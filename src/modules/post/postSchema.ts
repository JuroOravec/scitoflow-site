import gql from 'graphql-tag';

/**
 * Define base or shared interfaces to be used by collections
 * that are rendered as posts (e.g. articles).
 */
export const postSchema = gql`
  "Base interface for a Post"
  interface Post {
    "Our own internal ID used with e.g. Vssue comments"
    postId: String!
    "The canonical post URL"
    canonicalUrl: String
    "Post's authors"
    authors: [PostPerson!]!
    "People who contributed to the post"
    contributors: [PostPerson!]!
    "Post title. Should be up to 120 characters"
    title: String!
    "Post title slug shown in the URL"
    title: String!
    "Post description. Should be up to 120 characters"
    description: String!
    "Date when the post was first published"
    datePublished: Date
    "Last time the post was modified, e.g. edited"
    dateModified: Date
    "The date after which this post will become outdated (optional)"
    dateExpired: Date
    tags: [String!]!
    """
    Main video associated with the post that describes a substantial amount of the content.
    This video should be our own and should be give comparable or more content than the textual version.

    If present, the post is seen as a video from the Open Graph point of view,
    e.g. this video is used for preview on social media.
    """
    mainVideo: OGVideo
    "Images associated with the post. First image is used for preview on social media"
    images: [PostImage!]!
    "Other videos that accompany the post."
    videos: [PostVideo!]!
    "Audio sources that accompany the post."
    audios: [PostAudio!]!
    timeToRead: ReadTime!
    # These fields should come from the source plugins
    "Textual content of the post"
    content: String!
    "Canonical url path of the post"
    path: String!
  }

  type PostPerson {
    firstName: String!
    lastName: String!
    fullName: String!
    email: String!
    url: String!
  }

  type ReadTime {
    text: String!
    minutes: Float!
    time: Float!
    words: Int!
  }

  interface PostResource {
    "Mime type of the resource"
    mimeType: String!
  }

  type PostResourceSize {
    width: Int!
    height: Int!
  }

  type PostImage implements PostResource {
    path: Image!
    alt: String!
    mimeType: String!
    size: PostResourceSize!
  }

  type PostVideo implements PostResource {
    path: String!
    mimeType: String!
    size: PostResourceSize!
  }

  type PostAudio implements PostResource {
    path: String!
    mimeType: String!
  }

  "Open Graph (og:video) data"
  type OGVideo {
    "Url of the webpage with the player"
    url: String!
    "Video dimensions"
    size: PostResourceSize!
    "Actors in the movie"
    actors: [OGVideoActor!]!
    "Directors of the movie"
    directors: [OGProfileRef!]!
    "Writers of the movie"
    writers: [OGProfileRef!]!
    "Duration in seconds"
    duration: Int!
    "When the video was released"
    releaseDate: Date!
    "Tag words associated with this movie"
    tags: [String!]!
  }

  type OGVideoActor {
    "URL pointing to the actor's Open Graph profile webpage"
    url: String!
    "The role they played"
    role: String
  }

  type OGProfileRef {
    "URL pointing to the person's Open Graph profile webpage"
    url: String!
  }

  "Open Graph (og:profile) data"
  type OGProfile {
    firstName: String!
    lastName: String!
    username: String!
    gender: OGGenderType!
  }

  enum OGGenderType {
    male
    female
  }
`;
