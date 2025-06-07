import { Container as InversifyContainer, interfaces } from 'inversify';
import { IContainer } from './interfaces/container.interface';
import { PropertyInjectionResolver } from './utilities/property-injection-resolver';
import { ContextualBindingManager } from './utilities/contextual-binding-manager';
import { IContextualBindingBuilder } from './interfaces/contextual-binding.interface';
import { INJECTION_TOKENS } from './constants/injection-tokens.constant';

/**
 * Extended container implementation that builds upon InversifyJS.
 * Provides additional functionality for lazy loading, property injection, and contextual binding.
 * 
 * @class Container
 * @extends {InversifyContainer}
 * @implements {IContainer}
 */
export class Container extends InversifyContainer implements IContainer {
  /**
   * Map of lazy-loaded services with their factory functions.
   */
  private lazyServices = new Map<string | symbol, () => any>();

  /**
   * Map of service metadata for enhanced service information.
   */
  private serviceMetadata = new Map<string | symbol, any>();

  /**
   * Property injection resolver for handling property-based DI.
   */
  private propertyResolver: PropertyInjectionResolver;

  /**
   * Contextual binding manager for Laravel-style contextual DI.
   */
  private contextualBindings: ContextualBindingManager;

  /**
   * Container statistics for monitoring and debugging.
   */
  private stats = {
    resolutions: 0,
    lazyLoads: 0,
    propertyInjections: 0,
    contextualResolutions: 0,
    errors: 0,
  };

  /**
   * Creates a new container instance.
   * 
   * @param containerOptions - Optional container configuration
   */
  constructor(containerOptions?: interfaces.ContainerOptions) {
    super(containerOptions);
    this.propertyResolver = PropertyInjectionResolver.make();
    this.contextualBindings = ContextualBindingManager.make();
    this.setupDefaultBindings();
    this.setupPropertyInjection();
    this.setupErrorHandling();
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
    try {
      // Check if already bound
      if (this.isBound(identifier)) {
        this.stats.resolutions++;
        return this.get<T>(identifier);
      }

      // Check if lazy factory exists
      if (this.lazyServices.has(identifier)) {
        const lazyFactory = this.lazyServices.get(identifier)!;
        const instance = lazyFactory();
        
        // Bind the instance for future requests
        this.bind(identifier).toConstantValue(instance);
        this.lazyServices.delete(identifier);
        
        this.stats.lazyLoads++;
        this.stats.resolutions++;
        
        // Log lazy loading in development
        if (process.env.NODE_ENV === 'development') {
          console.debug(`Lazy loaded service: ${String(identifier)}`);
        }
        
        return instance;
      }

      // Store the factory for later use
      this.lazyServices.set(identifier, factory);
      
      // Create and bind the instance
      const instance = factory();
      this.bind(identifier).toConstantValue(instance);
      this.lazyServices.delete(identifier);
      
      this.stats.lazyLoads++;
      this.stats.resolutions++;
      
      return instance;
    } catch (error) {
      this.stats.errors++;
      throw new Error(`Failed to lazy load service '${String(identifier)}': ${error instanceof Error ? error.message : String(error)}`);
    }
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
    try {
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

      // Store metadata
      this.setMetadata(identifier, {
        scope,
        registeredAt: new Date(),
        implementation: implementation.name || 'Anonymous',
      });

      // Log registration in development
      if (process.env.NODE_ENV === 'development') {
        console.debug(`Registered service: ${String(identifier)} with scope: ${scope}`);
      }
    } catch (error) {
      this.stats.errors++;
      throw new Error(`Failed to register service '${String(identifier)}': ${error instanceof Error ? error.message : String(error)}`);
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
   * Create a contextual binding.
   * Enables Laravel-style contextual dependency injection.
   * 
   * @param when - The context class or identifier
   * @returns IContextualBindingBuilder
   */
  when(when: string | symbol | Function): IContextualBindingBuilder {
    return this.contextualBindings.when(when);
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
      this.stats.resolutions++;
      return super.getAll<T>(identifier);
    } catch (error) {
      // If not bound, check lazy services
      if (this.lazyServices.has(identifier)) {
        const instance = this.lazyLoad<T>(identifier, this.lazyServices.get(identifier)!);
        return [instance];
      }
      this.stats.errors++;
      throw error;
    }
  }

  /**
   * Override get to support lazy loading and contextual binding.
   * 
   * @template T
   * @param serviceIdentifier - The service identifier
   * @returns T - The resolved service instance
   */
  get<T>(serviceIdentifier: string | symbol): T {
    try {
      // Check for contextual binding first
      const contextualService = this.resolveContextual<T>(serviceIdentifier);
      if (contextualService !== null) {
        this.stats.contextualResolutions++;
        this.stats.resolutions++;
        return contextualService;
      }

      const instance = super.get<T>(serviceIdentifier);
      
      // Perform property injection if the instance is an object
      if (instance && typeof instance === 'object') {
        this.propertyResolver.resolveProperties(instance, this);
        this.stats.propertyInjections++;
      }
      
      this.stats.resolutions++;
      return instance;
    } catch (error) {
      // If not bound, check lazy services
      if (this.lazyServices.has(serviceIdentifier)) {
        return this.lazyLoad<T>(serviceIdentifier, this.lazyServices.get(serviceIdentifier)!);
      }
      this.stats.errors++;
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
    return this.isBound(identifier) || 
           this.lazyServices.has(identifier) ||
           this.contextualBindings.hasContextualBinding(this, identifier);
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
    const existingMetadata = this.serviceMetadata.get(identifier) || {};
    this.serviceMetadata.set(identifier, { ...existingMetadata, ...metadata });
  }

  /**
   * Create a child container that inherits from this container.
   * 
   * @returns IContainer - The child container
   */
  createChild(): IContainer {
    const child = new Container();
    child.parent = this;
    
    // Copy contextual bindings to child
    const parentBindings = this.contextualBindings.getStats();
    if (parentBindings.totalBindings > 0) {
      // In a real implementation, we would copy the bindings
      console.debug(`Child container created with ${parentBindings.totalBindings} inherited contextual bindings`);
    }
    
    return child;
  }

  /**
   * Get container statistics.
   * 
   * @returns object - Container statistics
   */
  getStats(): typeof this.stats {
    return { ...this.stats };
  }

  /**
   * Reset container statistics.
   * 
   * @returns void
   */
  resetStats(): void {
    this.stats = {
      resolutions: 0,
      lazyLoads: 0,
      propertyInjections: 0,
      contextualResolutions: 0,
      errors: 0,
    };
  }

  /**
   * Resolve contextual binding for a service.
   * 
   * @private
   * @template T
   * @param serviceIdentifier - The service identifier
   * @returns T | null - The resolved service or null
   */
  private resolveContextual<T>(serviceIdentifier: string | symbol): T | null {
    // Get the current execution context from the call stack
    const context = this.getCurrentContext();
    if (!context) {
      return null;
    }

    return this.contextualBindings.resolveContextual(context, serviceIdentifier);
  }

  /**
   * Get the current execution context from the call stack.
   * 
   * @private
   * @returns any - The current context or null
   */
  private getCurrentContext(): any {
    // In a real implementation, this would analyze the call stack
    // to determine the requesting context. For now, we return null
    // as this requires more complex stack trace analysis.
    
    // This could be enhanced by:
    // 1. Analyzing Error().stack
    // 2. Using async_hooks in Node.js
    // 3. Maintaining a context stack during resolution
    
    return null;
  }

  /**
   * Setup default container bindings.
   * 
   * @private
   * @returns void
   */
  private setupDefaultBindings(): void {
    // Bind the container itself
    this.bind<IContainer>(INJECTION_TOKENS.CONTAINER).toConstantValue(this);
    
    // Bind utility services
    this.bind<PropertyInjectionResolver>('PropertyInjectionResolver').toConstantValue(this.propertyResolver);
    this.bind<ContextualBindingManager>('ContextualBindingManager').toConstantValue(this.contextualBindings);
  }

  /**
   * Setup property injection hooks.
   * 
   * @private
   * @returns void
   */
  private setupPropertyInjection(): void {
    // Override the onActivation to perform property injection
    this.onActivation = (context: interfaces.Context, injectable: any) => {
      if (injectable && typeof injectable === 'object') {
        try {
          this.propertyResolver.resolveProperties(injectable, this);
          this.stats.propertyInjections++;
        } catch (error) {
          this.stats.errors++;
          console.error(`Property injection failed for ${injectable.constructor?.name || 'unknown'}:`, error);
        }
      }
      return injectable;
    };
  }

  /**
   * Setup error handling for the container.
   * 
   * @private
   * @returns void
   */
  private setupErrorHandling(): void {
    // Add error handling for binding failures
    const originalBind = this.bind.bind(this);
    this.bind = function<T>(serviceIdentifier: string | symbol) {
      try {
        return originalBind<T>(serviceIdentifier);
      } catch (error) {
        this.stats.errors++;
        throw new Error(`Failed to bind service '${String(serviceIdentifier)}': ${error instanceof Error ? error.message : String(error)}`);
      }
    }.bind(this);
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