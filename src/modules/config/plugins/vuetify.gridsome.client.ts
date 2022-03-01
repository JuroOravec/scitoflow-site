import type VuetifyType from 'vuetify'; // Imported to load the TS types
import Vuetify from 'vuetify/lib';

import type { GridsomeClientPlugin } from '@/typings/gridsome';

// See https://gridsome.org/docs/assets-css/#vuetify
export const vuetifyGridsomeClientPlugin: GridsomeClientPlugin = (
  Vue,
  { appOptions, head },
) => {
  head.link.push({
    rel: 'stylesheet',
    href: 'https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css',
  });

  head.link.push({
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900',
  });

  Vue.use(Vuetify, {
    // Overwrite components and directives so we import them ourselves from inside the files.
    // We're basically doing our own tree-shaking, becuase vuetify-loader isn't working / compatible.
    components: {},
    directives: {},
  });

  // See Vuetify docs for details
  appOptions.vuetify = new Vuetify({
    theme: {
      options: {
        customProperties: true,
      },
    },
  });
};
