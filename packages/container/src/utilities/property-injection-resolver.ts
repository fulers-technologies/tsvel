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
   * Cache for resolved property injections to improve performance.
   */
  private static injectionCache = new WeakMap<any, IPropertyInjection[]>();

  /**
   * Resolve property injections for a target instance.
   * Injects dependencies into properties marked with @Inject decorator.
   * 
   * @param target - The target instance
   * @param container - The container to resolve from
   * @returns void
   */
  resolveProperties(target: any, container: any): void {
    if (!target || typeof target !== 'object') {
      return;
    }

    const propertyInjections = this.getPropertyInjections(target.constructor);

    for (const injection of propertyInjections) {
      try {
        let service: any;

        // Handle custom factory
        if (injection.factory) {
          service = injection.factory();
        } else {
          // Handle named injections
          if (injection.named !== undefined) {
            service = container.getNamed(injection.serviceIdentifier, injection.named);
          }
          // Handle tagged injections
          else if (injection.tagged && injection.tagged.length > 0) {
            const tag = injection.tagged[0]; // Use first tag for simplicity
            service = container.getTagged(injection.serviceIdentifier, tag.key, tag.value);
          }
          // Standard resolution
          else {
            service = container.get(injection.serviceIdentifier);
          }
        }

        // Inject the service into the property
        Object.defineProperty(target, injection.propertyKey, {
          value: service,
          writable: false,
          enumerable: true,
          configurable: false,
        });

        // Log successful injection in development
        if (process.env.NODE_ENV === 'development') {
          console.debug(`Injected ${String(injection.serviceIdentifier)} into ${target.constructor.name}.${String(injection.propertyKey)}`);
        }
      } catch (error) {
        if (!injection.optional) {
          throw new Error(
            `Failed to inject property '${String(injection.propertyKey)}' with service '${String(injection.serviceIdentifier)}' in class '${target.constructor.name}': ${error instanceof Error ? error.message : String(error)}`
          );
        }
        
        // For optional injections, set to undefined
        Object.defineProperty(target, injection.propertyKey, {
          value: undefined,
          writable: false,
          enumerable: true,
          configurable: false,
        });

        // Log optional injection failure in development
        if (process.env.NODE_ENV === 'development') {
          console.debug(`Optional injection failed for ${target.constructor.name}.${String(injection.propertyKey)}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    }
  }

  /**
   * Get property injection metadata for a target.
   * Retrieves all properties marked for injection with caching.
   * 
   * @param target - The target class
   * @returns IPropertyInjection[]
   */
  getPropertyInjections(target: any): IPropertyInjection[] {
    // Check cache first
    if (PropertyInjectionResolver.injectionCache.has(target)) {
      return PropertyInjectionResolver.injectionCache.get(target)!;
    }

    const injections: IPropertyInjection[] = [];
    
    // Get property injection metadata from the class and its prototype chain
    let currentTarget = target;
    while (currentTarget && currentTarget !== Object.prototype) {
      const propertyMetadata = Reflect.getMetadata(METADATA_KEYS.INJECT_PROPERTY, currentTarget) || {};
      
      for (const [propertyKey, metadata] of Object.entries(propertyMetadata)) {
        // Avoid duplicate injections from inheritance
        if (!injections.some(inj => inj.propertyKey === propertyKey)) {
          injections.push({
            propertyKey,
            ...(metadata as any),
          });
        }
      }

      // Move up the prototype chain
      currentTarget = Object.getPrototypeOf(currentTarget);
    }

    // Cache the result
    PropertyInjectionResolver.injectionCache.set(target, injections);

    return injections;
  }

  /**
   * Clear the injection cache for a specific target or all targets.
   * 
   * @param target - Optional target to clear cache for
   * @returns void
   */
  clearCache(target?: any): void {
    if (target) {
      PropertyInjectionResolver.injectionCache.delete(target);
    } else {
      PropertyInjectionResolver.injectionCache = new WeakMap();
    }
  }

  /**
   * Check if a class has property injections.
   * 
   * @param target - The target class
   * @returns boolean
   */
  hasPropertyInjections(target: any): boolean {
    return this.getPropertyInjections(target).length > 0;
  }

  /**
   * Validate property injection metadata.
   * 
   * @param injection - The injection metadata to validate
   * @returns boolean
   */
  validateInjection(injection: IPropertyInjection): boolean {
    if (!injection.propertyKey || !injection.serviceIdentifier) {
      return false;
    }

    // Validate named constraints
    if (injection.named !== undefined && (typeof injection.named !== 'string' && typeof injection.named !== 'number' && typeof injection.named !== 'symbol')) {
      return false;
    }

    // Validate tagged constraints
    if (injection.tagged && !Array.isArray(injection.tagged)) {
      return false;
    }

    return true;
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

  /**
   * Get the singleton property injection resolver instance.
   * 
   * @static
   * @returns PropertyInjectionResolver
   */
  static getInstance(): PropertyInjectionResolver {
    if (!PropertyInjectionResolver.instance) {
      PropertyInjectionResolver.instance = new PropertyInjectionResolver();
    }
    return PropertyInjectionResolver.instance;
  }

  /**
   * Singleton instance.
   */
  private static instance: PropertyInjectionResolver;
}