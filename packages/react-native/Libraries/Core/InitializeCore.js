/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

'use client';

/**
 * 【中文注释】设置大多数 JavaScript 环境中常见的全局变量,包括:
 *
 *   1. 全局定时器(通过 `setTimeout` 等)。
 *   2. 全局 console 对象。
 *   3. 用于打印带 source map 堆栈信息的钩子。
 *
 * 同时为自行实现以下能力留出空间:
 *
 *   1. 模块引入(require)系统。
 *   2. 桥接(Bridged)模块。
 *
 * @deprecated 自 0.87 起废弃。请改用 `'react-native/setup-env'`。
 */

'use strict';

// 【中文注释】这里委托给 `'react-native/setup-env'` 入口(而不是直接调用
// `setUpDefaultReactNativeEnvironment`),目的是把 `src/setup-env.js`
// 纳入模块依赖图。Metro 的 `getModulesRunBeforeMainModule` 只会执行
// 已经进入 bundle 的模块,而 `InitializeCore` 是必然存在的依赖图入口
// (经由 `ReactNativePrivateInitializeCore`)。这样可以保证
// `'react-native/setup-env'` 始终可达,并在主模块之前执行。
require('../../src/setup-env');
