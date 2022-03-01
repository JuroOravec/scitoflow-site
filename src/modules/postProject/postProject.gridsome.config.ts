import gridsomePluginRecommender from '../config/plugins/_fork_gridsome-plugin-recommender';
import { remarkConfig } from '../config/plugins/markdown.gridsome.config';
import { createGridsomePluginRecommenderOptions } from '../config/utils/gridsomeRecommender';
import { PostType } from '../post/postTypes';
import { projectValidationSchema } from './postProjectValidation';
import { PostProjectRoutes } from './postProjectTypes';

export const postProjectGridsomeConfig = {
  plugins: [
    {
      // Dynamic pages based on markdown files
      //
      // Note: vue-remark plugin combines "@gridsome/source-filesystem" and template definition together.
      // https://github.com/gridsome/gridsome/tree/master/packages/vue-remark
      use: '@gridsome/vue-remark',
      options: {
        typeName: PostType.PROJECT,
        baseDir: './src/modules/postProject/content',
        // See docs: https://gridsome.org/docs/templates/#setup-templates
        route: PostProjectRoutes.PROJECT,
        template:
          './src/modules/postProject/components/ProjectPostTemplate.vue',
        // See validateFrontmatter.js
        validation: projectValidationSchema,
        // Note: Remark plugins must be included in all instance of vue-remark
        // See https://github.com/gridsome/gridsome/issues/707
        plugins: remarkConfig.plugins,
      },
    },
    // Generate "related" blog posts on ProjectPost
    {
      // Note: Using a fork of the package until the fix is released (see the fork).
      // use: 'gridsome-plugin-recommender',
      use: gridsomePluginRecommender,
      options: createGridsomePluginRecommenderOptions({
        typeName: PostType.PROJECT,
        referenceTypeName: PostType.BLOG,
        relatedFieldName: 'relatedBlogs',
        referenceRelatedFieldName: 'relatedProjects',
      }),
    },
  ],
};
