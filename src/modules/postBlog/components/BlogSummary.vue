<template>
  <div class="BlogSummary">
    <dl class="BlogSummary__wrapper d-flex flex-wrap text-body-2 pa-6">
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
        <dt class="text-label">Time</dt>
        <dd>{{ post.timeToRead.text }}</dd>
      </div>
    </dl>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';

import { formatDate } from '@/modules/core/utils/formatDate';
import type { PostInPostLayout } from '@/modules/post/components/PostLayout.vue';

const BlogSummary = defineComponent({
  name: 'BlogSummary',
  props: {
    post: {
      type: Object as PropType<PostInPostLayout>,
      required: false,
      default: null,
    },
  },
  setup() {
    return {
      formatDate,
    };
  },
});
export default BlogSummary;
</script>

<style lang="scss">
@import '~/modules/core/style/_neumorphic';

.BlogSummary {
  @include neumorphic;

  &__wrapper {
    @extend .neumorphic;
    
    gap: 28px;
  }
}
</style>
