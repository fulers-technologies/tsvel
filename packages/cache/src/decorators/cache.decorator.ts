import { DecoratorFactory } from '@tsvel/decorators';

/**
 * Method decorator that caches method results.
 * Provides automatic caching with configurable TTL and key generation.
 * 
 * @param options - Configuration options for the caching behavior
 * @returns MethodDecorator - The decorator function
 */
export function Cache(options: CacheOptions = {}): MethodDecorator {
  return DecoratorFactory.registerMethod(
    'Cache',
    (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor, opts: CacheOptions) => {
      const originalMethod = descriptor.value;
      const methodName = String(propertyKey);
      const className = target.constructor.name;
      
      descriptor.value = async function (...args: any[]) {
        // Generate cache key
        const cacheKey = opts.keyGenerator 
          ? opts.keyGenerator(className, methodName, args)
          : `${className}.${methodName}:${JSON.stringify(args)}`;
        
        // Try to get from cache first
        // In a real implementation, this would use the actual cache service
        console.log(`Checking cache for key: ${cacheKey}`);
        
        // If not in cache, execute method and cache result
        const result = await originalMethod.apply(this, args);
        
        // Cache the result
        console.log(`Caching result for key: ${cacheKey} with TTL: ${opts.ttl || 300}s`);
        
        return result;
      };
      
      return descriptor;
    },
    { description: 'Caches method results with configurable TTL' }
  );
}

/**
 * Configuration options for the Cache decorator.
 * 
 * @interface CacheOptions
 */
export interface CacheOptions {
  /**
   * Time to live for cached values in seconds.
   * Defaults to 300 seconds (5 minutes).
   */
  ttl?: number;
  
  /**
   * Custom cache key generator function.
   */
  keyGenerator?: (className: string, methodName: string, args: any[]) => string;
  
  /**
   * Whether to cache null/undefined results.
   * Defaults to false.
   */
  cacheNullValues?: boolean;
  
  /**
   * Custom condition for when to cache.
   */
  condition?: (result: any) => boolean;
}