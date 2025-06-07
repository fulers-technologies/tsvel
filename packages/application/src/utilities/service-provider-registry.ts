import { Container } from 'inversify';
import { IServiceProvider } from '../interfaces/service-provider.interface';
import { IDeferredServiceProvider } from '../interfaces/deferred-service-provider.interface';
import { ITerminableServiceProvider } from '../interfaces/terminable-service-provider.interface';
import { IProviderConfig } from '../interfaces/provider-config.interface';
import { IServiceProviderRegistry } from '../interfaces/service-provider-registry.interface';

/**
 * Service provider registry that manages all provider operations.
 * Centralizes provider registration, booting, and lifecycle management.
 * 
 * @class ServiceProviderRegistry
 * @implements {IServiceProviderRegistry}
 */
export class ServiceProviderRegistry implements IServiceProviderRegistry {
  /**
   * The dependency injection container.
   */
  private readonly container: Container;

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
   * Indicates whether the registry has been booted.
   */
  private booted = false;

  /**
   * Indicates whether the registry is terminating.
   */
  private terminating = false;

  /**
   * Registry statistics for monitoring and debugging.
   */
  private stats = {
    totalProviders: 0,
    deferredProviders: 0,
    terminableProviders: 0,
    bootedProviders: 0,
    registrationTime: 0,
    bootTime: 0,
  };

  /**
   * Creates a new service provider registry instance.
   * 
   * @param container - The dependency injection container
   */
  constructor(container: Container) {
    this.container = container;
    this.setupContainerBindings();
  }

  /**
   * Register a service provider with the registry.
   * Handles provider classification and configuration.
   * 
   * @param provider - The service provider to register
   * @param config - Optional configuration for the provider
   * @returns this - The registry instance for method chaining
   */
  register(provider: IServiceProvider, config: IProviderConfig = {}): this {
    const startTime = Date.now();
    const providerName = provider.constructor.name;

    try {
      // Validate provider
      this.validateProvider(provider);

      // Store provider configuration
      this.providerConfigs.set(providerName, config);

      // Handle deferred providers
      if (this.isDeferredProvider(provider)) {
        this.deferredProviders.set(providerName, provider);
        this.stats.deferredProviders++;
        
        // Log deferred provider registration in development
        if (process.env.NODE_ENV === 'development') {
          console.debug(`Registered deferred provider: ${providerName}`);
        }
        
        return this;
      }

      // Register the provider
      this.providers.set(providerName, provider);
      this.stats.totalProviders++;

      // Handle terminable providers
      if (this.isTerminableProvider(provider)) {
        this.terminableProviders.set(providerName, provider);
        this.stats.terminableProviders++;
      }

      // Register services if not deferred
      if (!config.deferred) {
        provider.register();
        
        // Log provider registration in development
        if (process.env.NODE_ENV === 'development') {
          console.debug(`Registered provider: ${providerName}`);
        }
      }

      // Update registration time statistics
      this.stats.registrationTime += Date.now() - startTime;

      return this;
    } catch (error) {
      throw new Error(`Failed to register provider '${providerName}': ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Boot all registered service providers.
   * Handles provider sorting by priority and sequential booting.
   * 
   * @returns Promise<void>
   */
  async boot(): Promise<void> {
    if (this.booted) {
      return;
    }

    const startTime = Date.now();

    try {
      // Sort providers by priority
      const sortedProviders = this.getSortedProviders();

      // Boot all registered providers
      for (const provider of sortedProviders) {
        await this.bootProvider(provider);
      }

      this.booted = true;
      this.stats.bootTime = Date.now() - startTime;

      // Log boot completion in development
      if (process.env.NODE_ENV === 'development') {
        console.debug(`Booted ${sortedProviders.length} providers in ${this.stats.bootTime}ms`);
      }
    } catch (error) {
      throw new Error(`Failed to boot providers: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Terminate all terminable service providers.
   * Handles graceful shutdown and resource cleanup.
   * 
   * @returns Promise<void>
   */
  async terminate(): Promise<void> {
    if (this.terminating) {
      return;
    }

    this.terminating = true;

    try {
      // Terminate all terminable providers in parallel
      const terminationPromises = Array.from(this.terminableProviders.values()).map(
        async (provider) => {
          try {
            await provider.terminate();
            
            // Log provider termination in development
            if (process.env.NODE_ENV === 'development') {
              console.debug(`Terminated provider: ${provider.constructor.name}`);
            }
          } catch (error) {
            console.error(`Error terminating provider ${provider.constructor.name}:`, error);
          }
        }
      );

      await Promise.all(terminationPromises);

      // Log termination completion in development
      if (process.env.NODE_ENV === 'development') {
        console.debug(`Terminated ${this.terminableProviders.size} providers`);
      }
    } catch (error) {
      console.error('Error during provider termination:', error);
    }
  }

  /**
   * Get a service from the container with deferred provider loading.
   * Automatically loads deferred providers if needed.
   * 
   * @template T
   * @param identifier - The service identifier
   * @returns T - The resolved service instance
   */
  resolve<T>(identifier: string | symbol): T {
    try {
      // Check if we need to load a deferred provider
      this.loadDeferredProviderIfNeeded(identifier);

      return this.container.get<T>(identifier);
    } catch (error) {
      throw new Error(`Failed to resolve service '${String(identifier)}': ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Check if a service is available (including deferred providers).
   * 
   * @param identifier - The service identifier
   * @returns boolean - True if the service is available
   */
  canResolve(identifier: string | symbol): boolean {
    // Check if already bound
    if (this.container.isBound(identifier)) {
      return true;
    }

    // Check if any deferred provider provides this service
    for (const provider of this.deferredProviders.values()) {
      if (provider.providesService(identifier)) {
        return true;
      }
    }

    return false;
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
   * Check if the registry has been booted.
   * 
   * @returns boolean - True if the registry has been booted
   */
  isBooted(): boolean {
    return this.booted;
  }

  /**
   * Check if the registry is terminating.
   * 
   * @returns boolean - True if the registry is terminating
   */
  isTerminating(): boolean {
    return this.terminating;
  }

  /**
   * Clear all providers from the registry.
   * Resets the registry to its initial state.
   * 
   * @returns void
   */
  clear(): void {
    this.providers.clear();
    this.deferredProviders.clear();
    this.terminableProviders.clear();
    this.providerConfigs.clear();
    
    this.booted = false;
    this.terminating = false;
    
    this.stats = {
      totalProviders: 0,
      deferredProviders: 0,
      terminableProviders: 0,
      bootedProviders: 0,
      registrationTime: 0,
      bootTime: 0,
    };

    // Log registry clear in development
    if (process.env.NODE_ENV === 'development') {
      console.debug('Service provider registry cleared');
    }
  }

  /**
   * Get registry statistics for monitoring and debugging.
   * 
   * @returns object - Registry statistics
   */
  getStats(): typeof this.stats {
    return { ...this.stats };
  }

  /**
   * Setup container bindings for the registry.
   * Binds the registry and container to themselves for dependency injection.
   * 
   * @private
   * @returns void
   */
  private setupContainerBindings(): void {
    // Bind the registry itself
    this.container.bind<IServiceProviderRegistry>('ServiceProviderRegistry').toConstantValue(this);
    
    // Bind the container
    this.container.bind<Container>('Container').toConstantValue(this.container);
  }

  /**
   * Validate a service provider before registration.
   * Ensures the provider implements the required interface.
   * 
   * @private
   * @param provider - The provider to validate
   * @returns void
   * @throws Error if the provider is invalid
   */
  private validateProvider(provider: IServiceProvider): void {
    if (!provider) {
      throw new Error('Provider cannot be null or undefined');
    }

    if (typeof provider.register !== 'function') {
      throw new Error('Provider must implement register() method');
    }

    if (typeof provider.boot !== 'function') {
      throw new Error('Provider must implement boot() method');
    }

    // Validate deferred provider interface
    if (this.isDeferredProvider(provider)) {
      if (!Array.isArray(provider.provides)) {
        throw new Error('Deferred provider must have provides array');
      }

      if (typeof provider.providesService !== 'function') {
        throw new Error('Deferred provider must implement providesService() method');
      }

      if (typeof provider.isLoaded !== 'function') {
        throw new Error('Deferred provider must implement isLoaded() method');
      }
    }

    // Validate terminable provider interface
    if (this.isTerminableProvider(provider)) {
      if (typeof provider.terminate !== 'function') {
        throw new Error('Terminable provider must implement terminate() method');
      }
    }
  }

  /**
   * Boot a single provider with error handling.
   * 
   * @private
   * @param provider - The provider to boot
   * @returns Promise<void>
   */
  private async bootProvider(provider: IServiceProvider): Promise<void> {
    try {
      await provider.boot();
      this.stats.bootedProviders++;
      
      // Log provider boot in development
      if (process.env.NODE_ENV === 'development') {
        console.debug(`Booted provider: ${provider.constructor.name}`);
      }
    } catch (error) {
      throw new Error(`Failed to boot provider '${provider.constructor.name}': ${error instanceof Error ? error.message : String(error)}`);
    }
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
   * Higher priority providers are booted first.
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
        try {
          // Move from deferred to regular providers
          this.deferredProviders.delete(name);
          this.providers.set(name, provider);
          this.stats.deferredProviders--;
          this.stats.totalProviders++;

          // Register and boot the provider
          provider.register();
          if (this.booted) {
            provider.boot();
          }

          // Handle terminable providers
          if (this.isTerminableProvider(provider)) {
            this.terminableProviders.set(name, provider);
            this.stats.terminableProviders++;
          }

          // Log deferred provider loading in development
          if (process.env.NODE_ENV === 'development') {
            console.debug(`Loaded deferred provider: ${name} for service: ${String(identifier)}`);
          }

          break;
        } catch (error) {
          console.error(`Failed to load deferred provider '${name}':`, error);
        }
      }
    }
  }

  /**
   * Create a new service provider registry instance.
   * Factory method following the framework's .make() pattern.
   * 
   * @static
   * @param container - The dependency injection container
   * @returns ServiceProviderRegistry - A new registry instance
   */
  static make(container: Container): ServiceProviderRegistry {
    return new ServiceProviderRegistry(container);
  }
}