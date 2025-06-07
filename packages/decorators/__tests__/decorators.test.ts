/**
 * Tests for the decorators functionality
 */

import { Decorators, DecoratorRegistry, DecoratorType } from '../src';

describe('Decorators', () => {
  describe('Decorators class', () => {
    it('should create a decorators instance', () => {
      const decorators = Decorators.make();
      expect(decorators).toBeDefined();
      expect(decorators).toBeInstanceOf(Decorators);
    });

    it('should return singleton instance', () => {
      const instance1 = Decorators.getInstance();
      const instance2 = Decorators.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('validation decorators', () => {
    it('should apply IsString decorator', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      class TestClass {
        @IsString()
        name: string = 'test';
      }

      expect(consoleSpy).toHaveBeenCalledWith('@IsString applied to name');
      consoleSpy.mockRestore();
    });

    it('should apply IsEmail decorator', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      class TestClass {
        @IsEmail()
        email: string = 'test@example.com';
      }

      expect(consoleSpy).toHaveBeenCalledWith('@IsEmail applied to email');
      consoleSpy.mockRestore();
    });

    it('should apply IsNotEmpty decorator', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      class TestClass {
        @IsNotEmpty()
        value: string = 'test';
      }

      expect(consoleSpy).toHaveBeenCalledWith('@IsNotEmpty applied to value');
      consoleSpy.mockRestore();
    });
  });

  describe('transformation decorators', () => {
    it('should apply Expose decorator', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      class TestClass {
        @Expose()
        publicField: string = 'test';
      }

      expect(consoleSpy).toHaveBeenCalledWith('@Expose applied to publicField');
      consoleSpy.mockRestore();
    });

    it('should apply Transform decorator', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      class TestClass {
        @Transform((value) => value.toUpperCase())
        name: string = 'test';
      }

      expect(consoleSpy).toHaveBeenCalledWith('@Transform applied to name');
      consoleSpy.mockRestore();
    });
  });
});

describe('DecoratorRegistry', () => {
  let registry: DecoratorRegistry;

  beforeEach(() => {
    registry = DecoratorRegistry.make();
  });

  describe('decorator registration', () => {
    it('should register a decorator', () => {
      const decorator = function() {};
      const metadata = {
        id: 'test.decorator',
        type: DecoratorType.CUSTOM,
        name: 'TestDecorator',
        source: 'test',
        enabled: true,
      };

      registry.registerDecorator(decorator, metadata);
      
      expect(registry.hasDecorator('test.decorator')).toBe(true);
      expect(registry.getDecorator('test.decorator')).toBeDefined();
    });

    it('should retrieve decorators by type', () => {
      const decorator1 = function() {};
      const decorator2 = function() {};
      
      registry.registerDecorator(decorator1, {
        id: 'validation.test1',
        type: DecoratorType.VALIDATION,
        name: 'Test1',
        source: 'test',
        enabled: true,
      });
      
      registry.registerDecorator(decorator2, {
        id: 'validation.test2',
        type: DecoratorType.VALIDATION,
        name: 'Test2',
        source: 'test',
        enabled: true,
      });

      const validationDecorators = registry.getDecoratorsByType(DecoratorType.VALIDATION);
      expect(validationDecorators).toHaveLength(2);
    });

    it('should unregister a decorator', () => {
      const decorator = function() {};
      const metadata = {
        id: 'test.decorator',
        type: DecoratorType.CUSTOM,
        name: 'TestDecorator',
        source: 'test',
        enabled: true,
      };

      registry.registerDecorator(decorator, metadata);
      expect(registry.hasDecorator('test.decorator')).toBe(true);
      
      const removed = registry.unregisterDecorator('test.decorator');
      expect(removed).toBe(true);
      expect(registry.hasDecorator('test.decorator')).toBe(false);
    });

    it('should get registry statistics', () => {
      const decorator = function() {};
      registry.registerDecorator(decorator, {
        id: 'test.decorator',
        type: DecoratorType.CUSTOM,
        name: 'TestDecorator',
        source: 'test',
        enabled: true,
      });

      const stats = registry.getStats();
      expect(stats.total).toBe(1);
      expect(stats.enabled).toBe(1);
      expect(stats.disabled).toBe(0);
    });
  });

  describe('metadata management', () => {
    it('should update decorator metadata', () => {
      const decorator = function() {};
      registry.registerDecorator(decorator, {
        id: 'test.decorator',
        type: DecoratorType.CUSTOM,
        name: 'TestDecorator',
        source: 'test',
        enabled: true,
      });

      const updated = registry.updateDecoratorMetadata('test.decorator', {
        description: 'Updated description',
      });

      expect(updated).toBe(true);
      const metadata = registry.getDecoratorMetadata('test.decorator');
      expect(metadata?.description).toBe('Updated description');
    });

    it('should enable/disable decorators', () => {
      const decorator = function() {};
      registry.registerDecorator(decorator, {
        id: 'test.decorator',
        type: DecoratorType.CUSTOM,
        name: 'TestDecorator',
        source: 'test',
        enabled: true,
      });

      registry.setDecoratorEnabled('test.decorator', false);
      const metadata = registry.getDecoratorMetadata('test.decorator');
      expect(metadata?.enabled).toBe(false);
    });
  });
});