import { useCallback } from 'react';
import { useContainerContext } from './contexts/container-context';
import { IContainer } from '../interfaces/container.interface';

/**
 * Hook for accessing container functionality in React components.
 * Provides convenient access to container methods and utilities.
 * 
 * @returns UseContainerReturn - Container methods and utilities
 */
export const useContainer = (): UseContainerReturn => {
  const { container, resolve, isBound, createChild } = useContainerContext();

  /**
   * Resolves a service from the container.
   * Memoized to prevent unnecessary re-creation on re-renders.
   */
  const get = useCallback(
    <T>(identifier: string | symbol): T => resolve<T>(identifier),
    [resolve]
  );

  /**
   * Resolves all services bound to an identifier.
   */
  const getAll = useCallback(
    <T>(identifier: string | symbol): T[] => container.getAll<T>(identifier),
    [container]
  );

  /**
   * Checks if a service is bound in the container.
   */
  const bound = useCallback(
    (identifier: string | symbol): boolean => isBound(identifier),
    [isBound]
  );

  /**
   * Checks if a service can be resolved (including lazy loaded services).
   */
  const canResolve = useCallback(
    (identifier: string | symbol): boolean => container.canResolve(identifier),
    [container]
  );

  /**
   * Creates a child container.
   */
  const child = useCallback(
    (): IContainer => createChild(),
    [createChild]
  );

  /**
   * Gets service metadata.
   */
  const getMetadata = useCallback(
    (identifier: string | symbol): any => container.getMetadata(identifier),
    [container]
  );

  return {
    container,
    get,
    getAll,
    isBound: bound,
    canResolve,
    createChild: child,
    getMetadata,
  };
};

/**
 * Return type for the useContainer hook.
 * Provides access to container instance and convenience methods.
 * 
 * @interface UseContainerReturn
 */
export interface UseContainerReturn {
  /**
   * The container instance for advanced usage.
   */
  container: IContainer;
  
  /**
   * Resolves a service from the container.
   */
  get: <T>(identifier: string | symbol) => T;
  
  /**
   * Resolves all services bound to an identifier.
   */
  getAll: <T>(identifier: string | symbol) => T[];
  
  /**
   * Checks if a service is bound in the container.
   */
  isBound: (identifier: string | symbol) => boolean;
  
  /**
   * Checks if a service can be resolved.
   */
  canResolve: (identifier: string | symbol) => boolean;
  
  /**
   * Creates a child container.
   */
  createChild: () => IContainer;
  
  /**
   * Gets service metadata.
   */
  getMetadata: (identifier: string | symbol) => any;
}