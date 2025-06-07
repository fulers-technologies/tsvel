import { IPropertyInjection } from './property-injection.interface';

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