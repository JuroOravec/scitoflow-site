<template>
  <PostLayout
    class="ProjectPostTemplate"
    :post="project"
    fallback-title="Project"
  >
    <template #before-content>
      <ProjectSummary :post="project" class="mb-12" />
    </template>
    <template #after-content>
      <RelatedPosts title="Related posts" :posts="relatedBlogs" class="mb-12" />
    </template>
  </PostLayout>
</template>

<page-query>
query getProjectPostByPath ($id: ID!) {
  post: projectPost(id: $id) {
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
    projectUrl
    projectStatus
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
    relatedBlogs {
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

import type { GqlgetProjectPostByPathQuery } from '@/__generated__/graphql';
import { usePageQuery } from '@/modules/core/utils/useGridsomeQuery';
import RelatedPosts, {
  RelatedPost,
} from '@/modules/post/components/RelatedPosts.vue';
import PostLayout, {
  PostInPostLayout,
} from '@/modules/post/components/PostLayout.vue';
import ProjectSummary, { ProjectInProjectSummary } from './ProjectSummary.vue';

type ProjectInTemplate = ProjectInProjectSummary &
  PostInPostLayout & {
    relatedBlogs: RelatedPost[];
  };

/**
 * This component is used as gridsome template for ProjectPost.
 *
 * See https://gridsome.org/docs/templates/
 */
const ProjectPostTemplate = defineComponent({
  name: 'ProjectPostTemplate',
  components: {
    PostLayout,
    RelatedPosts,
    ProjectSummary,
  },
  setup() {
    const project = usePageQuery<
      GqlgetProjectPostByPathQuery,
      ProjectInTemplate | null
    >((result) => {
      return (result?.post ?? null) as ProjectInTemplate | null;
    });

    const relatedBlogs = computed(() => project.value?.relatedBlogs ?? []);

    return {
      project,
      relatedBlogs,
    };
  },
});
export default ProjectPostTemplate;
</script>
