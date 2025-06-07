import { ILogger } from '../interfaces/logger.interface';
import { Logger } from '../logger';

/**
 * Service provider for logger functionality.
 * Manages registration and configuration of logger services within the application.
 * 
 * @class LoggerServiceProvider
 */
export class LoggerServiceProvider {
  private static instance: LoggerServiceProvider;
  private logger: ILogger;

  /**
   * Private constructor to enforce singleton pattern.
   * Use LoggerServiceProvider.getInstance() to access the instance.
   */
  private constructor() {
    this.logger = Logger.getInstance();
  }

  /**
   * Gets the singleton service provider instance.
   * Creates one if it doesn't exist.
   * 
   * @returns LoggerServiceProvider - The singleton service provider instance
   */
  static getInstance(): LoggerServiceProvider {
    if (!LoggerServiceProvider.instance) {
      LoggerServiceProvider.instance = new LoggerServiceProvider();
    }
    return LoggerServiceProvider.instance;
  }

  /**
   * Creates a new service provider instance.
   * Factory method following the framework's .make() pattern.
   * 
   * @returns LoggerServiceProvider - A new service provider instance
   */
  static make(): LoggerServiceProvider {
    return new LoggerServiceProvider();
  }

  /**
   * Registers the logger service with the application container.
   * Sets up default logger configuration and bindings.
   * 
   * @returns void
   */
  register(): void {
    // Initialize the logger service
    this.initializeLogger();
    
    // Register logger with dependency injection container if available
    this.registerWithContainer();
  }

  /**
   * Boots the logger service after all services are registered.
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
   * Gets the logger instance managed by this service provider.
   * 
   * @returns ILogger - The logger instance
   */
  getLogger(): ILogger {
    return this.logger;
  }

  /**
   * Creates a new logger instance with optional context.
   * 
   * @param context - Optional context to include in all log messages
   * @returns ILogger - A new logger instance
   */
  createLogger(context: Record<string, any> = {}): ILogger {
    return Logger.make(context);
  }

  /**
   * Initializes the logger service with default configuration.
   * Sets up the primary logger instance used throughout the application.
   * 
   * @private
   * @returns void
   */
  private initializeLogger(): void {
    // Set default log level based on environment
    const logLevel = this.getLogLevelFromEnvironment();
    this.logger.setLevel(logLevel);
  }

  /**
   * Registers the logger service with the dependency injection container.
   * Binds the ILogger interface to the concrete Logger implementation.
   * 
   * @private
   * @returns void
   */
  private registerWithContainer(): void {
    // In a real implementation, this would register with the DI container
    // For now, we'll store it globally for access
    if (typeof globalThis !== 'undefined') {
      (globalThis as any).__tsvel_logger = this.logger;
    }
  }

  /**
   * Configures the logger based on application environment and settings.
   * Applies environment-specific logging configuration.
   * 
   * @private
   * @returns void
   */
  private configureLogger(): void {
    // Configure based on environment variables or config files
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isDevelopment) {
      // More verbose logging in development
      this.logger.setLevel(0); // DEBUG level
    } else if (isProduction) {
      // Less verbose logging in production
      this.logger.setLevel(2); // WARN level
    }
  }

  /**
   * Sets up global error handling to capture unhandled errors.
   * Ensures that critical errors are always logged.
   * 
   * @private
   * @returns void
   */
  private setupGlobalErrorHandling(): void {
    // Handle unhandled promise rejections
    if (typeof process !== 'undefined') {
      process.on('unhandledRejection', (reason, promise) => {
        this.logger.error('Unhandled Promise Rejection', {
          reason: reason instanceof Error ? reason.message : String(reason),
          stack: reason instanceof Error ? reason.stack : undefined,
          promise: promise.toString(),
        });
      });

      // Handle uncaught exceptions
      process.on('uncaughtException', (error) => {
        this.logger.error('Uncaught Exception', {
          message: error.message,
          stack: error.stack,
          name: error.name,
        });
      });
    }
  }

  /**
   * Determines the appropriate log level based on environment variables.
   * Provides sensible defaults for different environments.
   * 
   * @private
   * @returns number - The log level to use
   */
  private getLogLevelFromEnvironment(): number {
    const envLogLevel = process.env.LOG_LEVEL?.toUpperCase();
    
    switch (envLogLevel) {
      case 'DEBUG':
        return 0;
      case 'INFO':
        return 1;
      case 'WARN':
        return 2;
      case 'ERROR':
        return 3;
      default:
        // Default to INFO level
        return 1;
    }
  }
}

/**
 * Singleton instance of the logger service provider.
 * Provides convenient access to the service provider throughout the application.
 */
export const loggerServiceProvider = LoggerServiceProvider.getInstance();