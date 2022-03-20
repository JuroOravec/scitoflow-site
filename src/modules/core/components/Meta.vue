<template>
  <div class="Meta" />
</template>

<static-query>
query getMetaMetadata {
  metadata {
    siteName
    siteUrl
    siteAuthor {
      fullName
    }
    siteImage {
      image
      alt
    }
    lang {
      lang
      localeIETF
      localeJava
    }
    social {
      twitter
      twitterOrg
    }
  }
}
</static-query>

<script lang="ts">
import {
  computed,
  defineComponent,
  getCurrentInstance,
  PropType,
  toRefs,
} from '@vue/composition-api';

import { useStaticQuery } from '../utils/useGridsomeQuery';
import type {
  GqlgetMetaMetadataQuery,
  GqlImageFit,
  Maybe,
} from '@/__generated__/graphql';
import type {
  CreateOgAudioTagsArgs,
  CreateOgImageTagsArgs,
  CreateOgVideoPageTagsArgs,
  CreateOgVideoTagsArgs,
} from '../utils/metaTagsOpenGraph';
import {
  createMetaInfo,
  OgType,
  CreateMetaInfoArgs,
  MetaInfoLocaleArgs,
  TwitterType,
} from '../utils/metaInfo';
import { formatUrlFromPath } from '../utils/url';

export interface OgAndTwitterVideo extends CreateOgVideoPageTagsArgs {
  /** URL to the webpage with video player */
  url: Maybe<string>;
  size: Maybe<{
    width: number;
    height: number;
  }>;
}

export interface MetaProps {
  /**
   * Url to be used in meta tags as the canonical url.
   * The url of the current route is used if the prop is not given.
   */
  pageUrl?: Maybe<string>;
  /**
   * Title to be used in meta tags, if string.
   * If `true`, the site name is used instead.
   */
  pageTitle?: Maybe<string>;
  /** Description to be used in meta tags. */
  pageDescription?: Maybe<string>;
  /** Tags (categories) to be used in meta tags. */
  pageTags?: Maybe<string[]>;
  audios?: Maybe<CreateOgAudioTagsArgs[]>;
  images?: Maybe<CreateOgImageTagsArgs[]>;
  videos?: Maybe<CreateOgVideoTagsArgs[]>;
  locales?: Maybe<MetaInfoLocaleArgs[]>;
  ogType?: Maybe<CreateMetaInfoArgs['ogType']>;
  ogProfile?: Maybe<CreateMetaInfoArgs['ogProfile']>;
  ogArticle?: Maybe<CreateMetaInfoArgs['ogArticle']>;
  ogVideo?: Maybe<OgAndTwitterVideo>;
}

const Meta = defineComponent({
  name: 'Meta',
  props: {
    /**
     * Url to be used in meta tags as the canonical url.
     * The url of the current route is used if the prop is not given.
     */
    pageUrl: { type: String, required: false },
    /**
     * Title to be used in meta tags, if string.
     * If `true`, the site name is used instead.
     */
    pageTitle: { type: [String, Boolean], required: false, default: true },
    /** Description to be used in meta tags. */
    pageDescription: { type: String, required: false },
    /** Tags (categories) to be used in meta tags. */
    pageTags: { type: Array as PropType<string[]>, required: false },
    audios: { type: Array as PropType<CreateOgAudioTagsArgs[]>, required: false }, // prettier-ignore
    images: { type: Array as PropType<CreateOgImageTagsArgs[]>, required: false }, // prettier-ignore
    videos: { type: Array as PropType<CreateOgVideoTagsArgs[]>, required: false }, // prettier-ignore
    locales: { type: Array as PropType<MetaInfoLocaleArgs[]>, required: false }, // prettier-ignore
    /**
     * What type of og:type meta tag should be defined.
     *
     * By default, this component will define `og:type=website` meta tag.
     */
    ogType: {
      type: String as PropType<OgType>,
      required: false,
      default: OgType.WEBSITE,
    },
    ogArticle: {
      type: Object as PropType<CreateMetaInfoArgs['ogArticle']>,
      required: false,
    },
    ogProfile: {
      type: Object as PropType<CreateMetaInfoArgs['ogProfile']>,
      required: false,
    },
    ogVideo: {
      type: Object as PropType<OgAndTwitterVideo>,
      required: false,
    },
  },
  setup(props) {
    const { pageUrl, pageTitle, pageDescription, images, locales, ogVideo } =
      toRefs(props);

    const instance = getCurrentInstance();

    const queryResult = useStaticQuery<
      GqlgetMetaMetadataQuery,
      GqlgetMetaMetadataQuery
    >((data) => data ?? {});
    const siteName = computed((): string | null => queryResult.value?.metadata?.siteName ?? null); // prettier-ignore
    const siteUrl = computed((): string | null => queryResult.value?.metadata?.siteUrl ?? null); // prettier-ignore
    const siteAuthor = computed((): string | null => queryResult.value?.metadata?.siteAuthor?.fullName ?? null); // prettier-ignore
    const siteImage = computed((): CreateOgImageTagsArgs => {
      const { alt, image } = queryResult.value?.metadata?.siteImage ?? {};
      const url = (image?.src && siteUrl.value) ? formatUrlFromPath(siteUrl.value, image.src) : null;
      return {
        url,
        alt,
        mimeType: image?.mimeType,
        width: image?.size.width,
        height: image?.size.height,
      };
    });

    const pageCanonicalUrl = computed((): string | null => {
      if (pageUrl?.value) return pageUrl.value;
      const pagePath = instance?.proxy.$route?.path;
      const canonicalUrl = (siteUrl.value && pagePath) ? formatUrlFromPath(siteUrl.value, pagePath) : null;
      return canonicalUrl;
    });

    const usedPageTitle = computed((): string | null => {
      return typeof pageTitle?.value === 'string'
        ? pageTitle.value
        : pageTitle?.value === true
        ? siteName.value
        : null;
    });
    const pageImages = computed(
      (): CreateOgImageTagsArgs[] =>
        images?.value ?? (siteImage.value ? [siteImage.value] : []),
    );
    const pageLocales = computed((): MetaInfoLocaleArgs[] => {
      const defaultLocale = queryResult.value?.metadata
        ?.lang as MetaInfoLocaleArgs;
      return locales?.value ?? [defaultLocale];
    });

    const formatTwitterUsername = (twitter?: string | undefined | null) =>
      twitter ? `@${twitter}` : null;

    const twitterSummary = computed(
      (): CreateMetaInfoArgs['twitterSummary'] => {
        const userTwitter = queryResult.value?.metadata?.social?.twitter;
        const orgTwitter = queryResult.value?.metadata?.social?.twitterOrg;
        return {
          orgTwitter: formatTwitterUsername(orgTwitter),
          userTwitter: formatTwitterUsername(userTwitter),
          title: usedPageTitle.value,
          description: pageDescription?.value ?? null,
          imageUrl: (pageImages.value?.[0]?.url as GqlImageFit) ?? null,
          imageAlt: pageImages.value?.[0]?.alt ?? null,
        };
      },
    );

    const twitterPlayer = computed((): CreateMetaInfoArgs['twitterPlayer'] => {
      if (!ogVideo?.value) return null;

      const { twitterOrg, twitter } = queryResult.value?.metadata?.social ?? {};
      return {
        orgTwitter:
          formatTwitterUsername(twitterOrg) ?? formatTwitterUsername(twitter),
        title: usedPageTitle.value,
        description: pageDescription?.value ?? null,
        imageUrl: pageImages.value?.[0]?.url ?? null,
        imageAlt: pageImages.value?.[0]?.alt ?? null,
        videoOrAudioUrl: ogVideo.value?.url ?? null,
        videoOrAudioWidth: ogVideo.value?.size?.width ?? null,
        videoOrAudioHeight: ogVideo.value?.size?.height ?? null,
      };
    });

    const twitterType = computed(
      (): TwitterType =>
        twitterPlayer.value
          ? TwitterType.PLAYER
          : twitterSummary.value?.imageUrl
          ? TwitterType.LARGE_IMAGE_SUMMARY
          : TwitterType.SUMMARY,
    );

    return {
      siteAuthor,
      siteImage,
      siteName,
      usedPageTitle,
      pageCanonicalUrl,
      pageImages,
      pageLocales,
      twitterSummary,
      twitterPlayer,
      twitterType,
    };
  },
  // See all properties in https://vue-meta.nuxtjs.org/api/#metainfo-properties
  metaInfo() {
    const metaInfo = createMetaInfo({
      pageTitle: this.usedPageTitle,
      pageCanonicalUrl: this.pageCanonicalUrl ?? null,
      pageDescription: this.pageDescription ?? null,
      pageTags: this.pageTags ?? null,
      siteName: this.siteName ?? null,
      siteAuthor: this.siteAuthor ?? null,
      audios: this.audios ?? [],
      images: this.pageImages,
      videos: this.videos ?? [],
      locales: this.pageLocales,
      ogType: this.ogType,
      ogArticle: this.ogArticle ?? null,
      ogProfile: this.ogProfile ?? null,
      ogVideo: this.ogVideo ?? null,
      twitterType: this.twitterType,
      twitterSummary: this.twitterSummary,
      twitterPlayer: this.twitterPlayer,
    });

    return metaInfo;
  },
});

export default Meta;
</script>
