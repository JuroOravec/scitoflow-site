import type { PostCollectionNode, PostInput } from '../post/postTypes';

export enum PostProjectRoutes {
  PROJECTS = '/projects',
  PROJECT = '/project/:slug',
}

/**
 * Interface for the Project Post fields that we expect to extract from the frontmatter
 * of project markdown files.
 */
export interface ProjectPostInput extends PostInput {
  projectUrl?: string;
  projectStatus: string;
}

//////////////////////////
// COLLECTION
//////////////////////////

/**
 * Interface of a ProjectPost entry as it is present in the gridsome / lokiJS collection.
 */
export interface ProjectPostCollectionNode extends PostCollectionNode {
  projectUrl?: string;
  projectStatus: string;
}
