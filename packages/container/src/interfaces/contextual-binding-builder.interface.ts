/**
 * Interface for contextual binding builder.
 * Provides fluent API for creating contextual bindings.
 * 
 * @interface IContextualBindingBuilder
 */
export interface IContextualBindingBuilder {
  /**
   * Specify what service is needed in this context.
   * 
   * @param identifier - The service identifier
   * @returns IContextualBindingNeedsBuilder
   */
  needs(identifier: string | symbol): IContextualBindingNeedsBuilder;
}

/**
 * Interface for contextual binding needs builder.
 * Continues the fluent API for specifying what to provide.
 * 
 * @interface IContextualBindingNeedsBuilder
 */
export interface IContextualBindingNeedsBuilder {
  /**
   * Specify what implementation to provide.
   * 
   * @param implementation - The implementation to provide
   * @returns void
   */
  give(implementation: any | (() => any)): void;

  /**
   * Specify what implementation to provide with a specific scope.
   * 
   * @param implementation - The implementation to provide
   * @param scope - The binding scope
   * @returns void
   */
  giveScoped(implementation: any | (() => any), scope: 'singleton' | 'transient' | 'request'): void;
}