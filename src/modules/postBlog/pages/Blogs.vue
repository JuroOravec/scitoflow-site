<template>
  <PostCollectionLayout
    name="Blog"
    :post-type="PostType.BLOG"
    :posts="blogs"
    :meta-props="metaProps"
    class="Blogs"
  />
</template>

<page-query>
query getAllBlogs {
	posts: allBlogPost {
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
}
</page-query>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

import type { GqlgetAllBlogsQuery } from '@/__generated__/graphql';
import { isNotNil } from '@/modules/core/utils/isNotNull';
import { usePageQuery } from '@/modules/core/utils/useGridsomeQuery';
import type { MetaProps } from '@/modules/core/components/Meta.vue';
import PostCollectionLayout, {
  PostInPostCollectionLayout,
} from '@/modules/post/components/PostCollectionLayout.vue';
import { PostType } from '@/modules/post/postTypes';

const metaProps: MetaProps = {
  pageTitle: 'Blogs',
  pageDescription: 'Browse all blogs',
};

const Blogs = defineComponent({
  name: 'Blogs',
  components: {
    PostCollectionLayout,
  },
  setup() {
    const blogs = usePageQuery<
      GqlgetAllBlogsQuery,
      PostInPostCollectionLayout[]
    >(
      (data) =>
        data?.posts?.edges
          ?.map((blog) => blog?.node ?? null)
          .filter(isNotNil) ?? [],
    );

    return {
      blogs,
      metaProps,
      PostType,
    };
  },
});
export default Blogs;
</script>
