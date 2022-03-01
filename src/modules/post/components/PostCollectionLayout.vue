<template>
  <AppLayout :meta-props="metaProps" class="PostCollectionLayout">
    <div class="text-center secondary--text text--darken-1 py-16">
      <h1>{{ name }}</h1>
    </div>

    <SearchBox :post-type="postType" class="pb-12" />

    <PostCollection :posts="posts" :small="$vuetify.breakpoint.xsOnly" />
  </AppLayout>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';

import type { GqlPost, GqlPostImage } from '@/__generated__/graphql';
import type { PostType } from '@/modules/post/postTypes';
import { formatDate } from '@/modules/core/utils/formatDate';
import AppLayout from '@/modules/core/components/AppLayout.vue';
import SearchBox from '@/modules/core/components/SearchBox.vue';
import PostCollection from './PostCollection.vue';

export type PostInPostCollectionLayout = Pick<
  GqlPost,
  'postId' | 'title' | 'path' | 'description' | 'datePublished'
> & { images: Pick<GqlPostImage, 'path' | 'alt'>[] };

const PostCollectionLayout = defineComponent({
  name: 'PostCollectionLayout',
  components: {
    AppLayout,
    SearchBox,
    PostCollection,
  },
  props: {
    name: { type: String, required: false, default: 'Posts' },
    postType: { type: String as PropType<PostType>, required: true },
    posts: {
      type: Array as PropType<PostInPostCollectionLayout[]>,
      required: false,
      default: () => [],
    },
    metaProps: { type: Object, required: false },
  },
  setup() {
    return {
      formatDate,
    };
  },
});
export default PostCollectionLayout;
</script>
