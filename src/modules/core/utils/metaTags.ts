import type { MetaInfo } from 'vue-meta';
import isNil from 'lodash/isNil';

export const initMetaTagsList = () => {
  const metaTags: MetaInfo['meta'] = [];

  /**
   * Helper for settin key:value meta tags.
   * Does nothing if called with empty / nil content.
   */
  const addKVMetaTag = (name: string, content?: string | null) => {
    if (isNil(content)) return;
    metaTags.push({ name, content });
  };

  return { addKVMetaTag, metaTags };
};

export interface CreateOgImageTagsArgs {
  url: string;
  width: number;
  height: number;
  mimeType: string;
  alt: string;
  https?: boolean;
}
