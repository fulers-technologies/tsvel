/**
 * Decorator type enumeration for categorizing different types of decorators.
 * Used to organize and filter decorators by their functionality.
 * 
 * @enum DecoratorType
 */
export enum DecoratorType {
  /**
   * Validation decorators from class-validator.
   * Used for input validation, data integrity checks, and constraint enforcement.
   */
  VALIDATION = 'validation',
  
  /**
   * Transformation decorators from class-transformer.
   * Used for data transformation, serialization, and deserialization.
   */
  TRANSFORMATION = 'transformation',
  
  /**
   * Dependency injection decorators.
   * Used for service injection, container binding, and IoC patterns.
   */
  INJECTION = 'injection',
  
  /**
   * Routing and HTTP decorators.
   * Used for route definition, HTTP method binding, and request handling.
   */
  ROUTING = 'routing',
  
  /**
   * Logging and monitoring decorators.
   * Used for method tracing, performance monitoring, and audit logging.
   */
  LOGGING = 'logging',
  
  /**
   * Caching decorators.
   * Used for result caching, cache invalidation, and performance optimization.
   */
  CACHING = 'caching',
  
  /**
   * Middleware decorators.
   * Used for request/response processing, authentication, and cross-cutting concerns.
   */
  MIDDLEWARE = 'middleware',
  
  /**
   * Property and method decorators.
   * Used for property enhancement, method interception, and metadata annotation.
   */
  PROPERTY = 'property',
  
  /**
   * Class decorators.
   * Used for class enhancement, metadata annotation, and behavior modification.
   */
  CLASS = 'class',
  
  /**
   * Method decorators.
   * Used for method interception, metadata annotation, and behavior modification.
   */
  METHOD = 'method',
  
  /**
   * Parameter decorators.
   * Used for parameter validation, injection, and metadata annotation.
   */
  PARAMETER = 'parameter',
  
  /**
   * Custom application-specific decorators.
   * Used for domain-specific functionality and custom business logic.
   */
  CUSTOM = 'custom',
}