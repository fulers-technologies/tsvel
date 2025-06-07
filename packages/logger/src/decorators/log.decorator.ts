import { Logger } from '../logger';
import { LogLevel } from '../enums/log-level.enum';

/**
 * Method decorator that logs method calls, parameters, and results.
 * Provides detailed tracing of method execution for debugging purposes.
 * 
 * @param options - Configuration options for the logging behavior
 * @returns MethodDecorator - The decorator function
 */
export function Log(options: LogOptions = {}): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const methodName = String(propertyKey);
    const className = target.constructor.name;
    
    // Get or create logger for this class
    const logger = target.constructor.__logger || Logger.make({ class: className });
    
    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now();
      const logLevel = options.level || LogLevel.DEBUG;
      const includeArgs = options.includeArgs !== false;
      const includeResult = options.includeResult !== false;
      
      // Log method entry
      if (logLevel <= logger.getLevel()) {
        const entryMeta: any = { method: methodName };
        if (includeArgs) {
          entryMeta.args = args;
        }
        
        await logger.debug(`Entering ${className}.${methodName}`, entryMeta);
      }
      
      try {
        // Execute the original method
        const result = await originalMethod.apply(this, args);
        const executionTime = Date.now() - startTime;
        
        // Log successful completion
        if (logLevel <= logger.getLevel()) {
          const successMeta: any = { 
            method: methodName, 
            executionTime: `${executionTime}ms` 
          };
          
          if (includeResult && result !== undefined) {
            successMeta.result = result;
          }
          
          await logger.debug(`Completed ${className}.${methodName}`, successMeta);
        }
        
        return result;
      } catch (error) {
        const executionTime = Date.now() - startTime;
        
        // Log error
        await logger.error(`Error in ${className}.${methodName}`, {
          method: methodName,
          executionTime: `${executionTime}ms`,
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
        
        // Re-throw the error
        throw error;
      }
    };
    
    return descriptor;
  };
}

/**
 * Configuration options for the Log decorator.
 * 
 * @interface LogOptions
 */
export interface LogOptions {
  /**
   * The log level to use for method logging.
   * Defaults to DEBUG.
   */
  level?: LogLevel;
  
  /**
   * Whether to include method arguments in log messages.
   * Defaults to true.
   */
  includeArgs?: boolean;
  
  /**
   * Whether to include method results in log messages.
   * Defaults to true.
   */
  includeResult?: boolean;
  
  /**
   * Custom message prefix for log entries.
   */
  prefix?: string;
}