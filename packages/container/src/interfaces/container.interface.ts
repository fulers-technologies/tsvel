import { Container as InversifyContainer, interfaces } from 'inversify';

/**
 * Extended container interface that builds upon InversifyJS Container.
 * Provides additional functionality for lazy loading and enhanced DI capabilities.
 * 
 * @interface IContainer
 * @extends {InversifyContainer}
 */
export interface IContainer extends InversifyContainer {
  /**
   * Lazy load a service, registering it only when first requested.
   * 
   * @template T
   * @param identifier - The service identifier
   * @param factory - Factory function to create the service
   * @returns T - The service instance
   */
  lazyLoad<T>(identifier: string | symbol, factory: () => T): T;

  /**
   * Register a service with automatic dependency resolution.
   * 
   * @template T
   * @param identifier - The service identifier
   * @param implementation - The service implementation
   * @param scope - The binding scope (singleton, transient, request)
   * @returns void
   */
  register<T>(
    identifier: string | symbol,
    implementation: interfaces.Newable<T> | T,
    scope?: 'singleton' | 'transient' | 'request'
  ): void;

  /**
   * Register a singleton service.
   * 
   * @template T
   * @param identifier - The service identifier
   * @param implementation - The service implementation
   * @returns void
   */
  singleton<T>(identifier: string | symbol, implementation: interfaces.Newable<T> | T): void;

  /**
   * Register a transient service.
   * 
   * @template T
   * @param identifier - The service identifier
   * @param implementation - The service implementation
   * @returns void
   */
  transient<T>(identifier: string | symbol, implementation: interfaces.Newable<T>): void;

  /**
   * Resolve all services bound to an identifier.
   * 
   * @template T
   * @param identifier - The service identifier
   * @returns T[] - Array of resolved service instances
   */
  getAll<T>(identifier: string | symbol): T[];

  /**
   * Check if a service can be resolved (including lazy loaded services).
   * 
   * @param identifier - The service identifier
   * @returns boolean - True if the service can be resolved
   */
  canResolve(identifier: string | symbol): boolean;

  /**
   * Get service metadata.
   * 
   * @param identifier - The service identifier
   * @returns any - Service metadata
   */
  getMetadata(identifier: string | symbol): any;

  /**
   * Create a child container that inherits from this container.
   * 
   * @returns IContainer - The child container
   */
  createChild(): IContainer;
}