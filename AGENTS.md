> 🌐 本文档由 [react/react-native](https://github.com/react/react-native) 翻译,英文原版见原项目。

# React Native

一个使用 React 构建原生应用的框架。

## 仓库结构

React Native 是一个 monorepo:包含 `react-native` 包、与其一同发布的各个包,以及用于开发它们的 App 和工具链。

| 路径 | 内容 |
| --- | --- |
| `packages/react-native/Libraries` | JavaScript 源码(Flow)—— 旧位置,代码正逐步迁移到 `src/private` |
| `packages/react-native/src/private` | JavaScript 源码(Flow) |
| `packages/react-native/ReactCommon` | 共享 C++ 代码 —— Fabric 渲染器、TurboModules、JSI、Yoga、`jsinspector-modern` |
| `packages/react-native/ReactAndroid` | Android 运行时(Kotlin、Java、JNI) |
| `packages/react-native/{React,ReactApple}` | Apple 运行时(Objective-C++、Swift) |
| `packages/rn-tester` | RNTester —— 展示每个核心组件和 API 的测试应用,另含一个 `Playground` 试验区 |
| `packages/*` | 其他已发布的包 —— Metro 配置、Codegen、ESLint 配置、dev-middleware、React Native DevTools 前端 |
| `private/*` | 未发布的部分 —— `helloworld` 示例应用、`react-native-fantom` 测试运行器 |
| `scripts/*` | 仓库工具脚本 —— 构建、测试、发布和 CI 脚本 |

架构说明文档位于相应代码旁边的 `__docs__` 目录中,索引见 [`__docs__/README.md`](__docs__/README.md)。把它们当作你所工作子系统的参考资料即可,并非必读。

## 环境

- Yarn v1,通过 `packageManager` 字段固定版本。请在仓库根目录执行命令。
- JavaScript 相关工作 —— lint、类型检查、Jest、Metro —— 只需要 Node 和 Yarn,任何平台均可。
- 原生构建需要对应平台的工具链:iOS 需要 Xcode 加 CocoaPods 或 Swift Package Manager(仅限 macOS),Android 需要 Android SDK、NDK 和 Gradle。参见[从源码构建](https://reactnative.dev/contributing/how-to-build-from-source)。

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `yarn test <path>` | Jest 单元测试,位于 `__tests__` 目录 |
| `yarn fantom <path>` | [Fantom](private/react-native-fantom/__docs__/README.md) 集成测试,文件名形如 `*-itest.js` —— 首次运行会构建原生测试器 |
| `yarn lint` | ESLint(`--max-warnings 0`) |
| `yarn flow-check` | Flow 类型检查 |
| `yarn format` | Prettier 和 clang-format(仅 Prettier 用 `yarn format-check`) |

JavaScript CI 是 [`.github/workflows/test-all.yml`](.github/workflows/test-all.yml) 中的 `lint`、`test_js` 和 `build_js_types` 任务;Fantom 与各原生平台有各自的 CI 任务。

### 验证:运行 RNTester

仅当改动需要实际跑起来观察时才需要,例如用户界面行为。

`yarn start` 会通过 Metro 在 `http://localhost:8081` 上提供 [RNTester](packages/rn-tester/README.md) 服务;`yarn android` 会在 Android 上构建并安装它。可用 `curl "http://localhost:8081/js/RNTesterApp.bundle?platform=ios&dev=true"` 检查打包器是否正常。

## 注意事项(坑)

- `yarn install` 会弄脏工作区:`preinstall` 钩子(`scripts/try-set-hermes-compiler-prebuilt.js`)会把 `packages/react-native/package.json` 里的 `hermes-compiler` 占位版本(`0.0.0` → 真实版本号)替换掉,并改动 `yarn.lock`。这是预期行为 —— 不要把它提交上去。
- codegen 构建过一次之前,Metro 无法打包 —— 需先执行 `yarn --cwd packages/react-native-codegen build`。否则打包会报 `Cannot find module '@react-native/codegen/lib/parsers/flow/parser'`。其他所有包都直接从源码运行 —— 开发时不需要 `yarn build`(见 [`scripts/build/README.md`](scripts/build/README.md))。

## 生成代码

绝不要手工编辑生成的产物 —— 应修改源码然后重新生成。CI 会校验已提交的快照。

- 原生模块和组件由 JavaScript spec 文件声明(`Native*.js`、`*NativeComponent.js`);对应的原生代码在构建时生成。
- Feature flags(特性开关)声明在 `packages/react-native/scripts/featureflags/ReactNativeFeatureFlags.config.js`;`yarn featureflags` 会重新生成 JavaScript、Java 和 C++ 访问器。
- JavaScript 源码使用 Flow 标注类型,公共 API 从 `packages/react-native/index.js` 导出。TypeScript 类型由这些源码生成,`packages/react-native/ReactNativeApi.d.ts` 是该 API 的已提交快照 —— 公共 API 变化时,先运行 `yarn build-types` 重新生成两者,再运行 `yarn test-generated-typescript` 对结果做类型检查。
- 公共原生 API 同样有快照:C++ 部分在 `scripts/cxx-api` 下(`yarn cxx-api-build`),Android 部分在 `packages/react-native/ReactAndroid/api/ReactAndroid.api`。
- `CHANGELOG.md` 在发版时根据各 Pull Request 的描述汇总生成。

## 贡献准则

- 保持每次改动聚焦 —— 不要夹带无关的重构、格式化或依赖升级。
- 完整填写 Pull Request 模板 —— 动机、对用户的可见影响,以及带有分类和类型标签的 [changelog 条目](https://reactnative.dev/contributing/changelogs-in-pull-requests)。
- 在测试计划中写明你执行过的确切命令及其结果;用户界面改动请附截图或视频。说明哪些检查你没能执行。

完整流程见 [reactnative.dev](https://reactnative.dev/contributing/overview)。
