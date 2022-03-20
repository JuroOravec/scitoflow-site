import path from 'path';
import type { Item, FeedOptions } from 'feed';
import glob from 'glob';

import type { GridsomeConfig } from '@/typings/gridsome';
import { PostType, PostCollectionNode } from '@/modules/post/postTypes';
import { metadata } from '../metadata';
import { formatUrlFromPath } from '@/modules/core/utils/url';

/////////////////////////////////////
// gridsome-plugin-feed CONFIG
/////////////////////////////////////

// Given a file asset, search for one of its versions among the rendered images
let imgAssets: string[] | null = null;
const formatAssetImgUrl = (assetFileName: string) => {
  const fileBase = path.basename(assetFileName).split('.')[0];
  if (!imgAssets) {
    imgAssets = glob.sync(`dist/public/assets/static/*`).map((assetPath) => path.basename(assetPath));
  }
  const fileInAssets = imgAssets.find((assetFilename) => assetFilename.startsWith(fileBase));
  if (!fileInAssets) return;

  const mediaPath = formatUrlFromPath(metadata.siteUrl, `/assets/static/${fileInAssets}`);
  return mediaPath;
};

/**
 * Transform Post (see @/modules/post/postType)
 * to FeedItem (see https://www.npmjs.com/package/feed#example)
 * */
const postToFeedItem = (post: PostCollectionNode): Item => {
  return {
    title: post.title,
    id: post.canonicalUrl,
    link: post.canonicalUrl,
    description: post.description,
    date: new Date(post.datePublished),
    content: post.content ?? '',
    author: post.authors?.map((author) => ({
      name: author.fullName,
      email: author.email,
      link: author.url,
    })),
    // prettier-ignore
    contributor: post.contributors?.map((contributor) => ({ // TODO: Untested
      name: contributor.fullName,
      email: contributor.email,
      link: contributor.url,
    })),
    image: post.images?.[0] ? formatAssetImgUrl(post.images[0].path) : undefined,
    audio: post.audios?.[0]?.path, // TODO: Untested
    video: post.mainVideo?.url, // TODO: Untested
  };
};

/////////////////////////////////////
// gridsome-plugin-flexsearch CONFIG
/////////////////////////////////////

const postSearchFields = [
  'title',
  'description',
  'canonicalUrl',
  'tags',
  'authorNames',
  'contributorNames',
] as const;
const returnedPostSearchFields = [
  'title',
  'description',
  'canonicalUrl',
  'path',
  'images',
  'authors',
] as const;

type _SearchFieldsPostKeys = keyof typeof postSearchFields;
type SearchFieldsPostKeys = Extract<
  typeof postSearchFields[_SearchFieldsPostKeys],
  string
>;

type _ResultPostKeys = keyof typeof returnedPostSearchFields;
type ResultPostKeys = Extract<
  typeof returnedPostSearchFields[_ResultPostKeys],
  string
>;

/**
 * Search result contains:
 * 1) ID, and source index name
 * 2) The indexed (searched) fields, stringified
 * 3) the picked fields from the original object under the `node` field
 */
export type SearchResult = Record<SearchFieldsPostKeys, string> & {
  id: string;
  index: string;
  node: Pick<PostCollectionNode, ResultPostKeys>;
};

const transformPostToSearchFields = (
  post: PostCollectionNode,
): Record<SearchFieldsPostKeys, string | string[]> => {
  return {
    ...post,
    authorNames: post.authors?.map(({ fullName }) => fullName) ?? '',
    contributorNames: post.contributors?.map(({ fullName }) => fullName) ?? '',
    canonicalUrl: post.canonicalUrl ?? '',
  };
};

/////////////////////////////////////
// CONFIG
/////////////////////////////////////

export const discoverabilityConfigGridsome: GridsomeConfig = {
  plugins: [
    // Enable to search across Posts
    {
      use: 'gridsome-plugin-flexsearch',
      options: {
        searchFields: postSearchFields,
        collections: [
          {
            typeName: PostType.BLOG,
            indexName: PostType.BLOG,
            fields: returnedPostSearchFields,
            transform: transformPostToSearchFields,
          },
          {
            typeName: PostType.PROJECT,
            indexName: PostType.PROJECT,
            fields: returnedPostSearchFields,
            transform: transformPostToSearchFields,
          },
        ],
      },
    },
    // Generate RSS feed
    {
      use: 'gridsome-plugin-feed',
      options: {
        // Required: array of `GraphQL` type names you wish to include
        contentTypes: [PostType.BLOG, PostType.PROJECT],
        // Optional: any properties you wish to set for `Feed()` constructor
        // See https://www.npmjs.com/package/feed#example for available properties
        feedOptions: <FeedOptions>{
          title: metadata.siteName,
          description: metadata.siteDescription,
          // id: metadata.siteUrl,
          // link: metadata.siteUrl,
          language: metadata.lang.localeIETF,
          // E.g. "http://example.com/image.png"
          image: metadata.siteImage.url,
          favicon: metadata.icon.favicon.png,
          copyright: metadata.siteCopyright,
          updated: metadata.siteLastUpdated
            ? new Date(metadata.siteLastUpdated)
            : undefined, // optional, default = today
          // generator: "awesome", // optional, default = 'Feed for Node.js'
          author: {
            name: metadata.siteAuthor?.fullName,
            email: metadata.siteAuthor?.email,
            link: metadata.siteAuthor?.url,
          },
        },
        // === All options after this point show their default values ===
        // Optional; opt into which feeds you wish to generate, and set their output path
        rss: {
          enabled: true,
          output: '/feed.xml',
        },
        atom: {
          enabled: false,
          output: '/feed.atom',
        },
        json: {
          enabled: true,
          output: '/feed.json',
        },
        // Optional: the maximum number of items to include in your feed
        maxItems: 25,
        // Optional: an array of properties passed to `Feed.addItem()` that will be parsed for
        // URLs in HTML (ensures that URLs are full `http` URLs rather than site-relative).
        // To disable this functionality, set to `null`.
        htmlFields: ['description', 'content'],
        // Optional: if you wish to enforce trailing slashes for site URLs
        enforceTrailingSlashes: false,
        // Optional: a method that accepts a node and returns true (include) or false (exclude)
        // Example: only past-dated nodes: `filterNodes: (node) => node.date <= new Date()`
        filterNodes: (node): boolean => {
          return true;
        },
        // Optional: a method that accepts a node and returns an object for `Feed.addItem()`
        // See https://www.npmjs.com/package/feed#example for available properties
        // NOTE: `date` field MUST be a Javascript `Date` object
        nodeToFeedItem: (node, context): Item => {
          return postToFeedItem(node);
        },
      },
    },
  ],
};
