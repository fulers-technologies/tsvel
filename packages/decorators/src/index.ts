/**
 * Main entry point for the decorators package.
 * Exports all public APIs for decorator functionality.
 */

// Core decorator functionality
export { Decorators } from './decorators';
export { default } from './decorators';

// Interfaces
export * from './interfaces';

// Enums
export * from './enums';

// Constants
export * from './constants';

// Utilities
export * from './utilities';

// Service providers
export * from './providers';

// Re-export all validation decorators from class-validator
export {
  IsDefined,
  IsString,
  IsNumber,
  IsInt,
  IsBoolean,
  IsEmail,
  IsUrl,
  IsUUID,
  IsDate,
  IsArray,
  IsObject,
  IsNotEmpty,
  IsEmpty,
  IsOptional,
} from './decorators';

// Re-export all transformation decorators from class-transformer
export {
  Expose,
  Exclude,
  Transform,
  Type,
  PlainToClass,
  ClassToPlain,
} from './decorators';

// Re-export decorator factory
export { DecoratorFactory } from './utilities/decorator-factory';

// Re-export commonly used types
export type { IDecorator, DecoratorRegistration, DecoratorMetadata } from './interfaces/decorator.interface';
export type { ValidationFunction, ValidationDecoratorOptions, ValidationResult } from './utilities/validation-decorator';
export type { RegistryStats } from './utilities/decorator-registry';
export type { 
  ValidationDecoratorOptions as FactoryValidationOptions,
  ClassDecoratorOptions,
  MethodDecoratorOptions,
  PropertyDecoratorOptions,
  ParameterDecoratorOptions,
  CustomDecoratorOptions,
} from './utilities/decorator-factory';