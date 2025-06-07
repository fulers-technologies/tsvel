import { IContextualBinding, IContextualBindingBuilder, IContextualBindingNeedsBuilder } from '../interfaces/contextual-binding.interface';

/**
 * Manager for contextual bindings in the container.
 * Provides Laravel-style contextual dependency injection.
 * 
 * @class ContextualBindingManager
 */
export class ContextualBindingManager {
  /**
   * Map of contextual bindings organized by context.
   */
  private bindings = new Map<string, IContextualBinding[]>();

  /**
   * Cache for resolved contextual services to improve performance.
   */
  private resolutionCache = new Map<string, any>();

  /**
   * Statistics for contextual binding usage.
   */
  private stats = {
    totalBindings: 0,
    resolutionCount: 0,
    cacheHits: 0,
    cacheMisses: 0,
  };

  /**
   * Register a contextual binding.
   * 
   * @param binding - The contextual binding configuration
   * @returns void
   */
  registerBinding(binding: IContextualBinding): void {
    if (!this.validateBinding(binding)) {
      throw new Error(`Invalid contextual binding: ${JSON.stringify(binding)}`);
    }

    const contextKey = this.getContextKey(binding.when);
    
    if (!this.bindings.has(contextKey)) {
      this.bindings.set(contextKey, []);
    }
    
    const bindings = this.bindings.get(contextKey)!;
    
    // Check for duplicate bindings
    const existingIndex = bindings.findIndex(b => 
      this.matchesService(b.needs, binding.needs)
    );
    
    if (existingIndex >= 0) {
      // Replace existing binding
      bindings[existingIndex] = binding;
    } else {
      // Add new binding
      bindings.push(binding);
      this.stats.totalBindings++;
    }

    // Clear cache when bindings change
    this.clearResolutionCache();

    // Log binding registration in development
    if (process.env.NODE_ENV === 'development') {
      console.debug(`Registered contextual binding: ${contextKey} needs ${String(binding.needs)}`);
    }
  }

  /**
   * Create a contextual binding for a specific context.
   * 
   * @param when - The context class or identifier
   * @returns IContextualBindingBuilder
   */
  when(when: string | symbol | Function): IContextualBindingBuilder {
    return new ContextualBindingBuilder(this, when);
  }

  /**
   * Resolve a contextual binding for a given context and service.
   * 
   * @param context - The context requesting the service
   * @param serviceIdentifier - The service identifier
   * @returns any | null - The resolved service or null if no binding found
   */
  resolveContextual(context: any, serviceIdentifier: string | symbol): any | null {
    const cacheKey = this.getCacheKey(context, serviceIdentifier);
    
    // Check cache first
    if (this.resolutionCache.has(cacheKey)) {
      this.stats.cacheHits++;
      return this.resolutionCache.get(cacheKey);
    }

    this.stats.cacheMisses++;
    this.stats.resolutionCount++;

    const contextKey = this.getContextKey(context);
    const bindings = this.bindings.get(contextKey) || [];
    
    for (const binding of bindings) {
      if (this.matchesService(binding.needs, serviceIdentifier)) {
        let resolvedService: any;

        if (typeof binding.give === 'function') {
          try {
            resolvedService = binding.give();
          } catch (error) {
            throw new Error(`Failed to resolve contextual binding for ${contextKey}: ${error instanceof Error ? error.message : String(error)}`);
          }
        } else {
          resolvedService = binding.give;
        }

        // Cache the resolved service based on scope
        if (binding.scope === 'singleton') {
          this.resolutionCache.set(cacheKey, resolvedService);
        }

        return resolvedService;
      }
    }
    
    return null;
  }

  /**
   * Check if there's a contextual binding for a context and service.
   * 
   * @param context - The context
   * @param serviceIdentifier - The service identifier
   * @returns boolean
   */
  hasContextualBinding(context: any, serviceIdentifier: string | symbol): boolean {
    const contextKey = this.getContextKey(context);
    const bindings = this.bindings.get(contextKey) || [];
    
    return bindings.some(binding => 
      this.matchesService(binding.needs, serviceIdentifier)
    );
  }

  /**
   * Get all contextual bindings for a context.
   * 
   * @param context - The context
   * @returns IContextualBinding[]
   */
  getBindingsForContext(context: any): IContextualBinding[] {
    const contextKey = this.getContextKey(context);
    return [...(this.bindings.get(contextKey) || [])]; // Return copy to prevent mutation
  }

  /**
   * Remove a specific contextual binding.
   * 
   * @param context - The context
   * @param serviceIdentifier - The service identifier
   * @returns boolean - True if binding was removed
   */
  removeBinding(context: any, serviceIdentifier: string | symbol): boolean {
    const contextKey = this.getContextKey(context);
    const bindings = this.bindings.get(contextKey);
    
    if (!bindings) {
      return false;
    }

    const initialLength = bindings.length;
    const filteredBindings = bindings.filter(binding => 
      !this.matchesService(binding.needs, serviceIdentifier)
    );

    if (filteredBindings.length < initialLength) {
      if (filteredBindings.length === 0) {
        this.bindings.delete(contextKey);
      } else {
        this.bindings.set(contextKey, filteredBindings);
      }
      
      this.stats.totalBindings -= (initialLength - filteredBindings.length);
      this.clearResolutionCache();
      return true;
    }

    return false;
  }

  /**
   * Get statistics about contextual binding usage.
   * 
   * @returns object - Statistics object
   */
  getStats(): typeof this.stats {
    return { ...this.stats };
  }

  /**
   * Clear all contextual bindings.
   * 
   * @returns void
   */
  clear(): void {
    this.bindings.clear();
    this.clearResolutionCache();
    this.stats = {
      totalBindings: 0,
      resolutionCount: 0,
      cacheHits: 0,
      cacheMisses: 0,
    };
  }

  /**
   * Clear the resolution cache.
   * 
   * @private
   * @returns void
   */
  private clearResolutionCache(): void {
    this.resolutionCache.clear();
  }

  /**
   * Get a cache key for resolution caching.
   * 
   * @private
   * @param context - The context
   * @param serviceIdentifier - The service identifier
   * @returns string
   */
  private getCacheKey(context: any, serviceIdentifier: string | symbol): string {
    const contextKey = this.getContextKey(context);
    const serviceKey = typeof serviceIdentifier === 'symbol' 
      ? serviceIdentifier.toString() 
      : String(serviceIdentifier);
    return `${contextKey}:${serviceKey}`;
  }

  /**
   * Get a string key for a context.
   * 
   * @private
   * @param context - The context
   * @returns string
   */
  private getContextKey(context: any): string {
    if (typeof context === 'string') {
      return context;
    }
    if (typeof context === 'symbol') {
      return context.toString();
    }
    if (typeof context === 'function') {
      return context.name || context.toString();
    }
    if (context && typeof context === 'object') {
      return context.constructor?.name || Object.prototype.toString.call(context);
    }
    return String(context);
  }

  /**
   * Check if a binding service matches the requested service.
   * 
   * @private
   * @param bindingService - The service from the binding
   * @param requestedService - The requested service
   * @returns boolean
   */
  private matchesService(bindingService: string | symbol, requestedService: string | symbol): boolean {
    return bindingService === requestedService;
  }

  /**
   * Validate a contextual binding configuration.
   * 
   * @private
   * @param binding - The binding to validate
   * @returns boolean
   */
  private validateBinding(binding: IContextualBinding): boolean {
    if (!binding.when || !binding.needs || binding.give === undefined) {
      return false;
    }

    if (binding.scope && !['singleton', 'transient', 'request'].includes(binding.scope)) {
      return false;
    }

    return true;
  }

  /**
   * Create a new contextual binding manager instance.
   * Factory method following the framework's .make() pattern.
   * 
   * @static
   * @returns ContextualBindingManager
   */
  static make(): ContextualBindingManager {
    return new ContextualBindingManager();
  }

  /**
   * Get the singleton contextual binding manager instance.
   * 
   * @static
   * @returns ContextualBindingManager
   */
  static getInstance(): ContextualBindingManager {
    if (!ContextualBindingManager.instance) {
      ContextualBindingManager.instance = new ContextualBindingManager();
    }
    return ContextualBindingManager.instance;
  }

  /**
   * Singleton instance.
   */
  private static instance: ContextualBindingManager;
}

/**
 * Builder class for creating contextual bindings.
 * Provides fluent API for contextual binding configuration.
 * 
 * @class ContextualBindingBuilder
 * @implements {IContextualBindingBuilder}
 */
class ContextualBindingBuilder implements IContextualBindingBuilder {
  /**
   * Creates a new contextual binding builder.
   * 
   * @param manager - The contextual binding manager
   * @param when - The context for the binding
   */
  constructor(
    private manager: ContextualBindingManager,
    private when: string | symbol | Function
  ) {}

  /**
   * Specify what service is needed in this context.
   * 
   * @param identifier - The service identifier
   * @returns IContextualBindingNeedsBuilder
   */
  needs(identifier: string | symbol): IContextualBindingNeedsBuilder {
    return new ContextualBindingNeedsBuilder(this.manager, this.when, identifier);
  }
}

/**
 * Builder class for specifying what to provide in a contextual binding.
 * Continues the fluent API for contextual binding configuration.
 * 
 * @class ContextualBindingNeedsBuilder
 * @implements {IContextualBindingNeedsBuilder}
 */
class ContextualBindingNeedsBuilder implements IContextualBindingNeedsBuilder {
  /**
   * Creates a new contextual binding needs builder.
   * 
   * @param manager - The contextual binding manager
   * @param when - The context for the binding
   * @param needs - The service identifier needed
   */
  constructor(
    private manager: ContextualBindingManager,
    private when: string | symbol | Function,
    private needs: string | symbol
  ) {}

  /**
   * Specify what implementation to provide.
   * 
   * @param implementation - The implementation to provide
   * @returns void
   */
  give(implementation: any | (() => any)): void {
    this.manager.registerBinding({
      when: this.when,
      needs: this.needs,
      give: implementation,
      scope: 'transient', // Default scope
    });
  }

  /**
   * Specify what implementation to provide with a specific scope.
   * 
   * @param implementation - The implementation to provide
   * @param scope - The binding scope
   * @returns void
   */
  giveScoped(implementation: any | (() => any), scope: 'singleton' | 'transient' | 'request'): void {
    this.manager.registerBinding({
      when: this.when,
      needs: this.needs,
      give: implementation,
      scope,
    });
  }
}