import { IServiceProvider } from '../interfaces/service-provider.interface';

/**
 * Abstract base class for service providers.
 * Provides common functionality and enforces the service provider contract.
 * 
 * @abstract
 * @class BaseServiceProvider
 * @implements {IServiceProvider}
 */
export abstract class BaseServiceProvider implements IServiceProvider {
  /**
   * The application instance.
   * Available to all service providers for container access.
   */
  protected app: any;

  /**
   * Creates a new service provider instance.
   * 
   * @param app - The application instance
   */
  constructor(app: any) {
    this.app = app;
  }

  /**
   * Register services with the application container.
   * Must be implemented by concrete service providers.
   * 
   * @abstract
   * @returns void | Promise<void>
   */
  abstract register(): void | Promise<void>;

  /**
   * Boot services after all providers have been registered.
   * Default implementation does nothing - override if needed.
   * 
   * @returns void | Promise<void>
   */
  boot(): void | Promise<void> {
    // Default implementation - override if needed
  }

  /**
   * Get a service from the application container.
   * Convenience method for accessing registered services.
   * 
   * @template T
   * @param identifier - The service identifier
   * @returns T - The resolved service instance
   */
  protected resolve<T>(identifier: string | symbol): T {
    return this.app.container.get<T>(identifier);
  }

  /**
   * Bind a service to the application container.
   * Convenience method for registering services.
   * 
   * @template T
   * @param identifier - The service identifier
   * @param implementation - The service implementation
   * @returns void
   */
  protected bind<T>(identifier: string | symbol, implementation: T | (() => T)): void {
    if (typeof implementation === 'function') {
      this.app.container.bind(identifier).toDynamicValue(implementation);
    } else {
      this.app.container.bind(identifier).toConstantValue(implementation);
    }
  }

  /**
   * Bind a singleton service to the application container.
   * Convenience method for registering singleton services.
   * 
   * @template T
   * @param identifier - The service identifier
   * @param implementation - The service implementation
   * @returns void
   */
  protected singleton<T>(identifier: string | symbol, implementation: new (...args: any[]) => T): void {
    this.app.container.bind(identifier).to(implementation).inSingletonScope();
  }

  /**
   * Check if a service is bound in the container.
   * 
   * @param identifier - The service identifier
   * @returns boolean - True if the service is bound
   */
  protected isBound(identifier: string | symbol): boolean {
    return this.app.container.isBound(identifier);
  }
}

export { BaseServiceProvider }