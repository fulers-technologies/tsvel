/**
 * Main entry point for the logger package.
 * Exports all public APIs for logging functionality.
 */

// Core logger functionality
export { Logger } from './logger';
export { default } from './logger';

// Interfaces
export * from './interfaces';

// Enums
export * from './enums';

// Decorators
export * from './decorators';

// Hooks for React integration
export * from './hooks';

// Service providers
export * from './providers';

// Re-export commonly used types
export type { ILogger, LogLevel } from './interfaces/logger.interface';
export type { LoggableOptions } from './decorators/loggable.decorator';
export type { LogOptions } from './decorators/log.decorator';
export type { UseLoggerReturn } from './hooks/use-logger';