/**
 * Interface for service providers that need cleanup during application shutdown.
 * Extends the base service provider with termination capabilities.
 * 
 * @interface ITerminableServiceProvider
 */
export interface ITerminableServiceProvider {
  /**
   * Indicates whether this provider is terminable.
   * Always true for terminable providers.
   */
  readonly isTerminable: true;

  /**
   * Register services with the application container.
   * 
   * @returns void | Promise<void>
   */
  register(): void | Promise<void>;

  /**
   * Boot services after all providers have been registered.
   * 
   * @returns void | Promise<void>
   */
  boot(): void | Promise<void>;

  /**
   * Terminate services and clean up resources.
   * Called during application shutdown.
   * 
   * @returns void | Promise<void>
   */
  terminate(): void | Promise<void>;
}