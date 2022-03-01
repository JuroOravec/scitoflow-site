import OrigJoi from 'joi';
import JoiDate from '@joi/date';

import type {
  PostImageInput,
  PostInput,
  PostOgActorInput,
  PostOgProfileRefInput,
  PostOgResourceSizeInput,
  PostPersonInput,
  PostProfileInput,
  PostVideoInput,
} from './postTypes';

const Joi = OrigJoi.extend(JoiDate) as OrigJoi.Root;

/**
 * These values define Open Graph Profile metadata
 *
 * See https://ogp.me/#type_profile
 */
export const ogProfileValidationSchema = Joi.object<PostProfileInput>({
  firstName: Joi.string().allow('').required(),
  lastName: Joi.string().allow('').required(),
  username: Joi.string().allow('').required(),
  gender: Joi.string().valid('male', 'female').required(),
})
  .required()
  .allow(null);

/**
 * These values define Open Graph Video actor metadata
 *
 * See https://ogp.me/#type_video
 */
export const ogActorValidationSchema = Joi.object<PostOgActorInput>({
  url: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .required(),
  role: Joi.string(),
})
  .required()
  .allow(null);

/**
 * These values define Open Graph Video writer and director metadata
 *
 * See https://ogp.me/#type_video
 */
export const ogProfileRefValidationSchema = Joi.object<PostOgProfileRefInput>({
  url: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .required(),
})
  .required()
  .allow(null);

export const ogResourceSizeValidationSchema =
  Joi.object<PostOgResourceSizeInput>({
    width: Joi.number().integer().positive().min(1).required(),
    height: Joi.number().integer().positive().min(1).required(),
  }).required();

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

/**
 * These values define Open Graph Video metadata
 *
 * See https://ogp.me/#type_video
 */
export const ogVideoValidationSchema = Joi.object<PostOgVideoInput>({
  url: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .required(),
  size: ogResourceSizeValidationSchema,
  actors: Joi.array().items(ogActorValidationSchema.disallow(null)).unique(),
  directors: Joi.array()
    .items(ogProfileRefValidationSchema.disallow(null))
    .unique(),
  writers: Joi.array()
    .items(ogProfileRefValidationSchema.disallow(null))
    .unique(),
  duration: Joi.number().integer().positive().min(1).required(),
  releaseDate: Joi.date().format(['YYYY-MM-DD']).required(),
  tags: Joi.array().items(Joi.string().required()).unique(),
})
  .allow(null)
  .required();

/**
 * Image that accommanies a post.
 *
 * See og:image in https://ogp.me/#structured.
 */
export const postImageValidationSchema = Joi.object<PostImageInput>({
  path: Joi.string().required(),
  alt: Joi.string().required(),
})
  .allow(null)
  .required();

/**
 * Video that accommanies a post. Note: This is different from OGVideo.
 */
export const postVideoValidationSchema = Joi.object<PostVideoInput>({
  path: Joi.string().required(),
  size: ogResourceSizeValidationSchema,
})
  .allow(null)
  .required();

export interface PostAudioInput {
  path: string;
}

/** Audio that accommanies a post */
export const postAudioValidationSchema = Joi.object<PostAudioInput>({
  path: Joi.string().required(),
})
  .allow(null)
  .required();

/** Post person (e.g. author or contributor) */
export const postPersonValidationSchema = Joi.object<PostPersonInput>({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  url: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .required(),
})
  .allow(null)
  .unknown(true)
  .required();

/** Common fields of a post */
export const postValidationSchema = Joi.object<PostInput>({
  postId: Joi.string().required(),
  authors: Joi.array()
    .items(postPersonValidationSchema.disallow(null))
    .required(),
  contributors: Joi.array()
    .items(postPersonValidationSchema.disallow(null).optional())
    .required(),
  title: Joi.string().max(120).required(),
  slug: Joi.string()
    .max(120)
    .lowercase()
    .pattern(/^[a-z0-9\-]+$/) // Slug
    .pattern(/\s/, { invert: true, name: 'whitespace' })
    .required(),
  description: Joi.string().max(120).required(),
  datePublished: Joi.date().format(['YYYY-MM-DD']).required(),
  dateModified: Joi.date().format(['YYYY-MM-DD']).required(),
  dateExpired: Joi.date().format(['YYYY-MM-DD']).allow(null).required(),
  tags: Joi.array().items(Joi.string().required()).unique().required(),
  images: Joi.array()
    .items(
      // .optional() here means the array can be empty
      postImageValidationSchema.disallow(null).optional(),
    )
    .unique()
    .required(),
  /**
   * Main video associated with the post that describes a substantial amount of the content.
   * This video should be our own and should be give comparable or more content than the textual version.
   *
   * If present, the post is seen as a video from the SEO point of view,
   * e.g. this video is used for preview on social media.
   */
  mainVideo: ogVideoValidationSchema,
  videos: Joi.array()
    .items(postVideoValidationSchema.disallow(null).optional())
    .unique()
    .required(),
  audios: Joi.array()
    .items(postAudioValidationSchema.disallow(null).optional())
    .unique()
    .required(),
  ignore: Joi.boolean().optional(),
}).required();
