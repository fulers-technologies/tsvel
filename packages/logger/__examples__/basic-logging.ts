/**
 * Basic logging usage examples
 */

import { Logger, LogLevel } from '../src';

// Example 1: Basic logger usage
function basicLoggingExample() {
  console.log('=== Basic Logging Example ===');
  
  const logger = Logger.make({ component: 'example' });
  
  // Set log level
  logger.setLevel(LogLevel.DEBUG);
  
  // Log different levels
  logger.debug('This is a debug message', { userId: 123 });
  logger.info('Application started successfully');
  logger.warn('This is a warning message', { reason: 'deprecated API' });
  logger.error('An error occurred', { error: 'Connection failed' });
}

// Example 2: Child logger usage
function childLoggerExample() {
  console.log('\n=== Child Logger Example ===');
  
  const parentLogger = Logger.make({ service: 'user-service' });
  const childLogger = parentLogger.child({ operation: 'create-user' });
  
  parentLogger.info('Parent logger message');
  childLogger.info('Child logger message with additional context');
}

// Example 3: Using decorators
function decoratorExample() {
  console.log('\n=== Decorator Example ===');
  
  // This would be used in a real class
  console.log('Decorator examples would be applied to actual classes');
}

// Export for main.ts
export {
  basicLoggingExample,
  childLoggerExample,
  decoratorExample,
};