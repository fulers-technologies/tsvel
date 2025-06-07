import { BaseServiceProvider } from '@tsvel/application';
import { ILogger } from '../interfaces/logger.interface';
import { Logger } from '../logger';

/**
 * Service provider for logger functionality.
 * Manages registration and configuration of logger services within the application.
 * 
 * @class LoggerServiceProvider
 * @extends {BaseServiceProvider}
 */
export class LoggerServiceProvider extends BaseServiceProvider {
  /**
   * Register the logger service with the application container.
   * Sets up default logger configuration and bindings.
   * 
   * @returns void
   */
  register(): void {
    // Register the logger interface with the container
    this.singleton<ILogger>('ILogger', Logger);
    this.singleton<Logger>('Logger', Logger);

    // Register logger factory for creating child loggers
    this.bind<(context?: Record<string, any>) => ILogger>('LoggerFactory', () => {
      return (context?: Record<string, any>) => Logger.make(context || {});
    });

    // Register the default logger instance
    this.bind<ILogger>('DefaultLogger', () => Logger.getInstance());
  }

  /**
   * Boot the logger service after all services are registered.
   * Performs any initialization that requires other services to be available.
   * 
   * @returns void
   */
  boot(): void {
    // Configure logger based on environment
    this.configureLogger();
    
    // Set up global error handling if needed
    this.setupGlobalErrorHandling();
  }

  /**
   * Configure the logger based on application environment and settings.
   * Applies environment-specific logging configuration.
   * 
   * @private
   * @returns void
   */
  private configureLogger(): void {
    const logger = this.resolve<ILogger>('ILogger');
    
    // Configure based on environment variables or config files
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isDevelopment) {
      // More verbose logging in development
      logger.setLevel(0); // DEBUG level
    } else if (isProduction) {
      // Less verbose logging in production
      logger.setLevel(2); // WARN level
    }
  }

  /**
   * Set up global error handling to capture unhandled errors.
   * Ensures that critical errors are always logged.
   * 
   * @private
   * @returns void
   */
  private setupGlobalErrorHandling(): void {
    const logger = this.resolve<ILogger>('ILogger');
    
    // Handle unhandled promise rejections
    if (typeof process !== 'undefined') {
      process.on('unhandledRejection', (reason, promise) => {
        logger.error('Unhandled Promise Rejection', {
          reason: reason instanceof Error ? reason.message : String(reason),
          stack: reason instanceof Error ? reason.stack : undefined,
          promise: promise.toString(),
        });
      });

      // Handle uncaught exceptions
      process.on('uncaughtException', (error) => {
        logger.error('Uncaught Exception', {
          message: error.message,
          stack: error.stack,
          name: error.name,
        });
      });
    }
  }
}

/**
 * Singleton instance of the logger service provider.
 * Provides convenient access to the service provider throughout the application.
 */
export const loggerServiceProvider = new LoggerServiceProvider(null as any);