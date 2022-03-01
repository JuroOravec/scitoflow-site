<template>
  <PostCollectionLayout
    name="Projects"
    :post-type="PostType.PROJECT"
    :posts="projects"
    :meta-props="metaProps"
    class="Project"
  />
</template>

<page-query>
query getAllProjects {
	posts: allProjectPost {
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

import type { GqlgetAllProjectsQuery } from '@/__generated__/graphql';
import { isNotNil } from '@/modules/core/utils/isNotNull';
import { usePageQuery } from '@/modules/core/utils/useGridsomeQuery';
import type { MetaProps } from '@/modules/core/components/Meta.vue';
import PostCollectionLayout, {
  PostInPostCollectionLayout,
} from '@/modules/post/components/PostCollectionLayout.vue';
import { PostType } from '@/modules/post/postTypes';

const metaProps: MetaProps = {
  pageTitle: 'Projects',
  pageDescription: 'Browse all projects',
};

const Projects = defineComponent({
  name: 'Projects',
  components: {
    PostCollectionLayout,
  },
  setup() {
    const projects = usePageQuery<
      GqlgetAllProjectsQuery,
      PostInPostCollectionLayout[]
    >(
      (data) =>
        data?.posts?.edges
          ?.map((project) => project?.node ?? null)
          .filter(isNotNil) ?? [],
    );

    return {
      projects,
      metaProps,
      PostType,
    };
  },
});
export default Projects;
</script>
