import { BaseServiceProvider } from '@tsvel/application';
import { Metadata } from '../metadata';
import { MetadataStorage } from '../utilities/metadata-storage';
import { MetadataReflector } from '../utilities/metadata-reflector';

/**
 * Service provider for metadata functionality.
 * Manages registration and configuration of metadata services within the application.
 * 
 * @class MetadataServiceProvider
 * @extends {BaseServiceProvider}
 */
export class MetadataServiceProvider extends BaseServiceProvider {
  /**
   * Register the metadata service with the application container.
   * Sets up metadata system and bindings.
   * 
   * @returns void
   */
  register(): void {
    // Register metadata storage
    this.singleton<MetadataStorage>('MetadataStorage', MetadataStorage);
    
    // Register metadata reflector
    this.singleton<MetadataReflector>('MetadataReflector', MetadataReflector);
    
    // Register metadata facade
    this.bind<typeof Metadata>('Metadata', () => Metadata);
    
    // Register metadata factory for creating reflector instances
    this.bind<() => MetadataReflector>('MetadataReflectorFactory', () => {
      return () => new MetadataReflector();
    });
  }

  /**
   * Boot the metadata service after all services are registered.
   * Performs any initialization that requires other services to be available.
   * 
   * @returns void
   */
  boot(): void {
    // Initialize metadata system
    this.initializeMetadata();
    
    // Set up Reflect polyfill if needed
    this.setupReflectPolyfill();
  }

  /**
   * Initialize metadata system with default configuration.
   * Sets up the metadata storage and reflector.
   * 
   * @private
   * @returns void
   */
  private initializeMetadata(): void {
    // Set up default storage if needed
    if (!Metadata.getStorage()) {
      const storage = this.resolve<MetadataStorage>('MetadataStorage');
      Metadata.setStorage(storage);
    }
  }

  /**
   * Set up Reflect metadata polyfill if needed.
   * Ensures that metadata functionality is available in all environments.
   * 
   * @private
   * @returns void
   */
  private setupReflectPolyfill(): void {
    if (typeof Reflect === 'undefined') {
      // Create a minimal Reflect polyfill
      (global as any).Reflect = {
        defineMetadata: Metadata.define.bind(Metadata),
        getMetadata: Metadata.get.bind(Metadata),
        hasMetadata: Metadata.has.bind(Metadata),
        deleteMetadata: Metadata.delete.bind(Metadata),
        getMetadataKeys: Metadata.getKeys.bind(Metadata),
        getOwnMetadata: Metadata.getOwn.bind(Metadata),
        getOwnMetadataKeys: Metadata.getOwnKeys.bind(Metadata),
      };
    }
  }
}

/**
 * Singleton instance of the metadata service provider.
 * Provides convenient access to the service provider throughout the application.
 */
export const metadataServiceProvider = new MetadataServiceProvider(null as any);