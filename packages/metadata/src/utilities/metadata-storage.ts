/**
 * Default metadata storage implementation using WeakMap for memory efficiency
 */
import { IMetadataStorage } from '../interfaces/metadata-storage.interface';

export class MetadataStorage implements IMetadataStorage {
  private readonly targetMetadata = new WeakMap<any, Map<string | symbol, any>>();
  private readonly targetPropertyMetadata = new WeakMap<any, Map<string | symbol, Map<string | symbol, any>>>();

  /**
   * Set metadata for a target
   */
  set(metadataKey: string | symbol, metadataValue: any, target: any, propertyKey?: string | symbol): void {
    if (propertyKey !== undefined) {
      this.setPropertyMetadata(metadataKey, metadataValue, target, propertyKey);
    } else {
      this.setTargetMetadata(metadataKey, metadataValue, target);
    }
  }

  /**
   * Get metadata for a target
   */
  get(metadataKey: string | symbol, target: any, propertyKey?: string | symbol): any {
    if (propertyKey !== undefined) {
      return this.getPropertyMetadata(metadataKey, target, propertyKey);
    } else {
      return this.getTargetMetadata(metadataKey, target);
    }
  }

  /**
   * Check if metadata exists for a target
   */
  has(metadataKey: string | symbol, target: any, propertyKey?: string | symbol): boolean {
    if (propertyKey !== undefined) {
      return this.hasPropertyMetadata(metadataKey, target, propertyKey);
    } else {
      return this.hasTargetMetadata(metadataKey, target);
    }
  }

  /**
   * Delete metadata for a target
   */
  delete(metadataKey: string | symbol, target: any, propertyKey?: string | symbol): boolean {
    if (propertyKey !== undefined) {
      return this.deletePropertyMetadata(metadataKey, target, propertyKey);
    } else {
      return this.deleteTargetMetadata(metadataKey, target);
    }
  }

  /**
   * Get all metadata keys for a target
   */
  getKeys(target: any, propertyKey?: string | symbol): (string | symbol)[] {
    if (propertyKey !== undefined) {
      return this.getPropertyMetadataKeys(target, propertyKey);
    } else {
      return this.getTargetMetadataKeys(target);
    }
  }

  /**
   * Get own metadata (not inherited)
   */
  getOwn(metadataKey: string | symbol, target: any, propertyKey?: string | symbol): any {
    // For now, same as get since we don't implement inheritance
    return this.get(metadataKey, target, propertyKey);
  }

  /**
   * Get own metadata keys (not inherited)
   */
  getOwnKeys(target: any, propertyKey?: string | symbol): (string | symbol)[] {
    // For now, same as getKeys since we don't implement inheritance
    return this.getKeys(target, propertyKey);
  }

  /**
   * Clear all metadata for a target
   */
  clear(target: any, propertyKey?: string | symbol): void {
    if (propertyKey !== undefined) {
      this.clearPropertyMetadata(target, propertyKey);
    } else {
      this.clearTargetMetadata(target);
    }
  }

  /**
   * Get all stored metadata entries
   */
  getAll(): Map<any, Map<string | symbol, any>> {
    // Note: WeakMap doesn't support iteration, so this returns an empty Map
    // In a real implementation, you might want to use a different storage mechanism
    return new Map();
  }

  /**
   * Clear all stored metadata
   */
  clearAll(): void {
    // WeakMap doesn't support clearing all entries
    // The garbage collector will handle cleanup when targets are no longer referenced
  }

  // Private methods for target metadata

  private setTargetMetadata(metadataKey: string | symbol, metadataValue: any, target: any): void {
    let metadata = this.targetMetadata.get(target);
    if (!metadata) {
      metadata = new Map();
      this.targetMetadata.set(target, metadata);
    }
    metadata.set(metadataKey, metadataValue);
  }

  private getTargetMetadata(metadataKey: string | symbol, target: any): any {
    const metadata = this.targetMetadata.get(target);
    if (!metadata) {
      return undefined;
    }
    return metadata.get(metadataKey);
  }

  private hasTargetMetadata(metadataKey: string | symbol, target: any): boolean {
    const metadata = this.targetMetadata.get(target);
    if (!metadata) {
      return false;
    }
    return metadata.has(metadataKey);
  }

  private deleteTargetMetadata(metadataKey: string | symbol, target: any): boolean {
    const metadata = this.targetMetadata.get(target);
    if (!metadata) {
      return false;
    }
    return metadata.delete(metadataKey);
  }

  private getTargetMetadataKeys(target: any): (string | symbol)[] {
    const metadata = this.targetMetadata.get(target);
    if (!metadata) {
      return [];
    }
    return Array.from(metadata.keys());
  }

  private clearTargetMetadata(target: any): void {
    this.targetMetadata.delete(target);
  }

  // Private methods for property metadata

  private setPropertyMetadata(metadataKey: string | symbol, metadataValue: any, target: any, propertyKey: string | symbol): void {
    let properties = this.targetPropertyMetadata.get(target);
    if (!properties) {
      properties = new Map();
      this.targetPropertyMetadata.set(target, properties);
    }

    let metadata = properties.get(propertyKey);
    if (!metadata) {
      metadata = new Map();
      properties.set(propertyKey, metadata);
    }

    metadata.set(metadataKey, metadataValue);
  }

  private getPropertyMetadata(metadataKey: string | symbol, target: any, propertyKey: string | symbol): any {
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
    const properties = this.targetPropertyMetadata.get(target);
    if (!properties) {
      return false;
    }

    const metadata = properties.get(propertyKey);
    if (!metadata) {
      return false;
    }

    return metadata.delete(metadataKey);
  }

  private getPropertyMetadataKeys(target: any, propertyKey: string | symbol): (string | symbol)[] {
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
    const properties = this.targetPropertyMetadata.get(target);
    if (!properties) {
      return;
    }

    properties.delete(propertyKey);
  }
}