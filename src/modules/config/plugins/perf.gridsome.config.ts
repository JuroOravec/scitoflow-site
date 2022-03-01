import type { GridsomeConfig } from '@/typings/gridsome';

export const perfConfigGridsome: GridsomeConfig = {
  plugins: [
    {
      use: '@gridsome/plugin-critical',
      options: {
        paths: ['/'],
        width: 1300,
        height: 900,
      },
    },
    {
      use: 'gridsome-plugin-precompress',
      options: {
        extensions: ['css', 'html', 'js', 'svg', 'json'],
      },
    },
  ],
};
