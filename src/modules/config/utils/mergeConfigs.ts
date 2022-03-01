import mergeWith from 'lodash/mergeWith';
import isArray from 'lodash/isArray';

import type { GridsomeConfig } from '@/typings/gridsome';

export const mergeConfigs = (...configs: GridsomeConfig[]) => {
  // @ts-ignore
  return mergeWith(...configs, (objValue: unknown, srcValue: unknown) => {
    // Join arrays
    if (isArray(objValue)) {
      return objValue.concat(srcValue);
    }
  });
};
