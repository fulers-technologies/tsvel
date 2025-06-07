/**
 * Main entry point for the container package.
 * Exports all public APIs for container functionality.
 */

// Core container functionality
export { Container } from './container';
export { default } from './container';

// Interfaces
export * from './interfaces';

// Decorators
export * from './decorators';

// Hooks for React integration
export * from './hooks';

// Re-export commonly used types from InversifyJS
export { interfaces } from 'inversify';

// Re-export commonly used types
export type { IContainer } from './interfaces/container.interface';
export type { UseContainerReturn } from './hooks/use-container';
export type { ContainerContextValue } from './hooks/contexts/container-context';