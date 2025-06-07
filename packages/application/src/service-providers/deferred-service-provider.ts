import { BaseServiceProvider } from './base-service-provider';
import { IDeferredServiceProvider } from '../interfaces/deferred-service-provider.interface';

/**
 * Abstract base class for deferred service providers.
 * Provides lazy loading capabilities for services that are only needed on-demand.
 * 
 * @abstract
 * @class DeferredServiceProvider
 * @extends {BaseServiceProvider}
 * @implements {IDeferredServiceProvider}
 */
export abstract class DeferredServiceProvider extends BaseServiceProvider implements IDeferredServiceProvider {
  /**
   * Array of service identifiers that this provider provides.
   * Must be implemented by concrete deferred providers.
   */
  abstract readonly provides: (string | symbol)[];

  /**
   * Indicates that this provider is deferred.
   */
  readonly isDeferred = true as const;

  /**
   * Indicates whether this provider has been loaded.
   */
  private loaded = false;

  /**
   * Register services with the application container.
   * Only called when one of the provided services is requested.
   * 
   * @abstract
   * @returns void | Promise<void>
   */
  abstract register(): void | Promise<void>;

  /**
   * Boot services after registration.
   * Called after the provider has been registered.
   * 
   * @returns void | Promise<void>
   */
  boot(): void | Promise<void> {
    // Default implementation - override if needed
  }

  /**
   * Load the provider if it hasn't been loaded yet.
   * Called by the application when a provided service is requested.
   * 
   * @returns Promise<void>
   */
  async load(): Promise<void> {
    if (this.loaded) {
      return;
    }

    await this.register();
    await this.boot();
    this.loaded = true;
  }

  /**
   * Check if this provider provides a specific service.
   * 
   * @param identifier - The service identifier to check
   * @returns boolean - True if this provider provides the service
   */
  providesService(identifier: string | symbol): boolean {
    return this.provides.includes(identifier);
  }

  /**
   * Check if this provider has been loaded.
   * 
   * @returns boolean - True if the provider has been loaded
   */
  isLoaded(): boolean {
    return this.loaded;
  }
}