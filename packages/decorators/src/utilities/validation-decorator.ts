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
  private static validationCache = new Map<string, ValidationResult>();

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
    if (!name || typeof validator !== 'function') {
      throw new Error('Validation decorator requires a name and validator function');
    }

    const decoratorId = `validation.${name}`;
    
    const decorator = function (target: any, propertyKey: string | symbol) {
      try {
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

        // Log decorator application in development
        if (process.env.NODE_ENV === 'development') {
          console.debug(`Applied custom validation decorator '${name}' to ${target.constructor.name}.${String(propertyKey)}`);
        }
      } catch (error) {
        throw new Error(`Failed to apply validation decorator '${name}': ${error instanceof Error ? error.message : String(error)}`);
      }
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
    if (typeof minLength !== 'number' || minLength < 0) {
      throw new Error('minLength must be a non-negative number');
    }

    return ValidationDecorator.create(
      'IsLongerThan',
      (value: any) => {
        if (value === null || value === undefined) {
          return false;
        }
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
    if (!(pattern instanceof RegExp)) {
      throw new Error('pattern must be a RegExp instance');
    }

    return ValidationDecorator.create(
      'MatchesPattern',
      (value: any) => {
        if (value === null || value === undefined) {
          return false;
        }
        if (typeof value !== 'string') {
          return false;
        }
        return pattern.test(value);
      },
      {
        message: message || `Value must match the required pattern`,
        constraints: { pattern: pattern.source, flags: pattern.flags },
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
    if (typeof min !== 'number' || typeof max !== 'number') {
      throw new Error('min and max must be numbers');
    }
    if (min > max) {
      throw new Error('min cannot be greater than max');
    }

    return ValidationDecorator.create(
      'IsInRange',
      (value: any) => {
        if (value === null || value === undefined) {
          return false;
        }
        if (typeof value !== 'number' || isNaN(value)) {
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
   * Creates a validation decorator that checks if a value is a valid email format.
   * 
   * @param message - Optional custom error message
   * @returns PropertyDecorator - The validation decorator function
   */
  static IsValidEmail(message?: string): PropertyDecorator {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    return ValidationDecorator.create(
      'IsValidEmail',
      (value: any) => {
        if (value === null || value === undefined) {
          return false;
        }
        if (typeof value !== 'string') {
          return false;
        }
        return emailRegex.test(value);
      },
      {
        message: message || 'Value must be a valid email address',
        constraints: { pattern: emailRegex.source },
      }
    );
  }

  /**
   * Creates a validation decorator that checks if a value is a strong password.
   * 
   * @param options - Password strength options
   * @param message - Optional custom error message
   * @returns PropertyDecorator - The validation decorator function
   */
  static IsStrongPassword(options: PasswordOptions = {}, message?: string): PropertyDecorator {
    const {
      minLength = 8,
      requireUppercase = true,
      requireLowercase = true,
      requireNumbers = true,
      requireSpecialChars = true,
    } = options;

    return ValidationDecorator.create(
      'IsStrongPassword',
      (value: any) => {
        if (value === null || value === undefined || typeof value !== 'string') {
          return false;
        }

        if (value.length < minLength) {
          return false;
        }

        if (requireUppercase && !/[A-Z]/.test(value)) {
          return false;
        }

        if (requireLowercase && !/[a-z]/.test(value)) {
          return false;
        }

        if (requireNumbers && !/\d/.test(value)) {
          return false;
        }

        if (requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
          return false;
        }

        return true;
      },
      {
        message: message || 'Password does not meet strength requirements',
        constraints: options,
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
    if (!target || typeof target !== 'object') {
      return {
        isValid: false,
        errors: [{
          property: 'target',
          value: target,
          message: 'Validation target must be an object',
          constraints: {},
        }],
      };
    }

    // Check cache first
    const cacheKey = this.getCacheKey(target);
    if (this.validationCache.has(cacheKey)) {
      return this.validationCache.get(cacheKey)!;
    }

    const validations: ValidationMetadata[] = Reflect.getMetadata('custom:validations', target.constructor) || [];
    const errors: ValidationError[] = [];

    for (const validation of validations) {
      try {
        const value = target[validation.propertyKey];
        
        // Skip validation if skipIf condition is met
        if (validation.options.skipIf && validation.options.skipIf(target)) {
          continue;
        }

        const isValid = validation.validator(value);

        if (!isValid) {
          errors.push({
            property: validation.propertyKey,
            value,
            message: validation.options.message || `Validation failed for ${validation.name}`,
            constraints: validation.options.constraints || {},
          });
        }
      } catch (error) {
        errors.push({
          property: validation.propertyKey,
          value: target[validation.propertyKey],
          message: `Validation error: ${error instanceof Error ? error.message : String(error)}`,
          constraints: {},
        });
      }
    }

    const result: ValidationResult = {
      isValid: errors.length === 0,
      errors,
    };

    // Cache the result
    this.validationCache.set(cacheKey, result);

    return result;
  }

  /**
   * Validates a single property of an object.
   * 
   * @param target - The object containing the property
   * @param propertyKey - The property to validate
   * @returns ValidationResult - The validation result for the property
   */
  static validateProperty(target: any, propertyKey: string): ValidationResult {
    if (!target || typeof target !== 'object') {
      return {
        isValid: false,
        errors: [{
          property: propertyKey,
          value: undefined,
          message: 'Validation target must be an object',
          constraints: {},
        }],
      };
    }

    const validations: ValidationMetadata[] = Reflect.getMetadata('custom:validations', target.constructor) || [];
    const propertyValidations = validations.filter(v => v.propertyKey === propertyKey);
    const errors: ValidationError[] = [];

    for (const validation of propertyValidations) {
      try {
        const value = target[validation.propertyKey];
        
        // Skip validation if skipIf condition is met
        if (validation.options.skipIf && validation.options.skipIf(target)) {
          continue;
        }

        const isValid = validation.validator(value);

        if (!isValid) {
          errors.push({
            property: validation.propertyKey,
            value,
            message: validation.options.message || `Validation failed for ${validation.name}`,
            constraints: validation.options.constraints || {},
          });
        }
      } catch (error) {
        errors.push({
          property: validation.propertyKey,
          value: target[validation.propertyKey],
          message: `Validation error: ${error instanceof Error ? error.message : String(error)}`,
          constraints: {},
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Clears the validation cache.
   * 
   * @param target - Optional specific target to clear from cache
   * @returns void
   */
  static clearCache(target?: any): void {
    if (target) {
      const cacheKey = this.getCacheKey(target);
      this.validationCache.delete(cacheKey);
    } else {
      this.validationCache.clear();
    }
  }

  /**
   * Gets validation statistics.
   * 
   * @returns object - Validation statistics
   */
  static getStats(): {
    cacheSize: number;
    registeredValidators: number;
  } {
    const registeredValidators = this.registry.getDecoratorsByType(DecoratorType.VALIDATION).length;
    
    return {
      cacheSize: this.validationCache.size,
      registeredValidators,
    };
  }

  /**
   * Generates a cache key for validation results.
   * 
   * @private
   * @param target - The validation target
   * @returns string - Cache key
   */
  private static getCacheKey(target: any): string {
    // Create a simple cache key based on constructor name and property values
    const className = target.constructor.name;
    const properties = Object.keys(target).sort();
    const values = properties.map(key => target[key]);
    
    return `${className}:${JSON.stringify(values)}`;
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
 * Options for password strength validation.
 * 
 * @interface PasswordOptions
 */
export interface PasswordOptions {
  /**
   * Minimum password length.
   */
  minLength?: number;
  
  /**
   * Require at least one uppercase letter.
   */
  requireUppercase?: boolean;
  
  /**
   * Require at least one lowercase letter.
   */
  requireLowercase?: boolean;
  
  /**
   * Require at least one number.
   */
  requireNumbers?: boolean;
  
  /**
   * Require at least one special character.
   */
  requireSpecialChars?: boolean;
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