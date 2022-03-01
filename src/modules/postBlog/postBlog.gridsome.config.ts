import gridsomePluginRecommender from '../config/plugins/_fork_gridsome-plugin-recommender';
import type { GridsomeConfig } from '@/typings/gridsome';
import { remarkConfig } from '../config/plugins/markdown.gridsome.config';
import { createGridsomePluginRecommenderOptions } from '../config/utils/gridsomeRecommender';
import { PostType } from '../post/postTypes';
import { blogValidationSchema } from './postBlogValidation';
import { PostBlogRoutes } from './postBlogTypes';

export const postBlogGridsomeConfig: GridsomeConfig = {
  plugins: [
    {
      // Note: vue-remark plugin combines "@gridsome/source-filesystem" and template definition together.
      // https://github.com/gridsome/gridsome/tree/master/packages/vue-remark
      use: '@gridsome/vue-remark',
      options: {
        typeName: PostType.BLOG,
        baseDir: './src/modules/postBlog/content',
        // See docs: https://gridsome.org/docs/templates/#setup-templates
        route: PostBlogRoutes.BLOG,
        template:
          './src/modules/postBlog/components/BlogPostTemplate.vue',
        // See validateFrontmatter.js
        validation: blogValidationSchema,
        plugins: remarkConfig.plugins,
      },
    },
    // Generate "related" blog posts on BlogPost
    {
      // Note: Using a fork of the package until the fix is released (see the fork).
      // use: 'gridsome-plugin-recommender',
      use: gridsomePluginRecommender,
      options: createGridsomePluginRecommenderOptions({
        typeName: PostType.BLOG,
        relatedFieldName: 'related',
      }),
    },
  ],
};
