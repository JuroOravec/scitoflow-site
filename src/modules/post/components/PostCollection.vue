<template>
  <div class="PostCollection" :class="{ small: small }">
    <g-link
      v-for="post in posts"
      :to="post.path"
      :key="post.postId"
      class="PostCollection__post secondary--text text--darken-1 py-8 gap-6"
    >
      <g-image v-if="post.images.length" v-bind="post.images[0].path" />
      <div>
        <p class="text-caption secondary--text text--lighten-3 mb-1">
          {{ formatDate(post.datePublished) }}
        </p>
        <h3>{{ post.title }}</h3>
        <p class="mb-0">{{ post.description }}</p>
      </div>
    </g-link>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';

import type { GqlPost, GqlPostImage } from '@/__generated__/graphql';
import { formatDate } from '@/modules/core/utils/formatDate';
import AppLayout from '@/modules/core/components/AppLayout.vue';
import SearchBox from '@/modules/core/components/SearchBox.vue';

export type PostInPostCollection = Pick<
  GqlPost,
  'postId' | 'title' | 'path' | 'description' | 'datePublished'
> & { images: Pick<GqlPostImage, 'path' | 'alt'>[] };

const PostCollection = defineComponent({
  name: 'PostCollection',
  components: {
    AppLayout,
    SearchBox,
  },
  props: {
    posts: {
      type: Array as PropType<PostInPostCollection[]>,
      required: false,
      default: () => [],
    },
    small: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup() {
    return {
      formatDate,
    };
  },
});
export default PostCollection;
</script>

<style lang="scss">
@import '~/modules/core/style/_utils.scss';
.PostCollection {
  &__post {
    display: flex;
    text-decoration: none !important;
    transition: background 0.5s ease;

    &:hover {
      background-color: hsl(180deg 20% 97%);
    }
  }

  img {
    object-fit: cover;
  }

  &:not(.small) {
    img {
      max-width: 250px;
    }

    .PostCollection {
      &__post {
        /* Slide to right on hover on large screen */
        padding: 0 32px 0 16px;
        @extend .hover-slide-x-8;
      }
    }
  }

  &.small {
    .PostCollection {
      &__post {
        display: block !important;
        text-align: center;
        /* Slide up on hover on small screen */
        padding: 0 32px;
        @extend .hover-slide-y-4;
      }
    }
  }
}
</style>
