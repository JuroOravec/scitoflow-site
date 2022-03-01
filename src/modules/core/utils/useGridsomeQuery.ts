import {
  computed,
  ComputedRef,
  getCurrentInstance,
} from '@vue/composition-api';

import type { Maybe } from '@/__generated__/graphql';

/** Get gridsome static query as a reactive value */
export const useStaticQuery = <TQuery extends Record<string, any>, TResult>(
  transformer: (queryResult: Maybe<TQuery> | undefined) => TResult,
): ComputedRef<TResult> => {
  const currentInstace = getCurrentInstance();

  return computed((): TResult => transformer(currentInstace?.proxy.$static ?? currentInstace?.root?.proxy.$static));
};

/** Get gridsome page query as a reactive value */
export const usePageQuery = <TQuery extends Record<string, any>, TResult>(
  transformer: (queryResult: Maybe<TQuery> | undefined) => TResult,
): ComputedRef<TResult> => {
  const currentInstace = getCurrentInstance();

  return computed(
    (): TResult => transformer(currentInstace?.proxy.$page ?? currentInstace?.root?.proxy.$page),
  );
};
