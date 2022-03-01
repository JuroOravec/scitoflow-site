import isNil from 'lodash/isNil';

export const isNotNil = <T>(val: T): val is NonNullable<T> => !isNil(val);
