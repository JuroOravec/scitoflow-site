<template>
  <v-list-item
    :to="{ path: item.node.path }"
    class="SearchBoxItem d-flex mx-n4"
  >
    <v-list-item-avatar
      v-if="image"
      color="indigo"
      class="text-h5 font-weight-light white--text rounded-0"
    >
      <g-image :src="image.path" v-bind="image" />
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title v-text="item.title" />

      <v-list-item-subtitle v-text="item.description" />
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  PropType,
  toRefs,
} from '@vue/composition-api';
import {
  VAutocomplete,
  VListItem,
  VListItemAvatar,
  VListItemContent,
  VListItemSubtitle,
  VListItemTitle,
  VTextField,
} from 'vuetify/lib/components';
import truncate from 'lodash/truncate';

import { SearchResult } from '@/modules/config/plugins/discoverability.gridsome.config';

const SearchBoxItem = defineComponent({
  name: 'SearchBoxItem',
  components: {
    VAutocomplete,
    VListItem,
    VListItemContent,
    VListItemTitle,
    VListItemSubtitle,
    VListItemAvatar,
    VTextField,
  },
  props: {
    item: { type: Object as PropType<SearchResult>, required: true },
  },
  setup(props) {
    const { item } = toRefs(props);

    const image = computed(() => item.value.node.images?.[0]);

    return {
      image,
      truncate,
    };
  },
});

export default SearchBoxItem;
</script>

<style lang="scss">
.SearchBoxItem {
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}
</style>
