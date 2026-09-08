> 🌐 本文档由 [react/react-native](https://github.com/react/react-native) 翻译,英文原版见原项目。

# RNTester

RNTester 用于展示 React Native 的视图和模块。

## 运行本应用

运行之前,请确保已执行:

```sh
git clone https://github.com/facebook/react-native.git
cd react-native
yarn install
```

### 在 iOS 上运行

如果你要测试非 Fabric 组件,请搜索并修改 [RNTester 的 Podfile](https://github.com/facebook/react-native/blob/main/packages/rn-tester/Podfile) 中的 `fabric_enabled` 标志。

```ruby
fabric_enabled = false
```

另外,如果你之前以启用 Fabric 的方式构建过 RNTester,可能需要清理构建文件和 Pods。

```sh
# 清理生成的文件和目录,以便全新安装 RNTester
cd packages/rn-tester
yarn clean-ios
```

如果清理后仍有问题(在使用较旧 React Native 版本、把文件生成在 react-native 目录内部的情况下可能发生),最好的办法可能是彻底重装 react-native(例如删除 node_modules 后重新 yarn install)。若清理后依然有问题,可以再试试 `RCT_NEW_ARCH_ENABLED=0 bundle exec pod install` 禁用新架构,因为它可能存在冲突。

需要 macOS 和 Xcode。

1. `cd packages/rn-tester`
2. 安装 [Bundler](https://bundler.io/):`gem install bundler`。我们用 Bundler 在本地安装正确版本的 [CocoaPods](https://cocoapods.org/)。
3. 安装 Bundler 和 CocoaPods 依赖:`bundle install && bundle exec pod install`,或 `yarn prepare-ios`。
4. 打开生成的 `RNTesterPods.xcworkspace`。它不会被提交到仓库,因为它由 CocoaPods 生成。不要直接打开 `RNTesterPods.xcodeproj`。

#### Apple Silicon 用户注意事项

如果你用的是 Apple Silicon 芯片的 Mac,安装和运行 CocoaPods 需要执行一些不同的命令。

- `sudo arch -x86_64 gem install ffi`:安装用于加载动态链接库的 `ffi` 包。
- `arch -x86_64 pod install`:以正确的架构运行 `pod install`。

### 在 Android 上运行

你需要安装构建 React Native 所需的全部[前提条件](https://reactnative.dev/contributing/how-to-build-from-source#prerequisites)(SDK、NDK)。

在仓库根目录执行以下命令即可构建并运行 RN-Tester:

```sh
yarn android
```

> [!NOTE]
> 首次构建耗时可能较长。

如果使用真机,请执行 `adb reverse tcp:8081 tcp:8081`,确保设备能访问 Metro。

使用真机的更多说明见 [Running on Device](https://reactnative.dev/docs/running-on-device)。

## 从源码构建

在 iOS 和 Android 上构建本应用,意味着从源码构建 React Native 框架。这样你运行的就是你在 GitHub 仓库克隆中看到的最新原生与 JS 代码。

这与通过 `react-native init` 创建的应用不同:后者依赖 `package.json`(Android 应用还有 `build.gradle`)中声明的特定版本的 React Native JS 与原生代码。

## 运行测试(iOS)

RNTester 同时提供集成测试和单元测试。在 Xcode 中按 `Cmd+U` 即可运行全部测试。也可以先选择对应的 scheme(`RNTesterUnitTests` 或 `RNTesterIntegrationTests`),再用同样的快捷键只运行单元测试或集成测试。
