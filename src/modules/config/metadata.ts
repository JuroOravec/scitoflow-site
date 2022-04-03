import type { SocialType } from '@/modules/core/utils/socials';
import type { OgProfileGender } from '@/modules/core/utils/metaTagsOpenGraph';
import { formatUrlFromStaticPath, formatUrlFromPath } from '../core/utils/url';

export interface GridsomeConfigMetadata {
  siteName: string;
  siteUrl: string;
  siteDescription: string;
  siteTags: string[];
  siteAuthor: {
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    url: string;
    gender: OgProfileGender;
  };
  siteImage: {
    /** Absolute path that's converted to Image type at GraphQL interface */
    image: string;
    url: string;
    alt: string;
  };
  siteCopyright: string;
  siteLastUpdated: Date;
  lang: {
    lang: string;
    /** Language with locale in format 'en-GB'. This format is used by HTML "lang" attribute */
    localeIETF: string;
    /** Language with locale in format 'en_GB'. This one is used by Open Graph */
    localeJava: string;
  };
  icon: {
    favicon: {
      /** Absolute path that's converted to Image type at GraphQL interface */
      png: string;
      /** Absolute path that's converted to Image type at GraphQL interface */
      svg: string;
    };
    /** Absolute path that's converted to Image type at GraphQL interface */
    touchicon: string;
    maskColor: string;
  };
  social: Record<SocialType, string> & {
    fbAppId: string | null;
    /** Organisation's Twitter username (without `@`), e.g. `nytimes` */
    twitterOrg: string;
  };
  analytics: {
    mixpanelToken: string;
    sentryIngest: string;
  };
  comments: {
    vssueGithubUser: string;
    vssueGithubRepo: string;
    vssueClientId: string;
    vssueClientSecret: string;
  };
}

const cwd = process.cwd();
const remoteSiteUrl = 'https://scitoflow.com';
const localSiteUrl = 'http://localhost:8080';
const siteUrl =
  process.env.SITE_URL || process.env.NODE_ENV === 'development'
    ? localSiteUrl
    : remoteSiteUrl;
const email = 'juraj.oravec.josefson@gmail.com';

/** Globally defined metadata */
export const metadata: GridsomeConfigMetadata = {
  siteName: 'Scitoflow',
  siteUrl,
  siteDescription: 'Explore the process behind science',
  siteTags: ['science', 'research', 'rnd', 'tech', 'software'],
  siteAuthor: {
    firstName: 'Juro',
    lastName: 'Oravec',
    fullName: 'Juro Oravec',
    email,
    url: 'https://jurora.vc/about',
    gender: 'male',
  },
  // This image will be shown on social shares
  // See https://stackoverflow.com/a/19632390/9788634
  siteImage: {
    image: `${cwd}/static/imgs/scitoflow-logo.png`,
    url: formatUrlFromStaticPath(siteUrl, './static/imgs/scitoflow-logo.png'), // prettier-ignore
    alt: 'Scitoflow',
  },
  siteCopyright: 'All rights reserved, Scitoflow',
  siteLastUpdated: new Date('2022-03-01'),
  /**
   * Default locale used on the site.
   * See why there are 2 versions: https://stackoverflow.com/questions/4904803/en-us-or-en-us-which-one-should-you-use
   */
  lang: {
    lang: 'en',
    /** Language with locale in format 'en-GB'. This format is used by HTML "lang" attribute */
    localeIETF: 'en-GB',
    /** Language with locale in format 'en_GB'. This one is used by Open Graph */
    localeJava: 'en_GB',
  },
  icon: {
    favicon: {
      png: `${cwd}/static/imgs/scitoflow-logo-notext.png`,
      svg: `${cwd}/static/imgs/scitoflow-logo-notext.svg`,
    },
    touchicon: `${cwd}/static/imgs/scitoflow-logo-notext.png`,
    maskColor: '#666600',
  },
  social: {
    // These have to be non-null to be available via GraphQL
    fbAppId: null,
    email,
    facebook: 'juro.oravec',
    twitter: 'jurooravec',
    twitterOrg: '', // e.g. @nytimes
    github: 'jurooravec',
    devto: 'jurooravec',
    rss: formatUrlFromPath(siteUrl, '/feed.xml'),
    linkedin: 'jurooravec',
    instagram: 'jurooravec',
    youtube: 'UC8JdqB5j16JkQ1a3RHdCejQ',
    soundcloud: '',
    twitch: 'freefalltwelve',
  },
  analytics: {
    mixpanelToken: process.env.GRIDSOME_MIXPANEL_TOKEN ?? '',
    sentryIngest: process.env.GRIDSOME_SENTRY_INGEST ?? '',
  },
  comments: {
    vssueGithubUser: 'JuroOravec',
    vssueGithubRepo: 'scitoflow-site',
    vssueClientId: process.env.GRIDSOME_VSSUE_CLIENT_ID ?? '',
    vssueClientSecret: process.env.GRIDSOME_VSSUE_CLIENT_SECRET ?? '',
  },
};
