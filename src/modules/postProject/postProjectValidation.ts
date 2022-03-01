import OrigJoi from 'joi';
import JoiDate from '@joi/date';

import { postValidationSchema } from '../post/postValidation';
import type { ProjectPostInput } from './postProjectTypes';

const Joi = OrigJoi.extend(JoiDate) as OrigJoi.Root;

// Validation for fields that are custom to ProjectPost
export const projectValidationSchema = Joi.object<ProjectPostInput>({
  projectUrl: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .allow(null)
    .required(),
  projectStatus: Joi.string().valid('published', 'unpublished', 'stopped').required(),
})
  .required()
  .concat(postValidationSchema as OrigJoi.ObjectSchema<any>);
