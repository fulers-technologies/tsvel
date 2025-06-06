/**
 * Service provider for metadata functionality
 */
import { Metadata } from '../metadata';
import { MetadataStorage } from '../utilities/metadata-storage';
import { MetadataReflector } from '../utilities/metadata-reflector';

export class MetadataServiceProvider {
  private static instance: MetadataServiceProvider;

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): MetadataServiceProvider {
    if (!MetadataServiceProvider.instance) {
      MetadataServiceProvider.instance = new MetadataServiceProvider();
    }
    return MetadataServiceProvider.instance;
  }

  /**
   * Register the metadata service
   */
  register(): void {
    // Initialize metadata system
    this.initializeMetadata();
  }

  /**
   * Boot the metadata service
   */
  boot(): void {
    // Perform any boot-time initialization
    this.setupReflectPolyfill();
  }

  /**
   * Initialize metadata system
   */
  private initializeMetadata(): void {
    // Set up default storage if needed
    if (!Metadata.getStorage()) {
      Metadata.setStorage(new MetadataStorage());
    }
  }

  /**
   * Set up Reflect metadata polyfill if needed
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

  /**
   * Get metadata instance
   */
  getMetadata(): typeof Metadata {
    return Metadata;
  }

  /**
   * Get metadata storage
   */
  getStorage() {
    return Metadata.getStorage();
  }

  /**
   * Get metadata reflector
   */
  getReflector() {
    return Metadata.getReflector();
  }

  /**
   * Create a new metadata reflector instance
   */
  createReflector(): MetadataReflector {
    return new MetadataReflector();
  }
}

// Export singleton instance
export const metadataServiceProvider = MetadataServiceProvider.getInstance();