import gql from 'graphql-tag';

/**
 * Define shared interfaces and core concepts that may be used by
 * other modules.
 */
export const coreSchema = gql`
  "File info added by remark after parsing an .md file"
  type RemarkFileInfo {
    "Extension of the parsed file, e.g. '.md'"
    extension: String!
    "Directory of the parsed file, relative to the base path, or '' if at root of base path"
    directory: String!
    "Path of the parsed file, relative to the base path, e.g. 'path/to/dir'"
    path: String!
    "Name of the parsed file, without extension, e.g. 'my-markdown-file'"
    name: String!
  }
`;
