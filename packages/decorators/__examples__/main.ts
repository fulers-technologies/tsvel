/**
 * Main example file demonstrating decorators package usage
 */

import { Decorators, DecoratorRegistry, DecoratorType } from '../src';
import {
  UserDto,
  ProductDto,
  validationExample,
} from './validation-example';

console.log('=== TSVEL Decorators Package Examples ===\n');

// Example 1: Basic Validation
validationExample();

// Example 2: Decorator Registry
function registryExample() {
  console.log('\n=== Decorator Registry Example ===');
  
  const registry = DecoratorRegistry.getInstance();
  const stats = registry.getStats();
  
  console.log('Registry statistics:', stats);
  
  // Get validation decorators
  const validationDecorators = registry.getDecoratorsByType(DecoratorType.VALIDATION);
  console.log('Validation decorators count:', validationDecorators.length);
}

registryExample();

// Example 3: Service Provider
function serviceProviderExample() {
  console.log('\n=== Service Provider Example ===');
  
  // This would typically be done during application bootstrap
  console.log('Service provider would be registered during app initialization');
}

serviceProviderExample();

// Example 4: Transformation Decorators
function transformationExample() {
  console.log('\n=== Transformation Example ===');
  
  // This would show class-transformer usage
  console.log('Transformation decorators would be used for serialization/deserialization');
}

transformationExample();

console.log('\n=== Examples Complete ===');