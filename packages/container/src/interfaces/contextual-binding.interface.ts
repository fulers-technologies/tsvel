/**
 * Interface for contextual binding configuration.
 * Enables Laravel-style contextual dependency injection.
 * 
 * @interface IContextualBinding
 */
export interface IContextualBinding {
  /**
   * The context class or identifier that requires the binding.
   */
  when: string | symbol | Function;

  /**
   * The service identifier that needs contextual binding.
   */
  needs: string | symbol;

  /**
   * The implementation to provide in this context.
   */
  give: any | (() => any);

  /**
   * Optional binding scope for this contextual binding.
   */
  scope?: 'singleton' | 'transient' | 'request';
}