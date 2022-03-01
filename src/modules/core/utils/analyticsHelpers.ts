import { getCurrentInstance, watch } from '@vue/composition-api';
import debounce from 'lodash/debounce';

import type { PostType } from '@/modules/post/postTypes';
import { useAnalytics } from './analytics';

export const useTrackClicks = ({ waitMs }: { waitMs?: number } = {}) => {
  const analytics = useAnalytics();

  return new Promise((res, rej) => {
    setTimeout(() => {
      const result = analytics.trackClicks<HTMLAnchorElement>(
        'a',
        'click_link',
        (elem) => ({
          to: elem.href,
          text: elem.textContent,
        }),
      );
      return res(result);
    }, waitMs);
  });
};

export const useTrackPage = () => {
  const instance = getCurrentInstance();
  const analytics = useAnalytics();

  watch(
    () => instance?.proxy?.$route.fullPath,
    async (newPath, oldPath) => {
      await analytics.track('page', {
        to: newPath ?? null,
        from: oldPath ?? null,
      });
      await analytics.setDefaultProperties({ path: newPath ?? null });
    },
    { immediate: true },
  );
};

export const useTrackSearch = ({ debounceMs }: { debounceMs?: number } = {}) => {
  const analytics = useAnalytics();

  const trackSearch = ({
    query,
    postType,
    results,
  }: {
    query?: string;
    postType?: PostType;
    results: any[];
  }) =>
    analytics.track('search', {
      query,
      postType: postType ?? null,
      numOfResults: results.length,
    });

  const debouncedTrackSearch = debounce(trackSearch, debounceMs);

  return {
    trackSearch: debouncedTrackSearch,
  };
};
