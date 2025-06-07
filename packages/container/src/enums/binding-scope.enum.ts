/**
 * Enumeration for dependency injection binding scopes.
 * Defines the lifecycle of service instances in the container.
 * 
 * @enum BindingScope
 */
export enum BindingScope {
  /**
   * Creates a new instance every time the service is resolved.
   */
  TRANSIENT = 'transient',

  /**
   * Creates a single instance that is shared across the entire application.
   */
  SINGLETON = 'singleton',

  /**
   * Creates a single instance per request scope.
   */
  REQUEST = 'request',

  /**
   * Creates a single instance per container hierarchy.
   */
  CONTAINER = 'container',
}