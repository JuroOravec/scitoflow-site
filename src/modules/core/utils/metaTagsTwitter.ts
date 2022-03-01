import type { Maybe } from '@/__generated__/graphql';
import { initMetaTagsList } from './metaTags';

export interface CreateTwitterSummaryCardMetaTagsArgs {
  /** Organisation's twitter handle (including `@`, e.g. @nytimes) */
  orgTwitter: Maybe<string>;
  title: Maybe<string>;
  description: Maybe<string>;
  imageUrl: Maybe<string>;
  imageAlt: Maybe<string>;
}

/**
 * Create description of meta tags for displaying the webpage
 * as a Summary Card on Twitter.
 *
 * See https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/summary
 * Validate at https://cards-dev.twitter.com/validator
 */
export const createTwitterSummaryCardMetaTags = ({
  orgTwitter,
  title,
  description,
  imageUrl,
  imageAlt,
}: CreateTwitterSummaryCardMetaTagsArgs) => {
  const { metaTags, addKVMetaTag } = initMetaTagsList();

  addKVMetaTag('twitter:card', 'summary');
  addKVMetaTag('twitter:site', orgTwitter?.length ? orgTwitter : null);
  addKVMetaTag('twitter:title', title);
  addKVMetaTag('twitter:description', description);
  addKVMetaTag('twitter:image', imageUrl);
  addKVMetaTag('twitter:image:alt', imageAlt);

  return metaTags;
};

export interface CreateTwitterLargeImageSummaryCardMetaTagsArgs {
  /** Organisation's twitter handle (including `@`, e.g. @nytimes) */
  orgTwitter: Maybe<string>;
  /** Author's twitter handle (including `@`, e.g. @jurooravec) */
  userTwitter: Maybe<string>;
  title: Maybe<string>;
  description: Maybe<string>;
  imageUrl: Maybe<string>;
  imageAlt: Maybe<string>;
}

/**
 * Create description of meta tags for displaying the webpage
 * as a Summary Card with Large Image on Twitter.
 *
 * See https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/summary-card-with-large-image
 * Validate at https://cards-dev.twitter.com/validator
 */
export const createTwitterLargeImageSummaryCardMetaTags = ({
  orgTwitter,
  userTwitter,
  title,
  description,
  imageUrl,
  imageAlt,
}: CreateTwitterLargeImageSummaryCardMetaTagsArgs) => {
  const { metaTags, addKVMetaTag } = initMetaTagsList();

  addKVMetaTag('twitter:card', 'summary_large_image');
  addKVMetaTag('twitter:site', orgTwitter?.length ? orgTwitter : null);
  addKVMetaTag('twitter:creator', userTwitter?.length ? userTwitter : null);
  addKVMetaTag('twitter:title', title);
  addKVMetaTag('twitter:description', description);
  addKVMetaTag('twitter:image', imageUrl);
  addKVMetaTag('twitter:image:alt', imageAlt);

  return metaTags;
};

export interface CreateTwitterPlayerCardMetaTagsArgs {
  /** Organisation's twitter handle (including `@`, e.g. @nytimes) */
  orgTwitter: Maybe<string>;
  title: Maybe<string>;
  description: Maybe<string>;
  videoOrAudioUrl: Maybe<string>;
  videoOrAudioWidth: Maybe<number>;
  videoOrAudioHeight: Maybe<number>;
  imageUrl: Maybe<string>;
  imageAlt: Maybe<string>;
}

/**
 * Create description of meta tags for displaying the webpage
 * as a Player Card on Twitter.
 *
 * See https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/player-card
 * Validate at https://cards-dev.twitter.com/validator
 */
export const createTwitterPlayerCardMetaTags = ({
  orgTwitter,
  title,
  description,
  videoOrAudioUrl,
  videoOrAudioWidth,
  videoOrAudioHeight,
  imageUrl,
  imageAlt,
}: CreateTwitterPlayerCardMetaTagsArgs) => {
  const { metaTags, addKVMetaTag } = initMetaTagsList();

  addKVMetaTag('twitter:card', 'player');
  addKVMetaTag('twitter:site', orgTwitter?.length ? orgTwitter : null);
  addKVMetaTag('twitter:title', title);
  addKVMetaTag('twitter:description', description);
  addKVMetaTag('twitter:player', videoOrAudioUrl);
  addKVMetaTag(
    'twitter:player:width',
    videoOrAudioWidth ? `${videoOrAudioWidth}` : null,
  );
  addKVMetaTag(
    'twitter:player:height',
    videoOrAudioHeight ? `${videoOrAudioHeight}` : null,
  );
  addKVMetaTag('twitter:image', imageUrl);
  addKVMetaTag('twitter:image:alt', imageAlt);

  return metaTags;
};
