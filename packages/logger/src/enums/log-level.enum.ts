/**
 * Log level enumeration for controlling logging verbosity.
 * Each level represents a different severity of log messages.
 * 
 * @enum LogLevel
 */
export enum LogLevel {
  /**
   * Debug level - Most verbose, used for detailed diagnostic information.
   * Typically only enabled during development or troubleshooting.
   */
  DEBUG = 0,

  /**
   * Info level - General informational messages about application flow.
   * Used to track normal application behavior and important events.
   */
  INFO = 1,

  /**
   * Warning level - Potentially harmful situations that don't stop execution.
   * Indicates something unexpected happened but the application can continue.
   */
  WARN = 2,

  /**
   * Error level - Error events that might still allow the application to continue.
   * Indicates a serious problem that should be investigated.
   */
  ERROR = 3,
}