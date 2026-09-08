> 🌐 本文档由 [react/react-native](https://github.com/react/react-native) 翻译,英文原版见原项目。

# @react-native/compatibility-check

[![npm]](https://www.npmjs.com/package/@react-native/compatibility-check) [![npm downloads]](https://www.npmjs.com/package/@react-native/compatibility-check)

[npm]: https://img.shields.io/npm/v/@react-native/compatibility-check.svg?color=blue
[npm downloads]: https://img.shields.io/npm/dm/@react-native/compatibility-check.svg

状态:实验性(stage 1)

开发中。文档尚不完善,目前主要面向高级用户使用。

该工具用于检查 JavaScript 与原生之间的边界是否存在向后不兼容的变更,以防止崩溃。

适用场景:

- 本地开发
- 在支持的平台进行 OTA(Over the Air)热更新
- 理论上还包括:React Native 与 Server Components 的组合

## **动机问题**

来看几个推动本项目的问题示例。

> [!NOTE]
> 以下示例使用 Flow 编写,但 compatibility-check 工具对你写哪种类型系统并不敏感。该工具运行在 JSON schema 文件上,这些文件通常由 [@react-native/codegen](https://www.npmjs.com/package/@react-native/codegen) 工具生成,后者同时支持 TypeScript 和 Flow。

### **新增方法**

假设你的应用里有一个 Analytics 原生模块,而原生客户端是几天前构建的:

```javascript
export interface Spec extends TurboModule {
  log: (eventName: string, content: string) => void;
}
```

现在你要给这个原生模块加一个新方法:

```javascript
export interface Spec extends TurboModule {
  log: (eventName: string, content: string) => void;
  logError: (message: string) => void;
}
```

```
NativeAnalytics.logError('Oh No! We hit a crash')
```

因为你在开发这个功能,你重新构建了原生客户端并在自己电脑上测试过,一切正常。

但当同事拉取你的最新改动并运行时,他们会遇到崩溃 `logError is not a function`。他们需要重新构建原生客户端!

使用本工具,你可以在构建阶段就发现这种不兼容,得到形如以下的错误:

```
NativeAnalytics: Object added required properties, which native will not provide
  -- logError
```

类似错误的成因可能远比"加一个方法"更微妙,例如:

### **向原生发送新的联合类型取值**

```javascript
export interface Spec extends TurboModule {
  // 你往这个联合类型里加了 'system'
  +setColorScheme: (color: 'light' | 'dark') => void;
}
```

如果你新增了 `system` 选项并为它添加了原生支持,那么在你自己的提交上用 `system` 调用该方法没问题;但在不认识 `system` 的旧构建上就会崩溃。本工具会给出错误信息:

```
ColorManager.setColorScheme parameter 0: Union added items, but native will not expect/support them
  -- position 3 system
```

### **修改从原生发来的枚举值**

再举一例:假设你以整数值从系统获取配色方案,在 JavaScript 中当作枚举使用:

```javascript
enum TestEnum {
  LIGHT = 1,
  DARK = 2,
  SYSTEM = 3,
}

export interface Spec extends TurboModule {
  getColorScheme: () => TestEnum;
}
```

后来你发现实际上需要原生对 System 发送 `-1` 而不是 3。

```javascript
enum TestEnum {
  LIGHT = 1,
  DARK = 2,
  SYSTEM = -1,
}
```

如果做了这个改动后仍在旧构建上运行 JavaScript,旧构建可能仍然发给 JavaScript 值 3,而你的 JavaScript 已经不再处理这个值了!

本工具会给出错误:

```javascript
ColorManager: Object contained a property with a type mismatch
   -- getColorScheme: has conflicting type changes
       --new: ()=>Enum<number>
       --old: ()=>Enum<number>
       Function return types do not match
           --new: ()=>Enum<number>
           --old: ()=>Enum<number>
           Enum types do not match
               --new: Enum<number> {LIGHT = 1, DARK = 2, SYSTEM = -1}
               --old: Enum<number> {LIGHT = 1, DARK = 2, SYSTEM = 3}
               Enum contained a member with a type mismatch
                   -- Member SYSTEM: has conflicting changes
                       --new: -1
                       --old: 3
                       Numeric literals are not equal
                           --new: -1
                           --old: 3

```

## **避免破坏性变更**

你可以用本工具在本地检测变更,提醒需要安装新的原生构建;或者在 OTA 场景下,保证 PR 中的变更与你将要运行它们的原生客户端兼容。

### **示例 1**

在示例 1 中,新增 logError 时必须声明为可选才是安全的:

```javascript
export interface Spec extends TurboModule {
  log: (eventName: string, content: string) => void;
  logError?: (message: string) => void;
}
```

这样,使用 TypeScript 或 Flow 时就会强制你在调用前检查原生客户端是否支持 logError:

```javascript
if (NativeAnalytics.logError) {
  NativeAnalytics.logError('Oh No! We hit a crash');
}
```

### **示例 2**

想往联合类型中加入 '`system'` 值时,直接修改现有联合类型是不安全的。你需要新增一个包含该变更的可选方法。等你确认所有可能运行这段 JavaScript 的构建都具备了原生支持之后,再清理旧方法。

```javascript
export interface Spec extends TurboModule {
  +setColorScheme: (color: 'light' | 'dark') => void
  +setColorSchemeWithSystem?: (color: 'light' | 'dark' | 'system') => void
}
```

### **示例 3**

修改联合类型的取值与示例 2 类似:要么新增一个方法,要么同时保留旧值并支持新的 `-1`。

```
enum TestEnum {
  LIGHT = 1,
  DARK = 2,
  SYSTEM = 3,
  SYSTEM_ALSO = -1,
}
```

## **安装**

```
yarn add @react-native/compatibility-check
```

## **用法**

使用本包时,你需要一个大致如下工作的脚本:

该脚本比较 React Native 应用 schema 在两个版本之间的兼容性。它会分析 schema 的变更,并判定这些变更是否兼容。

```javascript
import {compareSchemas} from '@react-native/compatibility-check';
const util = require('util');

async function run(argv: Argv, STDERR: string) {
  const debug = (log: mixed) => {
    argv.debug &&
      console.info(util.inspect(log, {showHidden: false, depth: null}));
  };

  const currentSchema =
    JSON.parse(/*读取你的应用中由 codegen 生成的文件,位置由你的项目决定*/);
  const previousSchema =
    JSON.parse(/*读取你在构建原生应用时持久化保存的 schema 文件*/);

  const safetyResult = compareSchemas(currentSchema, previousSchema);

  const summary = safetyResult.getSummary();
  switch (summary.status) {
    case 'ok':
      debug('边界无变化');
      console.log(JSON.stringify(summary));
      break;
    case 'patchable':
      debug('边界有变化,但兼容');
      debug(result.getDebugInfo());
      console.log(JSON.stringify(summary));
      break;
    default:
      debug(result.getDebugInfo());
      console.error(JSON.stringify(result.getErrors()));
      throw new Error(`边界存在不兼容变更`);
  }
}
```
