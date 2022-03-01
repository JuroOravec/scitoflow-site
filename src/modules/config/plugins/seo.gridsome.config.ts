import type { GridsomeConfig } from "@/typings/gridsome";

export const seoConfigGridsome: GridsomeConfig = {
  plugins: [
    {
      use: '@gridsome/plugin-sitemap',
      options: {
        // exclude: ['/exclude-me'],
        // See https://www.sitemaps.org/protocol.html
        // config: {
        //   '/articles/*': {
        //     changefreq: 'weekly',
        //     priority: 0.5,
        //     lastmod: '2020-02-19',
        //   },
        //   '/about': {
        //     changefreq: 'monthly',
        //     priority: 0.7,
        //     lastmod: '2020-05-12',
        //   },
        // },
      },
    },
    {
      // See https://gridsome.org/plugins/gridsome-plugin-robots
      use: 'gridsome-plugin-robots',
      options: {
        // host: ${siteMetadata.siteUrl},
        // sitemap: ${siteMetadata.siteUrl}/sitemap.xml,
        env: {
          development: {
            policy: [{ userAgent: '*', disallow: ['/'] }],
          },
          production: {
            policy: [{ userAgent: '*', allow: '/' }],
          },
        },
      },
    },
  ],
};
