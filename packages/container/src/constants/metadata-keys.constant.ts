/**
 * Metadata keys used for dependency injection annotations.
 * Provides consistent keys for storing injection metadata.
 */
export const METADATA_KEYS = {
  /**
   * Key for storing injection metadata on constructor parameters.
   */
  INJECT_CONSTRUCTOR: Symbol.for('inject:constructor'),

  /**
   * Key for storing injection metadata on properties.
   */
  INJECT_PROPERTY: Symbol.for('inject:property'),

  /**
   * Key for storing injection metadata on methods.
   */
  INJECT_METHOD: Symbol.for('inject:method'),

  /**
   * Key for storing named injection metadata.
   */
  INJECT_NAMED: Symbol.for('inject:named'),

  /**
   * Key for storing tagged injection metadata.
   */
  INJECT_TAGGED: Symbol.for('inject:tagged'),

  /**
   * Key for storing optional injection metadata.
   */
  INJECT_OPTIONAL: Symbol.for('inject:optional'),

  /**
   * Key for storing contextual binding metadata.
   */
  CONTEXTUAL_BINDING: Symbol.for('contextual:binding'),

  /**
   * Key for storing service metadata.
   */
  SERVICE_METADATA: Symbol.for('service:metadata'),
} as const;

/**
 * Type for metadata key values.
 */
export type MetadataKey = typeof METADATA_KEYS[keyof typeof METADATA_KEYS];