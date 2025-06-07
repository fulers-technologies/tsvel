import { BaseServiceProvider } from './base-service-provider';
import { ITerminableServiceProvider } from '../interfaces/terminable-service-provider.interface';

/**
 * Abstract base class for terminable service providers.
 * Provides cleanup capabilities for services that need to release resources.
 * 
 * @abstract
 * @class TerminableServiceProvider
 * @extends {BaseServiceProvider}
 * @implements {ITerminableServiceProvider}
 */
export abstract class TerminableServiceProvider extends BaseServiceProvider implements ITerminableServiceProvider {
  /**
   * Indicates that this provider is terminable.
   */
  readonly isTerminable = true as const;

  /**
   * Register services with the application container.
   * Must be implemented by concrete terminable providers.
   * 
   * @abstract
   * @returns void | Promise<void>
   */
  abstract register(): void | Promise<void>;

  /**
   * Boot services after all providers have been registered.
   * Default implementation does nothing - override if needed.
   * 
   * @returns void | Promise<void>
   */
  boot(): void | Promise<void> {
    // Default implementation - override if needed
  }

  /**
   * Terminate services and clean up resources.
   * Must be implemented by concrete terminable providers.
   * 
   * @abstract
   * @returns void | Promise<void>
   */
  abstract terminate(): void | Promise<void>;

  /**
   * Register a cleanup handler that will be called during termination.
   * Convenience method for registering cleanup logic.
   * 
   * @param handler - The cleanup handler function
   * @returns void
   */
  protected onTerminate(handler: () => void | Promise<void>): void {
    // Store cleanup handlers for execution during terminate()
    if (!this.cleanupHandlers) {
      this.cleanupHandlers = [];
    }
    this.cleanupHandlers.push(handler);
  }

  /**
   * Array of cleanup handlers to execute during termination.
   */
  private cleanupHandlers: (() => void | Promise<void>)[] = [];

  /**
   * Execute all registered cleanup handlers.
   * Called automatically during terminate() if handlers are registered.
   * 
   * @protected
   * @returns Promise<void>
   */
  protected async executeCleanupHandlers(): Promise<void> {
    if (!this.cleanupHandlers || this.cleanupHandlers.length === 0) {
      return;
    }

    await Promise.all(
      this.cleanupHandlers.map(async (handler) => {
        try {
          await handler();
        } catch (error) {
          console.error('Error executing cleanup handler:', error);
        }
      })
    );
  }
}