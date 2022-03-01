import OrigJoi from 'joi';
import JoiDate from '@joi/date';

import { postValidationSchema } from '../post/postValidation';

const Joi = OrigJoi.extend(JoiDate);

//////////////////////////
// VALIDATION SCHEMA
//////////////////////////

export const blogValidationSchema = Joi.object({
  // Write here validation for fields that are custom
  // to BlogPost
})
  .required()
  .concat(postValidationSchema);
