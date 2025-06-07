/**
 * Enumeration for dependency injection types.
 * Defines how dependencies should be injected.
 * 
 * @enum InjectionType
 */
export enum InjectionType {
  /**
   * Constructor parameter injection.
   */
  CONSTRUCTOR = 'constructor',

  /**
   * Property injection.
   */
  PROPERTY = 'property',

  /**
   * Method parameter injection.
   */
  METHOD = 'method',

  /**
   * Setter method injection.
   */
  SETTER = 'setter',
}