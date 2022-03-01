import type { Maybe } from '@/__generated__/graphql';

import { initMetaTagsList } from './metaTags';

export interface CreateOgImageTagsArgs {
  url?: Maybe<string>;
  width?: Maybe<number>;
  height?: Maybe<number>;
  mimeType?: Maybe<string>;
  alt?: Maybe<string>;
  https?: Maybe<boolean>;
}

/**
 * Create description of meta tags that describe an image
 * in Open Graph.
 *
 * See https://ogp.me/#structured
 */
export const createOGImageTags = ({
  width,
  height,
  url,
  mimeType,
  alt,
  https,
}: CreateOgImageTagsArgs) => {
  const { metaTags, addKVMetaTag } = initMetaTagsList();

  addKVMetaTag('og:image', url);
  if (https) addKVMetaTag('og:image:secure_url', url);
  addKVMetaTag('og:image:type', mimeType);
  addKVMetaTag('og:image:width', width ? `${width}` : null);
  addKVMetaTag('og:image:height', height ? `${height}` : null);
  addKVMetaTag('og:image:alt', alt ? `${alt}` : null);

  return metaTags;
};

export interface CreateOgVideoTagsArgs {
  url: Maybe<string>;
  width: number;
  height: number;
  mimeType: string;
  https?: boolean;
}

/**
 * Create description of meta tags that describe a video
 * in Open Graph.
 *
 * See https://ogp.me/#structured
 */
export const createOGVideoTags = ({
  width,
  height,
  url,
  mimeType,
  https,
}: CreateOgVideoTagsArgs) => {
  const { metaTags, addKVMetaTag } = initMetaTagsList();

  addKVMetaTag('og:video', url);
  if (https) addKVMetaTag('og:video:secure_url', url);
  addKVMetaTag('og:video:type', mimeType);
  addKVMetaTag('og:video:width', width ? `${width}` : null);
  addKVMetaTag('og:video:height', height ? `${height}` : null);

  return metaTags;
};

export interface CreateOgAudioTagsArgs {
  url: Maybe<string>;
  mimeType: string;
  https?: boolean;
}

/**
 * Create description of meta tags that describe an audio
 * in Open Graph.
 *
 * See https://ogp.me/#structured
 */
export const createOGAudioTags = ({
  url,
  mimeType,
  https,
}: CreateOgAudioTagsArgs) => {
  const { metaTags, addKVMetaTag } = initMetaTagsList();

  addKVMetaTag('og:audio', url);
  if (https) addKVMetaTag('og:audio:secure_url', url);
  addKVMetaTag('og:audio:type', mimeType);

  return metaTags;
};

/**
 * Create description of meta tags that describe a webpage
 * as a profile in Open Graph.
 *
 * See https://ogp.me/#type_profile
 * And https://stackoverflow.com/a/29831974/9788634
 */
 export const createOGWebsitePageTags = () => {
  const { metaTags, addKVMetaTag } = initMetaTagsList();

  addKVMetaTag('og:type', 'website');

  return metaTags;
};

export interface CreateOgArticlePageTagsArgs {
  /** Article authors */
  authors: {
    /** URL pointing to the author's Open Graph profile webpage */
    url: string;
  }[];
  /** When the article was first published */
  datePublished: Maybe<Date>;
  /** When the article was last changed */
  dateModified: Maybe<Date>;
  /** When the article is out of date after */
  dateExpired: Maybe<Date>;
  /** A high-level section name. E.g. Technology */
  section: Maybe<string>;
  /** Tag words associated with this article */
  tags?: string[];
}

/**
 * Create description of meta tags that describe a webpage
 * as an article in Open Graph.
 *
 * See https://ogp.me/#type_article
 * And https://stackoverflow.com/a/29831974/9788634
 */
export const createOGArticlePageTags = ({
  authors,
  datePublished,
  dateModified,
  dateExpired,
  section,
  tags,
}: CreateOgArticlePageTagsArgs) => {
  const { metaTags, addKVMetaTag } = initMetaTagsList();

  addKVMetaTag('og:type', 'article');
  addKVMetaTag('article:published_time', datePublished?.toISOString());
  addKVMetaTag('article:modified_time', dateModified?.toISOString());
  addKVMetaTag('article:expiration_time', dateExpired?.toISOString());
  addKVMetaTag('article:section', section);
  authors?.forEach((author) => addKVMetaTag('article:author', author.url));
  tags?.forEach((tag) => addKVMetaTag('article:tag', tag));

  return metaTags;
};

export type OgProfileGender = 'male' | 'female';

export interface CreateOgProfilePageTagsArgs {
  /** A name normally given to an individual by a parent or self-chosen */
  firstName: Maybe<string>;
  /** A name inherited from a family or marriage and by which the individual is commonly known */
  lastName: Maybe<string>;
  /** A short unique string to identify them */
  username?: Maybe<string>;
  /** Their gender as recognized by Open Graph */
  gender?: Maybe<OgProfileGender>;
}

/**
 * Create description of meta tags that describe a webpage
 * as a profile in Open Graph.
 *
 * See https://ogp.me/#type_profile
 * And https://stackoverflow.com/a/29831974/9788634
 */
export const createOGProfilePageTags = ({
  firstName,
  lastName,
  username,
  gender,
}: CreateOgProfilePageTagsArgs) => {
  const { metaTags, addKVMetaTag } = initMetaTagsList();

  addKVMetaTag('og:type', 'profile');
  addKVMetaTag('profile:first_name', firstName);
  addKVMetaTag('profile:last_name', lastName);
  addKVMetaTag('profile:username', username);
  addKVMetaTag('profile:gender', gender);

  return metaTags;
};

export interface CreateOgVideoPageTagsArgs {
  /** Actors in the movie */
  actors: {
    /** URL pointing to the actor's Open Graph profile webpage */
    url: string;
    /** The role they played */
    role?: Maybe<string>;
  }[];
  /** Writers of the movie */
  writers: {
    /** URL pointing to the writer's Open Graph profile webpage */
    url: string;
  }[];
  /** Directors of the movie */
  directors: {
    /** URL pointing to the director's Open Graph profile webpage */
    url: string;
  }[];
  /** When the video was released */
  releaseDate: Date;
  /** The movie's length in seconds. */
  duration: number;
  /** Tag words associated with this movie */
  tags?: string[];
};

/**
 * Create description of meta tags that describe a webpage
 * as a video in Open Graph.
 *
 * See https://ogp.me/#type_video.other
 * And https://stackoverflow.com/a/29831974/9788634
 */
export const createOGVideoPageTags = ({
  actors,
  directors,
  writers,
  duration,
  releaseDate,
  tags,
}: CreateOgVideoPageTagsArgs) => {
  const { metaTags, addKVMetaTag } = initMetaTagsList();

  addKVMetaTag('og:type', 'video.other');
  addKVMetaTag('video:duration', `${duration}`);
  addKVMetaTag('video:release_date', releaseDate?.toISOString());
  actors?.forEach((actor) => {
    addKVMetaTag('video:actor', actor.url);
    addKVMetaTag('video:actor:role', actor.role);
  });
  writers?.forEach((writer) => addKVMetaTag('video:writer', writer.url));
  directors?.forEach((director) => addKVMetaTag('video:director', director.url));
  tags?.forEach((tag) => addKVMetaTag('video:tag', tag));

  return metaTags;
};
