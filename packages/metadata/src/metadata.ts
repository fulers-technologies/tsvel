/**
 * Metadata management class inspired by inversiland metadata
 * Provides a centralized way to store and retrieve metadata for classes, methods, and properties
 */

import { MetadataStorage } from './utilities/metadata-storage';
import { MetadataReflector } from './utilities/metadata-reflector';
import { IMetadata, IMetadataStorage } from './interfaces';

/**
 * Main metadata class that provides static methods for metadata operations
 */
export class Metadata implements IMetadata {
  private static storage: IMetadataStorage = new MetadataStorage();
  private static reflector = new MetadataReflector();

  /**
   * Define metadata for a target
   */
  static define(metadataKey: string | symbol, metadataValue: any, target: any, propertyKey?: string | symbol): void {
    this.storage.set(metadataKey, metadataValue, target, propertyKey);
  }

  /**
   * Get metadata for a target
   */
  static get(metadataKey: string | symbol, target: any, propertyKey?: string | symbol): any {
    return this.storage.get(metadataKey, target, propertyKey);
  }

  /**
   * Check if metadata exists for a target
   */
  static has(metadataKey: string | symbol, target: any, propertyKey?: string | symbol): boolean {
    return this.storage.has(metadataKey, target, propertyKey);
  }

  /**
   * Delete metadata for a target
   */
  static delete(metadataKey: string | symbol, target: any, propertyKey?: string | symbol): boolean {
    return this.storage.delete(metadataKey, target, propertyKey);
  }

  /**
   * Get all metadata keys for a target
   */
  static getKeys(target: any, propertyKey?: string | symbol): (string | symbol)[] {
    return this.storage.getKeys(target, propertyKey);
  }

  /**
   * Get own metadata (not inherited)
   */
  static getOwn(metadataKey: string | symbol, target: any, propertyKey?: string | symbol): any {
    return this.storage.getOwn(metadataKey, target, propertyKey);
  }

  /**
   * Get own metadata keys (not inherited)
   */
  static getOwnKeys(target: any, propertyKey?: string | symbol): (string | symbol)[] {
    return this.storage.getOwnKeys(target, propertyKey);
  }

  /**
   * Clear all metadata for a target
   */
  static clear(target: any, propertyKey?: string | symbol): void {
    this.storage.clear(target, propertyKey);
  }

  /**
   * Get the metadata storage instance
   */
  static getStorage(): IMetadataStorage {
    return this.storage;
  }

  /**
   * Get the metadata reflector instance
   */
  static getReflector() {
    return this.reflector;
  }

  /**
   * Set a custom storage implementation
   */
  static setStorage(storage: IMetadataStorage): void {
    this.storage = storage;
  }

  /**
   * Reflect metadata using the built-in Reflect API if available
   */
  static reflect = {
    defineMetadata: (metadataKey: string | symbol, metadataValue: any, target: any, propertyKey?: string | symbol) => {
      if (typeof Reflect !== 'undefined' && Reflect.defineMetadata) {
        return Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
      }
      return this.define(metadataKey, metadataValue, target, propertyKey);
    },

    getMetadata: (metadataKey: string | symbol, target: any, propertyKey?: string | symbol) => {
      if (typeof Reflect !== 'undefined' && Reflect.getMetadata) {
        return Reflect.getMetadata(metadataKey, target, propertyKey);
      }
      return this.get(metadataKey, target, propertyKey);
    },

    hasMetadata: (metadataKey: string | symbol, target: any, propertyKey?: string | symbol) => {
      if (typeof Reflect !== 'undefined' && Reflect.hasMetadata) {
        return Reflect.hasMetadata(metadataKey, target, propertyKey);
      }
      return this.has(metadataKey, target, propertyKey);
    },

    deleteMetadata: (metadataKey: string | symbol, target: any, propertyKey?: string | symbol) => {
      if (typeof Reflect !== 'undefined' && Reflect.deleteMetadata) {
        return Reflect.deleteMetadata(metadataKey, target, propertyKey);
      }
      return this.delete(metadataKey, target, propertyKey);
    },

    getMetadataKeys: (target: any, propertyKey?: string | symbol) => {
      if (typeof Reflect !== 'undefined' && Reflect.getMetadataKeys) {
        return Reflect.getMetadataKeys(target, propertyKey);
      }
      return this.getKeys(target, propertyKey);
    },

    getOwnMetadata: (metadataKey: string | symbol, target: any, propertyKey?: string | symbol) => {
      if (typeof Reflect !== 'undefined' && Reflect.getOwnMetadata) {
        return Reflect.getOwnMetadata(metadataKey, target, propertyKey);
      }
      return this.getOwn(metadataKey, target, propertyKey);
    },

    getOwnMetadataKeys: (target: any, propertyKey?: string | symbol) => {
      if (typeof Reflect !== 'undefined' && Reflect.getOwnMetadataKeys) {
        return Reflect.getOwnMetadataKeys(target, propertyKey);
      }
      return this.getOwnKeys(target, propertyKey);
    }
  };
}

// Export default instance for convenience
export default Metadata;