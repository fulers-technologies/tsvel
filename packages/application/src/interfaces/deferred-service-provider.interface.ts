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

  /**
   * Check if this provider provides a specific service.
   * 
   * @param identifier - The service identifier to check
   * @returns boolean - True if this provider provides the service
   */
  providesService(identifier: string | symbol): boolean;

  /**
   * Check if this provider has been loaded.
   * 
   * @returns boolean - True if the provider has been loaded
   */
  isLoaded(): boolean;
}