<template>
  <v-app-bar
    app
    color="white"
    class="AppHeader link-soft"
    :class="{ large: large }"
    elevate-on-scroll
  >
    <div class="d-flex align-center gap-2">
      <v-app-bar-nav-icon
        v-if="!large"
        @click="() => $emit('menu-icon-click')"
      />
      <AppHeaderHomeLink />
    </div>

    <SearchBox dense />

    <nav
      v-if="large"
      class="d-flex align-center font-weight-regular gap-5 font-size-9"
    >
      <g-link
        v-for="nav in renderedNavItems"
        :to="nav.to"
        :key="nav.to"
        class="Header__nav"
        :class="
          nav.selected
            ? 'Header__nav--selected primary--text text--accent-4'
            : ''
        "
      >
        {{ nav.text }}
      </g-link>
    </nav>
  </v-app-bar>
</template>

<script lang="ts">
import 'vue-router';
import {
  computed,
  defineComponent,
  getCurrentInstance,
  PropType,
  toRefs,
} from '@vue/composition-api';
import {
  VSpacer,
  VAppBar,
  VAppBarNavIcon,
  VAppBarTitle,
  VToolbarTitle,
} from 'vuetify/lib/components';

import SearchBox from './SearchBox.vue';
import type { NavItem } from '../coreTypes';
import AppHeaderHomeLink from './AppHeaderHomeLink.vue';

const AppHeader = defineComponent({
  name: 'AppHeader',
  components: {
    AppHeaderHomeLink,
    SearchBox,
    VAppBar,
    VAppBarNavIcon,
    VAppBarTitle,
    VSpacer,
    VToolbarTitle,
  },
  props: {
    large: { type: Boolean, required: false, default: true },
    navItems: {
      type: Array as PropType<NavItem[]>,
      required: false,
      default: () => [],
    },
  },
  setup(props) {
    const { navItems } = toRefs(props);

    const instance = getCurrentInstance();

    const renderedNavItems = computed((): (NavItem & { selected: boolean })[] =>
      navItems.value?.map((navItem) => ({
        ...navItem,
        selected: instance?.proxy.$route.path === navItem.to,
      })),
    );

    return {
      renderedNavItems,
    };
  },
});

export default AppHeader;
</script>

<style lang="scss">
.AppHeader {
  z-index: 10;

  .v-toolbar__content {
    max-width: 960px;
    margin: auto;

    padding-left: 16px;
    padding-right: 16px;
    gap: 20px;
    justify-content: space-between;
  }

  &__nav {
    position: relative;

    &--selected {
      &::after {
        content: '';
        width: 140%;
        border-bottom: 1px solid;
        position: absolute;
        top: 110%;
        left: -20%;
      }
    }
  }

  &.large {
    .v-toolbar__content {
      padding-left: 32px;
      padding-right: 32px;
    }
  }
}
</style>
