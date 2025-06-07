/**
 * Core decorator interface defining the contract for decorator operations.
 * Follows ISP (Interface Segregation Principle) by providing focused decorator methods.
 * 
 * @interface IDecorator
 */
export interface IDecorator {
  /**
   * The unique identifier for this decorator.
   */
  readonly id: string;
  
  /**
   * The type category of this decorator.
   */
  readonly type: DecoratorType;
  
  /**
   * The name of this decorator.
   */
  readonly name: string;
  
  /**
   * Optional description of what this decorator does.
   */
  readonly description?: string;
  
  /**
   * Applies the decorator to a target with optional parameters.
   * 
   * @param target - The target to apply the decorator to
   * @param propertyKey - Optional property key for property/method decorators
   * @param descriptor - Optional property descriptor for method decorators
   * @param options - Optional configuration options for the decorator
   * @returns any - The result of applying the decorator
   */
  apply(
    target: any,
    propertyKey?: string | symbol,
    descriptor?: PropertyDescriptor,
    options?: Record<string, any>
  ): any;
}

/**
 * Decorator registration information for the decorator registry.
 * 
 * @interface DecoratorRegistration
 */
export interface DecoratorRegistration {
  /**
   * The decorator function to register.
   */
  decorator: Function;
  
  /**
   * Metadata about the decorator.
   */
  metadata: DecoratorMetadata;
}

/**
 * Metadata information about a decorator.
 * 
 * @interface DecoratorMetadata
 */
export interface DecoratorMetadata {
  /**
   * The unique identifier for this decorator.
   */
  id: string;
  
  /**
   * The type category of this decorator.
   */
  type: DecoratorType;
  
  /**
   * The name of this decorator.
   */
  name: string;
  
  /**
   * Optional description of what this decorator does.
   */
  description?: string;
  
  /**
   * The source package or library this decorator comes from.
   */
  source: string;
  
  /**
   * Version of the decorator or source package.
   */
  version?: string;
  
  /**
   * Whether this decorator is enabled.
   */
  enabled: boolean;
  
  /**
   * Timestamp when this decorator was registered.
   */
  registeredAt: Date;
}

/**
 * Decorator type enumeration for categorizing decorators.
 */
export enum DecoratorType {
  /**
   * Validation decorators from class-validator.
   */
  VALIDATION = 'validation',
  
  /**
   * Transformation decorators from class-transformer.
   */
  TRANSFORMATION = 'transformation',
  
  /**
   * Dependency injection decorators.
   */
  INJECTION = 'injection',
  
  /**
   * Routing and HTTP decorators.
   */
  ROUTING = 'routing',
  
  /**
   * Logging and monitoring decorators.
   */
  LOGGING = 'logging',
  
  /**
   * Caching decorators.
   */
  CACHING = 'caching',
  
  /**
   * Middleware decorators.
   */
  MIDDLEWARE = 'middleware',
  
  /**
   * Custom application-specific decorators.
   */
  CUSTOM = 'custom',
}