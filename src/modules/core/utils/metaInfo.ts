import type { MetaInfo } from 'vue-meta';

import type { Maybe } from '@/__generated__/graphql';
import {
  createOGArticlePageTags,
  CreateOgArticlePageTagsArgs,
  createOGAudioTags,
  CreateOgAudioTagsArgs,
  createOGImageTags,
  CreateOgImageTagsArgs,
  createOGProfilePageTags,
  CreateOgProfilePageTagsArgs,
  createOGVideoPageTags,
  CreateOgVideoPageTagsArgs,
  createOGVideoTags,
  CreateOgVideoTagsArgs,
  createOGWebsitePageTags,
} from './metaTagsOpenGraph';
import { initMetaTagsList } from './metaTags';
import {
  createTwitterLargeImageSummaryCardMetaTags,
  CreateTwitterLargeImageSummaryCardMetaTagsArgs,
  createTwitterPlayerCardMetaTags,
  CreateTwitterPlayerCardMetaTagsArgs,
  createTwitterSummaryCardMetaTags,
} from './metaTagsTwitter';

export enum OgType {
  ARTICLE = 'OgType__ARTICLE',
  PROFILE = 'OgType__PROFILE',
  VIDEO = 'OgType__VIDEO',
  WEBSITE = 'OgType__WEBSITE',
}

export enum TwitterType {
  SUMMARY = 'TwitterType__SUMMARY',
  LARGE_IMAGE_SUMMARY = 'TwitterType__LARGE_IMAGE_SUMMARY',
  PLAYER = 'TwitterType__PLAYER',
}

export interface MetaInfoLocaleArgs {
  /** Language code, e.g. 'en' */
  lang: string;
  /** Language locale code, e.g. 'en_GB' */
  localeJava: string;
  /** Language locale code, e.g. 'en-GB' */
  localeIETF: string;
}

export interface CreateMetaInfoArgs {
  pageTitle: Maybe<string | true>;
  pageCanonicalUrl: Maybe<string>;
  pageDescription: Maybe<string>;
  pageTags: Maybe<string[]>;
  siteName: Maybe<string>;
  siteAuthor: Maybe<string>;
  locales: MetaInfoLocaleArgs[];
  audios: CreateOgAudioTagsArgs[];
  images: CreateOgImageTagsArgs[];
  videos: CreateOgVideoTagsArgs[];
  ogType: OgType;
  /** Must be defined if OgType == "ARTICLE" */
  ogArticle: Maybe<CreateOgArticlePageTagsArgs>;
  /** Must be defined if OgType == "PROFILE" */
  ogProfile: Maybe<CreateOgProfilePageTagsArgs>;
  /** Must be defined if OgType == "VIDEO" */
  ogVideo: Maybe<CreateOgVideoPageTagsArgs>;
  twitterType: TwitterType;
  twitterSummary: Maybe<CreateTwitterLargeImageSummaryCardMetaTagsArgs>;
  twitterPlayer: Maybe<CreateTwitterPlayerCardMetaTagsArgs>;
}

/**
 * Create metaInfo data that's generated for every page
 *
 * Further reading:
 * - SEO by Google https://developers.google.com/search/docs/advanced/guidelines/get-started
 * - SEO by Ahrefs https://ahrefs.com/blog/seo-expert/
 * - Meta tags:
 *   - Google meta tags https://developers.google.com/search/docs/advanced/crawling/special-tags
 *   - https://moz.com/blog/the-ultimate-guide-to-seo-meta-tags
 *   - https://moz.com/blog/meta-data-templates-123
 *   - https://dohmaindesigns.com/adding-geo-meta-tags-to-your-website/
 *   - https://yoast.com/meta-descriptions/
 * - Semantic web https://www.socialmediatoday.com/news/8-of-the-most-important-html-tags-for-seo/574987/
 * - Lang & locales https://ahrefs.com/blog/hreflang-tags/
 *
 * // TODO:
 * - Add FB App meta tag
 *   { name: 'fb:app_id', content: '' },
 */
export const createMetaInfo = ({
  pageTitle,
  pageCanonicalUrl,
  pageDescription,
  pageTags,
  siteName,
  siteAuthor,
  locales,
  audios,
  images,
  videos,
  ogType,
  ogProfile,
  ogArticle,
  ogVideo,
  twitterType,
  twitterSummary,
  twitterPlayer,
}: CreateMetaInfoArgs): MetaInfo => {
  const [mainLocale, ...altLocales] = locales;
  const usedTitle = pageTitle === true ? siteName : pageTitle;

  /** Default way of how the page template is rendered */
  const titleTemplate: MetaInfo['titleTemplate'] = (title) => {
    return title && siteName
      ? `${title} - ${siteName}`
      : title || siteName || '';
  };

  //////////////////////////////
  // HTML ATTRIBUTES
  //////////////////////////////

  const htmlAttrs: MetaInfo['htmlAttrs'] = {
    // See https://vue-meta.nuxtjs.org/api/#htmlattrs
    // And https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang
    lang: mainLocale.localeIETF,
  };

  //////////////////////////////
  // META TAGS
  //////////////////////////////

  const { metaTags, addKVMetaTag } = initMetaTagsList();
  const linkTags: MetaInfo['link'] = [];

  /////////////////////////////
  // COMMON META TAGS
  /////////////////////////////

  /**
   * Special meta tags that have custom attributes
   */
  metaTags.push(
    /**
     * charset
     *
     * See https://dev.to/maggiecodes_/why-is-lt-meta-charset-utf-8-gt-important-59hl
     * And https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta
     */
    { charset: 'utf-8' },

    /**
     * http-equiv
     *
     * See https://www.keycdn.com/support/http-equiv
     * And https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta
     */
    {
      // Set the default client-defined CSP
      // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
      httpEquiv: 'Content-Security-Policy',
      content: "default-src 'self'; form-action 'self'",
    },
  );

  /**
   * General key:value metadata
   *
   * See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name
   */
  addKVMetaTag('referrer', 'same-origin');
  addKVMetaTag('color-scheme', 'only light');
  addKVMetaTag('creator', siteAuthor);
  // See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name#standard_metadata_names_defined_in_the_html_specification
  addKVMetaTag('author', siteAuthor);
  addKVMetaTag('description', pageDescription);
  // See https://en.ryte.com/wiki/Meta_Keyword
  // https://blog.spotibo.com/meta-description-length/#:~:text=Maximal%20limits,680%20pixels%20and%20120%20characters
  addKVMetaTag('keywords', pageTags?.join(',') ?? null);

  /**
   * Page-specific robots configuration
   *
   * See https://ahrefs.com/blog/seo-meta-tags/
   */
  addKVMetaTag('robots', 'index, follow');

  /////////////////////////////
  // OPEN GRAPH META TAGS
  /////////////////////////////

  // See https://ahrefs.com/blog/open-graph-meta-tags/
  // And https://ogp.me/
  // And https://ogp.me/#optional
  // And https://developers.facebook.com/docs/sharing/webmasters/

  addKVMetaTag('og:title', usedTitle);
  addKVMetaTag('og:description', pageDescription);
  addKVMetaTag('og:url', pageCanonicalUrl);
  addKVMetaTag('og:site_name', siteName);

  addKVMetaTag('og:locale', mainLocale.localeJava);
  altLocales.forEach((locale) =>
    addKVMetaTag('og:locale:alternate', locale.localeJava),
  );

  if (ogType === OgType.WEBSITE) {
    metaTags.push(...createOGWebsitePageTags());
  } else if (ogType === OgType.PROFILE) {
    if (!ogProfile) {
      throw Error('"ogProfile" arg must be defined when ogType === "profile"');
    }
    metaTags.push(...createOGProfilePageTags(ogProfile));
  } else if (ogType === OgType.ARTICLE) {
    if (!ogArticle) {
      throw Error('"ogArticle" arg must be defined when ogType === "article"');
    }
    metaTags.push(...createOGArticlePageTags(ogArticle));
  } else if (ogType === OgType.VIDEO) {
    if (!ogVideo) {
      throw Error('"ogVideo" arg must be defined when ogType === "video"');
    }
    metaTags.push(...createOGVideoPageTags(ogVideo));
  }

  metaTags.push(...audios.flatMap((audio) => createOGAudioTags(audio)));
  metaTags.push(...images.flatMap((image) => createOGImageTags(image)));
  metaTags.push(...videos.flatMap((video) => createOGVideoTags(video)));

  /////////////////////////////
  // TWITTER META TAGS
  /////////////////////////////

  if (twitterType === TwitterType.SUMMARY) {
    if (!twitterSummary) {
      throw Error('"twitterSummary" arg must be defined when ogType === "summary"'); // prettier-ignore
    }
    metaTags.push(
      ...createTwitterSummaryCardMetaTags({
        ...twitterSummary,
        title: twitterSummary?.title ?? usedTitle,
      }),
    );
  } else if (twitterType === TwitterType.LARGE_IMAGE_SUMMARY) {
    if (!twitterSummary) {
      throw Error('"twitterSummary" arg must be defined when ogType === "largeImageSummary"'); // prettier-ignore
    }
    metaTags.push(...createTwitterLargeImageSummaryCardMetaTags(twitterSummary)); // prettier-ignore
  } else if (twitterType === TwitterType.PLAYER) {
    if (!twitterPlayer) {
      throw Error('"twitterPlayer" arg must be defined when ogType === "player"'); // prettier-ignore
    }
    metaTags.push(...createTwitterPlayerCardMetaTags(twitterPlayer));
  }

  /////////////////////////////
  // LINK TAGS
  /////////////////////////////

  // See https://developers.google.com/search/docs/advanced/crawling/consolidate-duplicate-urls
  // See https://www.socialmediatoday.com/news/8-of-the-most-important-html-tags-for-seo/574987/
  if (pageCanonicalUrl) {
    linkTags.push({ rel: 'canonical', href: pageCanonicalUrl });
  }

  ////////////////////////////
  // BASE TAG
  ////////////////////////////

  /**
   * Default settings on how links and forms are treated
   *
   * See https://vue-meta.nuxtjs.org/api/#base
   * And https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base
   */
  // const base = { ... },

  return {
    title: usedTitle ?? undefined,
    titleTemplate,
    meta: metaTags,
    htmlAttrs,
    link: linkTags,
  };
};
