import type { GridsomeConfig } from '@/typings/gridsome';
import { metadata } from '../metadata';

export const analyticsConfigGridsome: GridsomeConfig = {
  plugins: [
    {
      use: 'gridsome-plugin-sentry',
      options: {
        dsn: metadata.analytics.sentryIngest,
        attachProps: true,
        logErrors: process.env.NODE_ENV === 'development',
      },
    },
  ],
};
