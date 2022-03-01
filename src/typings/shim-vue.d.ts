import type Vue from 'vue';
import type { defineComponent } from '@vue/composition-api';
import type { MetaInfo } from 'vue-meta';
import type FlexSearch from 'flexsearch';

declare module '*.vue' {
  const Component: ReturnType<typeof defineComponent>;
  export default Component;
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    metaInfo?: MetaInfo | (() => MetaInfo);
  }
}

// Note: To make it work, you have to import "vue" in that file
declare module 'vue/types/vue' {
  export interface Vue {
    /** Use graphql-codegen auto-generated types to specify the type of $static query */
    $static?: any;
    /** Use graphql-codegen auto-generated types to specify the type of $page query */
    $page?: any;
    /**
     * Search endpoint provided by gridsome-plugin-flexsearch.
     * See https://gridsome.org/plugins/gridsome-plugin-flexsearch#usage
     */
    $search: FlexSearch.Document<any>;
  }
}
