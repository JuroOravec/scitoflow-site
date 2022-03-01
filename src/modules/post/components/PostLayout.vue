<template>
  <AppLayout layout-type="post" :meta-props="metaProps" class="PostLayout">
    <!-- TODO: Do the semantic web like "content", "aside", etc -->
    <div class="PostLayout__container mx-auto pt-8 pb-16">
      <div v-if="!post">
        <h1 class="pb-12">Oops! Something went horribly wrong...</h1>
        <h2>...worse than my family reunion last Christmas!</h2>
      </div>

      <div v-else>
        <h1 class="pb-12">
          {{ post.title }}
        </h1>

        <slot name="before-content" />

        <!-- Component is auto-imported by https://github.com/gridsome/gridsome/tree/master/packages/vue-remark -->
        <VueRemarkContent />

        <div class="pt-16 pb-12" />

        <slot name="after-content" />

        <!-- Component is globally defined by Vissue plugin -->
        <Comments v-if="allowComments" :page-title="post.postId" />
      </div>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  PropType,
  toRefs,
} from '@vue/composition-api';

import type { GqlPost, GqlPostPerson, GqlReadTime } from '@/__generated__/graphql';
import AppLayout from '@/modules/core/components/AppLayout.vue';
import Comments from '@/modules/core/components/Comments.vue';
import type {
  PostMetaProps,
  PostForMeta,
} from '@/modules/post/components/PostMeta.vue';

/** Subset of GqlPost object with props used in PostLayout component */
export type PostInPostLayout = PostForMeta &
  Pick<GqlPost, 'postId'> & {
    authors: Pick<GqlPostPerson, 'fullName'>[];
    contributors: Pick<GqlPostPerson, 'fullName'>[];
    timeToRead: Pick<GqlReadTime, 'text'>;
  };

/**
 * This component is the main layout for all "Post" collections (BlogPost, ProjectPost).
 *
 * See https://gridsome.org/docs/templates/
 */
const PostLayout = defineComponent({
  name: 'PostLayout',
  components: {
    AppLayout,
    Comments,
  },
  props: {
    post: {
      type: Object as PropType<PostInPostLayout>,
      required: false,
      default: null,
    },
    fallbackTitle: { type: String, required: false, default: 'Post' },
    allowComments: { type: Boolean, required: false, default: true },
  },
  setup(props) {
    const { fallbackTitle, post } = toRefs(props);

    const metaProps = computed(
      (): PostMetaProps => ({
        post: post.value,
        fallbackTitle: fallbackTitle.value,
      }),
    );

    return {
      metaProps,
    };
  },
});
export default PostLayout;
</script>

<style lang="scss">
.PostLayout {
  &__container {
    max-width: 600px;
  }
}
</style>
