import { DecoratorFactory } from '@tsvel/decorators';

/**
 * Class decorator that adds middleware capabilities to a class.
 * Enables automatic middleware processing for class methods.
 * 
 * @param options - Configuration options for the middleware behavior
 * @returns ClassDecorator - The decorator function
 */
export function Middlewareable(options: MiddlewareableOptions = {}): ClassDecorator {
  return DecoratorFactory.registerClass(
    'Middlewareable',
    (constructor: any, opts: MiddlewareableOptions) => {
      // Store middleware configuration on the class
      (constructor as any).__middlewareConfig = opts;
      
      return constructor;
    },
    { description: 'Adds middleware capabilities to a class' }
  );
}

/**
 * Configuration options for the Middlewareable decorator.
 * 
 * @interface MiddlewareableOptions
 */
export interface MiddlewareableOptions {
  /**
   * Global middleware to apply to all methods.
   */
  globalMiddleware?: string[];
  
  /**
   * Whether to enable middleware by default for all methods.
   */
  enableByDefault?: boolean;
  
  /**
   * Custom middleware resolver.
   */
  resolver?: (middlewareName: string) => any;
}