/**
 * Core metadata interface defining the contract for metadata operations
 */
export interface IMetadata {
  // Static methods are not part of the interface since TypeScript doesn't support them
  // This interface is mainly for documentation and potential instance-based implementations
}

/**
 * Metadata key type - can be string or symbol
 */
export type MetadataKey = string | symbol;

/**
 * Metadata value type - can be any value
 */
export type MetadataValue = any;

/**
 * Target type - the object that metadata is attached to
 */
export type MetadataTarget = any;

/**
 * Property key type - optional property or method name
 */
export type PropertyKey = string | symbol;

/**
 * Metadata entry structure
 */
export interface MetadataEntry {
  key: MetadataKey;
  value: MetadataValue;
  target: MetadataTarget;
  propertyKey?: PropertyKey;
}

/**
 * Metadata map structure for organizing metadata
 */
export interface MetadataMap {
  [key: string]: MetadataValue;
}

/**
 * Metadata options for advanced operations
 */
export interface MetadataOptions {
  inherit?: boolean;
  enumerable?: boolean;
  configurable?: boolean;
}