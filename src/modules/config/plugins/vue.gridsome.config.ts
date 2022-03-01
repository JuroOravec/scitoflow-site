import type { GridsomeConfig } from "@/typings/gridsome";

/**
 * Config and plugin options that configure Vue.
 */
export const vueConfigGridsome: GridsomeConfig = {
  plugins: [
    { use: 'gridsome-plugin-typescript' },
    { use: 'gridsome-plugin-composition-api' },
  ],
};
