/**
 * Main example file demonstrating logger package usage
 */

import { Logger, LogLevel } from '../src';
import {
  basicLoggingExample,
  childLoggerExample,
  decoratorExample,
} from './basic-logging';

console.log('=== TSVEL Logger Package Examples ===\n');

// Example 1: Basic Usage
basicLoggingExample();

// Example 2: Child Logger
childLoggerExample();

// Example 3: Decorators
decoratorExample();

// Example 4: Service Provider
function serviceProviderExample() {
  console.log('\n=== Service Provider Example ===');
  
  // This would typically be done during application bootstrap
  console.log('Service provider would be registered during app initialization');
}

serviceProviderExample();

console.log('\n=== Examples Complete ===');