import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';
import mapValues from 'lodash/mapValues';
import get from 'lodash/get';

import { metadata } from '../config/metadata';
import type { CollectionNode } from '../core/coreModel';
import type { PostCollectionNode, PostCollectionNodePerson, PostInput } from './postTypes';

export const getUrlFromPath = (path: string) => {
  return `${metadata.siteUrl}${path}`;
};

/** Get the canonical URL for a given Post */
export const getPostCanonicalUrl = (post: Pick<PostCollectionNode, 'path'>) => {
  return getUrlFromPath(post.path);
};

/** Get the full name for a given PostPerson */
export const getPostPersonFullName = (
  postPerson: Pick<PostCollectionNodePerson, 'firstName' | 'lastName'>,
): string => {
  return `${postPerson.firstName} ${postPerson.lastName}`;
};

const mapValuesDeep = (
  objOrVal: Record<string, any>,
  fn: (value: any) => any,
): Record<string, any> => {
  let newVal;
  if (isArray(objOrVal)) {
    newVal = objOrVal.map(innerObj => mapValuesDeep(innerObj, fn));
  } else if (isPlainObject(objOrVal)) {
    newVal = mapValues(objOrVal, val => mapValuesDeep(val, fn));
  } else {
    newVal = fn(objOrVal);
  }

  // Return original value if we get undefined
  return newVal === undefined ? objOrVal : newVal;
};

// Resolve custom values like '$metadata.siteAuthor' to the
// actual values from metadata.
export const resolveFrontmatterMetadata = (node: CollectionNode & PostInput) => mapValuesDeep(node, (val) => {
  if (typeof val !== 'string' || !val.startsWith('$metadata')) {
    // Returning undefined means the original value is used
    return;
  };
  return get({ $metadata: metadata }, val);
}) as CollectionNode & PostInput;