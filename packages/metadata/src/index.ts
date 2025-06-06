/**
 * Main entry point for the metadata package
 * Exports all public APIs
 */

// Core metadata functionality
export { Metadata } from './metadata';
export { default } from './metadata';

// Interfaces
export * from './interfaces';

// Utilities
export * from './utilities';

// Providers
export * from './providers';

// Re-export commonly used types
export type {
  MetadataKey,
  MetadataValue,
  MetadataTarget,
  PropertyKey,
  MetadataEntry,
  MetadataMap,
  MetadataOptions
} from './interfaces/metadata.interface';

export type {
  IMetadataStorage,
  StorageKey,
  StorageEntry
} from './interfaces/metadata-storage.interface';