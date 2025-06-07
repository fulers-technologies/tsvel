import React, { createContext, useContext } from 'react';
import { Application } from '../../application';
import { IServiceProvider } from '../../interfaces/service-provider.interface';

/**
 * React context for providing application instances throughout the component tree.
 * Enables dependency injection of application services in React applications.
 * 
 * @interface ApplicationContextValue
 */
export interface ApplicationContextValue {
  /**
   * The application instance available to components.
   */
  application: Application;
  
  /**
   * Resolves a service from the application container.
   * 
   * @template T
   * @param identifier - The service identifier
   * @returns T - The resolved service instance
   */
  resolve: <T>(identifier: string | symbol) => T;

  /**
   * Checks if a service is bound in the application container.
   * 
   * @param identifier - The service identifier
   * @returns boolean - True if the service is bound
   */
  isBound: (identifier: string | symbol) => boolean;

  /**
   * Registers a service provider with the application.
   * 
   * @param provider - The service provider to register
   * @returns void
   */
  registerProvider: (provider: IServiceProvider) => void;

  /**
   * Boots the application if not already booted.
   * 
   * @returns Promise<void>
   */
  boot: () => Promise<void>;
}

/**
 * React context for application dependency injection.
 * Provides application instances and utility methods to React components.
 */
export const ApplicationContext = createContext<ApplicationContextValue | undefined>(undefined);

/**
 * Hook to access the application context.
 * Throws an error if used outside of an ApplicationProvider.
 * 
 * @returns ApplicationContextValue - The application context value
 * @throws Error - If used outside of ApplicationProvider
 */
export const useApplicationContext = (): ApplicationContextValue => {
  const context = useContext(ApplicationContext);
  
  if (!context) {
    throw new Error('useApplicationContext must be used within an ApplicationProvider');
  }
  
  return context;
};