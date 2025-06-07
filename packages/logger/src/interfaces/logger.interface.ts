/**
 * Core logger interface defining the contract for logging operations.
 * Follows ISP (Interface Segregation Principle) by providing focused logging methods.
 * 
 * @interface ILogger
 */
export interface ILogger {
  /**
   * Logs a debug message with optional metadata.
   * Used for detailed diagnostic information during development.
   * 
   * @param message - The debug message to log
   * @param meta - Optional metadata object for additional context
   * @returns Promise<void> - Resolves when the log operation is complete
   */
  debug(message: string, meta?: Record<string, any>): Promise<void>;

  /**
   * Logs an informational message with optional metadata.
   * Used for general application flow information.
   * 
   * @param message - The informational message to log
   * @param meta - Optional metadata object for additional context
   * @returns Promise<void> - Resolves when the log operation is complete
   */
  info(message: string, meta?: Record<string, any>): Promise<void>;

  /**
   * Logs a warning message with optional metadata.
   * Used for potentially harmful situations that don't stop execution.
   * 
   * @param message - The warning message to log
   * @param meta - Optional metadata object for additional context
   * @returns Promise<void> - Resolves when the log operation is complete
   */
  warn(message: string, meta?: Record<string, any>): Promise<void>;

  /**
   * Logs an error message with optional metadata.
   * Used for error events that might still allow the application to continue.
   * 
   * @param message - The error message to log
   * @param meta - Optional metadata object for additional context
   * @returns Promise<void> - Resolves when the log operation is complete
   */
  error(message: string, meta?: Record<string, any>): Promise<void>;

  /**
   * Sets the current log level for filtering messages.
   * Only messages at or above this level will be logged.
   * 
   * @param level - The minimum log level to output
   * @returns void
   */
  setLevel(level: LogLevel): void;

  /**
   * Gets the current log level setting.
   * 
   * @returns LogLevel - The current minimum log level
   */
  getLevel(): LogLevel;

  /**
   * Creates a child logger with additional context.
   * Useful for adding consistent metadata to related log entries.
   * 
   * @param context - Additional context to include in all child logger messages
   * @returns ILogger - A new logger instance with the added context
   */
  child(context: Record<string, any>): ILogger;
}

/**
 * Log level enumeration for controlling log output verbosity.
 * Higher numeric values indicate more severe log levels.
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}