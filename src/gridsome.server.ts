import 'module-alias/register';

import type { GridsomeServerPlugin } from './typings/gridsome';
import { vuetifyGridsomeServerPlugin } from './modules/config/plugins/vuetify.gridsome.server'; // prettier-ignore
import { coreGridsomeServerPlugin } from './modules/core/core.gridsome.server'; // prettier-ignore
import { postGridsomeServerPlugin } from './modules/post/post.gridsome.server'; // prettier-ignore
import { postBlogGridsomeServerPlugin } from './modules/postBlog/postBlog.gridsome.server'; // prettier-ignore
import { postProjectGridsomeServerPlugin } from './modules/postProject/postProject.gridsome.server'; // prettier-ignore

/**
 * Server API makes it possible to hook into various parts of Gridsome
 * on server-side and add custom data to the GraphQL data layer.
 * Learn more: https://gridsome.org/docs/server-api/
 *
 * https://github.com/gridsome/gridsome/blob/9920cc8ba4f81b431e1a3bb7bd1aa47f979b0d36/gridsome/lib/app/loadConfig.js#L93
 */
const gridsomeServer: GridsomeServerPlugin = (api) => {
  vuetifyGridsomeServerPlugin(api);
  coreGridsomeServerPlugin(api);
  postGridsomeServerPlugin(api);
  postBlogGridsomeServerPlugin(api);
  postProjectGridsomeServerPlugin(api);
};

// For compatiblity with commonJS we have to export the top level .ts file
// using `module.exports` instead of `export default`
module.exports = gridsomeServer;
