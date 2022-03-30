import type { GridsomeServerPlugin } from '@/typings/gridsome';
import { print as printTypeDef } from 'graphql/language/printer';

import { coreRoutes } from './coreRoutes';
import { coreSchema } from './coreSchema';

export const coreGridsomeServerPlugin: GridsomeServerPlugin = (api) => {
  api.loadSource(({ addSchemaTypes }) => {
    addSchemaTypes([
      // Pass the schema as plain string
      printTypeDef(coreSchema),
    ]);
  });

  api.createPages(({ createPage }) => {
    coreRoutes.forEach((pageOptions) => createPage(pageOptions));
  });
};
