/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 * @format
 */

'use strict';

const defineLazyObjectProperty = require('./defineLazyObjectProperty').default;

/**
 * 【中文注释】设置对象的某个属性。若已存在同名属性,会将其替换,
 * 但保留其描述符(descriptor)配置。该属性将被替换为惰性 getter。
 *
 * 在 DEV 模式下,原属性值会以 `original[属性名]` 的形式保留,
 * 以便必要时可以恢复。例如,想让网络请求经由 DevTools 转发
 * (以便追踪请求)时:
 *
 *   global.XMLHttpRequest = global.originalXMLHttpRequest;
 *
 * @see https://github.com/facebook/react-native/issues/934
 */
export function polyfillObjectProperty<T>(
  object: {...},
  name: string,
  getValue: () => T,
): void {
  const descriptor = Object.getOwnPropertyDescriptor<$FlowFixMe>(object, name);
  if (__DEV__ && descriptor) {
    // 【中文注释】DEV 模式下:以 `originalXxx` 为名备份原属性的描述符。
    const backupName = `original${name[0].toUpperCase()}${name.slice(1)}`;
    Object.defineProperty(object, backupName, descriptor);
  }

  const {enumerable, writable, configurable = false} = descriptor || {};
  if (descriptor && !configurable) {
    // 【中文注释】目标属性不可配置(configurable)时无法打补丁,报错并放弃。
    console.error('Failed to set polyfill. ' + name + ' is not configurable.');
    return;
  }

  // 【中文注释】用惰性属性替换:首次访问时才调用 getValue 求值。
  defineLazyObjectProperty(object, name, {
    get: getValue,
    enumerable: enumerable !== false,
    writable: writable !== false,
  });
}

/**
 * 【中文注释】在全局对象(global)上以 polyfill 方式定义指定名称的属性,
 * 常用于注入 Polyfill(如 `polyfillGlobal('Promise', () => require('Promise'))`)。
 */
export function polyfillGlobal<T>(name: string, getValue: () => T): void {
  polyfillObjectProperty(global, name, getValue);
}
