import type { GridsomeConfig } from '@/typings/gridsome';
import { metadata } from '../metadata';

// TODO: SETUP PWA (LOW PRIORITY?)
export const pwaConfigGridsome: GridsomeConfig = {
  plugins: [
    {
      use: 'gridsome-plugin-manifest',
      options: {
        background_color: '#000000',
        icon_path: metadata.icon.favicon,
        name: metadata.siteName,
        short_name: metadata.siteName,
        theme_color: '#FFFFFF',
        lang: metadata.lang.lang,
      },
    },
    {
      use: 'gridsome-plugin-pwa',
      options: {
        // Service Worker Options
        disableServiceWorker: false,
        serviceWorkerPath: 'service-worker.js',
        cachedFileTypes: 'js,json,css,html,png,jpg,jpeg,svg,gif',
        disableTemplatedUrls: false, // Optional

        // Manifest Options (https://developer.mozilla.org/en-US/docs/Web/Manifest)
        manifestPath: 'manifest.json',
        title: metadata.siteName,
        startUrl: '/',
        display: 'standalone',
        statusBarStyle: 'default',
        themeColor: metadata.icon.maskColor,
        backgroundColor: '#ffffff',
        icon: metadata.icon.favicon,
        shortName: metadata.siteName,
        description: metadata.siteDescription,
        categories: metadata.siteTags,
        lang: metadata.lang.localeIETF,
        dir: 'auto',
        maskableIcon: true,
        // screenshots: [
        //   {
        //     src: 'src/screenshot1.png',
        //     sizes: '1280x720',
        //     type: 'image/png',
        //   },
        // ],
        // shortcuts: [
        //   {
        //     name: 'View Subscriptions',
        //     short_name: 'Subscriptions',
        //     description: 'View the list of podcasts you listen to',
        //     url: '/subscriptions?utm_source=homescreen',
        //     icons: [{ src: '/icons/subscriptions.png', sizes: '192x192' }],
        //   },
        // ],
        gcmSenderId: undefined, // Optional

        // Standard Meta Tags
        // svgFavicon: metadata.icon.favicon.svg,

        // Microsoft Windows Meta Tags
        msTileColor: metadata.icon.maskColor,

        // Apple MacOS Meta Tags
        // appleMaskIcon: metadata.icon.favicon.svg,
        appleMaskIconColor: metadata.icon.maskColor,
      },
    },
  ],
};
