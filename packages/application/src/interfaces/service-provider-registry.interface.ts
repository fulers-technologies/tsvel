import { IServiceProvider } from './service-provider.interface';
import { IDeferredServiceProvider } from './deferred-service-provider.interface';
import { ITerminableServiceProvider } from './terminable-service-provider.interface';
import { IProviderConfig } from './provider-config.interface';

/**
 * Interface for service provider registry that manages all provider operations.
 * Centralizes provider registration, booting, and lifecycle management.
 * 
 * @interface IServiceProviderRegistry
 */
export interface IServiceProviderRegistry {
  /**
   * Register a service provider with the registry.
   * 
   * @param provider - The service provider to register
   * @param config - Optional configuration for the provider
   * @returns this - The registry instance for method chaining
   */
  register(provider: IServiceProvider, config?: IProviderConfig): this;

  /**
   * Boot all registered service providers.
   * 
   * @returns Promise<void>
   */
  boot(): Promise<void>;

  /**
   * Terminate all terminable service providers.
   * 
   * @returns Promise<void>
   */
  terminate(): Promise<void>;

  /**
   * Get a service from the container with deferred provider loading.
   * 
   * @template T
   * @param identifier - The service identifier
   * @returns T - The resolved service instance
   */
  resolve<T>(identifier: string | symbol): T;

  /**
   * Check if a service is available (including deferred providers).
   * 
   * @param identifier - The service identifier
   * @returns boolean - True if the service is available
   */
  canResolve(identifier: string | symbol): boolean;

  /**
   * Get all registered providers.
   * 
   * @returns IServiceProvider[] - Array of registered providers
   */
  getProviders(): IServiceProvider[];

  /**
   * Get all deferred providers.
   * 
   * @returns IDeferredServiceProvider[] - Array of deferred providers
   */
  getDeferredProviders(): IDeferredServiceProvider[];

  /**
   * Get all terminable providers.
   * 
   * @returns ITerminableServiceProvider[] - Array of terminable providers
   */
  getTerminableProviders(): ITerminableServiceProvider[];

  /**
   * Check if the registry has been booted.
   * 
   * @returns boolean - True if the registry has been booted
   */
  isBooted(): boolean;

  /**
   * Check if the registry is terminating.
   * 
   * @returns boolean - True if the registry is terminating
   */
  isTerminating(): boolean;

  /**
   * Clear all providers from the registry.
   * 
   * @returns void
   */
  clear(): void;
}