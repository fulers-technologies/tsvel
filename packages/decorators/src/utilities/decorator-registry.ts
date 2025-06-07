import { DecoratorType, DecoratorRegistration, DecoratorMetadata } from '../interfaces/decorator.interface';

/**
 * Central registry for managing decorator registrations and metadata.
 * Provides a unified interface for registering, retrieving, and managing decorators.
 * 
 * @class DecoratorRegistry
 */
export class DecoratorRegistry {
  private static instance: DecoratorRegistry;
  private decorators = new Map<string, DecoratorRegistration>();
  private decoratorsByType = new Map<DecoratorType, Set<string>>();
  private decoratorsBySource = new Map<string, Set<string>>();
  
  /**
   * Statistics for monitoring registry usage.
   */
  private stats = {
    totalDecorators: 0,
    enabledDecorators: 0,
    disabledDecorators: 0,
    registrationCount: 0,
    lookupCount: 0,
  };

  /**
   * Private constructor to enforce singleton pattern.
   * Use DecoratorRegistry.getInstance() to access the instance.
   */
  private constructor() {
    this.initializeRegistry();
  }

  /**
   * Gets the singleton registry instance.
   * Creates one if it doesn't exist.
   * 
   * @returns DecoratorRegistry - The singleton registry instance
   */
  static getInstance(): DecoratorRegistry {
    if (!DecoratorRegistry.instance) {
      DecoratorRegistry.instance = new DecoratorRegistry();
    }
    return DecoratorRegistry.instance;
  }

  /**
   * Creates a new registry instance.
   * Factory method following the framework's .make() pattern.
   * 
   * @returns DecoratorRegistry - A new registry instance
   */
  static make(): DecoratorRegistry {
    return new DecoratorRegistry();
  }

  /**
   * Registers a decorator with the registry.
   * Stores the decorator function along with its metadata for later retrieval.
   * 
   * @param decorator - The decorator function to register
   * @param metadata - Metadata about the decorator
   * @returns void
   */
  registerDecorator(decorator: Function, metadata: Omit<DecoratorMetadata, 'registeredAt'>): void {
    if (!decorator || typeof decorator !== 'function') {
      throw new Error('Decorator must be a function');
    }

    if (!metadata.id || !metadata.type || !metadata.name) {
      throw new Error('Decorator metadata must include id, type, and name');
    }

    const fullMetadata: DecoratorMetadata = {
      ...metadata,
      registeredAt: new Date(),
    };

    const registration: DecoratorRegistration = {
      decorator,
      metadata: fullMetadata,
    };

    // Check for duplicate registration
    if (this.decorators.has(metadata.id)) {
      console.warn(`Decorator '${metadata.id}' is already registered. Overwriting existing registration.`);
    }

    // Store by ID
    this.decorators.set(metadata.id, registration);

    // Index by type
    if (!this.decoratorsByType.has(metadata.type)) {
      this.decoratorsByType.set(metadata.type, new Set());
    }
    this.decoratorsByType.get(metadata.type)!.add(metadata.id);

    // Index by source
    if (!this.decoratorsBySource.has(metadata.source)) {
      this.decoratorsBySource.set(metadata.source, new Set());
    }
    this.decoratorsBySource.get(metadata.source)!.add(metadata.id);

    // Update statistics
    this.stats.totalDecorators = this.decorators.size;
    this.stats.registrationCount++;
    
    if (metadata.enabled) {
      this.stats.enabledDecorators++;
    } else {
      this.stats.disabledDecorators++;
    }

    // Log registration in development
    if (process.env.NODE_ENV === 'development') {
      console.debug(`Registered decorator: ${metadata.id} (${metadata.type})`);
    }
  }

  /**
   * Retrieves a decorator by its ID.
   * 
   * @param id - The unique identifier of the decorator
   * @returns DecoratorRegistration | undefined - The decorator registration or undefined if not found
   */
  getDecorator(id: string): DecoratorRegistration | undefined {
    this.stats.lookupCount++;
    return this.decorators.get(id);
  }

  /**
   * Retrieves all decorators of a specific type.
   * 
   * @param type - The decorator type to filter by
   * @returns DecoratorRegistration[] - Array of decorator registrations of the specified type
   */
  getDecoratorsByType(type: DecoratorType): DecoratorRegistration[] {
    this.stats.lookupCount++;
    const ids = this.decoratorsByType.get(type) || new Set();
    return Array.from(ids)
      .map(id => this.decorators.get(id))
      .filter((registration): registration is DecoratorRegistration => registration !== undefined);
  }

  /**
   * Retrieves all decorators from a specific source.
   * 
   * @param source - The source to filter by
   * @returns DecoratorRegistration[] - Array of decorator registrations from the specified source
   */
  getDecoratorsBySource(source: string): DecoratorRegistration[] {
    this.stats.lookupCount++;
    const ids = this.decoratorsBySource.get(source) || new Set();
    return Array.from(ids)
      .map(id => this.decorators.get(id))
      .filter((registration): registration is DecoratorRegistration => registration !== undefined);
  }

  /**
   * Retrieves all enabled decorators.
   * 
   * @returns DecoratorRegistration[] - Array of enabled decorator registrations
   */
  getEnabledDecorators(): DecoratorRegistration[] {
    this.stats.lookupCount++;
    return Array.from(this.decorators.values()).filter(
      registration => registration.metadata.enabled
    );
  }

  /**
   * Retrieves all disabled decorators.
   * 
   * @returns DecoratorRegistration[] - Array of disabled decorator registrations
   */
  getDisabledDecorators(): DecoratorRegistration[] {
    this.stats.lookupCount++;
    return Array.from(this.decorators.values()).filter(
      registration => !registration.metadata.enabled
    );
  }

  /**
   * Retrieves all registered decorators.
   * 
   * @returns DecoratorRegistration[] - Array of all decorator registrations
   */
  getAllDecorators(): DecoratorRegistration[] {
    this.stats.lookupCount++;
    return Array.from(this.decorators.values());
  }

  /**
   * Checks if a decorator is registered.
   * 
   * @param id - The unique identifier of the decorator
   * @returns boolean - True if the decorator is registered, false otherwise
   */
  hasDecorator(id: string): boolean {
    return this.decorators.has(id);
  }

  /**
   * Unregisters a decorator from the registry.
   * 
   * @param id - The unique identifier of the decorator to remove
   * @returns boolean - True if the decorator was removed, false if it wasn't found
   */
  unregisterDecorator(id: string): boolean {
    const registration = this.decorators.get(id);
    if (!registration) {
      return false;
    }

    // Remove from main registry
    this.decorators.delete(id);

    // Remove from type index
    const typeSet = this.decoratorsByType.get(registration.metadata.type);
    if (typeSet) {
      typeSet.delete(id);
      if (typeSet.size === 0) {
        this.decoratorsByType.delete(registration.metadata.type);
      }
    }

    // Remove from source index
    const sourceSet = this.decoratorsBySource.get(registration.metadata.source);
    if (sourceSet) {
      sourceSet.delete(id);
      if (sourceSet.size === 0) {
        this.decoratorsBySource.delete(registration.metadata.source);
      }
    }

    // Update statistics
    this.updateStatistics();

    // Log unregistration in development
    if (process.env.NODE_ENV === 'development') {
      console.debug(`Unregistered decorator: ${id}`);
    }

    return true;
  }

  /**
   * Gets metadata for a specific decorator.
   * 
   * @param id - The unique identifier of the decorator
   * @returns DecoratorMetadata | undefined - The decorator metadata or undefined if not found
   */
  getDecoratorMetadata(id: string): DecoratorMetadata | undefined {
    const registration = this.decorators.get(id);
    return registration?.metadata;
  }

  /**
   * Updates metadata for an existing decorator.
   * 
   * @param id - The unique identifier of the decorator
   * @param updates - Partial metadata updates to apply
   * @returns boolean - True if the update was successful, false if decorator not found
   */
  updateDecoratorMetadata(id: string, updates: Partial<DecoratorMetadata>): boolean {
    const registration = this.decorators.get(id);
    if (!registration) {
      return false;
    }

    // Update metadata
    Object.assign(registration.metadata, updates);
    
    // Update statistics if enabled status changed
    if ('enabled' in updates) {
      this.updateStatistics();
    }

    // Log update in development
    if (process.env.NODE_ENV === 'development') {
      console.debug(`Updated decorator metadata: ${id}`);
    }

    return true;
  }

  /**
   * Enables or disables a decorator.
   * 
   * @param id - The unique identifier of the decorator
   * @param enabled - Whether the decorator should be enabled
   * @returns boolean - True if the update was successful, false if decorator not found
   */
  setDecoratorEnabled(id: string, enabled: boolean): boolean {
    return this.updateDecoratorMetadata(id, { enabled });
  }

  /**
   * Enables multiple decorators by ID.
   * 
   * @param ids - Array of decorator IDs to enable
   * @returns number - Number of decorators successfully enabled
   */
  enableDecorators(ids: string[]): number {
    let count = 0;
    for (const id of ids) {
      if (this.setDecoratorEnabled(id, true)) {
        count++;
      }
    }
    return count;
  }

  /**
   * Disables multiple decorators by ID.
   * 
   * @param ids - Array of decorator IDs to disable
   * @returns number - Number of decorators successfully disabled
   */
  disableDecorators(ids: string[]): number {
    let count = 0;
    for (const id of ids) {
      if (this.setDecoratorEnabled(id, false)) {
        count++;
      }
    }
    return count;
  }

  /**
   * Gets statistics about the registry.
   * 
   * @returns RegistryStats - Statistics about registered decorators
   */
  getStats(): RegistryStats {
    const byType: Record<string, number> = {};
    for (const [type, ids] of this.decoratorsByType.entries()) {
      byType[type] = ids.size;
    }

    const bySource: Record<string, number> = {};
    for (const [source, ids] of this.decoratorsBySource.entries()) {
      bySource[source] = ids.size;
    }

    return {
      ...this.stats,
      byType,
      bySource,
    };
  }

  /**
   * Searches decorators by name or description.
   * 
   * @param query - Search query
   * @returns DecoratorRegistration[] - Array of matching decorator registrations
   */
  searchDecorators(query: string): DecoratorRegistration[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.decorators.values()).filter(registration => {
      const metadata = registration.metadata;
      return (
        metadata.name.toLowerCase().includes(lowerQuery) ||
        (metadata.description && metadata.description.toLowerCase().includes(lowerQuery))
      );
    });
  }

  /**
   * Exports registry data for backup or transfer.
   * 
   * @returns object - Serializable registry data
   */
  exportRegistry(): any {
    const data = {
      decorators: Array.from(this.decorators.entries()).map(([id, registration]) => ({
        id,
        metadata: registration.metadata,
        // Note: Functions cannot be serialized, so we only export metadata
      })),
      stats: this.stats,
      exportedAt: new Date().toISOString(),
    };

    return data;
  }

  /**
   * Clears all decorators from the registry.
   * 
   * @returns void
   */
  clear(): void {
    this.decorators.clear();
    this.decoratorsByType.clear();
    this.decoratorsBySource.clear();
    
    this.stats = {
      totalDecorators: 0,
      enabledDecorators: 0,
      disabledDecorators: 0,
      registrationCount: 0,
      lookupCount: 0,
    };

    // Log clear operation in development
    if (process.env.NODE_ENV === 'development') {
      console.debug('Decorator registry cleared');
    }
  }

  /**
   * Initializes the registry with default settings.
   * 
   * @private
   * @returns void
   */
  private initializeRegistry(): void {
    // Initialize with empty state
    // In a production environment, this might load from cache or configuration
    
    // Set up error handling for decorator registration
    this.setupErrorHandling();
  }

  /**
   * Sets up error handling for the registry.
   * 
   * @private
   * @returns void
   */
  private setupErrorHandling(): void {
    // Handle uncaught errors during decorator registration
    if (typeof process !== 'undefined') {
      process.on('uncaughtException', (error) => {
        if (error.message.includes('decorator')) {
          console.error('Decorator registry error:', error);
        }
      });
    }
  }

  /**
   * Updates registry statistics.
   * 
   * @private
   * @returns void
   */
  private updateStatistics(): void {
    this.stats.totalDecorators = this.decorators.size;
    this.stats.enabledDecorators = 0;
    this.stats.disabledDecorators = 0;

    for (const registration of this.decorators.values()) {
      if (registration.metadata.enabled) {
        this.stats.enabledDecorators++;
      } else {
        this.stats.disabledDecorators++;
      }
    }
  }
}

/**
 * Statistics about the decorator registry.
 * 
 * @interface RegistryStats
 */
export interface RegistryStats {
  /**
   * Total number of registered decorators.
   */
  totalDecorators: number;
  
  /**
   * Number of enabled decorators.
   */
  enabledDecorators: number;
  
  /**
   * Number of disabled decorators.
   */
  disabledDecorators: number;

  /**
   * Total number of registration operations.
   */
  registrationCount: number;

  /**
   * Total number of lookup operations.
   */
  lookupCount: number;
  
  /**
   * Count of decorators by type.
   */
  byType: Record<string, number>;

  /**
   * Count of decorators by source.
   */
  bySource: Record<string, number>;
}