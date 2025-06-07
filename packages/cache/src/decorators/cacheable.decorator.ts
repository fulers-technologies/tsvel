import { DecoratorFactory } from '@tsvel/decorators';

/**
 * Class decorator that adds caching capabilities to a class.
 * Enables automatic caching of method results.
 * 
 * @param options - Configuration options for the caching behavior
 * @returns ClassDecorator - The decorator function
 */
export function Cacheable(options: CacheableOptions = {}): ClassDecorator {
  return DecoratorFactory.registerClass(
    'Cacheable',
    (constructor: any, opts: CacheableOptions) => {
      // Store cache configuration on the class
      (constructor as any).__cacheConfig = opts;
      
      return constructor;
    },
    { description: 'Adds caching capabilities to a class' }
  );
}

/**
 * Configuration options for the Cacheable decorator.
 * 
 * @interface CacheableOptions
 */
export interface CacheableOptions {
  /**
   * Default TTL for cached values in seconds.
   */
  defaultTtl?: number;
  
  /**
   * Cache key prefix for this class.
   */
  keyPrefix?: string;
  
  /**
   * Whether to enable caching by default for all methods.
   */
  enableByDefault?: boolean;
}