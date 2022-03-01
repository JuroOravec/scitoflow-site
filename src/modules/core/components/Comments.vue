<template>
  <div class="Comments">
    <!-- Component is globally defined by Vissue plugin -->
    <Vssue :title="pageTitle" class="px-0" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

const Comments = defineComponent({
  name: 'Comments',
  props: {
    pageTitle: { type: String, required: true },
  },
});

export default Comments;
</script>

<style lang="scss">
@import '~vuetify/src/styles/main.sass';
@import '~vuetify/src/components/VBtn/VBtn.sass';
@import '~/modules/core/style/_neumorphic';
  
.Comments {
  @include neumorphic;

  --vssue-border-radius: 7px;
  --vssue-theme-color: #a3aab1;
  --vssue-theme-secondary: #eaecef;
  --vssue-font-size: 14px;

  .vssue {
    font-size: var(--vssue-font-size);
    font-family: 'Roboto', sans-serif !important;

    .vssue-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .vssue-header-comments-count {
      font-size: 1.2rem;
      font-weight: 300;
      color: rgba(0, 0, 0, 0.87) !important;
    }

    .vssue-header-powered-by {
      display: none;
    }

    .vssue-body {
      padding-top: 4px;
    }

    .vssue-status {
      color: var(--vssue-border-radius);
    }

    .vssue-new-comment-operations {
      @extend .my-4;
    }

    .vssue-logout,
    .vssue-button {
      @extend .v-btn, .v-btn--outlined, .py-2, .px-6, .elevation-0;
      text-transform: inherit !important;
      text-decoration: none !important;
      border-width: 1px;
      border-radius: var(--vssue-border-radius) !important;
    }
    .vssue-logout {
      @extend .v-btn--outlined;
    }
    .vssue-button {
      min-width: 170px;
    }
    .vssue-button[disabled] {
      @extend .v-btn--disabled;
    }
    .vssue-button:not([disabled]) {
      @extend .elevation-3;
      color: var(--v-secondary-lighten1) !important;
      border-color: var(--v-secondary-lighten1) !important;
    }

    .vssue-current-user {
      span {
        display: none;
      }
    }

    .vssue-new-comment-input,
    .vssue-comment-body {
      font-family: 'Roboto', sans-serif !important;
      font-size: var(--vssue-font-size) !important;
      letter-spacing: 0.3px;
      background-color: #fafafa !important;
      transition: all 0.2s;

      border-color: var(--vssue-theme-color) !important;
      border-radius: var(--vssue-border-radius) !important;
      border-bottom-width: 0;
      border-right-width: 0;

      @extend .neumorphic;

      &:focus {
        box-shadow: inset 1px 1px 3px 0 rgba(0, 0, 0, 0.2),
          inset 3px 3px 8px 0 rgba(0, 0, 0, 0.2),
          0 0 20px 5px rgba(177, 217, 231, 1) !important;
      }
    }

    .vssue-comment {
      @extend .my-5;
    }

    .vssue-comment-main {
      border-top-width: 0 !important;
      border-bottom-width: 0 !important;

      .markdown-body {
        font-size: var(--vssue-font-size);
      }
    }

    .vssue-comment-avatar {
      position: relative;
      border-radius: 200px;
      overflow: hidden;

      /* Do not highlight <a> that wraps an image */
      a {
        opacity: 1 !important;
      }

      &::after {
        content: '';
        position: absolute;
        display: block;
        height: 100%;
        width: 100%;
        top: 0;

        border-radius: 100px;
        box-shadow: inset 1px 1px 5px 1px rgb(0 0 0 / 20%),
          inset 3px 3px 8px 0 rgb(0 0 0 / 20%) !important;
      }
    }

    .vssue-comment-reaction[title="Heart"],
    .vssue-comment-reaction[title="Heart"] svg,
    .vssue-comment-reaction[title="Loading"],
    .vssue-comment-reaction[title="Loading"] svg {
      color: #00000088 !important;
      fill: #00000088 !important;
    }

    .vssue-comment-reaction[title="Unlike"],
    .vssue-comment-reaction[title="Unlike"] svg {
      color: rgb(245, 100, 100) !important;
      fill: rgb(245, 100, 100) !important;
    }

    .vssue-comment-operations .vssue-icon {
      color: #00000088 !important;
      fill: #00000088 !important; 
    }

    .vssue-comment-footer {
      .vssue-icon {
        width: 1.2em;
        height: 1.2em;
      }
    }

    .vssue-pagination {
      @extend .pb-4, .pt-2;
      font-weight: bold;
      border-bottom: 1px solid #eaecef;
      color: #00000088;
    }

    .vssue-pagination-select {
      border-width: 0 !important;
      box-shadow: none;
      padding: 0 20px;
      color: #00000088;

      &:focus {
        box-shadow: 0 0 0.2px 0.2px var(--vssue-theme-color);
      }
    }

    .vssue-pagination-link {
      font-weight: bolder;
      font-size: 16px;
    }

    a {
      color: var(--v-secondary-lighten1);
      font-weight: 700;

      &:hover {
        opacity: 0.8;
      }
    }
  }
}
</style>
