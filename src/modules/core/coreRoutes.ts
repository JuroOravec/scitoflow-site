import type { GridsomePluginCreatePageOptions } from '@/typings/gridsome';

import { CoreRoutes } from './coreTypes';

export const coreRoutes: GridsomePluginCreatePageOptions[] = [
  {
    path: CoreRoutes.HOME,
    component: './src/modules/core/pages/Home.vue',
  },
  // TODO: Enable once it makes sense to have separate page for About
  // {
  //   path: CoreRoutes.ABOUT,
  //   component: './src/modules/core/pages/About.vue',
  // },
  {
    path: CoreRoutes.NOT_FOUND,
    component: './src/modules/core/pages/Error404.vue',
  },
];
