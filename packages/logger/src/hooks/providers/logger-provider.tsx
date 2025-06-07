import React, { ReactNode, useMemo } from 'react';
import { LoggerContext, LoggerContextValue } from '../contexts/logger-context';
import { ILogger } from '../../interfaces/logger.interface';
import { Logger } from '../../logger';

/**
 * Props for the LoggerProvider component.
 * 
 * @interface LoggerProviderProps
 */
export interface LoggerProviderProps {
  /**
   * Child components that will have access to the logger context.
   */
  children: ReactNode;
  
  /**
   * Optional custom logger instance to use.
   * If not provided, a default logger will be created.
   */
  logger?: ILogger;
  
  /**
   * Optional context to include in all log messages from this provider.
   */
  context?: Record<string, any>;
}

/**
 * React provider component for logger dependency injection.
 * Provides logger instances and factory methods to child components.
 * 
 * @param props - The provider props
 * @returns JSX.Element - The provider component
 */
export const LoggerProvider: React.FC<LoggerProviderProps> = ({
  children,
  logger: customLogger,
  context = {},
}) => {
  /**
   * Memoized logger context value to prevent unnecessary re-renders.
   * Creates a stable reference to the logger and factory methods.
   */
  const contextValue = useMemo<LoggerContextValue>(() => {
    // Use custom logger or create a default one with context
    const logger = customLogger || Logger.make(context);
    
    return {
      logger,
      createChildLogger: (childContext: Record<string, any>) => {
        return logger.child(childContext);
      },
    };
  }, [customLogger, context]);

  return (
    <LoggerContext.Provider value={contextValue}>
      {children}
    </LoggerContext.Provider>
  );
};