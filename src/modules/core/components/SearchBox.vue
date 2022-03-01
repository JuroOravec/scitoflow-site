<template>
  <div
    class="SearchBox link-soft"
    :class="{ 'SearchBox--dense': dense }"
    :id="componentId"
  >
    <v-autocomplete
      color="primary"
      :items="autocompleteItems"
      :loading="searchLoading"
      :search-input.sync="searchTerm"
      :menu-props="!searchTerm ? { maxHeight: 0 } : undefined"
      return-object
      no-filter
      hide-details
      dense
      filled
      :attach="`#${componentId}`"
      placeholder="Search"
      :append-icon="null"
      prepend-inner-icon="md-magnify"
    >
      <template #prepend-inner>
        <v-icon small color="#0000005f">mdi-magnify</v-icon>
      </template>
      <template #no-data>
        <v-list-item>
          <v-list-item-subtitle>
            <template v-if="!searchTerm || searchTerm.length === 0">
              Write something into the search to load results
            </template>
            <template v-if="searchTerm && searchTerm.length < 3">
              Write a bit more to load results
            </template>
            <template v-else> No matches </template>
          </v-list-item-subtitle>
        </v-list-item>
      </template>

      <!--
      Note: Altho we use VAutoselect for search + selection,
      we don't want to render the "selected" items
      -->
      <template #selection>
        <div />
      </template>

      <template #item="{ item, on, attrs }">
        <SearchBoxItem :item="item.value" v-bind="attrs" v-on="on" />
      </template>
    </v-autocomplete>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  toRefs,
  watch,
  PropType,
} from '@vue/composition-api';
import uniqueId from 'lodash/uniqueId';
import {
  VAutocomplete,
  VIcon,
  VListItem,
  VListItemSubtitle,
  VTextField,
} from 'vuetify/lib/components';

import type { PostType } from '@/modules/post/postTypes';
import { useFlexsearch } from '../utils/useFlexsearch';
import SearchBoxItem from './SearchBoxItem.vue';

const SearchBox = defineComponent({
  name: 'SearchBox',
  components: {
    VAutocomplete,
    VIcon,
    VListItem,
    VListItemSubtitle,
    VTextField,
    SearchBoxItem,
  },
  props: {
    postType: {
      type: String as PropType<PostType>,
      required: false,
      default: null,
    },
    dense: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props) {
    const { postType } = toRefs(props);

    const componentId = uniqueId('searchbox_');
    const searchTerm = ref('');
    const searchLoading = ref(false);

    const { search: doSearch, searchResults } = useFlexsearch();

    const search = (text: string): void => {
      if (text.length < 3) {
        searchResults.value = [];
        return;
      }

      searchLoading.value = true;
      doSearch({ query: text, limit: 10 }, postType.value);
      searchLoading.value = false;
    };

    watch(searchTerm, (newSearchTerm) => search(newSearchTerm ?? ''));

    const autocompleteItems = computed(() =>
      searchResults.value.map((result) => ({ value: result })),
    );

    return {
      searchTerm,
      autocompleteItems,
      searchLoading,
      componentId,
    };
  },
});

export default SearchBox;
</script>

<style lang="scss">
@import '~/modules/core/style/_neumorphic';

.SearchBox {
  @include neumorphic;

  position: relative;

  .v-text-field {
    font-size: 14px !important;

    .v-input__slot {
      @extend .neumorphic;

      min-height: 40px !important;
      padding: 0 8px !important;
      background-color: white !important;

      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    .v-input__prepend-inner {
      margin: 4px 0 0 0 !important;
      align-self: center;
    }
  }

  .v-autocomplete__content {
    max-width: 450px;
  }

  .v-list-item--link:before {
    background-color: white;
  }
  .theme--light.v-list-item:hover::before {
    background-color: #00000055;
  }

  &--dense {
    .v-text-field {
      .v-input__slot {
        min-height: 30px !important;
      }
    }
  }
}
</style>
