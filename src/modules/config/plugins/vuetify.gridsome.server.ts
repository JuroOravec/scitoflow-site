import { GridsomeServerPlugin } from '@/typings/gridsome';

// TODO:
// When I import vuetify loader, I get following error:
// ```
// To install them, you can run: npm install --save atpl babel-core bracket-template child_process coffee-script
//   dot dustjs-linkedin eco ect fs haml-coffee hamlet hamljs handlebars hogan.js htmling jazz jqtpl just less
//   liquor marko module mote mustache plates ractive react react-dom/server slm stylus teacup/lib/express templayed
//   toffee twig vash velocityjs walrus webpack/lib/rules/DescriptionDataMatcherRulePlugin whiskers
// ```
//
// const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');
// NOTE: Might need to change sass-loader to @7.3.1

// See https://gridsome.org/docs/assets-css/#vuetify
export const vuetifyGridsomeServerPlugin: GridsomeServerPlugin = (api) => {
  api.chainWebpack((config, { isServer }) => {
    // config.plugin('vuetify-loader').use(VuetifyLoaderPlugin);
  });
};
