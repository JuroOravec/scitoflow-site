<template>
  <v-toolbar-title class="AppHeaderHomeLink">
    <g-link :to="CoreRoutes.HOME" class="d-flex align-center gap-2">
      <g-image alt="Juro Oravec Logo" :src="favicon" v-bind="favicon" />
      <div>
        {{ siteName }}
      </div>
    </g-link>
  </v-toolbar-title>
</template>

<static-query>
query getAppHeaderHomeLinkMetadata {
  metadata {
    siteName
    icon {
      favicon {
        png (width: 80, height: 80, quality: 100)
      }
    }
  }
}
</static-query>

<script lang="ts">
import 'vue-router';
import { computed, defineComponent } from '@vue/composition-api';
import { VToolbarTitle } from 'vuetify/lib/components';

import { useStaticQuery } from '@/modules/core/utils/useGridsomeQuery';
import type { GqlgetAppHeaderHomeLinkMetadataQuery } from '@/__generated__/graphql';
import { CoreRoutes } from '../coreTypes';

const AppHeaderHomeLink = defineComponent({
  name: 'AppHeaderHomeLink',
  components: {
    VToolbarTitle,
  },
  setup() {
    const metadata = useStaticQuery<
      GqlgetAppHeaderHomeLinkMetadataQuery,
      GqlgetAppHeaderHomeLinkMetadataQuery['metadata']
    >((data) => data?.metadata);
    const siteName = computed(() => metadata.value?.siteName ?? '');
    const favicon = computed(() => metadata.value?.icon?.favicon?.png);

    return {
      siteName,
      favicon,
      CoreRoutes,
    };
  },
});

export default AppHeaderHomeLink;
</script>
<style lang="scss">
.AppHeaderHomeLink {
  img {
    width: 40px;
    height: 40px;
  }
}
</style>
