<template>
  <div class="ProjectSummary">
    <dl class="ProjectSummary__wrapper d-flex flex-wrap text-body-2 pa-6">
      <div>
        <dt class="text-label">
          {{ post.authors.length === 1 ? 'Author' : 'Authors' }}
        </dt>
        <dd v-for="author in post.authors" :key="author.fullName">
          {{ author.fullName }}
        </dd>
      </div>

      <div v-if="post.contributors.length">
        <dt class="text-label">
          {{ post.contributors.length === 1 ? 'Contributor' : 'Contributors' }}
        </dt>
        <dd
          v-for="contributor in post.contributors"
          :key="contributor.fullName"
        >
          {{ contributor.fullName }}
        </dd>
      </div>

      <div>
        <dt class="text-label">Date</dt>
        <dd>
          {{ formatDate(post.datePublished) }}
        </dd>
      </div>

      <div class="flex" />

      <div>
        <dt class="text-label">Status</dt>
        <dd>
          {{ formatStatus(post.projectStatus) }}
        </dd>
      </div>

      <div>
        <dt class="text-label">URL</dt>
        <dd>
          <a
            v-if="post.projectUrl"
            :href="post.projectUrl"
            target="_blank"
            rel="noopener"
          >
            {{ formatUrl(post.projectUrl) }}
            <v-icon size="14" :style="{ marginTop: '-2px' }">mdi-open-in-new</v-icon>
          </a>
          <template v-else> N/A </template>
        </dd>
      </div>
    </dl>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import capitalize from 'lodash/capitalize';
import { VIcon } from 'vuetify/lib/components';

import type { GqlProjectPost } from '@/__generated__/graphql';
import { formatDate } from '@/modules/core/utils/formatDate';
import type { PostInPostLayout } from '@/modules/post/components/PostLayout.vue';

export type ProjectInProjectSummary = Pick<
  GqlProjectPost,
  'projectUrl' | 'projectStatus' | 'datePublished'
> &
  Pick<PostInPostLayout, 'authors' | 'contributors'>;

/**
 * This component is the main layout for all "Post" collections (BlogPost, ProjectPost).
 *
 * See https://gridsome.org/docs/templates/
 */
const ProjectSummary = defineComponent({
  name: 'ProjectSummary',
  components: {
    VIcon,
  },
  props: {
    post: {
      type: Object as PropType<ProjectInProjectSummary>,
      required: false,
      default: null,
    },
  },
  setup() {
    const formatUrl = (url: string) => new URL(url).hostname;
    const formatStatus = (status: string) => capitalize(status);

    return {
      formatDate,
      formatUrl,
      formatStatus,
    };
  },
});
export default ProjectSummary;
</script>

<style lang="scss">
@import '~/modules/core/style/_neumorphic';

.ProjectSummary {
  @include neumorphic;

  &__wrapper {
    @extend .neumorphic;

    gap: 28px;
  }
}
</style>
