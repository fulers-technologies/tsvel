/**
 * Main entry point for the application package.
 * Exports all public APIs for application functionality.
 */

// Core application functionality
export { Application } from './application';

// Interfaces
export * from './interfaces';

// Service providers
export * from './service-providers';

// Re-export commonly used types
export type { IServiceProvider } from './interfaces/service-provider.interface';
export type { IDeferredServiceProvider } from './interfaces/deferred-service-provider.interface';
export type { ITerminableServiceProvider } from './interfaces/terminable-service-provider.interface';
export type { IProviderConfig } from './interfaces/provider-config.interface';