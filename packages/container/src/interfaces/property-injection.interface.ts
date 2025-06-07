/**
 * Interface for property injection metadata.
 * Stores information about properties that should be injected.
 * 
 * @interface IPropertyInjection
 */
export interface IPropertyInjection {
  /**
   * The property key to inject into.
   */
  propertyKey: string | symbol;

  /**
   * The service identifier to inject.
   */
  serviceIdentifier: string | symbol;

  /**
   * Whether the injection is optional.
   */
  optional?: boolean;

  /**
   * Named constraint for the injection.
   */
  named?: string | number | symbol;

  /**
   * Tagged constraints for the injection.
   */
  tagged?: Array<{ key: string | number | symbol; value: any }>;

  /**
   * Custom factory function for the injection.
   */
  factory?: () => any;
}

/**
 * Interface for property injection resolver.
 * Handles the resolution of property injections.
 * 
 * @interface IPropertyInjectionResolver
 */
export interface IPropertyInjectionResolver {
  /**
   * Resolve property injections for a target instance.
   * 
   * @param target - The target instance
   * @param container - The container to resolve from
   * @returns void
   */
  resolveProperties(target: any, container: any): void;

  /**
   * Get property injection metadata for a target.
   * 
   * @param target - The target class or instance
   * @returns IPropertyInjection[]
   */
  getPropertyInjections(target: any): IPropertyInjection[];
}