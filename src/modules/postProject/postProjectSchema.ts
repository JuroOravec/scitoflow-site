import gql from 'graphql-tag';

/**
 * ProjectPost schema is defined, so we don't have to rely on
 * the parsing of markdown file for the schema definition.
 *
 * See https://gridsome.org/docs/schema-api/#addschematypestypes
 */
export const projectPostSchema = gql`
  type ProjectPost implements Post & Node {
    id: ID!

    # Front-matter fields (Post interface)
    postId: String!
    authors: [PostPerson!]!
    contributors: [PostPerson!]!
    title: String!
    slug: String!
    description: String!
    canonicalUrl: String!
    datePublished: Date!
    dateModified: Date!
    dateExpired: Date
    tags: [String!]!
    mainVideo: OGVideo
    images: [PostImage!]!
    videos: [PostVideo!]!
    audios: [PostAudio!]!
    tags: [String!]!
    timeToRead: ReadTime!

    # Front-matter fields (own fields)
    projectUrl: String
    projectStatus: String!

    # Fields below are added by other plugins (No need to define)
    # timeToRead: ReadTime              # readTime plugin
    # headings: VueRemarkHeading        # filesource plugin (vue-remark)

    # Fields below are populated by other plugins, but we have to define them)
    # From filesource plugin (vue-remark)
    content: String!
    path: String!
    # Type is defined in "core" module
    fileInfo: RemarkFileInfo!
  }
`;
