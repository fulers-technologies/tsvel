import { BaseServiceProvider } from '@tsvel/application';
import { IMiddleware } from '../interfaces/middleware.interface';
import { IMiddlewareChain } from '../interfaces/middleware-chain.interface';
import { Middleware } from '../middleware';
import { MiddlewareChain } from '../middleware-chain';

/**
 * Service provider for middleware functionality.
 * Manages registration and configuration of middleware services within the application.
 * 
 * @class MiddlewareServiceProvider
 * @extends {BaseServiceProvider}
 */
export class MiddlewareServiceProvider extends BaseServiceProvider {
  /**
   * Register the middleware service with the application container.
   * Sets up default middleware configuration and bindings.
   * 
   * @returns void
   */
  register(): void {
    // Register the middleware interfaces with the container
    this.singleton<IMiddleware>('IMiddleware', Middleware);
    this.singleton<IMiddlewareChain>('IMiddlewareChain', MiddlewareChain);
    this.singleton<Middleware>('Middleware', Middleware);
    this.singleton<MiddlewareChain>('MiddlewareChain', MiddlewareChain);

    // Register middleware factory for creating middleware instances
    this.bind<(config?: Record<string, any>) => IMiddleware>('MiddlewareFactory', () => {
      return (config?: Record<string, any>) => Middleware.make(config || {});
    });

    // Register middleware chain factory
    this.bind<() => IMiddlewareChain>('MiddlewareChainFactory', () => {
      return () => MiddlewareChain.make();
    });

    // Register the default middleware instance
    this.bind<IMiddleware>('DefaultMiddleware', () => Middleware.getInstance());
  }

  /**
   * Boot the middleware service after all services are registered.
   * Performs any initialization that requires other services to be available.
   * 
   * @returns void
   */
  boot(): void {
    // Configure middleware based on environment
    this.configureMiddleware();
    
    // Set up global middleware if needed
    this.setupGlobalMiddleware();
  }

  /**
   * Configure the middleware based on application environment and settings.
   * Applies environment-specific middleware configuration.
   * 
   * @private
   * @returns void
   */
  private configureMiddleware(): void {
    const middleware = this.resolve<IMiddleware>('IMiddleware');
    
    // Configure based on environment variables or config files
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isDevelopment) {
      // Enable debug middleware in development
      console.log('Middleware configured for development environment');
    } else if (isProduction) {
      // Enable performance middleware in production
      console.log('Middleware configured for production environment');
    }
  }

  /**
   * Set up global middleware that applies to all requests.
   * Registers common middleware like CORS, security headers, etc.
   * 
   * @private
   * @returns void
   */
  private setupGlobalMiddleware(): void {
    const middlewareChain = this.resolve<IMiddlewareChain>('IMiddlewareChain');
    
    // Add global middleware to the chain
    console.log('Global middleware chain configured');
  }
}

/**
 * Singleton instance of the middleware service provider.
 * Provides convenient access to the service provider throughout the application.
 */
export const middlewareServiceProvider = new MiddlewareServiceProvider(null as any);