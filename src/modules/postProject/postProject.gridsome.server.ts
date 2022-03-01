import { print as printTypeDef } from 'graphql/language/printer';

import type {
  GridsomePluginCreatePageOptions,
  GridsomeServerPlugin,
} from '@/typings/gridsome';
import { createRelatedPostsResolver } from '../post/postResolvers';
import { PostType } from '../post/postTypes';
import { projectPostSchema } from './postProjectSchema';
import { PostProjectRoutes } from './postProjectTypes';

const postProjectPages: GridsomePluginCreatePageOptions[] = [
  {
    path: PostProjectRoutes.PROJECTS,
    component: './src/modules/postProject/pages/Projects.vue',
  },
];

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
    postProjectPages.forEach((pageOptions) => createPage(pageOptions));
  });
};
