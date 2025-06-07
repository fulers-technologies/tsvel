import { IServiceProvider } from '../interfaces/service-provider.interface';

/**
 * Decorator that marks a class as a service provider.
 * Provides metadata for automatic service provider registration.
 * 
 * @param options - Configuration options for the service provider
 * @returns ClassDecorator - The service provider decorator
 */
export function ServiceProvider(options: ServiceProviderOptions = {}): ClassDecorator {
  return function <T extends { new (...args: any[]): IServiceProvider }>(target: T) {
    // Store service provider metadata
    Reflect.defineMetadata('serviceProvider:options', options, target);
    Reflect.defineMetadata('serviceProvider:isProvider', true, target);
    
    return target;
  };
}

/**
 * Configuration options for the ServiceProvider decorator.
 * 
 * @interface ServiceProviderOptions
 */
export interface ServiceProviderOptions {
  /**
   * Whether the provider should be registered as deferred.
   */
  deferred?: boolean;

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

/**
 * Check if a class is marked as a service provider.
 * 
 * @param target - The class to check
 * @returns boolean - True if the class is a service provider
 */
export function isServiceProvider(target: any): boolean {
  return Reflect.getMetadata('serviceProvider:isProvider', target) === true;
}

/**
 * Get service provider options from a class.
 * 
 * @param target - The service provider class
 * @returns ServiceProviderOptions - The provider options
 */
export function getServiceProviderOptions(target: any): ServiceProviderOptions {
  return Reflect.getMetadata('serviceProvider:options', target) || {};
}