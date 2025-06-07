/**
 * Metadata reflector utility for advanced reflection operations
 */
import { Metadata } from '../metadata';

export class MetadataReflector {
  /**
   * Cache for reflection results to improve performance.
   */
  private static reflectionCache = new WeakMap<any, Map<string, any>>();

  /**
   * Get the design type of a property or parameter
   */
  getType(target: any, propertyKey?: string | symbol): any {
    const cacheKey = `type:${String(propertyKey)}`;
    const cached = this.getCachedResult(target, cacheKey);
    if (cached !== undefined) {
      return cached;
    }

    const type = Metadata.get('design:type', target, propertyKey);
    this.setCachedResult(target, cacheKey, type);
    return type;
  }

  /**
   * Get the parameter types of a method or constructor
   */
  getParamTypes(target: any, propertyKey?: string | symbol): any[] {
    const cacheKey = `paramtypes:${String(propertyKey)}`;
    const cached = this.getCachedResult(target, cacheKey);
    if (cached !== undefined) {
      return cached;
    }

    const types = Metadata.get('design:paramtypes', target, propertyKey) || [];
    this.setCachedResult(target, cacheKey, types);
    return types;
  }

  /**
   * Get the return type of a method
   */
  getReturnType(target: any, propertyKey: string | symbol): any {
    const cacheKey = `returntype:${String(propertyKey)}`;
    const cached = this.getCachedResult(target, cacheKey);
    if (cached !== undefined) {
      return cached;
    }

    const type = Metadata.get('design:returntype', target, propertyKey);
    this.setCachedResult(target, cacheKey, type);
    return type;
  }

  /**
   * Get all property names that have metadata
   */
  getMetadataProperties(target: any): string[] {
    const cacheKey = 'metadata-properties';
    const cached = this.getCachedResult(target, cacheKey);
    if (cached !== undefined) {
      return cached;
    }

    const properties: string[] = [];
    const prototype = target.prototype || target;
    
    // Get all property names including inherited ones
    const propertyNames = this.getAllPropertyNames(prototype);
    
    for (const propertyName of propertyNames) {
      if (propertyName !== 'constructor') {
        const keys = Metadata.getKeys(target, propertyName);
        if (keys.length > 0) {
          properties.push(propertyName);
        }
      }
    }
    
    this.setCachedResult(target, cacheKey, properties);
    return properties;
  }

  /**
   * Get all methods that have metadata
   */
  getMetadataMethods(target: any): string[] {
    const cacheKey = 'metadata-methods';
    const cached = this.getCachedResult(target, cacheKey);
    if (cached !== undefined) {
      return cached;
    }

    const methods: string[] = [];
    const prototype = target.prototype || target;
    
    const propertyNames = this.getAllPropertyNames(prototype);
    
    for (const propertyName of propertyNames) {
      if (propertyName !== 'constructor') {
        const descriptor = Object.getOwnPropertyDescriptor(prototype, propertyName);
        if (descriptor && typeof descriptor.value === 'function') {
          const keys = Metadata.getKeys(target, propertyName);
          if (keys.length > 0) {
            methods.push(propertyName);
          }
        }
      }
    }
    
    this.setCachedResult(target, cacheKey, methods);
    return methods;
  }

  /**
   * Check if a target is a class constructor
   */
  isConstructor(target: any): boolean {
    if (typeof target !== 'function') {
      return false;
    }

    // Check if it has a prototype property
    if (!target.prototype) {
      return false;
    }

    // Check if it's a class (has constructor property)
    if (target.prototype.constructor === target) {
      return true;
    }

    // Additional checks for ES6 classes
    const targetString = target.toString();
    return targetString.startsWith('class ') || 
           targetString.includes('function ') && target.prototype.constructor === target;
  }

  /**
   * Check if a property is a method
   */
  isMethod(target: any, propertyKey: string | symbol): boolean {
    const prototype = target.prototype || target;
    const descriptor = this.getPropertyDescriptor(prototype, propertyKey);
    return descriptor !== undefined && typeof descriptor.value === 'function';
  }

  /**
   * Check if a property is a getter
   */
  isGetter(target: any, propertyKey: string | symbol): boolean {
    const prototype = target.prototype || target;
    const descriptor = this.getPropertyDescriptor(prototype, propertyKey);
    return descriptor !== undefined && typeof descriptor.get === 'function';
  }

  /**
   * Check if a property is a setter
   */
  isSetter(target: any, propertyKey: string | symbol): boolean {
    const prototype = target.prototype || target;
    const descriptor = this.getPropertyDescriptor(prototype, propertyKey);
    return descriptor !== undefined && typeof descriptor.set === 'function';
  }

  /**
   * Check if a property is an accessor (getter or setter)
   */
  isAccessor(target: any, propertyKey: string | symbol): boolean {
    return this.isGetter(target, propertyKey) || this.isSetter(target, propertyKey);
  }

  /**
   * Get all metadata for a target as a plain object
   */
  getAllMetadata(target: any, propertyKey?: string | symbol): Record<string | symbol, any> {
    const cacheKey = `all-metadata:${String(propertyKey)}`;
    const cached = this.getCachedResult(target, cacheKey);
    if (cached !== undefined) {
      return cached;
    }

    const keys = Metadata.getKeys(target, propertyKey);
    const metadata: Record<string | symbol, any> = {};
    
    for (const key of keys) {
      metadata[key] = Metadata.get(key, target, propertyKey);
    }
    
    this.setCachedResult(target, cacheKey, metadata);
    return metadata;
  }

  /**
   * Copy metadata from one target to another
   */
  copyMetadata(fromTarget: any, toTarget: any, fromPropertyKey?: string | symbol, toPropertyKey?: string | symbol): void {
    const keys = Metadata.getKeys(fromTarget, fromPropertyKey);
    
    for (const key of keys) {
      const value = Metadata.get(key, fromTarget, fromPropertyKey);
      Metadata.define(key, value, toTarget, toPropertyKey);
    }

    // Clear cache for target since metadata changed
    this.clearCache(toTarget);
  }

  /**
   * Merge metadata from multiple sources
   */
  mergeMetadata(target: any, propertyKey: string | symbol, ...sources: any[]): void {
    for (const source of sources) {
      const keys = Metadata.getKeys(source, propertyKey);
      
      for (const key of keys) {
        const value = Metadata.get(key, source, propertyKey);
        
        // Handle merging of object values
        const existingValue = Metadata.get(key, target, propertyKey);
        if (existingValue && typeof existingValue === 'object' && typeof value === 'object') {
          Metadata.define(key, { ...existingValue, ...value }, target, propertyKey);
        } else {
          Metadata.define(key, value, target, propertyKey);
        }
      }
    }

    // Clear cache for target since metadata changed
    this.clearCache(target);
  }

  /**
   * Get metadata with inheritance support
   */
  getMetadataWithInheritance(metadataKey: string | symbol, target: any, propertyKey?: string | symbol): any {
    let currentTarget = target;
    
    while (currentTarget && currentTarget !== Object.prototype) {
      const value = Metadata.get(metadataKey, currentTarget, propertyKey);
      if (value !== undefined) {
        return value;
      }
      
      // Move up the prototype chain
      currentTarget = Object.getPrototypeOf(currentTarget);
    }
    
    return undefined;
  }

  /**
   * Get all metadata keys with inheritance support
   */
  getMetadataKeysWithInheritance(target: any, propertyKey?: string | symbol): (string | symbol)[] {
    const keys = new Set<string | symbol>();
    let currentTarget = target;
    
    while (currentTarget && currentTarget !== Object.prototype) {
      const targetKeys = Metadata.getKeys(currentTarget, propertyKey);
      targetKeys.forEach(key => keys.add(key));
      
      // Move up the prototype chain
      currentTarget = Object.getPrototypeOf(currentTarget);
    }
    
    return Array.from(keys);
  }

  /**
   * Check if a target has any metadata
   */
  hasAnyMetadata(target: any, propertyKey?: string | symbol): boolean {
    const keys = Metadata.getKeys(target, propertyKey);
    return keys.length > 0;
  }

  /**
   * Get property descriptor with prototype chain traversal
   */
  getPropertyDescriptor(target: any, propertyKey: string | symbol): PropertyDescriptor | undefined {
    let currentTarget = target;
    
    while (currentTarget && currentTarget !== Object.prototype) {
      const descriptor = Object.getOwnPropertyDescriptor(currentTarget, propertyKey);
      if (descriptor) {
        return descriptor;
      }
      
      currentTarget = Object.getPrototypeOf(currentTarget);
    }
    
    return undefined;
  }

  /**
   * Get all property names including inherited ones
   */
  getAllPropertyNames(target: any): string[] {
    const properties = new Set<string>();
    let currentTarget = target;
    
    while (currentTarget && currentTarget !== Object.prototype) {
      Object.getOwnPropertyNames(currentTarget).forEach(name => properties.add(name));
      currentTarget = Object.getPrototypeOf(currentTarget);
    }
    
    return Array.from(properties);
  }

  /**
   * Clear reflection cache for a target
   */
  clearCache(target?: any): void {
    if (target) {
      MetadataReflector.reflectionCache.delete(target);
    } else {
      MetadataReflector.reflectionCache = new WeakMap();
    }
  }

  /**
   * Get cached reflection result
   */
  private getCachedResult(target: any, key: string): any {
    const cache = MetadataReflector.reflectionCache.get(target);
    return cache?.get(key);
  }

  /**
   * Set cached reflection result
   */
  private setCachedResult(target: any, key: string, value: any): void {
    let cache = MetadataReflector.reflectionCache.get(target);
    if (!cache) {
      cache = new Map();
      MetadataReflector.reflectionCache.set(target, cache);
    }
    cache.set(key, value);
  }

  /**
   * Create a new metadata reflector instance.
   * Factory method following the framework's .make() pattern.
   * 
   * @static
   * @returns MetadataReflector
   */
  static make(): MetadataReflector {
    return new MetadataReflector();
  }

  /**
   * Get the singleton metadata reflector instance.
   * 
   * @static
   * @returns MetadataReflector
   */
  static getInstance(): MetadataReflector {
    if (!MetadataReflector.instance) {
      MetadataReflector.instance = new MetadataReflector();
    }
    return MetadataReflector.instance;
  }

  /**
   * Singleton instance.
   */
  private static instance: MetadataReflector;
}