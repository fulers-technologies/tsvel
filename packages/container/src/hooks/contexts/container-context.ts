import React, { createContext, useContext } from 'react';
import { IContainer } from '../../interfaces/container.interface';
import { Container } from '../../container';

/**
 * React context for providing container instances throughout the component tree.
 * Enables dependency injection of container services in React applications.
 * 
 * @interface ContainerContextValue
 */
export interface ContainerContextValue {
  /**
   * The container instance available to components.
   */
  container: IContainer;
  
  /**
   * Resolves a service from the container.
   * 
   * @template T
   * @param identifier - The service identifier
   * @returns T - The resolved service instance
   */
  resolve: <T>(identifier: string | symbol) => T;

  /**
   * Checks if a service is bound in the container.
   * 
   * @param identifier - The service identifier
   * @returns boolean - True if the service is bound
   */
  isBound: (identifier: string | symbol) => boolean;

  /**
   * Creates a child container.
   * 
   * @returns IContainer - The child container
   */
  createChild: () => IContainer;
}

/**
 * React context for container dependency injection.
 * Provides container instances and utility methods to React components.
 */
export const ContainerContext = createContext<ContainerContextValue | undefined>(undefined);

/**
 * Hook to access the container context.
 * Throws an error if used outside of a ContainerProvider.
 * 
 * @returns ContainerContextValue - The container context value
 * @throws Error - If used outside of ContainerProvider
 */
export const useContainerContext = (): ContainerContextValue => {
  const context = useContext(ContainerContext);
  
  if (!context) {
    throw new Error('useContainerContext must be used within a ContainerProvider');
  }
  
  return context;
};