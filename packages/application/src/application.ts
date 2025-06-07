import { Container } from 'inversify';
import { IServiceProvider } from './interfaces/service-provider.interface';
import { IDeferredServiceProvider } from './interfaces/deferred-service-provider.interface';
import { ITerminableServiceProvider } from './interfaces/terminable-service-provider.interface';
import { IProviderConfig } from './interfaces/provider-config.interface';

/**
 * Main application class that manages service providers and application lifecycle.
 * Provides dependency injection container and service provider registration.
 * 
 * @class Application
 */
export class Application {
  /**
   * The dependency injection container.
   */
  public readonly container: Container;

  /**
   * Registered service providers.
   */
  private providers: Map<string, IServiceProvider> = new Map();

  /**
   * Deferred service providers.
   */
  private deferredProviders: Map<string, IDeferredServiceProvider> = new Map();

  /**
   * Terminable service providers.
   */
  private terminableProviders: Map<string, ITerminableServiceProvider> = new Map();

  /**
   * Provider configurations.
   */
  private providerConfigs: Map<string, IProviderConfig> = new Map();

  /**
   * Indicates whether the application has been booted.
   */
  private booted = false;

  /**
   * Indicates whether the application is terminating.
   */
  private terminating = false;

  /**
   * Creates a new application instance.
   * 
   * @param container - Optional existing container to use
   */
  constructor(container?: Container) {
    this.container = container || new Container();
    this.setupContainer();
  }

  /**
   * Register a service provider with the application.
   * 
   * @param provider - The service provider to register
   * @param config - Optional configuration for the provider
   * @returns this - The application instance for method chaining
   */
  register(provider: IServiceProvider, config: IProviderConfig = {}): this {
    const providerName = provider.constructor.name;

    // Store provider configuration
    this.providerConfigs.set(providerName, config);

    // Handle deferred providers
    if (this.isDeferredProvider(provider)) {
      this.deferredProviders.set(providerName, provider);
      return this;
    }

    // Register the provider
    this.providers.set(providerName, provider);

    // Handle terminable providers
    if (this.isTerminableProvider(provider)) {
      this.terminableProviders.set(providerName, provider);
    }

    // Register services if not deferred
    if (!config.deferred) {
      provider.register();
    }

    return this;
  }

  /**
   * Boot all registered service providers.
   * 
   * @returns Promise<void>
   */
  async boot(): Promise<void> {
    if (this.booted) {
      return;
    }

    // Sort providers by priority
    const sortedProviders = this.getSortedProviders();

    // Boot all registered providers
    for (const provider of sortedProviders) {
      await provider.boot();
    }

    this.booted = true;
  }

  /**
   * Terminate the application and clean up resources.
   * 
   * @returns Promise<void>
   */
  async terminate(): Promise<void> {
    if (this.terminating) {
      return;
    }

    this.terminating = true;

    // Terminate all terminable providers
    const terminationPromises = Array.from(this.terminableProviders.values()).map(
      async (provider) => {
        try {
          await provider.terminate();
        } catch (error) {
          console.error(`Error terminating provider ${provider.constructor.name}:`, error);
        }
      }
    );

    await Promise.all(terminationPromises);
  }

  /**
   * Get a service from the container.
   * Automatically loads deferred providers if needed.
   * 
   * @template T
   * @param identifier - The service identifier
   * @returns T - The resolved service instance
   */
  get<T>(identifier: string | symbol): T {
    // Check if we need to load a deferred provider
    this.loadDeferredProviderIfNeeded(identifier);

    return this.container.get<T>(identifier);
  }

  /**
   * Check if a service is bound in the container.
   * 
   * @param identifier - The service identifier
   * @returns boolean - True if the service is bound
   */
  isBound(identifier: string | symbol): boolean {
    return this.container.isBound(identifier);
  }

  /**
   * Get all registered providers.
   * 
   * @returns IServiceProvider[] - Array of registered providers
   */
  getProviders(): IServiceProvider[] {
    return Array.from(this.providers.values());
  }

  /**
   * Get all deferred providers.
   * 
   * @returns IDeferredServiceProvider[] - Array of deferred providers
   */
  getDeferredProviders(): IDeferredServiceProvider[] {
    return Array.from(this.deferredProviders.values());
  }

  /**
   * Get all terminable providers.
   * 
   * @returns ITerminableServiceProvider[] - Array of terminable providers
   */
  getTerminableProviders(): ITerminableServiceProvider[] {
    return Array.from(this.terminableProviders.values());
  }

  /**
   * Check if the application has been booted.
   * 
   * @returns boolean - True if the application has been booted
   */
  isBooted(): boolean {
    return this.booted;
  }

  /**
   * Check if the application is terminating.
   * 
   * @returns boolean - True if the application is terminating
   */
  isTerminating(): boolean {
    return this.terminating;
  }

  /**
   * Setup the container with default bindings.
   * 
   * @private
   * @returns void
   */
  private setupContainer(): void {
    // Bind the application instance to the container
    this.container.bind<Application>('Application').toConstantValue(this);
    this.container.bind<Container>('Container').toConstantValue(this.container);
  }

  /**
   * Check if a provider is a deferred provider.
   * 
   * @private
   * @param provider - The provider to check
   * @returns boolean - True if the provider is deferred
   */
  private isDeferredProvider(provider: IServiceProvider): provider is IDeferredServiceProvider {
    return 'isDeferred' in provider && provider.isDeferred === true;
  }

  /**
   * Check if a provider is a terminable provider.
   * 
   * @private
   * @param provider - The provider to check
   * @returns boolean - True if the provider is terminable
   */
  private isTerminableProvider(provider: IServiceProvider): provider is ITerminableServiceProvider {
    return 'isTerminable' in provider && provider.isTerminable === true;
  }

  /**
   * Get providers sorted by priority.
   * 
   * @private
   * @returns IServiceProvider[] - Sorted array of providers
   */
  private getSortedProviders(): IServiceProvider[] {
    const providers = Array.from(this.providers.values());
    
    return providers.sort((a, b) => {
      const configA = this.providerConfigs.get(a.constructor.name);
      const configB = this.providerConfigs.get(b.constructor.name);
      
      const priorityA = configA?.priority || 0;
      const priorityB = configB?.priority || 0;
      
      return priorityB - priorityA; // Higher priority first
    });
  }

  /**
   * Load a deferred provider if it provides the requested service.
   * 
   * @private
   * @param identifier - The service identifier
   * @returns void
   */
  private loadDeferredProviderIfNeeded(identifier: string | symbol): void {
    for (const [name, provider] of this.deferredProviders.entries()) {
      if (provider.providesService(identifier) && !provider.isLoaded()) {
        // Move from deferred to regular providers
        this.deferredProviders.delete(name);
        this.providers.set(name, provider);

        // Register and boot the provider
        provider.register();
        if (this.booted) {
          provider.boot();
        }

        // Handle terminable providers
        if (this.isTerminableProvider(provider)) {
          this.terminableProviders.set(name, provider);
        }

        break;
      }
    }
  }
}