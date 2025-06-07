import { DecoratorRegistry } from './decorator-registry';
import { DecoratorType } from '../enums/decorator-type.enum';

/**
 * Utility class for creating and managing custom validation decorators.
 * Provides helpers for building validation decorators that integrate with class-validator.
 * 
 * @class ValidationDecorator
 */
export class ValidationDecorator {
  private static registry = DecoratorRegistry.getInstance();

  /**
   * Creates a custom validation decorator.
   * Builds a decorator function that can be used for property validation.
   * 
   * @param name - The name of the validation decorator
   * @param validator - The validation function
   * @param options - Optional configuration for the decorator
   * @returns PropertyDecorator - The validation decorator function
   */
  static create(
    name: string,
    validator: ValidationFunction,
    options: ValidationDecoratorOptions = {}
  ): PropertyDecorator {
    const decoratorId = `validation.${name}`;
    
    const decorator = function (target: any, propertyKey: string | symbol) {
      // Store validation metadata
      const existingValidations = Reflect.getMetadata('custom:validations', target) || [];
      const validation: ValidationMetadata = {
        propertyKey: String(propertyKey),
        validator,
        options,
        name,
      };
      
      existingValidations.push(validation);
      Reflect.defineMetadata('custom:validations', existingValidations, target);
      
      // Register with the decorator registry
      ValidationDecorator.registry.registerDecorator(decorator, {
        id: decoratorId,
        type: DecoratorType.VALIDATION,
        name,
        description: options.message || `Custom validation: ${name}`,
        source: 'custom',
        enabled: true,
      });
    };

    return decorator;
  }

  /**
   * Creates a validation decorator that checks if a value is longer than a specified length.
   * Example of a custom validation decorator implementation.
   * 
   * @param minLength - The minimum required length
   * @param message - Optional custom error message
   * @returns PropertyDecorator - The validation decorator function
   */
  static IsLongerThan(minLength: number, message?: string): PropertyDecorator {
    return ValidationDecorator.create(
      'IsLongerThan',
      (value: any) => {
        if (typeof value !== 'string') {
          return false;
        }
        return value.length > minLength;
      },
      {
        message: message || `Value must be longer than ${minLength} characters`,
        constraints: { minLength },
      }
    );
  }

  /**
   * Creates a validation decorator that checks if a value matches a custom pattern.
   * 
   * @param pattern - The regular expression pattern to match
   * @param message - Optional custom error message
   * @returns PropertyDecorator - The validation decorator function
   */
  static MatchesPattern(pattern: RegExp, message?: string): PropertyDecorator {
    return ValidationDecorator.create(
      'MatchesPattern',
      (value: any) => {
        if (typeof value !== 'string') {
          return false;
        }
        return pattern.test(value);
      },
      {
        message: message || `Value must match the required pattern`,
        constraints: { pattern: pattern.source },
      }
    );
  }

  /**
   * Creates a validation decorator that checks if a value is within a numeric range.
   * 
   * @param min - The minimum value (inclusive)
   * @param max - The maximum value (inclusive)
   * @param message - Optional custom error message
   * @returns PropertyDecorator - The validation decorator function
   */
  static IsInRange(min: number, max: number, message?: string): PropertyDecorator {
    return ValidationDecorator.create(
      'IsInRange',
      (value: any) => {
        if (typeof value !== 'number') {
          return false;
        }
        return value >= min && value <= max;
      },
      {
        message: message || `Value must be between ${min} and ${max}`,
        constraints: { min, max },
      }
    );
  }

  /**
   * Validates an object using all registered custom validations.
   * 
   * @param target - The object to validate
   * @returns ValidationResult - The validation result
   */
  static validate(target: any): ValidationResult {
    const validations: ValidationMetadata[] = Reflect.getMetadata('custom:validations', target.constructor) || [];
    const errors: ValidationError[] = [];

    for (const validation of validations) {
      const value = target[validation.propertyKey];
      const isValid = validation.validator(value);

      if (!isValid) {
        errors.push({
          property: validation.propertyKey,
          value,
          message: validation.options.message || `Validation failed for ${validation.name}`,
          constraints: validation.options.constraints || {},
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

/**
 * Function signature for custom validation logic.
 * 
 * @type ValidationFunction
 */
export type ValidationFunction = (value: any) => boolean;

/**
 * Options for configuring validation decorators.
 * 
 * @interface ValidationDecoratorOptions
 */
export interface ValidationDecoratorOptions {
  /**
   * Custom error message for validation failures.
   */
  message?: string;
  
  /**
   * Additional constraints or parameters for the validation.
   */
  constraints?: Record<string, any>;
  
  /**
   * Whether this validation should be skipped in certain contexts.
   */
  skipIf?: (target: any) => boolean;
}

/**
 * Metadata stored for each validation decorator.
 * 
 * @interface ValidationMetadata
 */
export interface ValidationMetadata {
  /**
   * The property key this validation applies to.
   */
  propertyKey: string;
  
  /**
   * The validation function.
   */
  validator: ValidationFunction;
  
  /**
   * Configuration options for the validation.
   */
  options: ValidationDecoratorOptions;
  
  /**
   * The name of the validation decorator.
   */
  name: string;
}

/**
 * Result of a validation operation.
 * 
 * @interface ValidationResult
 */
export interface ValidationResult {
  /**
   * Whether the validation passed.
   */
  isValid: boolean;
  
  /**
   * Array of validation errors, if any.
   */
  errors: ValidationError[];
}

/**
 * Individual validation error information.
 * 
 * @interface ValidationError
 */
export interface ValidationError {
  /**
   * The property that failed validation.
   */
  property: string;
  
  /**
   * The value that failed validation.
   */
  value: any;
  
  /**
   * The error message.
   */
  message: string;
  
  /**
   * Additional constraints that were violated.
   */
  constraints: Record<string, any>;
}