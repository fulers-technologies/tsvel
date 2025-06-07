import { useCallback } from 'react';
import { useContainerContext } from './contexts/container-context';

/**
 * Hook for injecting dependencies in React components.
 * Provides a convenient way to resolve services from the container.
 * 
 * @template T
 * @param identifier - The service identifier to inject
 * @returns T - The resolved service instance
 */
export const useInject = <T>(identifier: string | symbol): T => {
  const { resolve } = useContainerContext();
  return resolve<T>(identifier);
};

/**
 * Hook for creating an injection function.
 * Returns a function that can be used to inject services on-demand.
 * 
 * @returns Function - The injection function
 */
export const useInjector = () => {
  const { resolve } = useContainerContext();
  
  return useCallback(
    <T>(identifier: string | symbol): T => resolve<T>(identifier),
    [resolve]
  );
};

/**
 * Hook for checking if a service is available for injection.
 * 
 * @param identifier - The service identifier to check
 * @returns boolean - True if the service is bound
 */
export const useCanInject = (identifier: string | symbol): boolean => {
  const { isBound } = useContainerContext();
  return isBound(identifier);
};