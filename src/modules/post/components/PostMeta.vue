<template>
  <Meta v-bind="metaProps" class="PostMeta" />
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  PropType,
  toRefs,
} from '@vue/composition-api';

import type { GqlPost, GqlPostPerson, Maybe } from '@/__generated__/graphql';
import type {
  CreateOgAudioTagsArgs,
  CreateOgImageTagsArgs,
  CreateOgVideoTagsArgs,
} from '@/modules/core/utils/metaTagsOpenGraph';
import Meta, { MetaProps } from '@/modules/core/components/Meta.vue';
import { OgType } from '@/modules/core/utils/metaInfo';
import { getUrlFromPath } from '../utils';

export type PostForMeta = Pick<
  GqlPost,
  | 'title'
  | 'description'
  | 'canonicalUrl'
  | 'audios'
  | 'videos'
  | 'images'
  | 'tags'
  | 'mainVideo'
  | 'datePublished'
  | 'dateModified'
  | 'dateExpired'
> & {
  authors: Pick<GqlPostPerson, 'url'>[];
};

export interface PostMetaProps {
  post: Maybe<PostForMeta>;
  fallbackTitle: string;
}

/** Create metaInfo data for a post template page */
const createPostMetaArgs = ({
  post,
  fallbackTitle,
}: {
  post: PostForMeta | null;
  fallbackTitle: string;
}): MetaProps => {
  const pageTitle = post?.title ?? fallbackTitle;
  const pageDescription = post?.description ?? null;
  const pageUrl = post?.canonicalUrl ?? null;
  const pageTags = post?.tags ?? null;

  const audios = post?.audios?.length
    ? post?.audios?.map(
        (audio): CreateOgAudioTagsArgs => ({
          mimeType: audio.mimeType,
          url: audio.path ? getUrlFromPath(audio.path) : null,
        }),
      )
    : null;

  const images = post?.images?.length
    ? post?.images.map(
        (image): CreateOgImageTagsArgs => ({
          // Note: image.path is of type Image
          url: image.path?.src ? getUrlFromPath(image.path?.src) : null,
          alt: image.alt,
          mimeType: image.mimeType,
          width: image.size.width,
          height: image.size.height,
        }),
      )
    : null;

  const videos = post?.videos?.length
    ? post?.videos.map(
        (image): CreateOgVideoTagsArgs => ({
          url: image.path ? getUrlFromPath(image.path) : null,
          mimeType: image.mimeType,
          width: image.size.width,
          height: image.size.height,
        }),
      )
    : null;

  const ogType = post?.mainVideo ? OgType.VIDEO : OgType.ARTICLE;

  const ogVideo: MetaProps['ogVideo'] = post?.mainVideo
    ? {
        url: post?.mainVideo?.url ?? null,
        size: post?.mainVideo?.size ?? null,
        actors: post?.mainVideo?.actors ?? [],
        directors: post?.mainVideo?.directors ?? [],
        writers: post?.mainVideo?.writers ?? [],
        releaseDate: post?.mainVideo?.releaseDate,
        duration: post?.mainVideo?.duration ?? 0,
        tags: post?.mainVideo?.tags,
      }
    : null;

  const ogArticle: MetaProps['ogArticle'] = {
    authors: post?.authors?.map((author) => ({ url: author.url })) ?? [],
    datePublished: post?.datePublished ? new Date(post?.datePublished) : null,
    dateModified: post?.dateModified ? new Date(post?.dateModified) : null,
    dateExpired: post?.dateExpired ? new Date(post?.dateExpired) : null,
    section: null, // Not used currently
    tags: post?.tags,
  };

  return {
    pageUrl,
    pageTitle,
    pageDescription,
    pageTags,
    audios,
    images,
    videos,
    // Note: Multiple locales not supported yet
    locales: null,
    ogType,
    ogProfile: null,
    ogArticle: ogType === OgType.ARTICLE ? ogArticle : null,
    ogVideo: ogType === OgType.VIDEO ? ogVideo : null,
  };
};

/** Component that takes a Post subtype to generate the meta tags using Meta component */
const PostMeta = defineComponent({
  name: 'PostMeta',
  components: {
    Meta,
  },
  props: {
    /**
     * Url to be used in meta tags as the canonical url.
     * The url of the current route is used if the prop is not given.
     */
    post: { type: Object as PropType<PostForMeta>, required: true },
    fallbackTitle: { type: String, required: true },
  },
  setup(props) {
    const { post, fallbackTitle } = toRefs(props);

    const metaProps = computed<MetaProps>(() => {
      return createPostMetaArgs({
        post: post.value,
        fallbackTitle: fallbackTitle.value,
      });
    });

    return {
      metaProps,
    };
  },
});

export default PostMeta;
</script>
