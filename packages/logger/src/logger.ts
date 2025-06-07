import { ILogger, LogLevel } from './interfaces/logger.interface';

/**
 * Default logger implementation with i18n support and configurable output.
 * Provides structured logging with metadata support and level-based filtering.
 * 
 * @class Logger
 * @implements {ILogger}
 */
export class Logger implements ILogger {
  private static instance: Logger;
  private currentLevel: LogLevel = LogLevel.INFO;
  private context: Record<string, any> = {};

  /**
   * Private constructor to enforce singleton pattern.
   * Use Logger.make() to create instances.
   * 
   * @param context - Optional context to include in all log messages
   */
  private constructor(context: Record<string, any> = {}) {
    this.context = context;
  }

  /**
   * Creates a new Logger instance with optional context.
   * Factory method following the framework's .make() pattern.
   * 
   * @param context - Optional context to include in all log messages
   * @returns Logger - A new logger instance
   */
  static make(context: Record<string, any> = {}): Logger {
    return new Logger(context);
  }

  /**
   * Gets the singleton logger instance.
   * Creates one if it doesn't exist.
   * 
   * @returns Logger - The singleton logger instance
   */
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Logs a debug message with optional metadata.
   * Only outputs if current log level is DEBUG or lower.
   * 
   * @param message - The debug message to log
   * @param meta - Optional metadata object for additional context
   * @returns Promise<void> - Resolves when the log operation is complete
   */
  async debug(message: string, meta: Record<string, any> = {}): Promise<void> {
    if (this.currentLevel <= LogLevel.DEBUG) {
      await this.writeLog(LogLevel.DEBUG, message, meta);
    }
  }

  /**
   * Logs an informational message with optional metadata.
   * Only outputs if current log level is INFO or lower.
   * 
   * @param message - The informational message to log
   * @param meta - Optional metadata object for additional context
   * @returns Promise<void> - Resolves when the log operation is complete
   */
  async info(message: string, meta: Record<string, any> = {}): Promise<void> {
    if (this.currentLevel <= LogLevel.INFO) {
      await this.writeLog(LogLevel.INFO, message, meta);
    }
  }

  /**
   * Logs a warning message with optional metadata.
   * Only outputs if current log level is WARN or lower.
   * 
   * @param message - The warning message to log
   * @param meta - Optional metadata object for additional context
   * @returns Promise<void> - Resolves when the log operation is complete
   */
  async warn(message: string, meta: Record<string, any> = {}): Promise<void> {
    if (this.currentLevel <= LogLevel.WARN) {
      await this.writeLog(LogLevel.WARN, message, meta);
    }
  }

  /**
   * Logs an error message with optional metadata.
   * Only outputs if current log level is ERROR or lower.
   * 
   * @param message - The error message to log
   * @param meta - Optional metadata object for additional context
   * @returns Promise<void> - Resolves when the log operation is complete
   */
  async error(message: string, meta: Record<string, any> = {}): Promise<void> {
    if (this.currentLevel <= LogLevel.ERROR) {
      await this.writeLog(LogLevel.ERROR, message, meta);
    }
  }

  /**
   * Sets the current log level for filtering messages.
   * Only messages at or above this level will be logged.
   * 
   * @param level - The minimum log level to output
   * @returns void
   */
  setLevel(level: LogLevel): void {
    this.currentLevel = level;
  }

  /**
   * Gets the current log level setting.
   * 
   * @returns LogLevel - The current minimum log level
   */
  getLevel(): LogLevel {
    return this.currentLevel;
  }

  /**
   * Creates a child logger with additional context.
   * Merges the provided context with the current logger's context.
   * 
   * @param context - Additional context to include in all child logger messages
   * @returns ILogger - A new logger instance with the added context
   */
  child(context: Record<string, any>): ILogger {
    const mergedContext = { ...this.context, ...context };
    const childLogger = new Logger(mergedContext);
    childLogger.setLevel(this.currentLevel);
    return childLogger;
  }

  /**
   * Writes a log entry to the output with proper formatting.
   * Combines message, metadata, and context into a structured log entry.
   * 
   * @private
   * @param level - The log level for this entry
   * @param message - The log message
   * @param meta - Additional metadata for the log entry
   * @returns Promise<void> - Resolves when the write operation is complete
   */
  private async writeLog(level: LogLevel, message: string, meta: Record<string, any>): Promise<void> {
    const timestamp = new Date().toISOString();
    const levelName = LogLevel[level];
    
    const logEntry = {
      timestamp,
      level: levelName,
      message,
      context: this.context,
      meta,
    };

    // In a real implementation, this would write to files, external services, etc.
    // For now, we'll use console output with appropriate styling
    const formattedMessage = this.formatLogEntry(logEntry);
    
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage);
        break;
    }
  }

  /**
   * Formats a log entry for output.
   * Creates a human-readable string representation of the log data.
   * 
   * @private
   * @param entry - The log entry to format
   * @returns string - The formatted log message
   */
  private formatLogEntry(entry: any): string {
    const { timestamp, level, message, context, meta } = entry;
    
    let formatted = `[${timestamp}] ${level}: ${message}`;
    
    if (Object.keys(context).length > 0) {
      formatted += ` | Context: ${JSON.stringify(context)}`;
    }
    
    if (Object.keys(meta).length > 0) {
      formatted += ` | Meta: ${JSON.stringify(meta)}`;
    }
    
    return formatted;
  }
}