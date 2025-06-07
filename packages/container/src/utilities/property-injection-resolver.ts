import { IPropertyInjectionResolver, IPropertyInjection } from '../interfaces/property-injection.interface';
import { METADATA_KEYS } from '../constants/metadata-keys.constant';

/**
 * Utility class for resolving property injections.
 * Handles the injection of dependencies into class properties.
 * 
 * @class PropertyInjectionResolver
 * @implements {IPropertyInjectionResolver}
 */
export class PropertyInjectionResolver implements IPropertyInjectionResolver {
  /**
   * Resolve property injections for a target instance.
   * Injects dependencies into properties marked with @Inject decorator.
   * 
   * @param target - The target instance
   * @param container - The container to resolve from
   * @returns void
   */
  resolveProperties(target: any, container: any): void {
    const propertyInjections = this.getPropertyInjections(target.constructor);

    for (const injection of propertyInjections) {
      try {
        let service: any;

        // Handle custom factory
        if (injection.factory) {
          service = injection.factory();
        } else {
          // Resolve from container
          service = container.get(injection.serviceIdentifier);
        }

        // Inject the service into the property
        target[injection.propertyKey] = service;
      } catch (error) {
        if (!injection.optional) {
          throw new Error(
            `Failed to inject property '${String(injection.propertyKey)}' with service '${String(injection.serviceIdentifier)}': ${error.message}`
          );
        }
        // For optional injections, set to undefined
        target[injection.propertyKey] = undefined;
      }
    }
  }

  /**
   * Get property injection metadata for a target.
   * Retrieves all properties marked for injection.
   * 
   * @param target - The target class
   * @returns IPropertyInjection[]
   */
  getPropertyInjections(target: any): IPropertyInjection[] {
    const injections: IPropertyInjection[] = [];
    
    // Get property injection metadata
    const propertyMetadata = Reflect.getMetadata(METADATA_KEYS.INJECT_PROPERTY, target) || {};
    
    for (const [propertyKey, metadata] of Object.entries(propertyMetadata)) {
      injections.push({
        propertyKey,
        ...(metadata as any),
      });
    }

    return injections;
  }

  /**
   * Create a new property injection resolver instance.
   * Factory method following the framework's .make() pattern.
   * 
   * @static
   * @returns PropertyInjectionResolver
   */
  static make(): PropertyInjectionResolver {
    return new PropertyInjectionResolver();
  }
}