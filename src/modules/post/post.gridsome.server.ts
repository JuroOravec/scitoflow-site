import { print as printTypeDef } from 'graphql/language/printer';
import readingTime from 'reading-time';

import type { GridsomeServerPlugin } from '@/typings/gridsome';
import type { PostCollectionNode, PostInput } from './postTypes';
import { postSchema } from './postSchema';
import { PostResourceType, PostType } from './postTypes';
import { imageSizeResolver, mediaPathResolver, mimeTypeResolver } from './postResolvers';
import type { CollectionNode } from '../core/coreModel';
import {
  getPostPersonFullName,
  resolveFrontmatterMetadata,
} from './utils';
import { metadata } from '../config/metadata';
import { formatUrlFromPath } from '../core/utils/url';

export const postGridsomeServerPlugin: GridsomeServerPlugin = (api) => {
  api.loadSource(({ addSchemaTypes, addSchemaResolvers }) => {
    addSchemaTypes([
      // Pass the schema as plain string
      printTypeDef(postSchema),
    ]);

    /** Common resolvers for all Post types */
    addSchemaResolvers({
      // Add helper resolvers to PostResource types
      [PostResourceType.AUDIO]: {
        mimeType: mimeTypeResolver,
        path: mediaPathResolver,
      },
      [PostResourceType.IMAGE]: {
        mimeType: mimeTypeResolver,
        size: imageSizeResolver,
      },
      [PostResourceType.VIDEO]: {
        mimeType: mimeTypeResolver,
        path: mediaPathResolver,
      },
    });
  });

  /** Common transformation for all Post nodes */
  api.onCreateNode(
    (
      node: CollectionNode & PostInput,
    ): PostCollectionNode | null | undefined => {
      if (
        !Object.values(PostType).includes(node.internal.typeName as PostType)
      ) {
        return;
      }

      // Resolve custom values like '$metadata.siteAuthor' to the
      // actual values from metadata.
      const nodeWithMetadata = resolveFrontmatterMetadata(node);

      if (nodeWithMetadata.ignore) return null;

      // Transform / enrich the fields parsed from frontmatter
      const enrichedPost: PostCollectionNode = {
        ...nodeWithMetadata,
        internal: {
          ...nodeWithMetadata.internal,
          typeName: nodeWithMetadata.internal.typeName as PostType,
        },
        canonicalUrl: formatUrlFromPath(metadata.siteUrl, nodeWithMetadata.path),
        authors: nodeWithMetadata.authors.map((author) => ({
          ...author,
          fullName: getPostPersonFullName(author),
        })),
        contributors: nodeWithMetadata.contributors.map((contributor) => ({
          ...contributor,
          fullName: getPostPersonFullName(contributor),
        })),
        datePublished: nodeWithMetadata.datePublished as any as Date,
        dateModified: nodeWithMetadata.dateModified as any as Date,
        dateExpired: nodeWithMetadata.dateExpired as any as Date | null,
        timeToRead: readingTime(nodeWithMetadata.content || ''),
      };

      return enrichedPost;
    },
  );
};
