<template>
  <PostLayout class="BlogPostTemplate" :post="blog" fallback-title="Blog">
    <template #before-content>
      <BlogSummary :post="blog" class="mb-12" />
    </template>
    <template #after-content>
      <RelatedPosts title="Related posts" :posts="relatedBlogs" class="mb-12" />
    </template>
  </PostLayout>
</template>

<page-query>
query getBlogPostByPath ($id: ID!) {
  post: blogPost(id: $id) {
    postId
    title
    canonicalUrl
    authors {
      fullName
      url
    }
    contributors {
      fullName
      url
    }
    datePublished
    dateModified
    dateExpired
    timeToRead {
      text
    }
    description
    tags
    audios {
      path
      mimeType
    }
    images {
      path
      alt
      mimeType
      size {
        width
        height
      }
    }
    videos {
      path
      mimeType
      size {
        width
        height
      }
    }
    mainVideo {
      url
      size {
        width
        height
      }
      actors {
        url
        role
      }
      directors {
        url
      }
      writers {
        url
      }
      duration
      releaseDate
      tags
    }
    # Provided by gridsome-plugin-recommender
    related {
      id
      title
      description
      canonicalUrl
      path
      images {
        path
        alt
      }
      authors {
        fullName
      }
    }
    relatedProjects {
      id
      title
      description
      canonicalUrl
      path
      images {
        path
        alt
      }
      authors {
        fullName
      }
    }
  }
}
</page-query>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api';

import { usePageQuery } from '@/modules/core/utils/useGridsomeQuery';
import type { GqlgetBlogPostByPathQuery } from '@/__generated__/graphql';
import RelatedPosts from '@/modules/post/components/RelatedPosts.vue';
import PostLayout from '@/modules/post/components/PostLayout.vue';
import BlogSummary from './BlogSummary.vue';

type BlogPostResult = NonNullable<GqlgetBlogPostByPathQuery['post']>;

/**
 * This component is used as gridsome template for BlogPost.
 *
 * See https://gridsome.org/docs/templates/
 */
const BlogPostTemplate = defineComponent({
  name: 'BlogPostTemplate',
  components: {
    PostLayout,
    BlogSummary,
    RelatedPosts,
  },
  setup() {
    const blog = usePageQuery<GqlgetBlogPostByPathQuery, BlogPostResult | null>(
      (result) => result?.post ?? null,
    );

    const relatedBlogs = computed(() => blog.value?.related ?? []);

    return {
      blog,
      relatedBlogs,
    };
  },
});
export default BlogPostTemplate;
</script>
