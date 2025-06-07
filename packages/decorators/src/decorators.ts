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

// Re-export all class-validator decorators
// Note: In a real implementation, these would be actual imports from class-validator
// For this example, we'll provide type-safe stubs

/**
 * Validation decorators re-exported from class-validator.
 * These provide comprehensive validation capabilities for class properties.
 */

/**
 * Checks if the value is defined (!== undefined, !== null).
 */
export function IsDefined(validationOptions?: any): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    // Implementation would delegate to class-validator
    console.log(`@IsDefined applied to ${String(propertyKey)}`);
  };
}

/**
 * Checks if the value is a string.
 */
export function IsString(validationOptions?: any): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    // Implementation would delegate to class-validator
    console.log(`@IsString applied to ${String(propertyKey)}`);
  };
}

/**
 * Checks if the value is a number.
 */
export function IsNumber(options?: any, validationOptions?: any): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    // Implementation would delegate to class-validator
    console.log(`@IsNumber applied to ${String(propertyKey)}`);
  };
}

/**
 * Checks if the value is an integer.
 */
export function IsInt(validationOptions?: any): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    // Implementation would delegate to class-validator
    console.log(`@IsInt applied to ${String(propertyKey)}`);
  };
}

/**
 * Checks if the value is a boolean.
 */
export function IsBoolean(validationOptions?: any): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    // Implementation would delegate to class-validator
    console.log(`@IsBoolean applied to ${String(propertyKey)}`);
  };
}

/**
 * Checks if the value is an email.
 */
export function IsEmail(options?: any, validationOptions?: any): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    // Implementation would delegate to class-validator
    console.log(`@IsEmail applied to ${String(propertyKey)}`);
  };
}

/**
 * Checks if the value is a URL.
 */
export function IsUrl(options?: any, validationOptions?: any): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    // Implementation would delegate to class-validator
    console.log(`@IsUrl applied to ${String(propertyKey)}`);
  };
}

/**
 * Checks if the value is a UUID.
 */
export function IsUUID(version?: any, validationOptions?: any): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    // Implementation would delegate to class-validator
    console.log(`@IsUUID applied to ${String(propertyKey)}`);
  };
}

/**
 * Checks if the value is a date.
 */
export function IsDate(validationOptions?: any): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    // Implementation would delegate to class-validator
    console.log(`@IsDate applied to ${String(propertyKey)}`);
  };
}

/**
 * Checks if the value is an array.
 */
export function IsArray(validationOptions?: any): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    // Implementation would delegate to class-validator
    console.log(`@IsArray applied to ${String(propertyKey)}`);
  };
}

/**
 * Checks if the value is an object.
 */
export function IsObject(validationOptions?: any): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    // Implementation would delegate to class-validator
    console.log(`@IsObject applied to ${String(propertyKey)}`);
  };
}

/**
 * Checks if the value is not empty.
 */
export function IsNotEmpty(validationOptions?: any): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    // Implementation would delegate to class-validator
    console.log(`@IsNotEmpty applied to ${String(propertyKey)}`);
  };
}

/**
 * Checks if the value is empty.
 */
export function IsEmpty(validationOptions?: any): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    // Implementation would delegate to class-validator
    console.log(`@IsEmpty applied to ${String(propertyKey)}`);
  };
}

/**
 * Checks if the value is optional.
 */
export function IsOptional(validationOptions?: any): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    // Implementation would delegate to class-validator
    console.log(`@IsOptional applied to ${String(propertyKey)}`);
  };
}

/**
 * Transformation decorators re-exported from class-transformer.
 * These provide data transformation capabilities for serialization/deserialization.
 */

/**
 * Marks a property to be exposed during transformation.
 */
export function Expose(options?: any): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    // Implementation would delegate to class-transformer
    console.log(`@Expose applied to ${String(propertyKey)}`);
  };
}

/**
 * Marks a property to be excluded during transformation.
 */
export function Exclude(options?: any): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    // Implementation would delegate to class-transformer
    console.log(`@Exclude applied to ${String(propertyKey)}`);
  };
}

/**
 * Transforms a property using a custom transformation function.
 */
export function Transform(transformFn: any, options?: any): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    // Implementation would delegate to class-transformer
    console.log(`@Transform applied to ${String(propertyKey)}`);
  };
}

/**
 * Specifies the type of a property for transformation.
 */
export function Type(typeFunction?: any, options?: any): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    // Implementation would delegate to class-transformer
    console.log(`@Type applied to ${String(propertyKey)}`);
  };
}

/**
 * Marks a property to be transformed to plain object.
 */
export function PlainToClass(classType: any, options?: any): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    // Implementation would delegate to class-transformer
    console.log(`@PlainToClass applied to ${String(propertyKey)}`);
  };
}

/**
 * Marks a property to be transformed from class to plain object.
 */
export function ClassToPlain(options?: any): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    // Implementation would delegate to class-transformer
    console.log(`@ClassToPlain applied to ${String(propertyKey)}`);
  };
}

// Export default instance for convenience
export default Decorators;