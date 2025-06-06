/**
 * Metadata reflector utility for advanced reflection operations
 */
import { Metadata } from '../metadata';

export class MetadataReflector {
  /**
   * Get the design type of a property or parameter
   */
  getType(target: any, propertyKey?: string | symbol): any {
    return Metadata.get('design:type', target, propertyKey);
  }

  /**
   * Get the parameter types of a method or constructor
   */
  getParamTypes(target: any, propertyKey?: string | symbol): any[] {
    return Metadata.get('design:paramtypes', target, propertyKey) || [];
  }

  /**
   * Get the return type of a method
   */
  getReturnType(target: any, propertyKey: string | symbol): any {
    return Metadata.get('design:returntype', target, propertyKey);
  }

  /**
   * Get all property names that have metadata
   */
  getMetadataProperties(target: any): string[] {
    const properties: string[] = [];
    const prototype = target.prototype || target;
    
    // Get all property names
    const propertyNames = Object.getOwnPropertyNames(prototype);
    
    for (const propertyName of propertyNames) {
      if (propertyName !== 'constructor') {
        const keys = Metadata.getKeys(target, propertyName);
        if (keys.length > 0) {
          properties.push(propertyName);
        }
      }
    }
    
    return properties;
  }

  /**
   * Get all methods that have metadata
   */
  getMetadataMethods(target: any): string[] {
    const methods: string[] = [];
    const prototype = target.prototype || target;
    
    const propertyNames = Object.getOwnPropertyNames(prototype);
    
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
    
    return methods;
  }

  /**
   * Check if a target is a class constructor
   */
  isConstructor(target: any): boolean {
    return typeof target === 'function' && target.prototype !== undefined;
  }

  /**
   * Check if a property is a method
   */
  isMethod(target: any, propertyKey: string | symbol): boolean {
    const prototype = target.prototype || target;
    const descriptor = Object.getOwnPropertyDescriptor(prototype, propertyKey);
    return descriptor !== undefined && typeof descriptor.value === 'function';
  }

  /**
   * Check if a property is a getter
   */
  isGetter(target: any, propertyKey: string | symbol): boolean {
    const prototype = target.prototype || target;
    const descriptor = Object.getOwnPropertyDescriptor(prototype, propertyKey);
    return descriptor !== undefined && typeof descriptor.get === 'function';
  }

  /**
   * Check if a property is a setter
   */
  isSetter(target: any, propertyKey: string | symbol): boolean {
    const prototype = target.prototype || target;
    const descriptor = Object.getOwnPropertyDescriptor(prototype, propertyKey);
    return descriptor !== undefined && typeof descriptor.set === 'function';
  }

  /**
   * Get all metadata for a target as a plain object
   */
  getAllMetadata(target: any, propertyKey?: string | symbol): Record<string | symbol, any> {
    const keys = Metadata.getKeys(target, propertyKey);
    const metadata: Record<string | symbol, any> = {};
    
    for (const key of keys) {
      metadata[key] = Metadata.get(key, target, propertyKey);
    }
    
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
  }

  /**
   * Merge metadata from multiple sources
   */
  mergeMetadata(target: any, propertyKey: string | symbol, ...sources: any[]): void {
    for (const source of sources) {
      const keys = Metadata.getKeys(source, propertyKey);
      
      for (const key of keys) {
        const value = Metadata.get(key, source, propertyKey);
        Metadata.define(key, value, target, propertyKey);
      }
    }
  }
}