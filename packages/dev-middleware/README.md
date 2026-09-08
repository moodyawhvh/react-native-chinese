> 🌐 本文档由 [react/react-native](https://github.com/react/react-native) 翻译,英文原版见原项目。

# @react-native/dev-middleware

[![npm]](https://www.npmjs.com/package/@react-native/dev-middleware) [![npm downloads]](https://www.npmjs.com/package/@react-native/dev-middleware)

[npm]: https://img.shields.io/npm/v/@react-native/dev-middleware.svg?color=blue
[npm downloads]: https://img.shields.io/npm/dm/@react-native/dev-middleware.svg

支持 React Native 核心开发功能的开发服务器中间件。所有 React Native 项目中都已预配置了此包。

## 用法

中间件可以通过 `createDevMiddleware` API 挂载到开发服务器(如 [Metro](https://facebook.github.io/metro/docs/getting-started))上。

```js
import { createDevMiddleware } from '@react-native/dev-middleware';

function myDevServerImpl(args) {
  ...

  const {middleware, websocketEndpoints} = createDevMiddleware({
    projectRoot: metroConfig.projectRoot,
    serverBaseUrl: new URL(`http://${args.host}:${args.port}`),
    logger,
  });

  await Metro.runServer(metroConfig, {
    host: args.host,
    ...,
    unstable_extraMiddleware: [
      middleware,
      // 可按需扩展额外的 HTTP 中间件
    ],
    websocketEndpoints: {
      ...websocketEndpoints,
      // 可按需扩展额外的 WebSocket 端点
    },
  });
}
```

## 内置中间件

`@react-native/dev-middleware` 面向集成方设计,例如 [`@expo/dev-server`](https://www.npmjs.com/package/@expo/dev-server) 和 [`@react-native/community-cli-plugin`](https://github.com/facebook/react-native/tree/main/packages/community-cli-plugin)。它为 React Native 开发服务器的核心职责提供一套通用的默认实现。

我们有意把功能收敛在一小范围内,围绕:

- **调试** —— React Native 支持的 [Chrome DevTools 协议(CDP)](https://chromedevtools.github.io/devtools-protocol/) 端点,包括 Inspector Proxy,它负责管理与多台设备的连接。
- **开发操作** —— 实现核心 [Dev Menu](https://reactnative.dev/docs/debugging#accessing-the-dev-menu) 操作的端点,例如重新加载应用、打开调试器前端。

### HTTP 端点

<small>`DevMiddlewareAPI.middleware`</small>

这些端点以 [`connect`](https://www.npmjs.com/package/connect) 中间件处理器的形式暴露,可赋给 `Metro.runServer` 或其他兼容的 HTTP 服务器。

#### GET `/json/list`、`/json`([CDP](https://chromedevtools.github.io/devtools-protocol/#endpoints))

返回所有已连接 React Native 应用会话可用的 WebSocket 目标列表。

#### GET `/json/version`([CDP](https://chromedevtools.github.io/devtools-protocol/#endpoints))

返回 Chrome DevTools 使用的版本元数据。

#### GET `/debugger-frontend`

该端点的子路径被保留,用于提供 JavaScript 调试器前端。

#### POST `/open-debugger`

为指定的 CDP 目标打开 JavaScript 调试器。必须提供以下查询参数之一:

- `device` —— 设备与应用组合的唯一 ID,跨安装保持稳定。由各原生平台上的 `getInspectorDeviceId` 实现。
- `target` —— 当前开发服务器会话中由 `/json/list` 返回的目标页面 ID。
- `appId`(已废弃,仅为兼容保留)—— 要匹配的应用包标识符(多台设备同时连接时不唯一)。此参数只匹配旧版 Hermes 调试器目标。

<details>
<summary>示例</summary>

    curl -X POST 'http://localhost:8081/open-debugger?target=<targetId>'
</details>

### WebSocket 端点

<small>`DevMiddlewareAPI.websocketEndpoints`</small>

#### `/inspector/device`

用于注册设备连接的 WebSocket 处理器。

#### `/inspector/debug`

将 CDP 消息双向代理到对应设备的 WebSocket 处理器。

## 实验性特性

React Native 框架可以向 `createDevMiddleware` 传入 `unstable_experiments` 选项来启用实验性特性。注意:这些特性可能无法正常工作,未来可能随时变更或移除,恕不另行通知。部分可用的实验开关如下。

### `unstable_experiments.enableStandaloneFuseboxShell`

启用以独立应用外壳(由 `@react-native/debugger-shell` 包提供)而非浏览器窗口启动调试器前端。自 React Native 0.83 起默认为 `true`,可通过显式传入 `false` 关闭。

该外壳由一个独立的二进制文件驱动,该文件会在后台(调用 `createDevMiddleware` 之后立即)下载并缓存。如果首次下载或调用该二进制文件失败,调试器前端将回退为在浏览器窗口中启动,直到下次调用 `createDevMiddleware`(通常是下次启动开发服务器时)。

## 参与贡献

对本包的改动可以在本地进行,并按照[贡献指南](https://reactnative.dev/contributing/overview#contributing-code)对照 `rn-tester` 应用测试。开发期间,本包直接从源码运行,无需构建步骤。
