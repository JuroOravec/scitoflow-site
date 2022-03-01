<template>
  <v-layout class="AppLayout flex-column">
    <component :is="metaComponent" v-bind="metaProps" />

    <AppHeader
      :nav-items="navItems"
      :large="isLarge"
      class="link-soft"
      @menu-icon-click="toggleDrawer"
    />

    <v-navigation-drawer
      v-if="!isLarge"
      v-model="isDrawerOpen"
      absolute
      temporary
      class="link-soft"
    >
      <v-list nav dense>
        <v-list-item-group active-class="primary--text text--accent-4">
          <AppHeaderHomeLink class="pa-2" />

          <v-list-item
            v-for="navItem in navItems"
            :key="navItem.to"
            :to="navItem.to"
          >
            <v-list-item-title>{{ navItem.text }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid :class="isLarge ? 'px-16' : 'px-8'">
        <slot name="default" />
      </v-container>
    </v-main>

    <AppFooter />
  </v-layout>
</template>

<script lang="ts">
import 'vue-router';
import type { Component } from 'vue';
import {
  computed,
  defineComponent,
  getCurrentInstance,
  PropType,
  ref,
  watch,
  toRefs,
} from '@vue/composition-api';
import {
  VLayout,
  VMain,
  VContainer,
  VNavigationDrawer,
  VList,
  VListItem,
  VListItemGroup,
  VListItemTitle,
} from 'vuetify/lib/components';

import AppHeader from './AppHeader.vue';
import AppFooter from './AppFooter.vue';
import Meta from './Meta.vue';
import PostMeta from '@/modules/post/components/PostMeta.vue';
import type { NavItem } from '../coreTypes';
import AppHeaderHomeLink from './AppHeaderHomeLink.vue';
import { PostProjectRoutes } from '@/modules/postProject/postProjectTypes';
import { PostBlogRoutes } from '@/modules/postBlog/postBlogTypes';

export enum LayoutType {
  POST = 'post',
  REGULAR = 'regular',
}

const layoutTypeToComponent: Record<LayoutType, Component> = {
  post: PostMeta,
  regular: Meta,
};

const navItems: NavItem[] = [
  { to: PostBlogRoutes.BLOGS, text: 'Blog' },
  { to: PostProjectRoutes.PROJECTS, text: 'Projects' },
  { to: '/about', text: 'About' },
];

const AppLayout = defineComponent({
  name: 'AppLayout',
  components: {
    AppHeaderHomeLink,
    AppHeader,
    AppFooter,
    Meta,
    PostMeta,
    VLayout,
    VMain,
    VContainer,
    VNavigationDrawer,
    VList,
    VListItem,
    VListItemGroup,
    VListItemTitle,
  },
  props: {
    layoutType: {
      type: String as PropType<LayoutType>,
      required: false,
      default: LayoutType.REGULAR,
    },
    metaProps: { type: Object, required: false },
  },
  setup(props) {
    const { layoutType } = toRefs(props);

    const isDrawerOpen = ref(false);

    const instance = getCurrentInstance();

    const metaComponent = computed(
      (): Component => layoutTypeToComponent[layoutType.value] ?? Meta,
    );

    const isLarge = computed(
      (): boolean => instance?.proxy?.$vuetify.breakpoint.smAndUp ?? true,
    );

    watch(isLarge, (newIsLarge) => {
      if (newIsLarge && isDrawerOpen.value) {
        isDrawerOpen.value = false;
      }
    });

    const toggleDrawer = () => {
      isDrawerOpen.value = !isDrawerOpen.value;
    };

    return {
      metaComponent,
      isDrawerOpen,
      isLarge,
      navItems,
      toggleDrawer,
    };
  },
});

export default AppLayout;
</script>

<style lang="scss">
.AppLayout {
  width: 100%;
  max-width: 960px;
  margin: auto;
}
</style>
