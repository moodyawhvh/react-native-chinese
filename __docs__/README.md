> 🌐 本文档由 [react/react-native](https://github.com/react/react-native) 翻译,英文原版见原项目。

# React Native 技术文档

React Native 技术文档描述 React Native 的内部工作原理、它由哪些子系统组成、这些子系统如何工作以及如何相互交互。

目标读者是希望了解 React Native 内部机制并参与贡献的人。**React Native 的最终用户请改用[公开官网](https://reactnative.dev)**(其代码见[这里](https://github.com/facebook/react-native-website))。

关于本仓库技术文档的组织方式,详见 [GUIDELINES.md](./GUIDELINES.md)。

## 🚀 用法

本仓库并非供最终用户直接消费。它构建出多个包并发布到 NPM 注册表,供最终用户和框架直接使用。

本仓库采用 monorepo 方式,公开的包位于 [`packages`](../packages/) 目录(`package.json` 文件中不含 `"private": true` 的那些)。

最重要的包是 [`react-native`](https://www.npmjs.com/package/react-native) 包,位于 [`packages/react-native`](../packages/react-native),其中包含公共 JavaScript API。

本仓库提供 Android 和 iOS 版本的 React Native。其他平台的版本由各自的仓库维护。

## 📐 设计

TODO: 从较高的层面解释 React Native 的各个组成部分。

## 🔗 与其他系统的关系

### 包含以下部分

- 运行时
  - 跨平台
    - [Feature Flags(特性开关)](../packages/react-native/src/private/featureflags/__docs__/README.md)
    - Host / Instance / Bridgeless
    - UI / Fabric
      - 事件(Events)
      - 影子树生命周期(Shadow Tree Lifecycle)
        - [Runtime Shadow Node Reference Update](../packages/react-native/ReactCommon/react/renderer/core/__docs__/RSNRU.md)
        - [passChildrenWhenCloningPersistedNodes](../packages/react-native/ReactCommon/react/renderer/core/__docs__/passChildrenWhenCloning.md)
      - 布局(Layout)
      - 挂载(Mounting)
      - [动画后端(Animation Backend)](../packages/react-native/ReactCommon/react/renderer/animationbackend/__docs__/AnimationBackend.md)
      - [原生动画(Native Animated)](../packages/react-native/ReactCommon/react/renderer/animated/__docs__/NativeAnimated.md)
    - 原生模块 / TurboModules
    - JS 运行时
      - [事件循环(Event Loop)](../packages/react-native/ReactCommon/react/renderer/runtimescheduler/__docs__/README.md)
      - 全局对象与环境搭建
      - 错误处理
    - 开发者工具
      - React Native DevTools
        - 基础设施
          - [Inspector 代理协议](../packages/dev-middleware/src/inspector-proxy/__docs__/README.md)
      - LogBox
    - 其他
      - Web API
        - DOM 遍历与布局 API
        - [IntersectionObserver](../packages/react-native/src/private/webapis/intersectionobserver/__docs__/README.md)
        - [MutationObserver](../packages/react-native/src/private/webapis/mutationobserver/__docs__/README.md)
        - Performance 与 PerformanceObserver
        - 定时器(Timers)
  - 平台特定
    - 宿主平台接口(Host Platform Interface)
  - Android
    - UI
      - [事件(Events)](../packages/react-native/ReactAndroid/src/main/java/com/facebook/react/fabric/events/__docs__/README.md)
      - 挂载(Mounting)
  - iOS
    - UI
      - 事件(Events)
      - 挂载(Mounting)
- 构建系统
  - Android
  - iOS
    - [SwiftPM](../packages/react-native/scripts/spm/__docs__/README.md)
  - C++
  - JavaScript
    - Metro
- 测试
  - Android
  - iOS
  - C++
  - JavaScript
    - Flow
    - TypeScript
    - Jest
    - ESLint
  - 集成 / 端到端
    - [Fantom](../private/react-native-fantom/__docs__/README.md)

### 依赖以下部分

本仓库有多种不同类型的依赖:构建系统、开发阶段使用的外部包、运行时使用的外部包,等等。

### 被以下部分使用

本仓库的主要使用场景:

1. 开发 React Native 本身。
2. 测试和发布 React Native。
3. 同步 `react-native-windows`、`react-native-macos` 等分支版本。
