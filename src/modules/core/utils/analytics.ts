import { metadata } from '@/modules/config/metadata';
import { inject } from '@vue/composition-api';
import mapValues from 'lodash/mapValues';
import mixpanel, { Config } from 'mixpanel-browser';

type Promisable<T> = T | Promise<T>;

interface Analytics {
  /** Initialize the analytics instances */
  init: () => Promisable<void>;
  track: (eventName: string, props: Record<string, any>) => Promisable<void>;
  /** Track clicks on elements specified with a query */
  trackClicks: <TElem extends HTMLElement>(
    querySelector: string,
    eventName: string,
    propsOrGetter: Record<string, any> | ((elem: TElem) => Record<string, any>),
  ) => Promisable<void>;
  /**
   * Set properties, which are included with all events.
   * This will overwrite previous set values.
   */
  setDefaultProperties: (props: Record<string, any>) => Promisable<void>;
}

export const AnalyticsKey = Symbol('analytics');

export const createAnalytics = (): Analytics => {
  // @ts-expect-error - Gridsome-specific value
  // See https://gridsome.org/docs/client-api/#isclient
  if (!process.isClient || process.env.NODE_ENV === 'development') {
    return createNullAnalytics();
  }

  const analyticsInstances: Analytics[] = [
    createMixpanelAnalytics(metadata.analytics.mixpanelToken, {
      debug: process.env.NODE_ENV === 'development',
    }),
  ];

  const proxy = createProxyAnalytics(analyticsInstances);
  return proxy;
};

export const useAnalytics = (): Analytics => {
  const analytics = inject<Analytics>(AnalyticsKey) ?? null;

  if (!analytics) {
    console.warn(
      'Analytics instance not found. Did you call "provide(AnalyticsKey, createAnalytics())"?',
    );
  }

  return analytics ?? createWarnAnalytics();
};

/////////////////////////////////////////
// ANALYTICS IMPLEMENTATIONS (HELPERS)
/////////////////////////////////////////

/**
 * Helper to create analytics instances where all methods are handled by the
 * same function, like for nullAnalytics.
 *
 * Create an analytics factory function that resolves the behaviour of individual
 * methods based on the `methodFactory` function.
 *
 * `methodFactory` receives the method key as first argument, and then
 * whatever args have been passed to the analytics factory function.
 */
const createAnalyticsFactory = <TParams extends any[] = []>(
  methodFactory: <T extends keyof Analytics>(
    methodName: T,
    ...args: TParams
  ) => Analytics[T],
): ((...args: TParams) => Analytics) => {
  const methods: Record<keyof Analytics, null> = {
    init: null,
    track: null,
    trackClicks: null,
    setDefaultProperties: null,
  };

  const factory = (...args: TParams): Analytics => {
    return mapValues(methods, (_, key) => methodFactory(key as any, ...args));
  };

  return factory;
};

/**
 * Analytics implementation that proxies the called methods to other
 * child instances.
 */
const createProxyAnalytics = (analyticsInstances: Analytics[]): Analytics => {
  const createProxyMethod =
    <TKey extends keyof Analytics>(method: TKey) =>
    async (...args: Parameters<Analytics[TKey]>) => {
      await Promise.all(
        analyticsInstances.map(
          // @ts-ignore
          (instance) => instance[method]?.apply(null, args),
        ),
      );
    };

  return createAnalyticsFactory((key) => createProxyMethod(key as any))();
};

/**
 * Analytics that prints a warning. Used when the analytics weren't
 * instantiated before calling useAnalytics.
 */
const createWarnAnalytics = (): Analytics => {
  const warn = () => {
    console.warn(
      'Analytics instance was not found before calling "useAnalytics". Did you call "provide(AnalyticsKey, createAnalytics())"?',
    );
  };

  return createAnalyticsFactory((key) => warn)();
};

/**
 * Analytics that does nothing. Used in environments
 * where analytics are not to be used (e.g. server-side
 * or client-side but localhost).
 */
const createNullAnalytics = (): Analytics => {
  const noop = () => {};
  return createAnalyticsFactory((key) => noop)();
};

/////////////////////////////////////////
// ANALYTICS IMPLEMENTATIONS (SINKS)
/////////////////////////////////////////

/**
 * Analytics that passes the info to Mixpanel.
 *
 * You can find the dashboard at https://eu.mixpanel.com/
 */
const createMixpanelAnalytics = (
  token: string,
  options: Partial<Config>,
): Analytics => ({
  init: () => mixpanel.init(token, options),
  track: (eventName, props) => {
    return new Promise((res, rej) =>
      mixpanel.track(eventName, props, () => res()),
    );
  },
  trackClicks: (...args) => mixpanel.track_links(...args),
  setDefaultProperties: (...args) => mixpanel.register(...args),
});
