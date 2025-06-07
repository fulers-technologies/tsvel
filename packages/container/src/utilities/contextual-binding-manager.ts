import { IContextualBinding, IContextualBindingBuilder, IContextualBindingNeedsBuilder } from '../interfaces/contextual-binding.interface';

/**
 * Manager for contextual bindings in the container.
 * Provides Laravel-style contextual dependency injection.
 * 
 * @class ContextualBindingManager
 */
export class ContextualBindingManager {
  /**
   * Map of contextual bindings.
   */
  private bindings = new Map<string, IContextualBinding[]>();

  /**
   * Register a contextual binding.
   * 
   * @param binding - The contextual binding configuration
   * @returns void
   */
  registerBinding(binding: IContextualBinding): void {
    const contextKey = this.getContextKey(binding.when);
    
    if (!this.bindings.has(contextKey)) {
      this.bindings.set(contextKey, []);
    }
    
    this.bindings.get(contextKey)!.push(binding);
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
    const contextKey = this.getContextKey(context);
    const bindings = this.bindings.get(contextKey) || [];
    
    for (const binding of bindings) {
      if (this.matchesService(binding.needs, serviceIdentifier)) {
        if (typeof binding.give === 'function') {
          return binding.give();
        }
        return binding.give;
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
    return this.resolveContextual(context, serviceIdentifier) !== null;
  }

  /**
   * Get all contextual bindings for a context.
   * 
   * @param context - The context
   * @returns IContextualBinding[]
   */
  getBindingsForContext(context: any): IContextualBinding[] {
    const contextKey = this.getContextKey(context);
    return this.bindings.get(contextKey) || [];
  }

  /**
   * Clear all contextual bindings.
   * 
   * @returns void
   */
  clear(): void {
    this.bindings.clear();
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
   * Create a new contextual binding manager instance.
   * Factory method following the framework's .make() pattern.
   * 
   * @static
   * @returns ContextualBindingManager
   */
  static make(): ContextualBindingManager {
    return new ContextualBindingManager();
  }
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