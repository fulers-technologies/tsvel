import { DecoratorType } from '../enums/decorator-type.enum';

/**
 * Decorator categories for organizing decorators by their primary function.
 * Maps decorator types to their functional categories.
 */
export const DECORATOR_CATEGORIES = {
  /**
   * Data validation and constraint decorators.
   */
  DATA_VALIDATION: [
    DecoratorType.VALIDATION,
    DecoratorType.PARAMETER,
  ],

  /**
   * Data transformation and serialization decorators.
   */
  DATA_TRANSFORMATION: [
    DecoratorType.TRANSFORMATION,
  ],

  /**
   * Dependency injection and IoC decorators.
   */
  DEPENDENCY_INJECTION: [
    DecoratorType.INJECTION,
    DecoratorType.PARAMETER,
  ],

  /**
   * HTTP and routing decorators.
   */
  HTTP_ROUTING: [
    DecoratorType.ROUTING,
    DecoratorType.METHOD,
    DecoratorType.CLASS,
  ],

  /**
   * Cross-cutting concern decorators.
   */
  CROSS_CUTTING: [
    DecoratorType.LOGGING,
    DecoratorType.CACHING,
    DecoratorType.MIDDLEWARE,
  ],

  /**
   * Metadata and annotation decorators.
   */
  METADATA: [
    DecoratorType.PROPERTY,
    DecoratorType.CLASS,
    DecoratorType.METHOD,
    DecoratorType.PARAMETER,
  ],

  /**
   * Custom business logic decorators.
   */
  CUSTOM_LOGIC: [
    DecoratorType.CUSTOM,
  ],
} as const;

/**
 * Type for decorator category keys.
 */
export type DecoratorCategory = keyof typeof DECORATOR_CATEGORIES;