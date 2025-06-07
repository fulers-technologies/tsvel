/**
 * Standard injection tokens used throughout the container system.
 * Provides consistent identifiers for common services.
 */
export const INJECTION_TOKENS = {
  /**
   * Token for the container itself.
   */
  CONTAINER: Symbol.for('Container'),

  /**
   * Token for the application instance.
   */
  APPLICATION: Symbol.for('Application'),

  /**
   * Token for the logger service.
   */
  LOGGER: Symbol.for('ILogger'),

  /**
   * Token for the cache service.
   */
  CACHE: Symbol.for('ICache'),

  /**
   * Token for the middleware service.
   */
  MIDDLEWARE: Symbol.for('IMiddleware'),

  /**
   * Token for the metadata service.
   */
  METADATA: Symbol.for('IMetadata'),

  /**
   * Token for the decorator registry.
   */
  DECORATOR_REGISTRY: Symbol.for('DecoratorRegistry'),
} as const;

/**
 * Type for injection token values.
 */
export type InjectionToken = typeof INJECTION_TOKENS[keyof typeof INJECTION_TOKENS];