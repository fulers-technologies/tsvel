/**
 * Interface for deferred service providers that are loaded on-demand.
 * Extends the base service provider with lazy loading capabilities.
 * 
 * @interface IDeferredServiceProvider
 */
export interface IDeferredServiceProvider {
  /**
   * Array of service identifiers that this provider provides.
   * Used to determine when to load this provider.
   */
  readonly provides: (string | symbol)[];

  /**
   * Indicates whether this provider is deferred.
   * Always true for deferred providers.
   */
  readonly isDeferred: true;

  /**
   * Register services with the application container.
   * Called when one of the provided services is requested.
   * 
   * @returns void | Promise<void>
   */
  register(): void | Promise<void>;

  /**
   * Boot services after registration.
   * Called after the provider has been registered.
   * 
   * @returns void | Promise<void>
   */
  boot(): void | Promise<void>;
}