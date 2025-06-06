/**
 * Tests for the metadata service provider
 */

import { MetadataServiceProvider, metadataServiceProvider } from '../src/providers/metadata.service-provider';
import { Metadata } from '../src';

describe('MetadataServiceProvider', () => {
  it('should be a singleton', () => {
    const instance1 = MetadataServiceProvider.getInstance();
    const instance2 = MetadataServiceProvider.getInstance();
    
    expect(instance1).toBe(instance2);
    expect(instance1).toBe(metadataServiceProvider);
  });

  it('should register metadata service', () => {
    const provider = MetadataServiceProvider.getInstance();
    
    expect(() => provider.register()).not.toThrow();
    expect(provider.getMetadata()).toBe(Metadata);
  });

  it('should boot metadata service', () => {
    const provider = MetadataServiceProvider.getInstance();
    
    expect(() => provider.boot()).not.toThrow();
  });

  it('should provide access to metadata components', () => {
    const provider = MetadataServiceProvider.getInstance();
    
    expect(provider.getMetadata()).toBe(Metadata);
    expect(provider.getStorage()).toBeDefined();
    expect(provider.getReflector()).toBeDefined();
    expect(provider.createReflector()).toBeDefined();
  });
});