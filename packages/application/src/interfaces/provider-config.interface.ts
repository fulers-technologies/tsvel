/**
 * Configuration interface for service provider registration.
 * Defines options for how providers should be registered and managed.
 * 
 * @interface IProviderConfig
 */
export interface IProviderConfig {
  /**
   * Whether the provider should be registered immediately or deferred.
   */
  deferred?: boolean;

  /**
   * Whether the provider should be booted immediately after registration.
   */
  autoboot?: boolean;

  /**
   * Priority for provider registration (higher numbers register first).
   */
  priority?: number;

  /**
   * Environment conditions for provider registration.
   */
  environment?: string | string[];

  /**
   * Dependencies that must be registered before this provider.
   */
  dependencies?: (string | symbol)[];

  /**
   * Additional metadata for the provider.
   */
  metadata?: Record<string, any>;
}