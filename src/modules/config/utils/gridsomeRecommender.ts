import defaults from 'lodash/defaults';

import type { PostType } from '@/modules/post/postTypes';

export interface GridsomePluginRecommenderOptions<
  TPost extends Record<any, string>,
  TRefPost extends Record<any, string>,
> {
  enabled: boolean;
  debug: boolean;
  typeName: PostType;
  referenceTypeName: PostType;
  field: keyof TPost;
  referenceField: keyof TRefPost;
  relatedFieldName: string;
  referenceRelatedFieldName: string;
  caseSensitive: boolean;
  minScore: number;
  maxScore: number;
  minRelations: number;
  maxRelations: number;
  fillWithRandom: boolean;
}

export const createGridsomePluginRecommenderOptions = <
  TPost extends Record<any, string>,
  TRefPost extends Record<any, string>,
>(
  options: Partial<GridsomePluginRecommenderOptions<TPost, TRefPost>>,
): Partial<GridsomePluginRecommenderOptions<TPost, TRefPost>> => {
  const defaultOptions: Partial<
    GridsomePluginRecommenderOptions<TPost, TRefPost>
  > = {
    enabled: true,
    debug: false,
    field: 'content',
    referenceField: 'content',
    caseSensitive: false,
    minScore: 0.01,
    maxScore: 1,
    minRelations: 1,
    maxRelations: 4,
    fillWithRandom: false,
  };
  return defaults(options, defaultOptions);
};
