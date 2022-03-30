import { print as printTypeDef } from 'graphql/language/printer';

import type { GridsomeServerPlugin } from '@/typings/gridsome';
import { createRelatedPostsResolver } from '../post/postResolvers';
import { PostType } from '../post/postTypes';
import { projectPostSchema } from './postProjectSchema';
import { postProjectRoutes } from './postProjectRoutes';

export const postProjectGridsomeServerPlugin: GridsomeServerPlugin = (api) => {
  api.loadSource(({ addSchemaTypes, addSchemaResolvers, getNode }) => {
    addSchemaTypes([
      // Stringify the schema
      printTypeDef(projectPostSchema),
    ]);

    addSchemaResolvers({
      [PostType.PROJECT]: {
        // Resolve the references to related posts to full-fledged Post entries
        // This field was added by `gridsome-plugin-recommender`
        relatedBlogs: createRelatedPostsResolver({
          postType: PostType.BLOG,
          relatedFieldName: 'relatedProjects',
          resolveNode: ({ typeName, id }) => getNode(typeName, id),
        }),
      },
    });
  });

  api.createPages(({ createPage }) => {
    postProjectRoutes.forEach((pageOptions) => createPage(pageOptions));
  });
};
