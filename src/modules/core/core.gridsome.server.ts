import type {
  GridsomePluginCreatePageOptions,
  GridsomeServerPlugin,
} from '@/typings/gridsome';
import { print as printTypeDef } from 'graphql/language/printer';

import { coreSchema } from './coreSchema';
import { CoreRoutes } from './coreTypes';

const corePages: GridsomePluginCreatePageOptions[] = [
  {
    path: CoreRoutes.HOME,
    component: './src/modules/core/pages/Home.vue',
  },
  {
    path: CoreRoutes.ABOUT,
    component: './src/modules/core/pages/About.vue',
  },
  {
    path: CoreRoutes.NOT_FOUND,
    component: './src/modules/core/pages/Error404.vue',
  },
];

export const coreGridsomeServerPlugin: GridsomeServerPlugin = (api) => {
  api.loadSource(({ addSchemaTypes }) => {
    addSchemaTypes([
      // Pass the schema as plain string
      printTypeDef(coreSchema),
    ]);
  });

  api.createPages(({ createPage }) => {
    corePages.forEach((pageOptions) => createPage(pageOptions));
  });
};
