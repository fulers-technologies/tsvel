/**
 * Interface for metadata storage implementations
 */
export interface IMetadataStorage {
  /**
   * Set metadata for a target
   */
  set(metadataKey: string | symbol, metadataValue: any, target: any, propertyKey?: string | symbol): void;

  /**
   * Get metadata for a target
   */
  get(metadataKey: string | symbol, target: any, propertyKey?: string | symbol): any;

  /**
   * Check if metadata exists for a target
   */
  has(metadataKey: string | symbol, target: any, propertyKey?: string | symbol): boolean;

  /**
   * Delete metadata for a target
   */
  delete(metadataKey: string | symbol, target: any, propertyKey?: string | symbol): boolean;

  /**
   * Get all metadata keys for a target
   */
  getKeys(target: any, propertyKey?: string | symbol): (string | symbol)[];

  /**
   * Get own metadata (not inherited)
   */
  getOwn(metadataKey: string | symbol, target: any, propertyKey?: string | symbol): any;

  /**
   * Get own metadata keys (not inherited)
   */
  getOwnKeys(target: any, propertyKey?: string | symbol): (string | symbol)[];

  /**
   * Clear all metadata for a target
   */
  clear(target: any, propertyKey?: string | symbol): void;

  /**
   * Get all stored metadata entries
   */
  getAll(): Map<any, Map<string | symbol, any>>;

  /**
   * Clear all stored metadata
   */
  clearAll(): void;
}

/**
 * Storage key structure for organizing metadata
 */
export interface StorageKey {
  target: any;
  propertyKey?: string | symbol;
}

/**
 * Storage entry structure
 */
export interface StorageEntry {
  metadata: Map<string | symbol, any>;
  properties: Map<string | symbol, Map<string | symbol, any>>;
}