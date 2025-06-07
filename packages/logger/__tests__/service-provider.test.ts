/**
 * Tests for the logger service provider
 */

import { LoggerServiceProvider, loggerServiceProvider } from '../src/providers/logger.service-provider';
import { Logger } from '../src';

describe('LoggerServiceProvider', () => {
  it('should be a singleton', () => {
    const instance1 = LoggerServiceProvider.getInstance();
    const instance2 = LoggerServiceProvider.getInstance();
    
    expect(instance1).toBe(instance2);
    expect(instance1).toBe(loggerServiceProvider);
  });

  it('should register logger service', () => {
    const provider = LoggerServiceProvider.getInstance();
    
    expect(() => provider.register()).not.toThrow();
    expect(provider.getLogger()).toBeDefined();
  });

  it('should boot logger service', () => {
    const provider = LoggerServiceProvider.getInstance();
    
    expect(() => provider.boot()).not.toThrow();
  });

  it('should create new logger instances', () => {
    const provider = LoggerServiceProvider.getInstance();
    const logger = provider.createLogger({ component: 'test' });
    
    expect(logger).toBeDefined();
    expect(logger).toBeInstanceOf(Logger);
  });

  it('should provide access to logger instance', () => {
    const provider = LoggerServiceProvider.getInstance();
    const logger = provider.getLogger();
    
    expect(logger).toBeDefined();
  });
});