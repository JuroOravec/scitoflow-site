<template>
  <AppLayout :meta-props="metaProps" class="Home">
    <div class="mt-n3 d-flex justify-center">
      <g-image
        src="@/modules/core/assets/imgs/tech-md.png"
        quality="100"
        class="Home__heroImg"
      />
      <div class="Hero text-center">
        <h1 class="Hero__title">What we know. Digitised.</h1>
        <!-- <h1 class="Hero__title">Living life like there's no tomorrow <br/> submerged in temporal stasis</h1> -->
      </div>
    </div>
    <div class="pt-16 text-center">
      <h2 class="Hero__subtitle secondary--text text--lighten-3">
        Mind the time
      </h2>
      <h4 class="secondary--text text--lighten-5">
        {{ countdown }}
      </h4>
    </div>

    <h2 class="pt-16 mt-16 secondary--text text--lighten-3">Latest posts</h2>
    <PostCollection
      :posts="latestPosts"
      :small="$vuetify.breakpoint.xsOnly"
    />
  </AppLayout>
</template>

<page-query>
query getHomeData {
	blogs: allBlogPost(limit: 5) {
    edges {
      node {
        postId
        path
        title
        description
        datePublished
        images {
          path
          alt
        }
      }
    }
  }
	projects: allProjectPost(limit: 5) {
    edges {
      node {
        postId
        path
        title
        description
        datePublished
        images {
          path
          alt
        }
      }
    }
  }
  metadata {
    siteDescription
  }
}
</page-query>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api';
import { useTimestamp } from '@vueuse/core';
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds';
import minutesToMilliseconds from 'date-fns/minutesToMilliseconds';
import hoursToMilliseconds from 'date-fns/hoursToMilliseconds';
import sortBy from 'lodash/sortBy';

import AppLayout from '@/modules/core/components/AppLayout.vue';
import type { GqlgetHomeDataQuery } from '@/__generated__/graphql';
import type { MetaProps } from '@/modules/core/components/Meta.vue';
import { usePageQuery } from '@/modules/core/utils/useGridsomeQuery';
import PostCollection from '@/modules/post/components/PostCollection.vue';
import { refToRefs } from '../utils/vueReactivity';
import { isNotNil } from '../utils/isNotNull';

const deadline = new Date('2030-12-13');

const Home = defineComponent({
  name: 'Home',
  components: {
    AppLayout,
    PostCollection,
  },
  setup() {
    const data = usePageQuery<GqlgetHomeDataQuery, GqlgetHomeDataQuery>(
      (data) => data ?? {},
    );
    const { metadata, projects, blogs } = refToRefs(data);

    const latestPosts = computed(() => {
      const posts = [
        ...(projects?.value?.edges ?? []),
        ...(blogs?.value?.edges ?? []),
      ]
        .map((post) => post?.node ?? null)
        .filter(isNotNil)
        .slice(0, 3);

      return sortBy(posts, (post) => post.datePublished);
    });

    const siteDescription = computed(
      (): string => metadata?.value?.siteDescription ?? '',
    );

    const timestamp = useTimestamp({ interval: 1000 });
    const countdown = computed(() => {
      let remaining = differenceInMilliseconds(deadline, timestamp.value);

      const remainingDays = Math.floor(remaining / hoursToMilliseconds(24));
      remaining = remaining % hoursToMilliseconds(24);

      const remainingHours = Math.floor(remaining / hoursToMilliseconds(1));
      remaining = remaining % hoursToMilliseconds(1);

      const remainingMinutes = Math.floor(remaining / minutesToMilliseconds(1));

      return `${remainingDays} days ${remainingHours} hours ${remainingMinutes} minutes`;
    });

    const metaProps = computed(
      (): MetaProps => ({
        pageTitle: '',
        pageDescription: siteDescription.value,
      }),
    );

    return {
      latestPosts,
      countdown,
      metaProps,
    };
  },
});
export default Home;
</script>

<style lang="scss">
.Home {
  &__heroImg {
    max-width: unset;
    min-height: 600px;
  }

  .Hero {
    position: absolute;
    padding-top: 190px;

    &__title {
      font-weight: 900 !important;
      color: white;
    }
  }

  @media (max-width: 360px) {
    .Hero {
      padding-top: 165px;
    }
  }
}
</style>
