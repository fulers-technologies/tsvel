import React, { createContext, useContext } from 'react';
import { ILogger } from '../../interfaces/logger.interface';
import { Logger } from '../../logger';

/**
 * React context for providing logger instances throughout the component tree.
 * Enables dependency injection of logger services in React applications.
 * 
 * @interface LoggerContextValue
 */
export interface LoggerContextValue {
  /**
   * The logger instance available to components.
   */
  logger: ILogger;
  
  /**
   * Creates a child logger with additional context.
   * 
   * @param context - Additional context for the child logger
   * @returns ILogger - A new logger instance with the added context
   */
  createChildLogger: (context: Record<string, any>) => ILogger;
}

/**
 * React context for logger dependency injection.
 * Provides logger instances and factory methods to React components.
 */
export const LoggerContext = createContext<LoggerContextValue | undefined>(undefined);

/**
 * Hook to access the logger context.
 * Throws an error if used outside of a LoggerProvider.
 * 
 * @returns LoggerContextValue - The logger context value
 * @throws Error - If used outside of LoggerProvider
 */
export const useLoggerContext = (): LoggerContextValue => {
  const context = useContext(LoggerContext);
  
  if (!context) {
    throw new Error('useLoggerContext must be used within a LoggerProvider');
  }
  
  return context;
};