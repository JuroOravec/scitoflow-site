import type { ReadTimeResults } from 'reading-time';

import type { CollectionNode } from '../core/coreModel';

/** Enum of available GraphQL types that implement Post interface */
export enum PostType {
  BLOG = 'BlogPost',
  PROJECT = 'ProjectPost',
}

/** Enum of available GraphQL types that implement PostResource interface */
export enum PostResourceType {
  IMAGE = 'PostImage',
  VIDEO = 'PostVideo',
  AUDIO = 'PostAudio',
}

//////////////////////////
// INPUT AND VALIDATION
//////////////////////////

export interface PostProfileInput {
  firstName: string;
  lastName: string;
  username: string;
  gender: 'male' | 'female';
}

export interface PostOgActorInput {
  url: string;
  role: string;
}

export interface PostOgProfileRefInput {
  url: string;
}

export interface PostOgResourceSizeInput {
  width: number;
  height: number;
}

export interface PostOgVideoInput {
  url: string;
  size: PostOgResourceSizeInput;
  actors: PostOgActorInput[];
  directors: PostOgProfileRefInput[];
  writers: PostOgProfileRefInput[];
  duration: number;
  releaseDate: string;
  tags: string[];
}

export interface PostImageInput {
  path: string;
  alt: string;
}

export interface PostVideoInput {
  path: string;
  size: PostOgResourceSizeInput;
}

export interface PostAudioInput {
  path: string;
}

export interface PostPersonInput {
  firstName: string;
  lastName: string;
  email: string;
  url: string;
}

/**
 * Interface for the Post fields that we expect to extract from the frontmatter
 * of markdown files.
 *
 * Note that this is different from the data that's in the collection,
 * as well as different from the GraphQL type that's exposed:
 *
 * PostInput --[enrich and insert into db]--> PostCollectionNode --[expose]--> GqlPostNode
 */
export interface PostInput {
  postId: string;
  authors: PostPersonInput[];
  contributors: PostPersonInput[];
  title: string;
  /** Title slug shown in the URL */
  slug: string;
  /** Short description of the content, used in social places, meta tags, preview, etc. */
  description: string;
  datePublished: string;
  dateModified: string;
  dateExpired?: string | null;
  tags: string[];
  images: PostImageInput[];
  mainVideo: PostOgVideoInput;
  videos: PostVideoInput[];
  audios: PostAudioInput[];
  /**
   * Whether this post should be ignored. Ignored posts are not included
   * in the collection, hence:
   * - No page is generated
   * - Not included in recommendations (related posts)
   * - Not included in RSS
   * - Not included in sitexml
   */
  ignore?: boolean;
}

//////////////////////////
// COLLECTION
//////////////////////////

export interface PostCollectionNodePerson extends PostPersonInput {
  fullName: string;
}

/**
 * Interface of a Post entry as it is present in the gridsome / lokiJS collection.
 *
 * Note that this is different from the input that's parsed from the frontmatter,
 * as well as different from the GraphQL type that's exposed:
 *
 * PostInput --[enrich and insert into db]--> PostCollectionNode --[expose]--> GqlPostNode
 */
export interface PostCollectionNode extends CollectionNode<PostType> {
  postId: string;
  path: string;
  canonicalUrl: string;
  title: string;
  description: string;
  authors: PostCollectionNodePerson[];
  contributors: PostCollectionNodePerson[];
  datePublished: Date;
  dateModified: Date;
  dateExpired: Date | null;
  images: PostImageInput[];
  mainVideo: PostOgVideoInput | null;
  videos: PostVideoInput[];
  audios: PostAudioInput[];
  tags: string[];
  timeToRead: ReadTimeResults;
}
