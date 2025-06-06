/**
 * Main example file demonstrating metadata package usage
 */

import { Metadata, MetadataReflector, MetadataStorage } from '../src';

console.log('=== TSVEL Metadata Package Examples ===\n');

// Example 1: Basic Usage
console.log('1. Basic Metadata Operations:');

class User {
  name: string;
  email: string;
  
  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
  
  getName(): string {
    return this.name;
  }
  
  setName(name: string): void {
    this.name = name;
  }
}

// Define metadata
Metadata.define('entity:table', 'users', User);
Metadata.define('entity:primaryKey', 'id', User);
Metadata.define('field:type', 'varchar', User, 'name');
Metadata.define('field:length', 255, User, 'name');
Metadata.define('field:type', 'varchar', User, 'email');
Metadata.define('field:unique', true, User, 'email');

console.log('Table name:', Metadata.get('entity:table', User));
console.log('Primary key:', Metadata.get('entity:primaryKey', User));
console.log('Name field type:', Metadata.get('field:type', User, 'name'));
console.log('Name field length:', Metadata.get('field:length', User, 'name'));
console.log('Email unique:', Metadata.get('field:unique', User, 'email'));

// Example 2: Decorator Pattern
console.log('\n2. Decorator Pattern:');

function Entity(tableName: string) {
  return function (target: any) {
    Metadata.define('orm:table', tableName, target);
    Metadata.define('orm:entity', true, target);
  };
}

function Column(options: { type?: string; length?: number; unique?: boolean } = {}) {
  return function (target: any, propertyKey: string) {
    if (options.type) {
      Metadata.define('orm:type', options.type, target, propertyKey);
    }
    if (options.length) {
      Metadata.define('orm:length', options.length, target, propertyKey);
    }
    if (options.unique) {
      Metadata.define('orm:unique', options.unique, target, propertyKey);
    }
    Metadata.define('orm:column', true, target, propertyKey);
  };
}

function PrimaryKey() {
  return function (target: any, propertyKey: string) {
    Metadata.define('orm:primaryKey', true, target, propertyKey);
  };
}

@Entity('products')
class Product {
  @PrimaryKey()
  @Column({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'decimal' })
  price: number;

  @Column({ type: 'text' })
  description: string;

  constructor(id: number, name: string, price: number, description: string) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.description = description;
  }
}

console.log('Product table:', Metadata.get('orm:table', Product));
console.log('Product is entity:', Metadata.get('orm:entity', Product));
console.log('ID is primary key:', Metadata.get('orm:primaryKey', Product, 'id'));
console.log('Name column type:', Metadata.get('orm:type', Product, 'name'));
console.log('Name column length:', Metadata.get('orm:length', Product, 'name'));

// Example 3: Using Reflector
console.log('\n3. Using Metadata Reflector:');

const reflector = new MetadataReflector();

console.log('Product metadata properties:', reflector.getMetadataProperties(Product));
console.log('Product metadata methods:', reflector.getMetadataMethods(Product));
console.log('Is Product a constructor:', reflector.isConstructor(Product));

// Get all metadata for the name property
const nameMetadata = reflector.getAllMetadata(Product, 'name');
console.log('Name property metadata:', nameMetadata);

// Example 4: Custom Storage
console.log('\n4. Custom Storage Example:');

class CustomStorage extends MetadataStorage {
  private logs: string[] = [];

  set(metadataKey: string | symbol, metadataValue: any, target: any, propertyKey?: string | symbol): void {
    this.logs.push(`SET: ${String(metadataKey)} = ${metadataValue}`);
    super.set(metadataKey, metadataValue, target, propertyKey);
  }

  get(metadataKey: string | symbol, target: any, propertyKey?: string | symbol): any {
    this.logs.push(`GET: ${String(metadataKey)}`);
    return super.get(metadataKey, target, propertyKey);
  }

  getLogs(): string[] {
    return this.logs;
  }
}

const customStorage = new CustomStorage();
Metadata.setStorage(customStorage);

class TestClass {}
Metadata.define('test:key', 'test:value', TestClass);
const value = Metadata.get('test:key', TestClass);

console.log('Retrieved value:', value);
console.log('Storage logs:', customStorage.getLogs());

// Example 5: Reflect API compatibility
console.log('\n5. Reflect API Compatibility:');

class ReflectExample {}

// Using Metadata.reflect (compatible with Reflect API)
Metadata.reflect.defineMetadata('reflect:test', 'reflect:value', ReflectExample);
console.log('Reflect get:', Metadata.reflect.getMetadata('reflect:test', ReflectExample));
console.log('Reflect has:', Metadata.reflect.hasMetadata('reflect:test', ReflectExample));

const keys = Metadata.reflect.getMetadataKeys(ReflectExample);
console.log('Reflect keys:', keys);

console.log('\n=== Examples Complete ===');