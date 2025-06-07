import { Container as InversifyContainer, interfaces } from 'inversify';
import { IContainer } from './interfaces/container.interface';

/**
 * Extended container implementation that builds upon InversifyJS.
 * Provides additional functionality for lazy loading and enhanced DI capabilities.
 * 
 * @class Container
 * @extends {InversifyContainer}
 * @implements {IContainer}
 */
export class Container extends InversifyContainer implements IContainer {
  /**
   * Map of lazy-loaded services.
   */
  private lazyServices = new Map<string | symbol, () => any>();

  /**
   * Map of service metadata.
   */
  private serviceMetadata = new Map<string | symbol, any>();

  /**
   * Creates a new container instance.
   * 
   * @param containerOptions - Optional container configuration
   */
  constructor(containerOptions?: interfaces.ContainerOptions) {
    super(containerOptions);
    this.setupDefaultBindings();
  }

  /**
   * Lazy load a service, registering it only when first requested.
   * 
   * @template T
   * @param identifier - The service identifier
   * @param factory - Factory function to create the service
   * @returns T - The service instance
   */
  lazyLoad<T>(identifier: string | symbol, factory: () => T): T {
    // Check if already bound
    if (this.isBound(identifier)) {
      return this.get<T>(identifier);
    }

    // Check if lazy factory exists
    if (this.lazyServices.has(identifier)) {
      const lazyFactory = this.lazyServices.get(identifier)!;
      const instance = lazyFactory();
      
      // Bind the instance for future requests
      this.bind(identifier).toConstantValue(instance);
      this.lazyServices.delete(identifier);
      
      return instance;
    }

    // Store the factory for later use
    this.lazyServices.set(identifier, factory);
    
    // Create and bind the instance
    const instance = factory();
    this.bind(identifier).toConstantValue(instance);
    this.lazyServices.delete(identifier);
    
    return instance;
  }

  /**
   * Register a service with automatic dependency resolution.
   * 
   * @template T
   * @param identifier - The service identifier
   * @param implementation - The service implementation
   * @param scope - The binding scope
   * @returns void
   */
  register<T>(
    identifier: string | symbol,
    implementation: interfaces.Newable<T> | T,
    scope: 'singleton' | 'transient' | 'request' = 'transient'
  ): void {
    let binding: interfaces.BindingToSyntax<T>;

    if (typeof implementation === 'function') {
      binding = this.bind<T>(identifier).to(implementation as interfaces.Newable<T>);
    } else {
      binding = this.bind<T>(identifier).toConstantValue(implementation);
      return; // Constants don't have scope
    }

    // Apply scope
    switch (scope) {
      case 'singleton':
        binding.inSingletonScope();
        break;
      case 'request':
        binding.inRequestScope();
        break;
      case 'transient':
      default:
        binding.inTransientScope();
        break;
    }
  }

  /**
   * Register a singleton service.
   * 
   * @template T
   * @param identifier - The service identifier
   * @param implementation - The service implementation
   * @returns void
   */
  singleton<T>(identifier: string | symbol, implementation: interfaces.Newable<T> | T): void {
    this.register(identifier, implementation, 'singleton');
  }

  /**
   * Register a transient service.
   * 
   * @template T
   * @param identifier - The service identifier
   * @param implementation - The service implementation
   * @returns void
   */
  transient<T>(identifier: string | symbol, implementation: interfaces.Newable<T>): void {
    this.register(identifier, implementation, 'transient');
  }

  /**
   * Resolve all services bound to an identifier.
   * 
   * @template T
   * @param identifier - The service identifier
   * @returns T[] - Array of resolved service instances
   */
  getAll<T>(identifier: string | symbol): T[] {
    try {
      return super.getAll<T>(identifier);
    } catch (error) {
      // If not bound, check lazy services
      if (this.lazyServices.has(identifier)) {
        const instance = this.lazyLoad<T>(identifier, this.lazyServices.get(identifier)!);
        return [instance];
      }
      throw error;
    }
  }

  /**
   * Override get to support lazy loading.
   * 
   * @template T
   * @param serviceIdentifier - The service identifier
   * @returns T - The resolved service instance
   */
  get<T>(serviceIdentifier: string | symbol): T {
    try {
      return super.get<T>(serviceIdentifier);
    } catch (error) {
      // If not bound, check lazy services
      if (this.lazyServices.has(serviceIdentifier)) {
        return this.lazyLoad<T>(serviceIdentifier, this.lazyServices.get(serviceIdentifier)!);
      }
      throw error;
    }
  }

  /**
   * Check if a service can be resolved (including lazy loaded services).
   * 
   * @param identifier - The service identifier
   * @returns boolean - True if the service can be resolved
   */
  canResolve(identifier: string | symbol): boolean {
    return this.isBound(identifier) || this.lazyServices.has(identifier);
  }

  /**
   * Get service metadata.
   * 
   * @param identifier - The service identifier
   * @returns any - Service metadata
   */
  getMetadata(identifier: string | symbol): any {
    return this.serviceMetadata.get(identifier);
  }

  /**
   * Set service metadata.
   * 
   * @param identifier - The service identifier
   * @param metadata - The metadata to store
   * @returns void
   */
  setMetadata(identifier: string | symbol, metadata: any): void {
    this.serviceMetadata.set(identifier, metadata);
  }

  /**
   * Create a child container that inherits from this container.
   * 
   * @returns IContainer - The child container
   */
  createChild(): IContainer {
    const child = new Container();
    child.parent = this;
    return child;
  }

  /**
   * Setup default container bindings.
   * 
   * @private
   * @returns void
   */
  private setupDefaultBindings(): void {
    // Bind the container itself
    this.bind<IContainer>('Container').toConstantValue(this);
  }

  /**
   * Create a new container instance.
   * Factory method following the framework's .make() pattern.
   * 
   * @static
   * @param options - Optional container configuration
   * @returns Container - A new container instance
   */
  static make(options?: interfaces.ContainerOptions): Container {
    return new Container(options);
  }

  /**
   * Get the singleton container instance.
   * 
   * @static
   * @returns Container - The singleton container instance
   */
  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  /**
   * Singleton container instance.
   */
  private static instance: Container;
}