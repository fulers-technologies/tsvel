import { useCallback } from 'react';
import { useLoggerContext } from './contexts/logger-context';
import { ILogger } from '../interfaces/logger.interface';

/**
 * Hook for accessing logger functionality in React components.
 * Provides convenient access to logging methods and child logger creation.
 * 
 * @returns UseLoggerReturn - Logger methods and utilities
 */
export const useLogger = (): UseLoggerReturn => {
  const { logger, createChildLogger } = useLoggerContext();

  /**
   * Creates a child logger with additional context.
   * Memoized to prevent unnecessary re-creation on re-renders.
   */
  const createChild = useCallback(
    (context: Record<string, any>) => createChildLogger(context),
    [createChildLogger]
  );

  /**
   * Logs a debug message with optional metadata.
   */
  const debug = useCallback(
    (message: string, meta?: Record<string, any>) => logger.debug(message, meta),
    [logger]
  );

  /**
   * Logs an informational message with optional metadata.
   */
  const info = useCallback(
    (message: string, meta?: Record<string, any>) => logger.info(message, meta),
    [logger]
  );

  /**
   * Logs a warning message with optional metadata.
   */
  const warn = useCallback(
    (message: string, meta?: Record<string, any>) => logger.warn(message, meta),
    [logger]
  );

  /**
   * Logs an error message with optional metadata.
   */
  const error = useCallback(
    (message: string, meta?: Record<string, any>) => logger.error(message, meta),
    [logger]
  );

  return {
    logger,
    createChild,
    debug,
    info,
    warn,
    error,
  };
};

/**
 * Return type for the useLogger hook.
 * Provides access to logger instance and convenience methods.
 * 
 * @interface UseLoggerReturn
 */
export interface UseLoggerReturn {
  /**
   * The logger instance for advanced usage.
   */
  logger: ILogger;
  
  /**
   * Creates a child logger with additional context.
   */
  createChild: (context: Record<string, any>) => ILogger;
  
  /**
   * Logs a debug message.
   */
  debug: (message: string, meta?: Record<string, any>) => Promise<void>;
  
  /**
   * Logs an informational message.
   */
  info: (message: string, meta?: Record<string, any>) => Promise<void>;
  
  /**
   * Logs a warning message.
   */
  warn: (message: string, meta?: Record<string, any>) => Promise<void>;
  
  /**
   * Logs an error message.
   */
  error: (message: string, meta?: Record<string, any>) => Promise<void>;
}