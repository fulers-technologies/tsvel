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
    const fullMetadata: DecoratorMetadata = {
      ...metadata,
      registeredAt: new Date(),
    };

    const registration: DecoratorRegistration = {
      decorator,
      metadata: fullMetadata,
    };

    // Store by ID
    this.decorators.set(metadata.id, registration);

    // Index by type
    if (!this.decoratorsByType.has(metadata.type)) {
      this.decoratorsByType.set(metadata.type, new Set());
    }
    this.decoratorsByType.get(metadata.type)!.add(metadata.id);
  }

  /**
   * Retrieves a decorator by its ID.
   * 
   * @param id - The unique identifier of the decorator
   * @returns DecoratorRegistration | undefined - The decorator registration or undefined if not found
   */
  getDecorator(id: string): DecoratorRegistration | undefined {
    return this.decorators.get(id);
  }

  /**
   * Retrieves all decorators of a specific type.
   * 
   * @param type - The decorator type to filter by
   * @returns DecoratorRegistration[] - Array of decorator registrations of the specified type
   */
  getDecoratorsByType(type: DecoratorType): DecoratorRegistration[] {
    const ids = this.decoratorsByType.get(type) || new Set();
    return Array.from(ids)
      .map(id => this.decorators.get(id))
      .filter((registration): registration is DecoratorRegistration => registration !== undefined);
  }

  /**
   * Retrieves all registered decorators.
   * 
   * @returns DecoratorRegistration[] - Array of all decorator registrations
   */
  getAllDecorators(): DecoratorRegistration[] {
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
   * Gets statistics about the registry.
   * 
   * @returns RegistryStats - Statistics about registered decorators
   */
  getStats(): RegistryStats {
    const total = this.decorators.size;
    const enabled = Array.from(this.decorators.values())
      .filter(reg => reg.metadata.enabled).length;
    
    const byType: Record<string, number> = {};
    for (const [type, ids] of this.decoratorsByType.entries()) {
      byType[type] = ids.size;
    }

    return {
      total,
      enabled,
      disabled: total - enabled,
      byType,
    };
  }

  /**
   * Clears all decorators from the registry.
   * 
   * @returns void
   */
  clear(): void {
    this.decorators.clear();
    this.decoratorsByType.clear();
  }

  /**
   * Initializes the registry with default settings.
   * 
   * @private
   * @returns void
   */
  private initializeRegistry(): void {
    // Initialize with empty state
    // In a real implementation, this might load from cache or configuration
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
  total: number;
  
  /**
   * Number of enabled decorators.
   */
  enabled: number;
  
  /**
   * Number of disabled decorators.
   */
  disabled: number;
  
  /**
   * Count of decorators by type.
   */
  byType: Record<string, number>;
}