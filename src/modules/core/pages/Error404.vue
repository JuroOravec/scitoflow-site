<template>
  <AppLayout :meta-props="metaProps" class="Error404">
    <div class="text-center secondary--text text--darken-1 py-16">
      <h1>404</h1>
    </div>
    <div class="text-center">
      <h4 class="pb-8">This seems to be your lucky number! 🎲</h4>
      <a :href="CoreRoutes.HOME"><h4>🔙 Go back to main page</h4></a>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

import AppLayout from '@/modules/core/components/AppLayout.vue';
import type { MetaProps } from '@/modules/core/components/Meta.vue';
import { CoreRoutes } from '../coreTypes';

const metaProps: MetaProps = {
  pageTitle: '404 Not Found',
  pageDescription: '404 Not Found! This seems to be your lucky number!',
};

const Error404 = defineComponent({
  name: 'Error404',
  components: {
    AppLayout,
  },
  setup() {
    return {
      metaProps,
      CoreRoutes,
    };
  },
});
export default Error404;
</script>
