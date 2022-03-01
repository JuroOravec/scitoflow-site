<template>
  <div v-if="posts.length" class="RelatedPosts">
    <h3 class="pb-0">
      {{ title }}
    </h3>

    <v-divider class="mt-3 mb-6" />

    <div class="RelatedPosts__posts py-4 px-5 link-soft">
      <template v-for="(post, index) in posts">
        <v-divider v-if="index" class="my-2" :key="post.path + '-divider'" />

        <div :key="post.path" class="RelatedPosts__post">
          <g-link :to="post.path">
            <div class="d-flex hover-slide-x-2">
              <g-image
                v-if="post.images.length"
                v-bind="post.images[0].path"
                class="pr-4"
              />
              <div>
                <h4 class="pb-1">
                  {{ post.title }}
                </h4>

                <p class="text-body-2 mb-0">
                  {{ post.description }}
                </p>
              </div>
            </div>
          </g-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { VDivider } from 'vuetify/lib/components';

import type {
  GqlPost,
  GqlPostImage,
  GqlPostPerson,
} from '@/__generated__/graphql';

export type RelatedPost = Pick<
  GqlPost,
  'title' | 'path' | 'description' | 'authors'
> & {
  images: Pick<GqlPostImage, 'path'>[];
};

const RelatedPosts = defineComponent({
  name: 'RelatedPosts',
  components: {
    VDivider,
  },
  props: {
    title: { type: String, required: true },
    posts: {
      type: Array as PropType<RelatedPost[]>,
      required: true,
      default: () => [],
    },
  },
  setup() {
    const formatAuthors = (authors: GqlPostPerson[]): string =>
      authors?.map((author) => author.fullName).join(', ') ?? '';

    return {
      formatAuthors,
    };
  },
});
export default RelatedPosts;
</script>

<style lang="scss">
@import '~/modules/core/style/_neumorphic';

.RelatedPosts {
  @include neumorphic;

  &__posts {
    display: flex;
    flex-direction: column;

    @extend .neumorphic;
  }

  &__post {
    img {
      max-height: 100px;
    }
  }
}
</style>
