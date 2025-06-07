import { Container } from 'inversify';
import { IServiceProvider } from './interfaces/service-provider.interface';
import { IProviderConfig } from './interfaces/provider-config.interface';
import { IServiceProviderRegistry } from './interfaces/service-provider-registry.interface';
import { ServiceProviderRegistry } from './utilities/service-provider-registry';

/**
 * Main application class that manages service providers and application lifecycle.
 * Delegates provider management to the ServiceProviderRegistry for clean separation of concerns.
 * 
 * @class Application
 */
export class Application {
  /**
   * The dependency injection container.
   */
  public readonly container: Container;

  /**
   * The service provider registry that manages all provider operations.
   */
  private readonly providerRegistry: IServiceProviderRegistry;

  /**
   * Application configuration and metadata.
   */
  private readonly config: ApplicationConfig;

  /**
   * Application lifecycle state.
   */
  private state: ApplicationState = ApplicationState.CREATED;

  /**
   * Application statistics for monitoring and debugging.
   */
  private stats = {
    startTime: Date.now(),
    bootTime: 0,
    uptime: 0,
    requestCount: 0,
    errorCount: 0,
  };

  /**
   * Creates a new application instance.
   * 
   * @param container - Optional existing container to use
   * @param config - Optional application configuration
   */
  constructor(container?: Container, config: ApplicationConfig = {}) {
    this.container = container || new Container();
    this.config = { ...this.getDefaultConfig(), ...config };
    this.providerRegistry = ServiceProviderRegistry.make(this.container);
    this.setupApplication();
  }

  /**
   * Register a service provider with the application.
   * Delegates to the service provider registry for centralized management.
   * 
   * @param provider - The service provider to register
   * @param config - Optional configuration for the provider
   * @returns this - The application instance for method chaining
   */
  register(provider: IServiceProvider, config: IProviderConfig = {}): this {
    this.validateApplicationState([ApplicationState.CREATED, ApplicationState.REGISTERED]);
    
    try {
      this.providerRegistry.register(provider, config);
      this.state = ApplicationState.REGISTERED;
      
      // Log provider registration in development
      if (this.config.debug) {
        console.debug(`Registered provider: ${provider.constructor.name}`);
      }
      
      return this;
    } catch (error) {
      this.stats.errorCount++;
      throw new Error(`Failed to register provider: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Boot the application and all registered service providers.
   * Delegates to the service provider registry for provider booting.
   * 
   * @returns Promise<void>
   */
  async boot(): Promise<void> {
    this.validateApplicationState([ApplicationState.CREATED, ApplicationState.REGISTERED]);
    
    const startTime = Date.now();
    
    try {
      this.state = ApplicationState.BOOTING;
      
      // Boot all providers through the registry
      await this.providerRegistry.boot();
      
      this.state = ApplicationState.BOOTED;
      this.stats.bootTime = Date.now() - startTime;
      
      // Log boot completion
      if (this.config.debug) {
        console.debug(`Application booted in ${this.stats.bootTime}ms`);
      }
      
      // Emit boot event if event system is available
      this.emitEvent('application.booted', { bootTime: this.stats.bootTime });
      
    } catch (error) {
      this.state = ApplicationState.ERROR;
      this.stats.errorCount++;
      throw new Error(`Failed to boot application: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Terminate the application and clean up resources.
   * Delegates to the service provider registry for provider termination.
   * 
   * @returns Promise<void>
   */
  async terminate(): Promise<void> {
    if (this.state === ApplicationState.TERMINATING || this.state === ApplicationState.TERMINATED) {
      return;
    }

    try {
      this.state = ApplicationState.TERMINATING;
      
      // Emit termination event
      this.emitEvent('application.terminating');
      
      // Terminate all providers through the registry
      await this.providerRegistry.terminate();
      
      this.state = ApplicationState.TERMINATED;
      
      // Log termination completion
      if (this.config.debug) {
        console.debug('Application terminated successfully');
      }
      
      // Emit terminated event
      this.emitEvent('application.terminated');
      
    } catch (error) {
      this.state = ApplicationState.ERROR;
      this.stats.errorCount++;
      console.error('Error during application termination:', error);
    }
  }

  /**
   * Get a service from the container.
   * Delegates to the service provider registry for service resolution.
   * 
   * @template T
   * @param identifier - The service identifier
   * @returns T - The resolved service instance
   */
  get<T>(identifier: string | symbol): T {
    try {
      this.stats.requestCount++;
      return this.providerRegistry.resolve<T>(identifier);
    } catch (error) {
      this.stats.errorCount++;
      throw error;
    }
  }

  /**
   * Check if a service is bound in the container.
   * Delegates to the service provider registry for availability checking.
   * 
   * @param identifier - The service identifier
   * @returns boolean - True if the service is bound or can be resolved
   */
  isBound(identifier: string | symbol): boolean {
    return this.providerRegistry.canResolve(identifier);
  }

  /**
   * Get all registered providers.
   * Delegates to the service provider registry.
   * 
   * @returns IServiceProvider[] - Array of registered providers
   */
  getProviders(): IServiceProvider[] {
    return this.providerRegistry.getProviders();
  }

  /**
   * Get all deferred providers.
   * Delegates to the service provider registry.
   * 
   * @returns IDeferredServiceProvider[] - Array of deferred providers
   */
  getDeferredProviders() {
    return this.providerRegistry.getDeferredProviders();
  }

  /**
   * Get all terminable providers.
   * Delegates to the service provider registry.
   * 
   * @returns ITerminableServiceProvider[] - Array of terminable providers
   */
  getTerminableProviders() {
    return this.providerRegistry.getTerminableProviders();
  }

  /**
   * Check if the application has been booted.
   * 
   * @returns boolean - True if the application has been booted
   */
  isBooted(): boolean {
    return this.state === ApplicationState.BOOTED;
  }

  /**
   * Check if the application is terminating.
   * 
   * @returns boolean - True if the application is terminating
   */
  isTerminating(): boolean {
    return this.state === ApplicationState.TERMINATING;
  }

  /**
   * Get the current application state.
   * 
   * @returns ApplicationState - The current state
   */
  getState(): ApplicationState {
    return this.state;
  }

  /**
   * Get application configuration.
   * 
   * @returns ApplicationConfig - The application configuration
   */
  getConfig(): ApplicationConfig {
    return { ...this.config };
  }

  /**
   * Get application statistics.
   * 
   * @returns object - Application statistics
   */
  getStats(): typeof this.stats & { uptime: number } {
    return {
      ...this.stats,
      uptime: Date.now() - this.stats.startTime,
    };
  }

  /**
   * Get the service provider registry instance.
   * Provides access to the registry for advanced operations.
   * 
   * @returns IServiceProviderRegistry - The service provider registry
   */
  getProviderRegistry(): IServiceProviderRegistry {
    return this.providerRegistry;
  }

  /**
   * Setup the application with default bindings and configuration.
   * 
   * @private
   * @returns void
   */
  private setupApplication(): void {
    // Bind the application instance to the container
    this.container.bind<Application>('Application').toConstantValue(this);
    
    // Setup error handling
    this.setupErrorHandling();
    
    // Setup graceful shutdown
    this.setupGracefulShutdown();
    
    // Log application creation in development
    if (this.config.debug) {
      console.debug('Application instance created');
    }
  }

  /**
   * Setup error handling for the application.
   * 
   * @private
   * @returns void
   */
  private setupErrorHandling(): void {
    if (typeof process !== 'undefined') {
      // Handle unhandled promise rejections
      process.on('unhandledRejection', (reason, promise) => {
        this.stats.errorCount++;
        console.error('Unhandled Promise Rejection:', reason);
        this.emitEvent('application.error', { type: 'unhandledRejection', reason, promise });
      });

      // Handle uncaught exceptions
      process.on('uncaughtException', (error) => {
        this.stats.errorCount++;
        console.error('Uncaught Exception:', error);
        this.emitEvent('application.error', { type: 'uncaughtException', error });
      });
    }
  }

  /**
   * Setup graceful shutdown handling.
   * 
   * @private
   * @returns void
   */
  private setupGracefulShutdown(): void {
    if (typeof process !== 'undefined') {
      const signals = ['SIGTERM', 'SIGINT', 'SIGUSR2'];
      
      signals.forEach(signal => {
        process.on(signal, async () => {
          console.log(`Received ${signal}, starting graceful shutdown...`);
          await this.terminate();
          process.exit(0);
        });
      });
    }
  }

  /**
   * Validate the current application state against allowed states.
   * 
   * @private
   * @param allowedStates - Array of allowed states
   * @throws Error if the current state is not allowed
   */
  private validateApplicationState(allowedStates: ApplicationState[]): void {
    if (!allowedStates.includes(this.state)) {
      throw new Error(`Invalid application state: ${this.state}. Expected one of: ${allowedStates.join(', ')}`);
    }
  }

  /**
   * Emit an application event if event system is available.
   * 
   * @private
   * @param event - The event name
   * @param data - Optional event data
   */
  private emitEvent(event: string, data?: any): void {
    // In a real implementation, this would use an event emitter
    // For now, we just log in development mode
    if (this.config.debug) {
      console.debug(`Event: ${event}`, data || '');
    }
  }

  /**
   * Get default application configuration.
   * 
   * @private
   * @returns ApplicationConfig - Default configuration
   */
  private getDefaultConfig(): ApplicationConfig {
    return {
      debug: process.env.NODE_ENV === 'development',
      environment: process.env.NODE_ENV || 'development',
      name: 'TSVEL Application',
      version: '1.0.0',
      timezone: 'UTC',
      locale: 'en',
    };
  }

  /**
   * Create a new application instance.
   * Factory method following the framework's .make() pattern.
   * 
   * @static
   * @param container - Optional existing container to use
   * @param config - Optional application configuration
   * @returns Application - A new application instance
   */
  static make(container?: Container, config?: ApplicationConfig): Application {
    return new Application(container, config);
  }
}

/**
 * Application configuration interface.
 * 
 * @interface ApplicationConfig
 */
export interface ApplicationConfig {
  /**
   * Whether debug mode is enabled.
   */
  debug?: boolean;

  /**
   * The application environment.
   */
  environment?: string;

  /**
   * The application name.
   */
  name?: string;

  /**
   * The application version.
   */
  version?: string;

  /**
   * The application timezone.
   */
  timezone?: string;

  /**
   * The application locale.
   */
  locale?: string;

  /**
   * Additional custom configuration.
   */
  [key: string]: any;
}

/**
 * Application state enumeration.
 * 
 * @enum ApplicationState
 */
export enum ApplicationState {
  CREATED = 'created',
  REGISTERED = 'registered',
  BOOTING = 'booting',
  BOOTED = 'booted',
  TERMINATING = 'terminating',
  TERMINATED = 'terminated',
  ERROR = 'error',
}