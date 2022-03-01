<template>
  <v-app class="App">
    <router-view />
  </v-app>
</template>

<static-query>
query getAppMetadata {
  metadata {
    siteName
    siteDescription
  }
}
</static-query>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { VApp } from 'vuetify/lib/components';

import { useAnalytics } from './modules/core/utils/analytics';
import {
  useTrackClicks,
  useTrackPage,
} from './modules/core/utils/analyticsHelpers';

// This component overrides the default App.vue defined by gridsome
// See https://gridsome.org/docs/overriding-app/
const App = defineComponent({
  name: 'App',
  components: {
    VApp,
  },
  setup() {
    const analytics = useAnalytics();
    analytics.init();
    useTrackPage();
    useTrackClicks({ waitMs: 500 });

    return {};
  },
});

export default App;
</script>
<style lang="scss">
.App {
  // Hide overflow for main page hore image
  overflow: hidden;
}
</style>