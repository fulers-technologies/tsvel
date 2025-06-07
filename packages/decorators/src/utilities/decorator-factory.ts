import { DecoratorType } from '../enums/decorator-type.enum';
import { DecoratorRegistry } from './decorator-registry';

/**
 * Factory class for creating and registering decorators.
 * Provides a centralized way to create decorators for all packages.
 * 
 * @class DecoratorFactory
 */
export class DecoratorFactory {
  /**
   * The decorator registry instance.
   */
  private static registry = DecoratorRegistry.getInstance();

  /**
   * Register a validation decorator.
   * Creates and registers a validation decorator with class-validator integration.
   * 
   * @param name - The decorator name
   * @param validator - The validation function
   * @param options - Optional configuration
   * @returns PropertyDecorator
   */
  static registerValidation(
    name: string,
    validator: (value: any, args?: any) => boolean,
    options: ValidationDecoratorOptions = {}
  ): PropertyDecorator {
    const decorator = function (target: any, propertyKey: string | symbol) {
      // Store validation metadata
      const existingValidations = Reflect.getMetadata('custom:validations', target) || [];
      existingValidations.push({
        propertyKey: String(propertyKey),
        validator,
        options,
        name,
      });
      Reflect.defineMetadata('custom:validations', existingValidations, target);
    };

    // Register with the decorator registry
    DecoratorFactory.registry.registerDecorator(decorator, {
      id: `validation.${name}`,
      type: DecoratorType.VALIDATION,
      name,
      description: options.message || `Custom validation: ${name}`,
      source: 'custom',
      enabled: true,
    });

    return decorator;
  }

  /**
   * Register a class decorator.
   * Creates and registers a class decorator.
   * 
   * @param name - The decorator name
   * @param enhancer - The class enhancement function
   * @param options - Optional configuration
   * @returns ClassDecorator
   */
  static registerClass(
    name: string,
    enhancer: (target: any, options?: any) => any,
    options: ClassDecoratorOptions = {}
  ): ClassDecorator {
    const decorator = function <T extends { new (...args: any[]): {} }>(target: T) {
      return enhancer(target, options) || target;
    };

    // Register with the decorator registry
    DecoratorFactory.registry.registerDecorator(decorator, {
      id: `class.${name}`,
      type: DecoratorType.CLASS,
      name,
      description: options.description || `Class decorator: ${name}`,
      source: 'custom',
      enabled: true,
    });

    return decorator;
  }

  /**
   * Register a method decorator.
   * Creates and registers a method decorator.
   * 
   * @param name - The decorator name
   * @param interceptor - The method interception function
   * @param options - Optional configuration
   * @returns MethodDecorator
   */
  static registerMethod(
    name: string,
    interceptor: (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor, options?: any) => PropertyDescriptor | void,
    options: MethodDecoratorOptions = {}
  ): MethodDecorator {
    const decorator = function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
      return interceptor(target, propertyKey, descriptor, options) || descriptor;
    };

    // Register with the decorator registry
    DecoratorFactory.registry.registerDecorator(decorator, {
      id: `method.${name}`,
      type: DecoratorType.METHOD,
      name,
      description: options.description || `Method decorator: ${name}`,
      source: 'custom',
      enabled: true,
    });

    return decorator;
  }

  /**
   * Register a property decorator.
   * Creates and registers a property decorator.
   * 
   * @param name - The decorator name
   * @param enhancer - The property enhancement function
   * @param options - Optional configuration
   * @returns PropertyDecorator
   */
  static registerProperty(
    name: string,
    enhancer: (target: any, propertyKey: string | symbol, options?: any) => void,
    options: PropertyDecoratorOptions = {}
  ): PropertyDecorator {
    const decorator = function (target: any, propertyKey: string | symbol) {
      enhancer(target, propertyKey, options);
    };

    // Register with the decorator registry
    DecoratorFactory.registry.registerDecorator(decorator, {
      id: `property.${name}`,
      type: DecoratorType.PROPERTY,
      name,
      description: options.description || `Property decorator: ${name}`,
      source: 'custom',
      enabled: true,
    });

    return decorator;
  }

  /**
   * Register a parameter decorator.
   * Creates and registers a parameter decorator.
   * 
   * @param name - The decorator name
   * @param enhancer - The parameter enhancement function
   * @param options - Optional configuration
   * @returns ParameterDecorator
   */
  static registerParameter(
    name: string,
    enhancer: (target: any, propertyKey: string | symbol | undefined, parameterIndex: number, options?: any) => void,
    options: ParameterDecoratorOptions = {}
  ): ParameterDecorator {
    const decorator = function (target: any, propertyKey: string | symbol | undefined, parameterIndex: number) {
      enhancer(target, propertyKey, parameterIndex, options);
    };

    // Register with the decorator registry
    DecoratorFactory.registry.registerDecorator(decorator, {
      id: `parameter.${name}`,
      type: DecoratorType.PARAMETER,
      name,
      description: options.description || `Parameter decorator: ${name}`,
      source: 'custom',
      enabled: true,
    });

    return decorator;
  }

  /**
   * Register a custom decorator with specific type.
   * Creates and registers a decorator with custom logic.
   * 
   * @param name - The decorator name
   * @param type - The decorator type
   * @param decorator - The decorator function
   * @param options - Optional configuration
   * @returns Function
   */
  static registerCustom(
    name: string,
    type: DecoratorType,
    decorator: Function,
    options: CustomDecoratorOptions = {}
  ): Function {
    // Register with the decorator registry
    DecoratorFactory.registry.registerDecorator(decorator, {
      id: `${type}.${name}`,
      type,
      name,
      description: options.description || `Custom decorator: ${name}`,
      source: options.source || 'custom',
      enabled: true,
    });

    return decorator;
  }

  /**
   * Get the decorator registry instance.
   * 
   * @returns DecoratorRegistry
   */
  static getRegistry(): DecoratorRegistry {
    return DecoratorFactory.registry;
  }
}

/**
 * Options for validation decorators.
 */
export interface ValidationDecoratorOptions {
  message?: string;
  constraints?: Record<string, any>;
  skipIf?: (target: any) => boolean;
}

/**
 * Options for class decorators.
 */
export interface ClassDecoratorOptions {
  description?: string;
  metadata?: Record<string, any>;
}

/**
 * Options for method decorators.
 */
export interface MethodDecoratorOptions {
  description?: string;
  metadata?: Record<string, any>;
}

/**
 * Options for property decorators.
 */
export interface PropertyDecoratorOptions {
  description?: string;
  metadata?: Record<string, any>;
}

/**
 * Options for parameter decorators.
 */
export interface ParameterDecoratorOptions {
  description?: string;
  metadata?: Record<string, any>;
}

/**
 * Options for custom decorators.
 */
export interface CustomDecoratorOptions {
  description?: string;
  source?: string;
  metadata?: Record<string, any>;
}