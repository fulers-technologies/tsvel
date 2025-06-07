import { DecoratorFactory } from '@tsvel/decorators';
import { Logger } from '../logger';

/**
 * Class decorator that adds logging capabilities to a class.
 * Automatically logs method calls and their results for debugging purposes.
 * 
 * @param options - Configuration options for the logging behavior
 * @returns ClassDecorator - The decorator function
 */
export function Loggable(options: LoggableOptions = {}): ClassDecorator {
  return DecoratorFactory.registerClass(
    'Loggable',
    (constructor: any, opts: LoggableOptions) => {
      const logger = Logger.make({ class: constructor.name });
      
      // Store the logger instance on the class for access by other decorators
      (constructor as any).__logger = logger;
      
      // Log class instantiation if enabled
      if (opts.logInstantiation !== false) {
        const originalConstructor = constructor;
        
        const newConstructor = class extends originalConstructor {
          constructor(...args: any[]) {
            super(...args);
            logger.debug(`${constructor.name} instantiated`, { args });
          }
        };
        
        // Preserve the original constructor name
        Object.defineProperty(newConstructor, 'name', { value: constructor.name });
        
        return newConstructor as any;
      }
      
      return constructor;
    },
    { description: 'Adds logging capabilities to a class' }
  );
}

/**
 * Configuration options for the Loggable decorator.
 * 
 * @interface LoggableOptions
 */
export interface LoggableOptions {
  /**
   * Whether to log class instantiation.
   * Defaults to true.
   */
  logInstantiation?: boolean;
  
  /**
   * Whether to log method calls automatically.
   * Defaults to false (use @Log decorator on individual methods).
   */
  logMethods?: boolean;
  
  /**
   * Custom logger context to include in all log messages.
   */
  context?: Record<string, any>;
}