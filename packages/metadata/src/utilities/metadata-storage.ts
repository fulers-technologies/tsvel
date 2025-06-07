/**
 * Default metadata storage implementation using WeakMap for memory efficiency
 */
import { IMetadataStorage } from '../interfaces/metadata-storage.interface';

export class MetadataStorage implements IMetadataStorage {
  private readonly targetMetadata = new WeakMap<any, Map<string | symbol, any>>();
  private readonly targetPropertyMetadata = new WeakMap<any, Map<string | symbol, Map<string | symbol, any>>>();
  
  /**
   * Statistics for monitoring storage usage.
   */
  private stats = {
    totalTargets: 0,
    totalProperties: 0,
    totalMetadataEntries: 0,
    operations: {
      set: 0,
      get: 0,
      delete: 0,
      clear: 0,
    },
  };

  /**
   * Set metadata for a target
   */
  set(metadataKey: string | symbol, metadataValue: any, target: any, propertyKey?: string | symbol): void {
    try {
      this.stats.operations.set++;

      if (propertyKey !== undefined) {
        this.setPropertyMetadata(metadataKey, metadataValue, target, propertyKey);
      } else {
        this.setTargetMetadata(metadataKey, metadataValue, target);
      }

      this.stats.totalMetadataEntries++;
    } catch (error) {
      throw new Error(`Failed to set metadata '${String(metadataKey)}': ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get metadata for a target
   */
  get(metadataKey: string | symbol, target: any, propertyKey?: string | symbol): any {
    try {
      this.stats.operations.get++;

      if (propertyKey !== undefined) {
        return this.getPropertyMetadata(metadataKey, target, propertyKey);
      } else {
        return this.getTargetMetadata(metadataKey, target);
      }
    } catch (error) {
      console.warn(`Failed to get metadata '${String(metadataKey)}':`, error);
      return undefined;
    }
  }

  /**
   * Check if metadata exists for a target
   */
  has(metadataKey: string | symbol, target: any, propertyKey?: string | symbol): boolean {
    try {
      if (propertyKey !== undefined) {
        return this.hasPropertyMetadata(metadataKey, target, propertyKey);
      } else {
        return this.hasTargetMetadata(metadataKey, target);
      }
    } catch (error) {
      console.warn(`Failed to check metadata '${String(metadataKey)}':`, error);
      return false;
    }
  }

  /**
   * Delete metadata for a target
   */
  delete(metadataKey: string | symbol, target: any, propertyKey?: string | symbol): boolean {
    try {
      this.stats.operations.delete++;

      const result = propertyKey !== undefined
        ? this.deletePropertyMetadata(metadataKey, target, propertyKey)
        : this.deleteTargetMetadata(metadataKey, target);

      if (result) {
        this.stats.totalMetadataEntries--;
      }

      return result;
    } catch (error) {
      console.warn(`Failed to delete metadata '${String(metadataKey)}':`, error);
      return false;
    }
  }

  /**
   * Get all metadata keys for a target
   */
  getKeys(target: any, propertyKey?: string | symbol): (string | symbol)[] {
    try {
      if (propertyKey !== undefined) {
        return this.getPropertyMetadataKeys(target, propertyKey);
      } else {
        return this.getTargetMetadataKeys(target);
      }
    } catch (error) {
      console.warn('Failed to get metadata keys:', error);
      return [];
    }
  }

  /**
   * Get own metadata (not inherited)
   */
  getOwn(metadataKey: string | symbol, target: any, propertyKey?: string | symbol): any {
    // For this implementation, we don't support inheritance, so getOwn is the same as get
    return this.get(metadataKey, target, propertyKey);
  }

  /**
   * Get own metadata keys (not inherited)
   */
  getOwnKeys(target: any, propertyKey?: string | symbol): (string | symbol)[] {
    // For this implementation, we don't support inheritance, so getOwnKeys is the same as getKeys
    return this.getKeys(target, propertyKey);
  }

  /**
   * Clear all metadata for a target
   */
  clear(target: any, propertyKey?: string | symbol): void {
    try {
      this.stats.operations.clear++;

      if (propertyKey !== undefined) {
        this.clearPropertyMetadata(target, propertyKey);
      } else {
        this.clearTargetMetadata(target);
      }
    } catch (error) {
      console.warn('Failed to clear metadata:', error);
    }
  }

  /**
   * Get all stored metadata entries
   */
  getAll(): Map<any, Map<string | symbol, any>> {
    // WeakMap doesn't support iteration, so we return an empty Map
    // In a real implementation with different storage, this would return actual data
    console.warn('getAll() is not supported with WeakMap storage. Consider using a different storage implementation for this feature.');
    return new Map();
  }

  /**
   * Clear all stored metadata
   */
  clearAll(): void {
    // WeakMap doesn't support clearing all entries
    // The garbage collector will handle cleanup when targets are no longer referenced
    console.warn('clearAll() is not supported with WeakMap storage. Metadata will be garbage collected when targets are no longer referenced.');
    
    // Reset statistics
    this.stats = {
      totalTargets: 0,
      totalProperties: 0,
      totalMetadataEntries: 0,
      operations: {
        set: 0,
        get: 0,
        delete: 0,
        clear: 0,
      },
    };
  }

  /**
   * Get storage statistics.
   * 
   * @returns object - Storage statistics
   */
  getStats(): typeof this.stats {
    return { ...this.stats };
  }

  /**
   * Reset storage statistics.
   * 
   * @returns void
   */
  resetStats(): void {
    this.stats.operations = {
      set: 0,
      get: 0,
      delete: 0,
      clear: 0,
    };
  }

  // Private methods for target metadata

  private setTargetMetadata(metadataKey: string | symbol, metadataValue: any, target: any): void {
    if (!target) {
      throw new Error('Target cannot be null or undefined');
    }

    let metadata = this.targetMetadata.get(target);
    if (!metadata) {
      metadata = new Map();
      this.targetMetadata.set(target, metadata);
      this.stats.totalTargets++;
    }
    
    const hadKey = metadata.has(metadataKey);
    metadata.set(metadataKey, metadataValue);
    
    // Log metadata setting in development
    if (process.env.NODE_ENV === 'development') {
      console.debug(`Set metadata '${String(metadataKey)}' on target ${target.constructor?.name || 'unknown'}`);
    }
  }

  private getTargetMetadata(metadataKey: string | symbol, target: any): any {
    if (!target) {
      return undefined;
    }

    const metadata = this.targetMetadata.get(target);
    if (!metadata) {
      return undefined;
    }
    return metadata.get(metadataKey);
  }

  private hasTargetMetadata(metadataKey: string | symbol, target: any): boolean {
    if (!target) {
      return false;
    }

    const metadata = this.targetMetadata.get(target);
    if (!metadata) {
      return false;
    }
    return metadata.has(metadataKey);
  }

  private deleteTargetMetadata(metadataKey: string | symbol, target: any): boolean {
    if (!target) {
      return false;
    }

    const metadata = this.targetMetadata.get(target);
    if (!metadata) {
      return false;
    }
    
    const result = metadata.delete(metadataKey);
    
    // Clean up empty metadata maps
    if (metadata.size === 0) {
      this.targetMetadata.delete(target);
      this.stats.totalTargets--;
    }
    
    return result;
  }

  private getTargetMetadataKeys(target: any): (string | symbol)[] {
    if (!target) {
      return [];
    }

    const metadata = this.targetMetadata.get(target);
    if (!metadata) {
      return [];
    }
    return Array.from(metadata.keys());
  }

  private clearTargetMetadata(target: any): void {
    if (!target) {
      return;
    }

    const metadata = this.targetMetadata.get(target);
    if (metadata) {
      this.stats.totalMetadataEntries -= metadata.size;
      this.targetMetadata.delete(target);
      this.stats.totalTargets--;
    }
  }

  // Private methods for property metadata

  private setPropertyMetadata(metadataKey: string | symbol, metadataValue: any, target: any, propertyKey: string | symbol): void {
    if (!target) {
      throw new Error('Target cannot be null or undefined');
    }

    let properties = this.targetPropertyMetadata.get(target);
    if (!properties) {
      properties = new Map();
      this.targetPropertyMetadata.set(target, properties);
    }

    let metadata = properties.get(propertyKey);
    if (!metadata) {
      metadata = new Map();
      properties.set(propertyKey, metadata);
      this.stats.totalProperties++;
    }

    metadata.set(metadataKey, metadataValue);
    
    // Log property metadata setting in development
    if (process.env.NODE_ENV === 'development') {
      console.debug(`Set property metadata '${String(metadataKey)}' on ${target.constructor?.name || 'unknown'}.${String(propertyKey)}`);
    }
  }

  private getPropertyMetadata(metadataKey: string | symbol, target: any, propertyKey: string | symbol): any {
    if (!target) {
      return undefined;
    }

    const properties = this.targetPropertyMetadata.get(target);
    if (!properties) {
      return undefined;
    }

    const metadata = properties.get(propertyKey);
    if (!metadata) {
      return undefined;
    }

    return metadata.get(metadataKey);
  }

  private hasPropertyMetadata(metadataKey: string | symbol, target: any, propertyKey: string | symbol): boolean {
    if (!target) {
      return false;
    }

    const properties = this.targetPropertyMetadata.get(target);
    if (!properties) {
      return false;
    }

    const metadata = properties.get(propertyKey);
    if (!metadata) {
      return false;
    }

    return metadata.has(metadataKey);
  }

  private deletePropertyMetadata(metadataKey: string | symbol, target: any, propertyKey: string | symbol): boolean {
    if (!target) {
      return false;
    }

    const properties = this.targetPropertyMetadata.get(target);
    if (!properties) {
      return false;
    }

    const metadata = properties.get(propertyKey);
    if (!metadata) {
      return false;
    }

    const result = metadata.delete(metadataKey);
    
    // Clean up empty metadata maps
    if (metadata.size === 0) {
      properties.delete(propertyKey);
      this.stats.totalProperties--;
      
      if (properties.size === 0) {
        this.targetPropertyMetadata.delete(target);
      }
    }
    
    return result;
  }

  private getPropertyMetadataKeys(target: any, propertyKey: string | symbol): (string | symbol)[] {
    if (!target) {
      return [];
    }

    const properties = this.targetPropertyMetadata.get(target);
    if (!properties) {
      return [];
    }

    const metadata = properties.get(propertyKey);
    if (!metadata) {
      return [];
    }

    return Array.from(metadata.keys());
  }

  private clearPropertyMetadata(target: any, propertyKey: string | symbol): void {
    if (!target) {
      return;
    }

    const properties = this.targetPropertyMetadata.get(target);
    if (!properties) {
      return;
    }

    const metadata = properties.get(propertyKey);
    if (metadata) {
      this.stats.totalMetadataEntries -= metadata.size;
      properties.delete(propertyKey);
      this.stats.totalProperties--;
      
      if (properties.size === 0) {
        this.targetPropertyMetadata.delete(target);
      }
    }
  }
}