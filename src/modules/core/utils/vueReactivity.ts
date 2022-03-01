import { computed, ComputedRef, Ref } from '@vue/composition-api';
import fromPairs from 'lodash/fromPairs';

/**
 * Similar to `toRefs`, but works with `ref`s instead of `reactive`s.
 *
 * Given a Vue ref containing an object,
 * transform the object keys to computed refs.
 *
 * NOTE: This will create refs only for those properties that were
 * on the object at the time of invocation.
 */
export const refToRefs = <T extends Record<string, any>>(
  refObj: Ref<T>,
): Partial<{ [Key in keyof T]: ComputedRef<T[Key]> }> => {
  const keys = Object.keys(refObj.value);
  const objOfRefs = fromPairs(
    keys.map((key) => [key, computed(() => refObj.value?.[key])]),
  );
  return objOfRefs as any;
};
