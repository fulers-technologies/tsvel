/**
 * Main entry point for the container package.
 * Exports all public APIs for container functionality.
 */

// Core container functionality
export { Container } from './container';
export { default } from './container';

// Interfaces
export * from './interfaces';

// Enums
export * from './enums';

// Constants
export * from './constants';

// Decorators
export * from './decorators';

// Utilities
export * from './utilities';

// Hooks for React integration
export * from './hooks';

// Re-export commonly used types from InversifyJS
export { interfaces } from 'inversify';

// Re-export commonly used types
export type { IContainer } from './interfaces/container.interface';
export type { IContextualBinding, IContextualBindingBuilder } from './interfaces/contextual-binding.interface';
export type { IPropertyInjection, IPropertyInjectionResolver } from './interfaces/property-injection.interface';
export type { UseContainerReturn } from './hooks/use-container';
export type { ContainerContextValue } from './hooks/contexts/container-context';