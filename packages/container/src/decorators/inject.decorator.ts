import { inject as inversifyInject } from 'inversify';
import { METADATA_KEYS } from '../constants/metadata-keys.constant';
import { IPropertyInjection } from '../interfaces/property-injection.interface';

/**
 * Injects a dependency into a constructor parameter or property.
 * Enhanced version that supports property injection.
 * 
 * @param serviceIdentifier - The service identifier to inject
 * @returns ParameterDecorator | PropertyDecorator - The inject decorator
 */
export function Inject(serviceIdentifier: string | symbol): ParameterDecorator | PropertyDecorator {
  return function (target: any, propertyKey?: string | symbol, parameterIndex?: number) {
    // Handle property injection
    if (propertyKey !== undefined && parameterIndex === undefined) {
      // This is a property decorator
      const existingMetadata = Reflect.getMetadata(METADATA_KEYS.INJECT_PROPERTY, target.constructor) || {};
      
      existingMetadata[propertyKey] = {
        serviceIdentifier,
        optional: false,
      } as IPropertyInjection;
      
      Reflect.defineMetadata(METADATA_KEYS.INJECT_PROPERTY, existingMetadata, target.constructor);
      return;
    }
    
    // Handle constructor parameter injection (delegate to InversifyJS)
    if (parameterIndex !== undefined) {
      return inversifyInject(serviceIdentifier)(target, propertyKey, parameterIndex);
    }
    
    // Handle method parameter injection
    if (propertyKey !== undefined) {
      return inversifyInject(serviceIdentifier)(target, propertyKey, parameterIndex);
    }
  };
}

/**
 * Injects an optional dependency into a property.
 * If the service is not available, the property will be undefined.
 * 
 * @param serviceIdentifier - The service identifier to inject
 * @returns PropertyDecorator - The optional inject decorator
 */
export function InjectOptional(serviceIdentifier: string | symbol): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const existingMetadata = Reflect.getMetadata(METADATA_KEYS.INJECT_PROPERTY, target.constructor) || {};
    
    existingMetadata[propertyKey] = {
      serviceIdentifier,
      optional: true,
    } as IPropertyInjection;
    
    Reflect.defineMetadata(METADATA_KEYS.INJECT_PROPERTY, existingMetadata, target.constructor);
  };
}

/**
 * Alternative export for consistency with InversifyJS naming.
 */
export const inject = Inject;