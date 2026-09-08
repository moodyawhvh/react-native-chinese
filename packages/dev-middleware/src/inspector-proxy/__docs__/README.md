> 🌐 本文档由 [react/react-native](https://github.com/react/react-native) 翻译,英文原版见原项目。
>
> ℹ️ 译注:原文件超过 10000 字符,本译文覆盖核心章节;文末"旧版兼容特性"一节仅保留内容摘要,细节请见英文原版。

# Inspector 代理协议(Inspector Proxy Protocol)

[🏠 主页](../../../../../__docs__/README.md)

inspector-proxy 协议用于在**调试器**(如 Chrome DevTools、VS Code)与**设备**(包含 React Native 宿主的进程)之间完成 Chrome DevTools 协议(CDP)的目标发现与通信。代理按设备复用连接,每台设备使用一条 WebSocket,从而允许多个调试器连接同一设备上的多个页面。

## 🚀 用法

### 目标发现(HTTP)

我们实现了 [Chrome DevTools 协议](https://chromedevtools.github.io/devtools-protocol/) [HTTP 端点](https://chromedevtools.github.io/devtools-protocol/#:~:text=a%20reconnect%20button.-,HTTP%20Endpoints,-If%20started%20with) 的一个子集,供调试器发现目标。

| 端点                        | 说明                   |
| --------------------------- | ---------------------- |
| `GET /json` 或 `/json/list` | 可调试页面列表         |
| `GET /json/version`         | 协议版本信息           |

### 设备注册(WebSocket)

设备通过连接 `/inspector/device` 向代理注册:

```text
ws://{host}/inspector/device?device={id}&name={name}&app={bundle_id}&profiling={true|false}
```

| 参数        | 必填 | 说明                                                       |
| ----------- | ---- | ---------------------------------------------------------- |
| `device`    | 否\* | 逻辑设备标识符。省略时自动生成。                           |
| `name`      | 否   | 人类可读的设备名称。默认为 "Unknown"。                     |
| `app`       | 否   | 应用包标识符。默认为 "Unknown"。                           |
| `profiling` | 否   | 若为性能分析(profiling)构建则为 "true"。(仅用于日志记录) |

\* 建议提供,以便应用重启后保持连接的可识别性。

#### `device` 参数的要求

逻辑设备 ID 的目的在于辅助目标发现,尤其是目标的*再*发现 —— 减少用户显式关闭并重启调试器前端的次数(例如应用崩溃之后)。

如果提供了逻辑设备 ID,则:

1. 对当前物理设备(或模拟器实例)与应用的组合,应当(SHOULD)保持稳定。
2. 同一设备(或模拟器实例)上的同一应用跨安装/启动应当(SHOULD)保持稳定,但可以(MAY)允许用户重置(从而不需要任何特殊隐私权限)。
3. 同一物理设备(或模拟器)上的不同应用之间必须(MUST)唯一。
4. 不同物理设备(或模拟器)之间必须(MUST)唯一。
5. 同一物理设备(或模拟器)上同一应用的每个并发*实例*之间必须(MUST)唯一。

注意:唯一性要求(必须)强于稳定性要求(应当)。特别是在允许同一应用多实例并发运行的平台上,为满足要求 5,可以(MAY)违反要求 1 和/或 2。桌面平台即属此类场景。

### 调试器连接(WebSocket)

调试器连接 `/inspector/debug` 与页面建立 CDP 会话:

```text
ws://{host}/inspector/debug?device={device_id}&page={page_id}
```

`device` 和 `page` 两个查询参数均为必填。

## 📐 设计

### 架构

```text
┌─────────────────┐     ┌─────────────────────────┐     ┌────────────────┐
│    Debugger     │────▶│    Inspector Proxy      │◀────│     Device     │
│ (Chrome/VSCode) │     │      (Node.js)          │     │ (iOS/Android)  │
└─────────────────┘     └─────────────────────────┘     └────────────────┘
   WebSocket               HTTP + WebSocket               WebSocket
   /inspector/debug        /json, /json/list              /inspector/device
                           /json/version
```

### 设备 ↔ 代理协议

所有消息均为 JSON 编码的 WebSocket 文本帧:

```typescript
interface Message {
  event: string;
  payload?: /* 取决于具体事件 */;
}
```

#### 代理 → 设备消息

| 事件           | 负载                                                          | 说明                                        |
| -------------- | ------------------------------------------------------------- | ------------------------------------------- |
| `getPages`     | _(无)_                                                        | 请求当前页面列表。周期性发送。              |
| `connect`      | `{ pageId: string, sessionId: string }`                       | 准备让调试器连接到页面。                    |
| `disconnect`   | `{ pageId: string, sessionId: string }`                       | 终止页面的调试器会话。                      |
| `wrappedEvent` | `{ pageId: string, sessionId: string, wrappedEvent: string }` | 把 CDP 消息(JSON 字符串)转发给页面。      |

#### 设备 → 代理消息

| 事件           | 负载                                                           | 说明                                          |
| -------------- | -------------------------------------------------------------- | --------------------------------------------- |
| `getPages`     | `Page[]`                                                       | 当前可检查页面列表。                          |
| `disconnect`   | `{ pageId: string, sessionId?: string }`                       | 通知页面已断开或拒绝了连接。                  |
| `wrappedEvent` | `{ pageId: string, sessionId?: string, wrappedEvent: string }` | 从页面转发 CDP 消息(JSON 字符串)。          |

#### Page 对象

```typescript
interface Page {
  id: string; // 页面唯一标识符(通常为数字字符串)
  title: string; // 展示标题
  app: string; // 应用包标识符
  description?: string; // 附加描述
  capabilities?: {
    nativePageReloads?: boolean; // 目标在页面重载后保持 socket 打开
    nativeSourceCodeFetching?: boolean; // 目标支持 Network.loadNetworkResource
    supportsMultipleDebuggers?: boolean; // 支持并发调试器会话
  };
}
```

**注意**:对同一设备,`supportsMultipleDebuggers` 的取值在所有页面上应当(SHOULD)一致。

### 连接生命周期

**设备注册:**

```text
Device                              Proxy
   │                                  │
   │──── WS Connect ─────────────────▶│
   │     /inspector/device?...        │
   │                                  │
   │◀──── getPages ───────────────────│  (周期性)
   │                                  │
   │───── getPages response ─────────▶│
   │      (页面列表)                 │
```

**调试器会话:**

```text
Debugger            Proxy                        Device
   │                  │                            │
   │── WS Connect ───▶│                            │
   │   ?device&page   │── connect ────────────────▶│
   │                  │   {pageId, sessionId}      │
   │                  │                            │
   │── CDP Request ──▶│── wrappedEvent ───────────▶│
   │                  │   {pageId, sessionId,      │
   │                  │    wrappedEvent}           │
   │                  │                            │
   │                  │◀── wrappedEvent ───────────│
   │◀── CDP Response ─│   {pageId, sessionId,      │
   │                  │    wrappedEvent}           │
   │                  │                            │
   │── WS Close ─────▶│── disconnect ─────────────▶│
   │                  │   {pageId, sessionId}      │
```

**连接被拒绝:**

如果设备无法接受某个 `connect`(例如页面不存在),应向代理回发针对该 `pageId` 的 `disconnect`。

### 连接语义

#### 多调试器支持

当代理和设备**同时**支持会话复用时,多个调试器可以同时连接同一页面:

1. **会话 ID**:代理为每个调试器连接分配唯一且非空的 `sessionId`。所有消息都携带该 `sessionId` 用于路由。它应当(SHOULD)是 UUID 或其他足够唯一且一次性的标识符。

2. **能力检测**:设备在页面能力中上报 `supportsMultipleDebuggers: true`,表示支持会话。

3. **向后兼容**:旧设备会忽略收到的 `sessionId` 字段,也不会在响应中携带该字段。

#### 连接规则

1. **支持会话的设备**:多个调试器可同时连接同一页面,每个连接拥有独立会话。

2. **旧设备(无 `supportsMultipleDebuggers`)**:新的调试器连接到已被连接的页面时会断开既有调试器。代理必须(MUST)禁止多个调试器连接同一页面。

3. **设备重连**:若设备以相同 `device` ID 重连,而代理中仍存在指向该逻辑设备的调试器连接,代理可以尝试把这些活跃的调试器会话转发给新设备,以保留会话。

### WebSocket 关闭原因

代理使用的关闭原因具有特定含义,DevTools 前端可据此识别:

| 原因                    | 场景                             |
| ----------------------- | -------------------------------- |
| `[PAGE_NOT_FOUND]`      | 调试器连接了不存在的页面         |
| `[CONNECTION_LOST]`     | 设备已断开                       |
| `[RECREATING_DEVICE]`   | 设备正在重连                     |
| `[NEW_DEBUGGER_OPENED]` | 另一个调试器接管了该页面         |
| `[UNREGISTERED_DEVICE]` | 未找到该设备 ID                  |
| `[INCORRECT_URL]`       | 缺少 device/page 查询参数        |

### PageDescription(HTTP 响应)

`/json` 端点返回在设备上报内容基础上补充丰富后的页面描述。

```typescript
interface PageDescription {
  // 用于目标选择
  id: string; // "{deviceId}-{pageId}"

  // 用于展示
  title: string;
  description: string;
  deviceName: string;

  // 用于目标匹配
  appId: string;

  // 用于调试器连接
  webSocketDebuggerUrl: string;

  // React Native 特有元数据
  reactNative: {
    logicalDeviceId: string; // 用于目标匹配
    capabilities: {
      nativePageReloads?: boolean; // 用于目标过滤
    };
  };
}
```

## 🔗 与其他系统的关系

### 包含以下部分(Part of this)

- **Device.js** —— 代理中每设备连接的处理器
- **InspectorProxy.js** —— 代理的主 HTTP/WebSocket 服务器

### 依赖以下部分(Used by this)

- **Chrome DevTools 协议(CDP)** —— 包装的消息即 DevTools 前端与 JavaScript 运行时之间交换的 CDP 消息。
- **WebSocket** —— 设备与调试器连接的传输层。

### 被以下部分使用(Uses this)

- **InspectorPackagerConnection(C++)** —— `ReactCommon/jsinspector-modern/` 中共享的设备侧协议实现。
- **平台层** —— iOS(`RCTInspectorDevServerHelper.mm`)、Android(`DevServerHelper.kt`)与 ReactCxxPlatform(`Inspector.cpp`)提供 WebSocket I/O 和线程支持。
- **openDebuggerMiddleware** —— 使用 `/json` 为 `/open-debugger` 端点发现目标。
- **OpenDebuggerKeyboardHandler** —— 使用 `/json` 在 CLI 中展示目标选择。

---

## 旧版兼容特性(摘要)

以下特性用于向后兼容缺乏现代能力的旧版 React Native 目标。新实现应设置相应的能力标志,并可以忽略本节。译注:此处仅保留摘要,完整细节见英文原版。

- **合成可重载页面(页面 ID `-1`)**:对不具备 `nativePageReloads` 能力的目标,代理暴露一个 ID 为 `-1`、标题为 "React Native Experimental (Improved Chrome Reloads)" 的合成页面;连接该页面的调试器会被自动重定向到最新的 React Native 页面,并在页面重载后保持连接。期间代理负责发送 `disconnect`/`connect`、`Runtime.enable`、`Debugger.enable`,并在收到 `Runtime.executionContextCreated` 后向调试器发送 `Runtime.executionContextsCleared`、向设备发送 `Debugger.resume`。
- **URL 重写**:对不具备 `nativeSourceCodeFetching` 能力的目标,代理会在 CDP 消息中双向重写 URL(`Debugger.scriptParsed` 设备相对路径 ↔ 调试器相对路径;`Debugger.getScriptSource` 由代理经 HTTP 获取;`Network.loadNetworkResource` 返回 CDP 错误 -32601 促使前端回退)。此外,若脚本 URL 匹配 `^[0-9a-z]+$`(纯字母数字 ID),代理会补上 `file://` 前缀,确保 Chrome 能下载 source map。
- **旧版重载通知**:对不具备 `nativePageReloads` 的目标,当某页面收到 `disconnect` 事件时,代理向已连接的调试器发送 `{method: 'reload'}` 以表达页面重载。
