> 🌐 本文档由 [react/react-native](https://github.com/react/react-native) 翻译,英文原版见原项目。

# @react-native/community-cli-plugin

[![npm]](https://www.npmjs.com/package/@react-native/community-cli-plugin) [![npm downloads]](https://www.npmjs.com/package/@react-native/community-cli-plugin)

[npm]: https://img.shields.io/npm/v/@react-native/community-cli-plugin.svg?color=blue
[npm downloads]: https://img.shields.io/npm/dm/@react-native/community-cli-plugin.svg

> 这是 React Native 的内部依赖。**请不要直接依赖它。**

支持 React Native 核心开发功能的 CLI 入口。

前身为 [@react-native-community/cli-plugin-metro](https://www.npmjs.com/package/@react-native-community/cli-plugin-metro)。

## 命令

### `start`

启动 React Native 开发服务器。

#### 用法

```sh
npx @react-native-community/cli start [options]
```

#### 选项

| 选项 | 说明 |
| - | - |
| `--port <number>` | 设置服务器端口。 |
| `--host <string>` | 设置服务器主机。 |
| `--projectRoot <path>` | 设置项目根目录路径。 |
| `--watchFolders <list>` | 指定要加入监视列表的额外目录。 |
| `--assetPlugins <list>` | 指定额外的资源(asset)插件。 |
| `--sourceExts <list>` | 指定要打包的额外源码扩展名。 |
| `--max-workers <number>` | 设置转换文件的工作池可生成的最大 worker 数。默认为本机可用核心数。 |
| `--transformer <string>` | 指定自定义转换器。 |
| `--reset-cache` | 清除缓存文件。 |
| `--custom-log-reporter-path <string>` | 指定一个模块路径,用于替换 `TerminalReporter`。 |
| `--https` | 启用 HTTPS 连接。 |
| `--key <path>` | 指定自定义 SSL 密钥路径。 |
| `--cert <path>` | 指定自定义 SSL 证书路径。 |
| `--config <string>` | CLI 配置文件路径。 |
| `--no-interactive` | 关闭交互模式。 |
| `--client-logs` | **[已废弃]** 为所有已连接的应用启用纯文本 JavaScript 日志流。 |

### `bundle`

为指定的 JavaScript 入口文件构建 bundle。

#### 用法

```sh
npx @react-native-community/cli bundle --entry-file <path> [options]
```

#### 选项

| 选项 | 说明 |
| - | - |
| `--entry-file <path>` | 设置根 JavaScript 入口文件路径。 |
| `--platform <string>` | 设置目标平台(`"android"` 或 `"ios"`)。默认为 `"ios"`。 |
| `--transformer <string>` | 指定自定义转换器。 |
| `--dev [boolean]` | 为 `false` 时关闭警告并压缩 bundle。默认为 `true`。 |
| `--minify [boolean]` | 覆盖是否压缩 bundle。设置了 `--dev` 时默认为 `false`。关闭压缩有助于加快用于测试目的的生产构建。 |
| `--bundle-output <string>` | 指定生成 bundle 的存放路径。 |
| `--bundle-encoding <string>` | 指定写入 bundle 的编码(<https://nodejs.org/api/buffer.html#buffer_buffer>)。 |
| `--resolver-option <string...>` | 形如 key=value 的自定义 resolver 选项。URL 编码。可多次指定。 |
| `--sourcemap-output <string>` | 指定生成 source map 文件的存放路径。 |
| `--sourcemap-sources-root <string>` | 设置 source map 条目的根路径。 |
| `--sourcemap-use-absolute-path` | 使用完整路径报告 `SourceMapURL`。 |
| `--max-workers <number>` | 设置转换文件的工作池可生成的最大 worker 数。默认为本机可用核心数。 |
| `--assets-dest <string>` | 指定存放 bundle 引用资源的目录路径。 |
| `--reset-cache` | 清除缓存文件。 |
| `--read-global-cache` | 若已配置,尝试从全局缓存获取已转换的 JS 代码。默认为 `false`。 |
| `--config <string>` | CLI 配置文件路径。 |

### `codegen`

运行 React Native codegen,从 JS spec 文件生成原生样板代码。

#### 用法

```sh
npx @react-native-community/cli codegen [options]
```

#### 选项

| 选项 | 说明 |
| - | - |
| `--path <path>` | React Native 项目根目录路径。默认为当前工作目录。 |
| `--platform <string>` | 目标平台。支持 `"android"`、`"ios"`、`"all"`。默认为 `"all"`。 |
| `--outputPath <path>` | 生成产物的输出路径。 |
| `--source <string>` | 脚本是从 `app` 还是 `library` 调用。默认为 `"app"`。 |

### `spm [action]`

为 iOS/macOS 应用配置或维护 Swift Package Manager 支持。可选动作:`add`、`update`、`deinit`、`scaffold`。不带动作时等价于 `add`(若 SPM 已配置则为 `update`)。

#### 用法

```sh
npx @react-native-community/cli spm [action] [options]
```

#### 选项

| 选项 | 说明 |
| - | - |
| `--version <string>` | React Native 版本(如 `0.80.0`)。默认取 `node_modules/react-native/package.json` 中的版本。 |
| `--yes` | 跳过 pbxproj 已变更时的确认提示。 |
| `--xcodeproj <path>` | **[add]** 要注入 SPM 包的 `.xcodeproj` 路径(存在多个时用于消歧)。 |
| `--productName <string>` | **[add]** 要注入的 App target(存在多个时用于消歧)。 |
| `--deintegrate` | **[add]** 注入前先执行 `pod deintegrate` 并从 Podfile 中移除 React Native(CocoaPods → SwiftPM 迁移)。 |
| `--artifacts <path>` | **[高级]** 本地产物根目录,需包含完整的 `debug/` 和 `release/` 槽位。 |
| `--download <string>` | **[高级]** 产物下载策略:`auto`(默认)、`skip` 或 `force`。 |
| `--skipCodegen` | **[高级]** 跳过 react-native codegen 步骤。 |

## 参与贡献

对本包的改动可以在本地进行,并按照[贡献指南](https://reactnative.dev/contributing/overview#contributing-code)对照 `rn-tester` 应用测试。开发期间,本包直接从源码运行,无需构建步骤。
