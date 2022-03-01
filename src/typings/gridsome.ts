import type { VueConstructor } from 'vue';
import type VueRouter from 'vue-router';
import type { ComponentOptions } from 'vue/types/umd';
import type { Collection } from 'lokijs';
import type { DocumentNode, GraphQLFieldConfig, GraphQLSchema } from 'graphql';
import type { CollectionNode } from '@/modules/core/coreModel';
import type { resolve } from 'path';

export interface GridsomeConfig {
  siteName?: string;
  siteDescription?: string;
  siteUrl?: string;
  pathPrefix?: string;
  titleTemplate?: string;
  plugins?: GridsomeConfigPlugin[];
  templates?: Record<string, any>;
  metadata?: Record<string, any>;
  transformers?: Record<string, any>;
  icon?: {
    favicon?: string;
    touchicon?: string;
  };
  configureWebpack?: any;
  chainWebpack?: any;
  runtimeCompiler?: boolean;
  configureServer?: any;
  permalinks?: {
    trailingSlash?: boolean;
    slugify?: any;
  };
  css?: {
    split?: boolean;
    loaderOptions?: any;
  };
  host?: string;
  port?: number;
  outputDir?: string;
}

interface GridsomeConfigPlugin {
  use: string | Record<string, any>;
  options?: Record<string, any>;
}

export type GridsomeClientPlugin = (
  vue: VueConstructor,
  context: GridsomeClientPluginContext,
) => void;

/** Object passed to Gridsome client plugin */
interface GridsomeClientPluginContext {
  /**
   * Options passed to the main Vue Instance like new Vue(appOptions).
   * See https://gridsome.org/docs/client-api/#appoptions
   */
  appOptions: ComponentOptions<Vue>;
  /** See https://gridsome.org/docs/client-api/#router */
  router: VueRouter;
  /** See https://gridsome.org/docs/client-api/#head */
  head: any;
}

export type GridsomeServerPlugin<TOptions = any> = (
  api: GridsomePlugin,
  options?: TOptions,
) => void;

/**
 * Object passed to gridsome.server.js that enables us to interact
 * with the Gridsome server system.
 *
 * See https://github.com/gridsome/gridsome/blob/7a2080ef39621d4e15f97fffa3442404549009ac/gridsome/lib/app/Plugins.js
 */
export interface GridsomePlugin {
  /** See https://gridsome.org/docs/pages-api */
  createPages: (
    callback: (actions: GridsomePluginCreatePagesActions) => void,
  ) => void;
  /** See https://gridsome.org/docs/pages-api/#create-managed-pages */
  createManagedPages: (
    callback: (actions: GridsomePluginCreatePagesActions) => void,
  ) => void;
  loadSource: (
    callback: (actions: GridsomePluginLoadSourceActions) => void,
  ) => void;
  onCreateNode: <TNode extends CollectionNode>(
    callback: (node: TNode) => Record<string, any> | null | undefined,
  ) => void;
  chainWebpack: (...args: any[]) => any;
}

interface GridsomePluginCreatePagesActions {
  /** See https://gridsome.org/docs/pages-api/#createpageoptions */
  createPage: (options: GridsomePluginCreatePageOptions) => void;
  graphql: (graphqlQuery: string) => Promise<any>;
}

export interface GridsomePluginCreatePageOptions {
  path: string;
  component: string;
  /** Optional context for the page and page-query */
  context?: Record<string, any>;
  /** Optional context only for page-query. */
  queryVariables?: Record<string, any>;
}

/**
 * Object available in api.loadSource
 *
 * This interface is based on inspecting the object using a debugger
 * in gridsome@0.7.23.
 *
 * See https://github.com/gridsome/gridsome/blob/b61c2fbb58f783454e5ed9552036c84c4b525881/gridsome/lib/app/actions.js
 * And https://github.com/gridsome/gridsome/blob/b61c2fbb58f783454e5ed9552036c84c4b525881/gridsome/lib/app/actions.js#L152
 */
interface GridsomePluginLoadSourceActions {
  graphql: (
    docOrQuery: any,
    variables?: Record<string, any>,
    operationName?: string,
  ) => any;
  resolve: (...pathSegments: string[]) => string;
  slugify: (str: string) => string;

  addCollection: GridsomePluginStore['addCollection'];
  getCollection: GridsomePluginStore['getCollection'];
  getNodeByUid: GridsomePluginStore['getNodeByUid'];
  getNode: (
    typeName: string,
    id: string,
  ) => ReturnType<GridsomePluginStore['getNodeByUid']>;
  addMetadata: GridsomePluginStore['addMetadata'];

  store: {
    createUniqueId: (id: string) => Buffer | string;
    createReference: GridsomePluginStore['createReference'];
  };

  createReference: GridsomePluginStore['createReference'];
  makeUid: (id: string) => Buffer | string;

  GraphQLSchema: any;
  GraphQLScalarType: any;
  GraphQLObjectType: any;
  GraphQLInterfaceType: any;
  GraphQLUnionType: any;
  GraphQLEnumType: any;
  GraphQLInputObjectType: any;
  GraphQLList: any;
  GraphQLNonNull: any;
  GraphQLDeprecatedDirective: any;
  GraphQLInt: any;
  GraphQLFloat: any;
  GraphQLString: any;
  GraphQLBoolean: any;
  GraphQLID: any;
  GraphQLJSON: any;

  addSchema: (schema: GraphQLSchema) => void;
  addSchemaTypes: (typesOrSDL: (string | DocumentNode)[]) => void;
  addSchemaResolvers: <
    TResolvers extends Record<
      string,
      Record<
        string,
        | GraphQLFieldConfig<any, any>['resolve']
        | (Omit<GraphQLFieldConfig<any, any>, 'type'> & { type?: string })
      >
    >,
  >(
    resolvers: TResolvers,
  ) => void;
  addSchemaFieldExtension: (options: any) => void;

  schema: {
    createEnumType: (options: any) => { options: any; type: string };
    createObjectType: (options: any) => { options: any; type: string };
    createUnionType: (options: any) => { options: any; type: string };
    createScalarType: (options: any) => { options: any; type: string };
    createInterfaceType: (options: any) => { options: any; type: string };
    createInputType: (options: any) => { options: any; type: string };
  };
}

type LokiQuery = Parameters<Collection['find']>[0];

/**
 * Gridsome's PluginStore class handles interface between a plugin
 * and Gridsome's Store class (which interfaces with the database (LokiJS)
 * and its Collections). This PluginStore instance is passed to the callback
 * when we call api.loadSource(callback).
 *
 * pluginFunc <--> PluginStore <--> Store <--> LokiJS.Collection & LokiJS
 *
 * See https://github.com/gridsome/gridsome/blob/b61c2fbb58f783454e5ed9552036c84c4b525881/gridsome/lib/store/PluginStore.js
 */
interface GridsomePluginStore {
  // metadata
  addMetadata: (key: string, data: any) => any;

  // collections
  /**
   * See https://gridsome.org/docs/data-store-api/#actionsaddcollectionoptions
   * And https://github.com/gridsome/gridsome/blob/b61c2fbb58f783454e5ed9552036c84c4b525881/gridsome/lib/store/PluginStore.js#L41
   * And https://github.com/gridsome/gridsome/blob/dad45d4c180d3a2661a9ff5f253fe525bc21e8cb/gridsome/lib/store/Collection.js#L15
   */
  addCollection: <T extends Record<string, any> = any>(
    options: Record<string, any>,
  ) => GridsomeCollection<T>;
  getCollection: <T extends Record<string, any> = any>(
    typeName: string,
  ) => GridsomeCollection<T>;
  getNodeByUid: (uid: string) => any | null;

  // utils
  createTypeName: (name: string) => string;
  createReference: (
    typeName: string | string[] | { $loki: string },
    id: string,
  ) => { typeName: string; id: string };
}

/**
 * Gridsome wrapper for LokiJS Collection.
 *
 * See https://github.com/gridsome/gridsome/blob/dad45d4c180d3a2661a9ff5f253fe525bc21e8cb/gridsome/lib/store/Collection.js
 */
interface GridsomeCollection<T extends Record<string, any> = any> {
  collection: () => Collection<T>;
  on: (eventName, fn, ctx) => any;
  off: (eventName, fn, ctx) => any;
  addNode: (options: any) => T | null;
  data: () => T[];
  getNodeById: (id: string) => T;
  findNode: (query: LokiQuery) => T;
  findNodes: (query: LokiQuery) => T[];
  removeNode: (id: string) => void;
  updateNode: (options: T) => T;

  // utils
  makeUid: (orgId: string) => Buffer | string;
  createFieldName: (name: string) => void;
  addReference: (fieldName: string, typeName: string) => void;
}

//////////////////////////////////////
// GRAPHQL TYPES
//////////////////////////////////////

/**
 * Context available in GraphQL resolvers.
 *
 * See https://github.com/gridsome/gridsome/blob/61dc64963449cc009b63c70f18961e536a4c00e0/gridsome/lib/app/Schema.js#L45
 */
export interface GridsomeResolverContext {
  store: any;
  pages: any;
  /** Config extended with internal info */
  config: GridsomeConfig & { [key: string]: any };
  assets: GridsomeAssetQueue;
}

type GridsomeAssetQueueAsset = (
  | GridsomeFileProcessQueueAsset
  | GridsomeImageProcessQueueAsset
  | {}
) & {
  type: 'image' | 'file';
  mimeType: string;
  isUrl: boolean;
  filePath: string;
};

interface GridsomeAssetQueue {
  app: { context: string; resolve: typeof resolve };
  index: Map<string, GridsomeAssetQueueAsset>;
  files: GridsomeFileProcessQueue;
  images: GridsomeImageProcessQueue;
  add: (filePath: string, options: any) => Promise<GridsomeAssetQueueAsset>;
  get: (key: string) => GridsomeAssetQueueAsset;
}

interface GridsomeFileProcessQueueAsset {
  src: string;
  destPath?: string;
}

/**
 * See https://github.com/gridsome/gridsome/blob/61dc64963449cc009b63c70f18961e536a4c00e0/gridsome/lib/app/queue/FileProcessQueue.js#L6
 */
class GridsomeFileProcessQueue {
  context: any;
  config: any;
  queue: any[];
  add: (filePath: string) => Promise<GridsomeFileProcessQueueAsset>;
  preProcess: (filePath: string) => Promise<GridsomeFileProcessQueueAsset>;
}

interface GridsomeImageOption {
  key: string;
  shortKey: string;
  value: any;
}

interface GridsomeImageProcessQueueAsset {
  src: string;
  size: { width: number; height: number };
  width: number;
  height: number;
  noscriptHTML: string;
  imageHTML: string;
  dataUri?: string;
  cacheKey: string;
  name: string;
  ext: string;
  hash: string;
  sets: {
    filename: string;
    destPath?: string;
    src: string;
    width: number;
    height: number;
  }[];
  sizes: string;
  srcset: string;
}

interface GridsomeImageProcessQueue {
  context: any;
  config: any;
  queue: any[];

  add: (
    filePath: string,
    options: any,
  ) => Promise<GridsomeImageProcessQueueAsset>;
  preProcess: (
    filePath: string,
    options: any,
  ) => Promise<GridsomeImageProcessQueueAsset>;
  createImageOptions: (options: {
    width?: number;
    height?: number;
    quality?: number;
    fit?: any;
    position?: any;
    background?: any;
    blur?: any;
  }) => GridsomeImageOption[];
  createFileName: (relPath: string, arr: string[], hash?: string) => string;
}

/**
 * Gridsome's Image Scalar type
 *
 * See https://github.com/gridsome/gridsome/blob/61dc64963449cc009b63c70f18961e536a4c00e0/gridsome/lib/graphql/types/image.js
 * Related https://github.com/gridsome/gridsome/blob/61dc64963449cc009b63c70f18961e536a4c00e0/gridsome/lib/app/queue/ImageProcessQueue.js
 */
export interface GridsomeImage {
  /** Asset type identifier */
  type: string;
  mimeType: string;
  /** URL path to the asset */
  src: string;
  size: {
    width: number;
    height: number;
  };
  /** e.g. "(max-width: 1402px) 100vw, 1402px" */
  sizes: string;
  /** e.g. ["/assets/static/static/imgs/photo.jpg?width=480&fit=cover&key=28efdc7 480w"] */
  srcset: string[];
  /** e.g. "data:image/svg+xml..." */
  dataUri: string;
}
