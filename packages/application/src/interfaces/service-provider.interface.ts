/**
 * Core service provider interface defining the contract for service registration and lifecycle management.
 * Follows ISP (Interface Segregation Principle) by providing focused service provider methods.
 * 
 * @interface IServiceProvider
 */
export interface IServiceProvider {
  /**
   * Register services with the application container.
   * This method is called during the application bootstrap process.
   * 
   * @returns void | Promise<void>
   */
  register(): void | Promise<void>;

  /**
   * Boot services after all providers have been registered.
   * This method is called after all service providers have been registered.
   * 
   * @returns void | Promise<void>
   */
  boot(): void | Promise<void>;
}