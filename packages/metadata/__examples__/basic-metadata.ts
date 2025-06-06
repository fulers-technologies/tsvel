/**
 * Basic metadata usage examples
 */

import { Metadata } from '../src';

// Example 1: Basic metadata operations
class ExampleClass {
  property: string = 'test';
  
  method(): void {
    console.log('method called');
  }
}

// Define metadata on class
Metadata.define('custom:description', 'This is an example class', ExampleClass);
Metadata.define('custom:version', '1.0.0', ExampleClass);

// Define metadata on property
Metadata.define('custom:type', 'string', ExampleClass, 'property');
Metadata.define('custom:required', true, ExampleClass, 'property');

// Define metadata on method
Metadata.define('custom:route', '/api/example', ExampleClass, 'method');
Metadata.define('custom:httpMethod', 'GET', ExampleClass, 'method');

// Get metadata
console.log('Class description:', Metadata.get('custom:description', ExampleClass));
console.log('Class version:', Metadata.get('custom:version', ExampleClass));
console.log('Property type:', Metadata.get('custom:type', ExampleClass, 'property'));
console.log('Property required:', Metadata.get('custom:required', ExampleClass, 'property'));
console.log('Method route:', Metadata.get('custom:route', ExampleClass, 'method'));
console.log('Method HTTP method:', Metadata.get('custom:httpMethod', ExampleClass, 'method'));

// Check if metadata exists
console.log('Has description:', Metadata.has('custom:description', ExampleClass));
console.log('Has unknown key:', Metadata.has('custom:unknown', ExampleClass));

// Get all keys
console.log('Class metadata keys:', Metadata.getKeys(ExampleClass));
console.log('Property metadata keys:', Metadata.getKeys(ExampleClass, 'property'));
console.log('Method metadata keys:', Metadata.getKeys(ExampleClass, 'method'));

// Example 2: Using with decorators
function Route(path: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Metadata.define('route:path', path, target, propertyKey);
  };
}

function HttpMethod(method: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Metadata.define('route:method', method, target, propertyKey);
  };
}

function Controller(prefix: string) {
  return function (target: any) {
    Metadata.define('controller:prefix', prefix, target);
  };
}

@Controller('/api/users')
class UserController {
  @Route('/')
  @HttpMethod('GET')
  getUsers() {
    return [];
  }

  @Route('/:id')
  @HttpMethod('GET')
  getUser() {
    return {};
  }

  @Route('/')
  @HttpMethod('POST')
  createUser() {
    return {};
  }
}

// Read decorator metadata
console.log('\nController prefix:', Metadata.get('controller:prefix', UserController));
console.log('getUsers route:', Metadata.get('route:path', UserController, 'getUsers'));
console.log('getUsers method:', Metadata.get('route:method', UserController, 'getUsers'));
console.log('getUser route:', Metadata.get('route:path', UserController, 'getUser'));
console.log('createUser method:', Metadata.get('route:method', UserController, 'createUser'));

// Example 3: Using reflector
const reflector = Metadata.getReflector();

console.log('\nMetadata properties:', reflector.getMetadataProperties(UserController));
console.log('Metadata methods:', reflector.getMetadataMethods(UserController));
console.log('Is constructor:', reflector.isConstructor(UserController));
console.log('Is getUsers a method:', reflector.isMethod(UserController, 'getUsers'));

// Get all metadata for a method
console.log('All getUsers metadata:', reflector.getAllMetadata(UserController, 'getUsers'));