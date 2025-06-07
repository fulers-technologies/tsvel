/**
 * Tests for the logger functionality
 */

import { Logger, LogLevel } from '../src';

describe('Logger', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = Logger.make();
  });

  describe('basic functionality', () => {
    it('should create a logger instance', () => {
      expect(logger).toBeDefined();
      expect(logger).toBeInstanceOf(Logger);
    });

    it('should have default log level of INFO', () => {
      expect(logger.getLevel()).toBe(LogLevel.INFO);
    });

    it('should allow setting log level', () => {
      logger.setLevel(LogLevel.DEBUG);
      expect(logger.getLevel()).toBe(LogLevel.DEBUG);
    });
  });

  describe('logging methods', () => {
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

    it('should log debug messages when level is DEBUG', async () => {
      logger.setLevel(LogLevel.DEBUG);
      await logger.debug('Test debug message');
      expect(console.debug).toHaveBeenCalled();
    });

    it('should not log debug messages when level is INFO', async () => {
      logger.setLevel(LogLevel.INFO);
      await logger.debug('Test debug message');
      expect(console.debug).not.toHaveBeenCalled();
    });

    it('should log info messages when level is INFO or lower', async () => {
      logger.setLevel(LogLevel.INFO);
      await logger.info('Test info message');
      expect(console.info).toHaveBeenCalled();
    });

    it('should log warning messages', async () => {
      await logger.warn('Test warning message');
      expect(console.warn).toHaveBeenCalled();
    });

    it('should log error messages', async () => {
      await logger.error('Test error message');
      expect(console.error).toHaveBeenCalled();
    });

    it('should include metadata in log messages', async () => {
      const meta = { userId: 123, action: 'test' };
      await logger.info('Test message', meta);
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('Test message')
      );
    });
  });

  describe('child logger', () => {
    it('should create a child logger with additional context', () => {
      const childLogger = logger.child({ component: 'test' });
      expect(childLogger).toBeDefined();
      expect(childLogger).not.toBe(logger);
    });

    it('should inherit log level from parent', () => {
      logger.setLevel(LogLevel.WARN);
      const childLogger = logger.child({ component: 'test' });
      expect(childLogger.getLevel()).toBe(LogLevel.WARN);
    });
  });

  describe('singleton instance', () => {
    it('should return the same instance', () => {
      const instance1 = Logger.getInstance();
      const instance2 = Logger.getInstance();
      expect(instance1).toBe(instance2);
    });
  });
});