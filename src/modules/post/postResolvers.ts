import mime from 'mime-types';
import sizeOf from 'image-size';

import type { PostType } from './postTypes';
import type { GqlPost } from '@/__generated__/graphql';
import { formatAssetMediaPath } from '../core/utils/url';

interface PostMetadata {
  id: string;
  typeName: string;
}

/**
 * Resolve the references to related posts to full-fledged Post entries
 */
export const createRelatedPostsResolver = ({
  postType,
  relatedFieldName,
  resolveNode,
}: {
  postType: PostType;
  relatedFieldName: string;
  resolveNode: (post: PostMetadata) => GqlPost;
}) =>
  Object.freeze({
    type: `[${postType}!]!`,
    resolve: (parentPost: GqlPost): GqlPost[] => {
      const relatedPostsMetadata = ((parentPost as any)?.[relatedFieldName] ??
        []) as { id: string; typeName: string }[];
      const relatedPosts = relatedPostsMetadata.map(resolveNode);
      return relatedPosts;
    },
  });

/**
 * A resolver that returns the mime type for a GraphQL schema type
 * that implements PostResource interface.
 */
export const mimeTypeResolver = Object.freeze({
  type: 'String!',
  resolve: (obj) => {
    return mime.lookup(obj.path);
  },
});

/**
 * A resolver that returns the image size for a PostImage GraphQL schema type.
 */
export const imageSizeResolver = Object.freeze({
  type: 'PostResourceSize!',
  resolve: (obj) => {
    const dimensions = sizeOf(obj.path);
    return dimensions;
  },
});

/**
 * Update the local path to the media object (eg PostVideo or PostAudio).
 * At build time, these are exported to `${public_path}/assets/media/filename.ext`.
 */
export const mediaPathResolver = Object.freeze({
  type: 'String!',
  resolve: (obj) => formatAssetMediaPath(obj.path),
});
