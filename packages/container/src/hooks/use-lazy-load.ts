import { useCallback, useState } from 'react';
import { useContainerContext } from './contexts/container-context';

/**
 * Hook for lazy loading services in React components.
 * Provides a way to load services only when needed.
 * 
 * @template T
 * @param identifier - The service identifier
 * @param factory - Factory function to create the service
 * @returns Object with service instance and loading state
 */
export const useLazyLoad = <T>(
  identifier: string | symbol,
  factory: () => T
): {
  service: T | null;
  isLoaded: boolean;
  load: () => T;
} => {
  const { container } = useContainerContext();
  const [isLoaded, setIsLoaded] = useState(false);
  const [service, setService] = useState<T | null>(null);

  const load = useCallback((): T => {
    if (service) {
      return service;
    }

    const loadedService = container.lazyLoad(identifier, factory);
    setService(loadedService);
    setIsLoaded(true);
    return loadedService;
  }, [container, identifier, factory, service]);

  return {
    service,
    isLoaded,
    load,
  };
};

/**
 * Hook for creating a lazy loader function.
 * Returns a function that can be used to lazy load services on-demand.
 * 
 * @returns Function - The lazy loader function
 */
export const useLazyLoader = () => {
  const { container } = useContainerContext();
  
  return useCallback(
    <T>(identifier: string | symbol, factory: () => T): T => {
      return container.lazyLoad(identifier, factory);
    },
    [container]
  );
};