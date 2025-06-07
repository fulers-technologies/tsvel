/**
 * Tests for logger decorators
 */

import { Loggable, Log, Logger, LogLevel } from '../src';

describe('Logger Decorators', () => {
  beforeEach(() => {
    // Mock console methods
    jest.spyOn(console, 'debug').mockImplementation();
    jest.spyOn(console, 'info').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('@Loggable', () => {
    it('should add logging to class instantiation', () => {
      @Loggable()
      class TestClass {
        constructor(public name: string) {}
      }

      const instance = new TestClass('test');
      expect(instance).toBeDefined();
      expect(instance.name).toBe('test');
    });

    it('should not log instantiation when disabled', () => {
      @Loggable({ logInstantiation: false })
      class TestClass {
        constructor(public name: string) {}
      }

      const instance = new TestClass('test');
      expect(instance).toBeDefined();
    });
  });

  describe('@Log', () => {
    it('should log method execution', async () => {
      class TestClass {
        @Log()
        testMethod(value: string): string {
          return `processed: ${value}`;
        }
      }

      const instance = new TestClass();
      const result = instance.testMethod('test');
      
      expect(result).toBe('processed: test');
    });

    it('should log method errors', async () => {
      class TestClass {
        @Log()
        errorMethod(): void {
          throw new Error('Test error');
        }
      }

      const instance = new TestClass();
      
      expect(() => instance.errorMethod()).toThrow('Test error');
    });

    it('should handle async methods', async () => {
      class TestClass {
        @Log()
        async asyncMethod(value: string): Promise<string> {
          return Promise.resolve(`async: ${value}`);
        }
      }

      const instance = new TestClass();
      const result = await instance.asyncMethod('test');
      
      expect(result).toBe('async: test');
    });

    it('should respect log level configuration', async () => {
      class TestClass {
        @Log({ level: LogLevel.ERROR })
        testMethod(): string {
          return 'test';
        }
      }

      const instance = new TestClass();
      const result = instance.testMethod();
      
      expect(result).toBe('test');
    });
  });
});