import { print as printTypeDef } from 'graphql/language/printer';

import type { GridsomeServerPlugin } from '@/typings/gridsome';
import { blogPostSchema } from './postBlogSchema';
import { createRelatedPostsResolver } from '../post/postResolvers';
import { PostType } from '../post/postTypes';
import { postBlogRoutes } from './postBlogRoutes';

export const postBlogGridsomeServerPlugin: GridsomeServerPlugin = (api) => {
  api.loadSource(({ addSchemaTypes, addSchemaResolvers, getNode }) => {
    addSchemaTypes([
      // Stringify the schema
      printTypeDef(blogPostSchema),
    ]);

    addSchemaResolvers({
      [PostType.BLOG]: {
        // Resolve the references to related posts to full-fledged Post entries
        // This field was added by `gridsome-plugin-recommender`
        related: createRelatedPostsResolver({
          postType: PostType.BLOG,
          relatedFieldName: 'related',
          resolveNode: ({ typeName, id }) => getNode(typeName, id),
        }),
        // Defined in projects config
        relatedProjects: createRelatedPostsResolver({
          postType: PostType.PROJECT,
          relatedFieldName: 'relatedProjects',
          resolveNode: ({ typeName, id }) => getNode(typeName, id),
        }),
      },
    });
  });

  api.createPages(({ createPage }) => {
    postBlogRoutes.forEach((pageOptions) => createPage(pageOptions));
  });
};
