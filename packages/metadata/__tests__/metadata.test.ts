/**
 * Tests for the metadata functionality
 */

import { Metadata, MetadataStorage, MetadataReflector } from '../src';

describe('Metadata', () => {
  beforeEach(() => {
    // Reset storage before each test
    Metadata.setStorage(new MetadataStorage());
  });

  describe('basic operations', () => {
    it('should define and get metadata', () => {
      class TestClass {}
      
      Metadata.define('test:key', 'test:value', TestClass);
      const value = Metadata.get('test:key', TestClass);
      
      expect(value).toBe('test:value');
    });

    it('should define and get property metadata', () => {
      class TestClass {
        property: string = 'test';
      }
      
      Metadata.define('prop:type', 'string', TestClass, 'property');
      const value = Metadata.get('prop:type', TestClass, 'property');
      
      expect(value).toBe('string');
    });

    it('should check if metadata exists', () => {
      class TestClass {}
      
      Metadata.define('test:key', 'test:value', TestClass);
      
      expect(Metadata.has('test:key', TestClass)).toBe(true);
      expect(Metadata.has('nonexistent:key', TestClass)).toBe(false);
    });

    it('should delete metadata', () => {
      class TestClass {}
      
      Metadata.define('test:key', 'test:value', TestClass);
      expect(Metadata.has('test:key', TestClass)).toBe(true);
      
      const deleted = Metadata.delete('test:key', TestClass);
      expect(deleted).toBe(true);
      expect(Metadata.has('test:key', TestClass)).toBe(false);
    });

    it('should get metadata keys', () => {
      class TestClass {}
      
      Metadata.define('key1', 'value1', TestClass);
      Metadata.define('key2', 'value2', TestClass);
      
      const keys = Metadata.getKeys(TestClass);
      expect(keys).toContain('key1');
      expect(keys).toContain('key2');
      expect(keys).toHaveLength(2);
    });

    it('should clear metadata', () => {
      class TestClass {}
      
      Metadata.define('key1', 'value1', TestClass);
      Metadata.define('key2', 'value2', TestClass);
      
      expect(Metadata.getKeys(TestClass)).toHaveLength(2);
      
      Metadata.clear(TestClass);
      expect(Metadata.getKeys(TestClass)).toHaveLength(0);
    });
  });

  describe('reflect API compatibility', () => {
    it('should work with reflect.defineMetadata', () => {
      class TestClass {}
      
      Metadata.reflect.defineMetadata('reflect:key', 'reflect:value', TestClass);
      const value = Metadata.reflect.getMetadata('reflect:key', TestClass);
      
      expect(value).toBe('reflect:value');
    });

    it('should work with reflect.hasMetadata', () => {
      class TestClass {}
      
      Metadata.reflect.defineMetadata('reflect:key', 'reflect:value', TestClass);
      
      expect(Metadata.reflect.hasMetadata('reflect:key', TestClass)).toBe(true);
      expect(Metadata.reflect.hasMetadata('nonexistent', TestClass)).toBe(false);
    });

    it('should work with reflect.getMetadataKeys', () => {
      class TestClass {}
      
      Metadata.reflect.defineMetadata('key1', 'value1', TestClass);
      Metadata.reflect.defineMetadata('key2', 'value2', TestClass);
      
      const keys = Metadata.reflect.getMetadataKeys(TestClass);
      expect(keys).toContain('key1');
      expect(keys).toContain('key2');
    });
  });

  describe('decorator usage', () => {
    it('should work with class decorators', () => {
      function TestDecorator(value: string) {
        return function (target: any) {
          Metadata.define('decorator:value', value, target);
        };
      }

      @TestDecorator('test-value')
      class DecoratedClass {}

      const value = Metadata.get('decorator:value', DecoratedClass);
      expect(value).toBe('test-value');
    });

    it('should work with property decorators', () => {
      function PropertyDecorator(type: string) {
        return function (target: any, propertyKey: string) {
          Metadata.define('property:type', type, target, propertyKey);
        };
      }

      class TestClass {
        @PropertyDecorator('string')
        property: string = 'test';
      }

      const type = Metadata.get('property:type', TestClass, 'property');
      expect(type).toBe('string');
    });

    it('should work with method decorators', () => {
      function MethodDecorator(route: string) {
        return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
          Metadata.define('method:route', route, target, propertyKey);
        };
      }

      class TestClass {
        @MethodDecorator('/api/test')
        testMethod() {
          return 'test';
        }
      }

      const route = Metadata.get('method:route', TestClass, 'testMethod');
      expect(route).toBe('/api/test');
    });
  });
});

describe('MetadataReflector', () => {
  let reflector: MetadataReflector;

  beforeEach(() => {
    reflector = new MetadataReflector();
    Metadata.setStorage(new MetadataStorage());
  });

  it('should identify constructors', () => {
    class TestClass {}
    function testFunction() {}
    const testObject = {};

    expect(reflector.isConstructor(TestClass)).toBe(true);
    expect(reflector.isConstructor(testFunction)).toBe(true);
    expect(reflector.isConstructor(testObject)).toBe(false);
  });

  it('should identify methods', () => {
    class TestClass {
      property: string = 'test';
      method() {}
      get getter() { return 'test'; }
      set setter(value: string) {}
    }

    expect(reflector.isMethod(TestClass, 'method')).toBe(true);
    expect(reflector.isMethod(TestClass, 'property')).toBe(false);
  });

  it('should get metadata properties', () => {
    class TestClass {
      property1: string = 'test';
      property2: number = 42;
      method() {}
    }

    Metadata.define('test:key', 'value', TestClass, 'property1');
    Metadata.define('test:key', 'value', TestClass, 'method');

    const properties = reflector.getMetadataProperties(TestClass);
    expect(properties).toContain('property1');
    expect(properties).toContain('method');
  });

  it('should get all metadata', () => {
    class TestClass {}

    Metadata.define('key1', 'value1', TestClass, 'property');
    Metadata.define('key2', 'value2', TestClass, 'property');

    const metadata = reflector.getAllMetadata(TestClass, 'property');
    expect(metadata).toEqual({
      key1: 'value1',
      key2: 'value2'
    });
  });

  it('should copy metadata', () => {
    class SourceClass {}
    class TargetClass {}

    Metadata.define('key1', 'value1', SourceClass, 'property');
    Metadata.define('key2', 'value2', SourceClass, 'property');

    reflector.copyMetadata(SourceClass, TargetClass, 'property', 'property');

    expect(Metadata.get('key1', TargetClass, 'property')).toBe('value1');
    expect(Metadata.get('key2', TargetClass, 'property')).toBe('value2');
  });
});

describe('MetadataStorage', () => {
  let storage: MetadataStorage;

  beforeEach(() => {
    storage = new MetadataStorage();
  });

  it('should store and retrieve target metadata', () => {
    const target = {};
    storage.set('key', 'value', target);
    
    expect(storage.get('key', target)).toBe('value');
    expect(storage.has('key', target)).toBe(true);
  });

  it('should store and retrieve property metadata', () => {
    const target = {};
    storage.set('key', 'value', target, 'property');
    
    expect(storage.get('key', target, 'property')).toBe('value');
    expect(storage.has('key', target, 'property')).toBe(true);
  });

  it('should delete metadata', () => {
    const target = {};
    storage.set('key', 'value', target);
    
    expect(storage.delete('key', target)).toBe(true);
    expect(storage.has('key', target)).toBe(false);
    expect(storage.delete('key', target)).toBe(false);
  });

  it('should get metadata keys', () => {
    const target = {};
    storage.set('key1', 'value1', target);
    storage.set('key2', 'value2', target);
    
    const keys = storage.getKeys(target);
    expect(keys).toContain('key1');
    expect(keys).toContain('key2');
    expect(keys).toHaveLength(2);
  });

  it('should clear metadata', () => {
    const target = {};
    storage.set('key1', 'value1', target);
    storage.set('key2', 'value2', target);
    
    storage.clear(target);
    expect(storage.getKeys(target)).toHaveLength(0);
  });
});