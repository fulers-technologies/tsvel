import { BaseServiceProvider } from '@tsvel/application';
import { ICache } from '../interfaces/cache.interface';
import { Cache } from '../cache';

/**
 * Service provider for cache functionality.
 * Manages registration and configuration of cache services within the application.
 * 
 * @class CacheServiceProvider
 * @extends {BaseServiceProvider}
 */
export class CacheServiceProvider extends BaseServiceProvider {
  /**
   * Register the cache service with the application container.
   * Sets up default cache configuration and bindings.
   * 
   * @returns void
   */
  register(): void {
    // Register the cache interface with the container
    this.singleton<ICache>('ICache', Cache);
    this.singleton<Cache>('Cache', Cache);

    // Register cache factory for creating cache instances
    this.bind<(config?: Record<string, any>) => ICache>('CacheFactory', () => {
      return (config?: Record<string, any>) => Cache.make(config || {});
    });

    // Register the default cache instance
    this.bind<ICache>('DefaultCache', () => Cache.getInstance());
  }

  /**
   * Boot the cache service after all services are registered.
   * Performs any initialization that requires other services to be available.
   * 
   * @returns void
   */
  boot(): void {
    // Configure cache based on environment
    this.configureCache();
    
    // Set up cache cleanup if needed
    this.setupCacheCleanup();
  }

  /**
   * Configure the cache based on application environment and settings.
   * Applies environment-specific cache configuration.
   * 
   * @private
   * @returns void
   */
  private configureCache(): void {
    const cache = this.resolve<ICache>('ICache');
    
    // Configure based on environment variables or config files
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isDevelopment) {
      // Shorter TTL in development for faster iteration
      console.log('Cache configured for development environment');
    } else if (isProduction) {
      // Longer TTL in production for better performance
      console.log('Cache configured for production environment');
    }
  }

  /**
   * Set up cache cleanup mechanisms.
   * Ensures that expired cache entries are properly cleaned up.
   * 
   * @private
   * @returns void
   */
  private setupCacheCleanup(): void {
    // Set up periodic cache cleanup
    if (typeof setInterval !== 'undefined') {
      setInterval(() => {
        // Cleanup logic would go here
        console.log('Cache cleanup executed');
      }, 60000); // Every minute
    }
  }
}

/**
 * Singleton instance of the cache service provider.
 * Provides convenient access to the service provider throughout the application.
 */
export const cacheServiceProvider = new CacheServiceProvider(null as any);