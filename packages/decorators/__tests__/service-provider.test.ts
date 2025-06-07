/**
 * Tests for the decorators service provider
 */

import { DecoratorsServiceProvider, decoratorsServiceProvider } from '../src/providers/decorators.service-provider';
import { DecoratorRegistry } from '../src';

describe('DecoratorsServiceProvider', () => {
  it('should be a singleton', () => {
    const instance1 = DecoratorsServiceProvider.getInstance();
    const instance2 = DecoratorsServiceProvider.getInstance();
    
    expect(instance1).toBe(instance2);
    expect(instance1).toBe(decoratorsServiceProvider);
  });

  it('should register decorator service', () => {
    const provider = DecoratorsServiceProvider.getInstance();
    
    expect(() => provider.register()).not.toThrow();
    expect(provider.getRegistry()).toBeDefined();
  });

  it('should boot decorator service', () => {
    const provider = DecoratorsServiceProvider.getInstance();
    
    expect(() => provider.boot()).not.toThrow();
  });

  it('should provide access to registry', () => {
    const provider = DecoratorsServiceProvider.getInstance();
    const registry = provider.getRegistry();
    
    expect(registry).toBeDefined();
    expect(registry).toBeInstanceOf(DecoratorRegistry);
  });

  it('should register custom decorators', () => {
    const provider = DecoratorsServiceProvider.getInstance();
    const decorator = function() {};
    const metadata = {
      id: 'test.custom',
      type: 'custom' as any,
      name: 'TestCustom',
      source: 'test',
      enabled: true,
    };

    provider.registerDecorator(decorator, metadata);
    
    const registry = provider.getRegistry();
    expect(registry.hasDecorator('test.custom')).toBe(true);
  });

  it('should provide registry statistics', () => {
    const provider = DecoratorsServiceProvider.getInstance();
    const stats = provider.getStats();
    
    expect(stats).toBeDefined();
    expect(typeof stats.total).toBe('number');
    expect(typeof stats.enabled).toBe('number');
    expect(typeof stats.disabled).toBe('number');
  });
});