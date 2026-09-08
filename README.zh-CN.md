# react-native 中文文档

<div align="center">

[![原项目](https://img.shields.io/badge/原项目-react--react--native-blue?style=flat-square&logo=github)](https://github.com/react/react-native)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/react/react-native/blob/main/LICENSE)
[![微信联系](https://img.shields.io/badge/微信-uaycar-brightgreen?style=flat-square&logo=wechat)](#)

**Learn once, write anywhere：一次学习，随处书写**
使用 React 为 Android、iOS 等平台创建原生应用

**代部署 / 定制服务 / 技术咨询 请添加微信：uaycar**

</div>

---

> 本文是 [react/react-native](https://github.com/react/react-native) 官方 README 的中文翻译版本，仅供学习交流。如与英文原文有出入，请以[原仓库](https://github.com/react/react-native)为准。

## 简介

React Native 让你使用 [React](https://react.dev/) 构建原生应用：用 JavaScript 编写，以原生代码渲染。

- **原生 UI。** React Native 的基础组件会渲染为原生平台的界面控件，这意味着你的应用使用的正是其他应用所使用的同一套原生平台 API。手势、文字缩放和无障碍功能在各操作系统上的表现都与用户预期一致。
- **处处皆 React。** 声明式 UI、组件、Hooks 与 Suspense，可在 Android、iOS 以及[其他平台](https://reactnative.dev/docs/out-of-tree-platforms)之间复用。
- **开发者速度。** 几秒内即可看到本地改动。JavaScript 代码的修改通过 Fast Refresh 热更新生效，无需重新构建原生应用。
- **自行扩展。** Native Modules 允许你从 JavaScript 直接调用平台原生代码，同步且类型安全——或者直接使用[数千个现成的社区库](https://reactnative.directory/)。

React Native 由众多公司和个人核心贡献者共同开发与支持。更多信息请访问 [React 基金会网站](https://react.foundation/)。

## 构建你的第一个 React Native 应用

按照[入门指南](https://reactnative.dev/docs/environment-setup)创建一个新应用，或者阅读[与现有应用集成](https://reactnative.dev/docs/integration-with-existing-apps)，在既有项目中渐进式地引入 React Native。

### 使用框架

我们认为体验 React Native 的最佳方式是通过框架（Framework）——一个内置了所有必要 API 的工具箱，帮助你构建可用于生产环境的应用。[Expo](https://docs.expo.dev/get-started/set-up-your-environment/) 是一个生产级的 React Native 框架，提供基于文件的路由、原生模块标准库等诸多能力。

要创建一个新的 Expo 项目，请在终端运行：

```bash
npx create-expo-app@latest
```

然后按照 [Expo 入门指南](https://docs.expo.dev/get-started/set-up-your-environment/)的其余步骤开始构建。

### 不使用框架

你也可以在不使用框架的情况下使用 React Native，但我们发现绝大多数开发者都能从框架中受益——导航、原生依赖和平台工具链这些生态早已解决的问题，框架都替你处理好了。如果框架不适合你的应用，请参考[不使用框架的入门文档](https://reactnative.dev/docs/getting-started-without-a-framework)。

## 文档

React Native 的完整文档可以在[官方网站](https://reactnative.dev/docs/getting-started)查阅：

- [介绍](https://reactnative.dev/docs/getting-started)
- [环境搭建（入门）](https://reactnative.dev/docs/environment-setup)
- [学习基础（教程）](https://reactnative.dev/docs/tutorial)
- [组件与 API](https://reactnative.dev/docs/components-and-apis)
- [UI 与交互](https://reactnative.dev/docs/style)
- [原生模块](https://reactnative.dev/docs/native-platform)
- [调试](https://reactnative.dev/docs/debugging)
- [升级](https://reactnative.dev/docs/upgrading)
- [架构](https://reactnative.dev/architecture/overview)

React Native 文档与网站的源码托管在另一个独立仓库 [**react/react-native-website**](https://github.com/react/react-native-website)。

## 核心术语对照

| 英文 | 中文 |
|:-----|:-----|
| Native UI | 原生界面 |
| Native Modules | 原生模块 |
| Fast Refresh | 快速刷新（热更新） |
| Components | 组件 |
| Hooks | Hooks（钩子函数） |
| Suspense | Suspense（异步挂起） |
| Declarative UI | 声明式 UI |
| Framework | 框架 |
| Navigation | 导航 |
| Debugging | 调试 |
| Upgrading | 升级 |

## 参与贡献

本仓库的主要目的是持续演进 React Native 核心。我们希望让参与这个项目尽可能简单、透明，也非常感谢社区贡献的每一个缺陷修复与改进。请阅读以下内容，了解如何参与改进 React Native。

### [行为准则](https://code.fb.com/codeofconduct/)

Meta 制定了一套行为准则，期望所有项目参与者遵守。请阅读[完整文本](https://code.fb.com/codeofconduct/)，了解哪些行为是允许的、哪些是不能容忍的。

### [贡献指南](https://reactnative.dev/docs/contributing)

阅读我们的 [**贡献指南**](https://reactnative.dev/docs/contributing)，了解开发流程、如何提交缺陷修复与改进建议，以及如何构建并测试你对 React Native 的改动。

### 讨论区

较大范围的讨论与提案在 [**react-native-community/discussions-and-proposals**](https://github.com/react-native-community/discussions-and-proposals) 中进行。

React Native 版本发布的相关讨论则在 [**reactwg/react-native-releases**](https://github.com/reactwg/react-native-releases/discussions) 中进行。

## 许可证

React Native 采用 MIT 许可证，详见原仓库的 [LICENSE](https://github.com/react/react-native/blob/main/LICENSE) 文件。

---

## 关于本翻译

- 本文为 [react/react-native](https://github.com/react/react-native) 官方 README 的中文翻译版本，仅供学习交流。
- 原项目全部代码与文档的版权归原项目作者所有，遵循 MIT 许可证发布。
- 完整源代码与最新版本请访问原项目：https://github.com/react/react-native
- **代部署 / 定制服务 / 技术咨询 请添加微信：uaycar**

**如果觉得有用，请给原项目点个 Star！** ⭐
