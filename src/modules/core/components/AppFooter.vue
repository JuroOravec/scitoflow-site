<template>
  <footer
    class="AppFooter d-flex text-caption pt-8 pb-6 secondary--text text--lighten-3"
  >
    <div class="flex-grow-0 mx-auto">{{ siteCopyright }}</div>
  </footer>
</template>

<static-query>
query getFooterMetadata {
  metadata {
    siteCopyright
  }
}
</static-query>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

import type { GqlgetFooterMetadataQuery } from '@/__generated__/graphql';
import { useStaticQuery } from '../utils/useGridsomeQuery';

const AppFooter = defineComponent({
  name: 'AppFooter',
  setup() {
    const siteCopyright = useStaticQuery<GqlgetFooterMetadataQuery, string>(
      (data) => data?.metadata?.siteCopyright ?? '',
    );

    return {
      siteCopyright,
    };
  },
});

export default AppFooter;
</script>
