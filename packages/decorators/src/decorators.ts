/**
 * Central decorator management class with re-exports from class-validator and class-transformer.
 * Provides a unified interface for accessing all decorator functionality.
 * 
 * @class Decorators
 */
export class Decorators {
  private static instance: Decorators;

  /**
   * Private constructor to enforce singleton pattern.
   * Use Decorators.getInstance() to access the instance.
   */
  private constructor() {}

  /**
   * Gets the singleton decorators instance.
   * Creates one if it doesn't exist.
   * 
   * @returns Decorators - The singleton decorators instance
   */
  static getInstance(): Decorators {
    if (!Decorators.instance) {
      Decorators.instance = new Decorators();
    }
    return Decorators.instance;
  }

  /**
   * Creates a new decorators instance.
   * Factory method following the framework's .make() pattern.
   * 
   * @returns Decorators - A new decorators instance
   */
  static make(): Decorators {
    return new Decorators();
  }
}

/**
 * Validation decorators re-exported from class-validator.
 * These provide comprehensive validation capabilities for class properties.
 * 
 * Note: In a production environment, these would be actual imports from class-validator.
 * For this implementation, we provide type-safe stubs that demonstrate the interface.
 */

/**
 * Checks if the value is defined (!== undefined, !== null).
 * 
 * @param validationOptions - Optional validation configuration
 * @returns PropertyDecorator
 */
export function IsDefined(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    // Store validation metadata for runtime validation
    const validations = Reflect.getMetadata('validation:rules', target) || [];
    validations.push({
      propertyKey: String(propertyKey),
      validator: 'IsDefined',
      options: validationOptions,
      validate: (value: any) => value !== undefined && value !== null,
    });
    Reflect.defineMetadata('validation:rules', validations, target);
    
    console.log(`@IsDefined applied to ${String(propertyKey)}`);
  };
}

/**
 * Checks if the value is a string.
 * 
 * @param validationOptions - Optional validation configuration
 * @returns PropertyDecorator
 */
export function IsString(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const validations = Reflect.getMetadata('validation:rules', target) || [];
    validations.push({
      propertyKey: String(propertyKey),
      validator: 'IsString',
      options: validationOptions,
      validate: (value: any) => typeof value === 'string',
    });
    Reflect.defineMetadata('validation:rules', validations, target);
    
    console.log(`@IsString applied to ${String(propertyKey)}`);
  };
}

/**
 * Checks if the value is a number.
 * 
 * @param options - Number validation options
 * @param validationOptions - Optional validation configuration
 * @returns PropertyDecorator
 */
export function IsNumber(options?: NumberOptions, validationOptions?: ValidationOptions): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const validations = Reflect.getMetadata('validation:rules', target) || [];
    validations.push({
      propertyKey: String(propertyKey),
      validator: 'IsNumber',
      options: { ...options, ...validationOptions },
      validate: (value: any) => {
        if (typeof value !== 'number') return false;
        if (options?.allowNaN === false && isNaN(value)) return false;
        if (options?.allowInfinity === false && !isFinite(value)) return false;
        return true;
      },
    });
    Reflect.defineMetadata('validation:rules', validations, target);
    
    console.log(`@IsNumber applied to ${String(propertyKey)}`);
  };
}

/**
 * Checks if the value is an integer.
 * 
 * @param validationOptions - Optional validation configuration
 * @returns PropertyDecorator
 */
export function IsInt(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const validations = Reflect.getMetadata('validation:rules', target) || [];
    validations.push({
      propertyKey: String(propertyKey),
      validator: 'IsInt',
      options: validationOptions,
      validate: (value: any) => Number.isInteger(value),
    });
    Reflect.defineMetadata('validation:rules', validations, target);
    
    console.log(`@IsInt applied to ${String(propertyKey)}`);
  };
}

/**
 * Checks if the value is a boolean.
 * 
 * @param validationOptions - Optional validation configuration
 * @returns PropertyDecorator
 */
export function IsBoolean(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const validations = Reflect.getMetadata('validation:rules', target) || [];
    validations.push({
      propertyKey: String(propertyKey),
      validator: 'IsBoolean',
      options: validationOptions,
      validate: (value: any) => typeof value === 'boolean',
    });
    Reflect.defineMetadata('validation:rules', validations, target);
    
    console.log(`@IsBoolean applied to ${String(propertyKey)}`);
  };
}

/**
 * Checks if the value is an email.
 * 
 * @param options - Email validation options
 * @param validationOptions - Optional validation configuration
 * @returns PropertyDecorator
 */
export function IsEmail(options?: EmailOptions, validationOptions?: ValidationOptions): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const validations = Reflect.getMetadata('validation:rules', target) || [];
    validations.push({
      propertyKey: String(propertyKey),
      validator: 'IsEmail',
      options: { ...options, ...validationOptions },
      validate: (value: any) => {
        if (typeof value !== 'string') return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      },
    });
    Reflect.defineMetadata('validation:rules', validations, target);
    
    console.log(`@IsEmail applied to ${String(propertyKey)}`);
  };
}

/**
 * Checks if the value is a URL.
 * 
 * @param options - URL validation options
 * @param validationOptions - Optional validation configuration
 * @returns PropertyDecorator
 */
export function IsUrl(options?: UrlOptions, validationOptions?: ValidationOptions): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const validations = Reflect.getMetadata('validation:rules', target) || [];
    validations.push({
      propertyKey: String(propertyKey),
      validator: 'IsUrl',
      options: { ...options, ...validationOptions },
      validate: (value: any) => {
        if (typeof value !== 'string') return false;
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      },
    });
    Reflect.defineMetadata('validation:rules', validations, target);
    
    console.log(`@IsUrl applied to ${String(propertyKey)}`);
  };
}

/**
 * Checks if the value is a UUID.
 * 
 * @param version - UUID version to validate
 * @param validationOptions - Optional validation configuration
 * @returns PropertyDecorator
 */
export function IsUUID(version?: UUIDVersion, validationOptions?: ValidationOptions): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const validations = Reflect.getMetadata('validation:rules', target) || [];
    validations.push({
      propertyKey: String(propertyKey),
      validator: 'IsUUID',
      options: { version, ...validationOptions },
      validate: (value: any) => {
        if (typeof value !== 'string') return false;
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(value);
      },
    });
    Reflect.defineMetadata('validation:rules', validations, target);
    
    console.log(`@IsUUID applied to ${String(propertyKey)}`);
  };
}

/**
 * Checks if the value is a date.
 * 
 * @param validationOptions - Optional validation configuration
 * @returns PropertyDecorator
 */
export function IsDate(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const validations = Reflect.getMetadata('validation:rules', target) || [];
    validations.push({
      propertyKey: String(propertyKey),
      validator: 'IsDate',
      options: validationOptions,
      validate: (value: any) => value instanceof Date && !isNaN(value.getTime()),
    });
    Reflect.defineMetadata('validation:rules', validations, target);
    
    console.log(`@IsDate applied to ${String(propertyKey)}`);
  };
}

/**
 * Checks if the value is an array.
 * 
 * @param validationOptions - Optional validation configuration
 * @returns PropertyDecorator
 */
export function IsArray(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const validations = Reflect.getMetadata('validation:rules', target) || [];
    validations.push({
      propertyKey: String(propertyKey),
      validator: 'IsArray',
      options: validationOptions,
      validate: (value: any) => Array.isArray(value),
    });
    Reflect.defineMetadata('validation:rules', validations, target);
    
    console.log(`@IsArray applied to ${String(propertyKey)}`);
  };
}

/**
 * Checks if the value is an object.
 * 
 * @param validationOptions - Optional validation configuration
 * @returns PropertyDecorator
 */
export function IsObject(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const validations = Reflect.getMetadata('validation:rules', target) || [];
    validations.push({
      propertyKey: String(propertyKey),
      validator: 'IsObject',
      options: validationOptions,
      validate: (value: any) => value !== null && typeof value === 'object' && !Array.isArray(value),
    });
    Reflect.defineMetadata('validation:rules', validations, target);
    
    console.log(`@IsObject applied to ${String(propertyKey)}`);
  };
}

/**
 * Checks if the value is not empty.
 * 
 * @param validationOptions - Optional validation configuration
 * @returns PropertyDecorator
 */
export function IsNotEmpty(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const validations = Reflect.getMetadata('validation:rules', target) || [];
    validations.push({
      propertyKey: String(propertyKey),
      validator: 'IsNotEmpty',
      options: validationOptions,
      validate: (value: any) => {
        if (value === null || value === undefined) return false;
        if (typeof value === 'string') return value.trim().length > 0;
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === 'object') return Object.keys(value).length > 0;
        return true;
      },
    });
    Reflect.defineMetadata('validation:rules', validations, target);
    
    console.log(`@IsNotEmpty applied to ${String(propertyKey)}`);
  };
}

/**
 * Checks if the value is empty.
 * 
 * @param validationOptions - Optional validation configuration
 * @returns PropertyDecorator
 */
export function IsEmpty(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const validations = Reflect.getMetadata('validation:rules', target) || [];
    validations.push({
      propertyKey: String(propertyKey),
      validator: 'IsEmpty',
      options: validationOptions,
      validate: (value: any) => {
        if (value === null || value === undefined) return true;
        if (typeof value === 'string') return value.trim().length === 0;
        if (Array.isArray(value)) return value.length === 0;
        if (typeof value === 'object') return Object.keys(value).length === 0;
        return false;
      },
    });
    Reflect.defineMetadata('validation:rules', validations, target);
    
    console.log(`@IsEmpty applied to ${String(propertyKey)}`);
  };
}

/**
 * Checks if the value is optional.
 * 
 * @param validationOptions - Optional validation configuration
 * @returns PropertyDecorator
 */
export function IsOptional(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const validations = Reflect.getMetadata('validation:rules', target) || [];
    validations.push({
      propertyKey: String(propertyKey),
      validator: 'IsOptional',
      options: validationOptions,
      validate: () => true, // Optional fields always pass validation
      optional: true,
    });
    Reflect.defineMetadata('validation:rules', validations, target);
    
    console.log(`@IsOptional applied to ${String(propertyKey)}`);
  };
}

/**
 * Transformation decorators re-exported from class-transformer.
 * These provide data transformation capabilities for serialization/deserialization.
 * 
 * Note: In a production environment, these would be actual imports from class-transformer.
 */

/**
 * Marks a property to be exposed during transformation.
 * 
 * @param options - Expose options
 * @returns PropertyDecorator
 */
export function Expose(options?: ExposeOptions): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const transformations = Reflect.getMetadata('transformation:rules', target) || [];
    transformations.push({
      propertyKey: String(propertyKey),
      transformer: 'Expose',
      options,
      transform: (value: any) => value, // Identity transformation for expose
    });
    Reflect.defineMetadata('transformation:rules', transformations, target);
    
    console.log(`@Expose applied to ${String(propertyKey)}`);
  };
}

/**
 * Marks a property to be excluded during transformation.
 * 
 * @param options - Exclude options
 * @returns PropertyDecorator
 */
export function Exclude(options?: ExcludeOptions): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const transformations = Reflect.getMetadata('transformation:rules', target) || [];
    transformations.push({
      propertyKey: String(propertyKey),
      transformer: 'Exclude',
      options,
      transform: () => undefined, // Exclude by returning undefined
    });
    Reflect.defineMetadata('transformation:rules', transformations, target);
    
    console.log(`@Exclude applied to ${String(propertyKey)}`);
  };
}

/**
 * Transforms a property using a custom transformation function.
 * 
 * @param transformFn - The transformation function
 * @param options - Transform options
 * @returns PropertyDecorator
 */
export function Transform(transformFn: TransformFn, options?: TransformOptions): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const transformations = Reflect.getMetadata('transformation:rules', target) || [];
    transformations.push({
      propertyKey: String(propertyKey),
      transformer: 'Transform',
      options,
      transform: transformFn,
    });
    Reflect.defineMetadata('transformation:rules', transformations, target);
    
    console.log(`@Transform applied to ${String(propertyKey)}`);
  };
}

/**
 * Specifies the type of a property for transformation.
 * 
 * @param typeFunction - Function that returns the type
 * @param options - Type options
 * @returns PropertyDecorator
 */
export function Type(typeFunction?: TypeFunction, options?: TypeOptions): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const transformations = Reflect.getMetadata('transformation:rules', target) || [];
    transformations.push({
      propertyKey: String(propertyKey),
      transformer: 'Type',
      options: { typeFunction, ...options },
      transform: (value: any) => {
        if (typeFunction && value !== null && value !== undefined) {
          const TargetType = typeFunction();
          if (typeof TargetType === 'function') {
            return new TargetType(value);
          }
        }
        return value;
      },
    });
    Reflect.defineMetadata('transformation:rules', transformations, target);
    
    console.log(`@Type applied to ${String(propertyKey)}`);
  };
}

/**
 * Marks a property to be transformed to plain object.
 * 
 * @param classType - The class type to transform to
 * @param options - Transform options
 * @returns PropertyDecorator
 */
export function PlainToClass(classType: any, options?: TransformOptions): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const transformations = Reflect.getMetadata('transformation:rules', target) || [];
    transformations.push({
      propertyKey: String(propertyKey),
      transformer: 'PlainToClass',
      options: { classType, ...options },
      transform: (value: any) => {
        if (value && typeof value === 'object' && classType) {
          return Object.assign(new classType(), value);
        }
        return value;
      },
    });
    Reflect.defineMetadata('transformation:rules', transformations, target);
    
    console.log(`@PlainToClass applied to ${String(propertyKey)}`);
  };
}

/**
 * Marks a property to be transformed from class to plain object.
 * 
 * @param options - Transform options
 * @returns PropertyDecorator
 */
export function ClassToPlain(options?: TransformOptions): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const transformations = Reflect.getMetadata('transformation:rules', target) || [];
    transformations.push({
      propertyKey: String(propertyKey),
      transformer: 'ClassToPlain',
      options,
      transform: (value: any) => {
        if (value && typeof value === 'object' && value.constructor !== Object) {
          return JSON.parse(JSON.stringify(value));
        }
        return value;
      },
    });
    Reflect.defineMetadata('transformation:rules', transformations, target);
    
    console.log(`@ClassToPlain applied to ${String(propertyKey)}`);
  };
}

/**
 * Validation function to validate an object using stored validation rules.
 * 
 * @param target - The object to validate
 * @returns ValidationResult
 */
export function validate(target: any): ValidationResult {
  const validations = Reflect.getMetadata('validation:rules', target.constructor) || [];
  const errors: ValidationError[] = [];

  for (const validation of validations) {
    const value = target[validation.propertyKey];
    
    // Skip validation for optional fields that are undefined
    if (validation.optional && (value === undefined || value === null)) {
      continue;
    }

    if (!validation.validate(value)) {
      errors.push({
        property: validation.propertyKey,
        value,
        constraints: {
          [validation.validator]: validation.options?.message || `${validation.validator} validation failed`,
        },
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Transform function to transform an object using stored transformation rules.
 * 
 * @param target - The object to transform
 * @returns any - The transformed object
 */
export function transform(target: any): any {
  const transformations = Reflect.getMetadata('transformation:rules', target.constructor) || [];
  const result: any = {};

  // Copy all properties first
  Object.assign(result, target);

  // Apply transformations
  for (const transformation of transformations) {
    const value = target[transformation.propertyKey];
    
    if (transformation.transformer === 'Exclude') {
      delete result[transformation.propertyKey];
    } else {
      result[transformation.propertyKey] = transformation.transform(value);
    }
  }

  return result;
}

// Type definitions for validation and transformation options

export interface ValidationOptions {
  message?: string;
  groups?: string[];
  always?: boolean;
  each?: boolean;
  context?: any;
}

export interface NumberOptions {
  allowNaN?: boolean;
  allowInfinity?: boolean;
  maxDecimalPlaces?: number;
}

export interface EmailOptions {
  allow_display_name?: boolean;
  require_display_name?: boolean;
  allow_utf8_local_part?: boolean;
  require_tld?: boolean;
}

export interface UrlOptions {
  protocols?: string[];
  require_tld?: boolean;
  require_protocol?: boolean;
  require_host?: boolean;
  require_valid_protocol?: boolean;
  allow_underscores?: boolean;
  host_whitelist?: string[];
  host_blacklist?: string[];
  allow_trailing_dot?: boolean;
  allow_protocol_relative_urls?: boolean;
}

export type UUIDVersion = '3' | '4' | '5' | 'all';

export interface ExposeOptions {
  name?: string;
  since?: number;
  until?: number;
  groups?: string[];
}

export interface ExcludeOptions {
  toClassOnly?: boolean;
  toPlainOnly?: boolean;
  since?: number;
  until?: number;
  groups?: string[];
}

export interface TransformOptions {
  since?: number;
  until?: number;
  groups?: string[];
  toClassOnly?: boolean;
  toPlainOnly?: boolean;
}

export type TransformFn = (value: any, obj?: any, transformationType?: any) => any;
export type TypeFunction = () => any;

export interface TypeOptions {
  discriminator?: any;
  keepDiscriminatorProperty?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  property: string;
  value: any;
  constraints: Record<string, string>;
}

// Export default instance for convenience
export default Decorators;