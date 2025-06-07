import { useCallback } from 'react';
import { useApplicationContext } from './contexts/application-context';
import { Application } from '../application';
import { IServiceProvider } from '../interfaces/service-provider.interface';

/**
 * Hook for accessing application functionality in React components.
 * Provides convenient access to application methods and utilities.
 * 
 * @returns UseApplicationReturn - Application methods and utilities
 */
export const useApplication = (): UseApplicationReturn => {
  const { application, resolve, isBound, registerProvider, boot } = useApplicationContext();

  /**
   * Resolves a service from the application container.
   * Memoized to prevent unnecessary re-creation on re-renders.
   */
  const get = useCallback(
    <T>(identifier: string | symbol): T => resolve<T>(identifier),
    [resolve]
  );

  /**
   * Checks if a service is bound in the application container.
   */
  const bound = useCallback(
    (identifier: string | symbol): boolean => isBound(identifier),
    [isBound]
  );

  /**
   * Registers a service provider with the application.
   */
  const register = useCallback(
    (provider: IServiceProvider): void => registerProvider(provider),
    [registerProvider]
  );

  /**
   * Boots the application if not already booted.
   */
  const bootApp = useCallback(
    (): Promise<void> => boot(),
    [boot]
  );

  /**
   * Gets all registered providers.
   */
  const getProviders = useCallback(
    (): IServiceProvider[] => application.getProviders(),
    [application]
  );

  /**
   * Checks if the application has been booted.
   */
  const isBooted = useCallback(
    (): boolean => application.isBooted(),
    [application]
  );

  /**
   * Terminates the application.
   */
  const terminate = useCallback(
    (): Promise<void> => application.terminate(),
    [application]
  );

  return {
    application,
    get,
    isBound: bound,
    register,
    boot: bootApp,
    getProviders,
    isBooted,
    terminate,
  };
};

/**
 * Return type for the useApplication hook.
 * Provides access to application instance and convenience methods.
 * 
 * @interface UseApplicationReturn
 */
export interface UseApplicationReturn {
  /**
   * The application instance for advanced usage.
   */
  application: Application;
  
  /**
   * Resolves a service from the application container.
   */
  get: <T>(identifier: string | symbol) => T;
  
  /**
   * Checks if a service is bound in the application container.
   */
  isBound: (identifier: string | symbol) => boolean;
  
  /**
   * Registers a service provider with the application.
   */
  register: (provider: IServiceProvider) => void;
  
  /**
   * Boots the application if not already booted.
   */
  boot: () => Promise<void>;
  
  /**
   * Gets all registered providers.
   */
  getProviders: () => IServiceProvider[];
  
  /**
   * Checks if the application has been booted.
   */
  isBooted: () => boolean;
  
  /**
   * Terminates the application.
   */
  terminate: () => Promise<void>;
}