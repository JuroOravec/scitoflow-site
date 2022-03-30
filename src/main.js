// This is the main.js file. Import global CSS and scripts here.
import 'vuetify/dist/vuetify.min.css';
import 'prismjs/themes/prism.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'gridsome-plugin-remark-container/themes/classic.css';

import '@/modules/core/style/main.scss';

import { provide } from '@vue/composition-api';

import { vuetifyGridsomeClientPlugin } from './modules/config/plugins/vuetify.gridsome.client.ts';
import { vssueGridsomeClientPlugin } from './modules/config/plugins/vssue.gridsome.client.ts';
import { AnalyticsKey, createAnalytics } from './modules/core/utils/analytics';

/**
 * See docs: https://gridsome.org/docs/client-api/
 * See args definition: https://github.com/gridsome/gridsome/blob/85e449b7d5157dfdf49df5a2c20c8e868b889019/gridsome/app/app.js#L28
 */
const gridsomeApp = (Vue, context) => {
  const { router, head, isClient, appOptions } = context;

  head.bodyAttrs = {
    class: false ? 'dark' : '',
  };

  vuetifyGridsomeClientPlugin(Vue, context);
  vssueGridsomeClientPlugin(Vue, context);

  // See https://gridsome.org/docs/client-api/#appoptions
  appOptions.setup = () => {
    const analytics = createAnalytics();
    provide(AnalyticsKey, analytics);
  };
};

export default gridsomeApp;
