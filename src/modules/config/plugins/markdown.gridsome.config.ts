import type { GridsomeConfig } from '@/typings/gridsome';

// See https://github.com/remarkjs/remark/blob/main/doc/plugins.md#list-of-plugins
export const remarkConfig = {
  // global remark options
  // See https://www.npmjs.com/package/@gridsome/transformer-remark
  plugins: [
    // Highlight for code blocks, see https://gridsome.org/plugins/@gridsome/remark-prismjs
    '@gridsome/remark-prismjs',
    // Add custom styling to markdown elements
    ['@noxify/gridsome-remark-classes', {
      thematicBreak: 'v-divider theme--light mt-3 mb-6',
    }],
    // Add info containers (info, warn, error, ...)
    // See https://gridsome.org/plugins/gridsome-plugin-remark-container
    [
      'gridsome-plugin-remark-container',
      // Add custom types
      // {
      //   customTypes: {
      //     custom: {
      //       defaultTitle: "Custom",
      //       emoji: "💻",
      //       svg: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M15 2H1c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1h5.34c-.25.61-.86 1.39-2.34 2h8c-1.48-.61-2.09-1.39-2.34-2H15c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm0 9H1V3h14v8z"></path></svg>'
      //     }
      //   }
      // }
    ],
    // Add youtube links easily like so:
    // `youtube:https://www.youtube.com/watch?v=dQw4w9WgXcQ`
    // See https://gridsome.org/plugins/gridsome-plugin-remark-youtube
    ['gridsome-plugin-remark-youtube', { width: '500px', align: 'auto' }],
    [
      'gridsome-remark-figure-caption',
      {
        // All the options here are optional
        figureClassName: "md-figure-block",
        imageClassName: "md-figure-image",
        captionClassName: "md-figure-caption",
      },
    ],
  ],

  externalLinks: true,
  externalLinksTarget: '_blank',
  externalLinksRel: ['nofollow', 'noopener', 'noreferrer'],
};

export const markdownConfigGridsome: GridsomeConfig = {
  transformers: {
    remark: remarkConfig,
  },
};
