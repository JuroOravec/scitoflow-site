import { getCurrentInstance, ref } from '@vue/composition-api';
import type { SearchOptions } from 'flexsearch';

import type { SearchResult } from '@/modules/config/plugins/discoverability.gridsome.config';
import type { PostType } from '@/modules/post/postTypes';
import { useTrackSearch } from './analyticsHelpers';

/** Interact with Flexsearch search function provided by gridsome-plugin-flexsearch */
export const useFlexsearch = () => {
  const searchResults = ref<SearchResult[]>([]);

  const instance = getCurrentInstance();
  const { trackSearch } = useTrackSearch({ debounceMs: 200 });

  const search = (query?: SearchOptions, postType?: PostType): void => {
    const whereClause = postType ? { index: postType } : undefined;
    const results =
      // @ts-ignore
      instance?.proxy.$search.search({
        limit: 5,
        where: whereClause,
        ...query,
      }) ?? [];
    searchResults.value = results as any;

    trackSearch({
      query: query?.query,
      postType,
      results,
    });
  };

  return {
    search,
    searchResults,
  };
};
