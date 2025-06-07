import React, { ReactNode, useMemo } from 'react';
import { ContainerContext, ContainerContextValue } from '../contexts/container-context';
import { IContainer } from '../../interfaces/container.interface';
import { Container } from '../../container';

/**
 * Props for the ContainerProvider component.
 * 
 * @interface ContainerProviderProps
 */
export interface ContainerProviderProps {
  /**
   * Child components that will have access to the container context.
   */
  children: ReactNode;
  
  /**
   * Optional custom container instance to use.
   * If not provided, a default container will be created.
   */
  container?: IContainer;
}

/**
 * React provider component for container dependency injection.
 * Provides container instances and utility methods to child components.
 * 
 * @param props - The provider props
 * @returns JSX.Element - The provider component
 */
export const ContainerProvider: React.FC<ContainerProviderProps> = ({
  children,
  container: customContainer,
}) => {
  /**
   * Memoized container context value to prevent unnecessary re-renders.
   * Creates a stable reference to the container and utility methods.
   */
  const contextValue = useMemo<ContainerContextValue>(() => {
    // Use custom container or create a default one
    const container = customContainer || Container.make();
    
    return {
      container,
      resolve: <T>(identifier: string | symbol) => container.get<T>(identifier),
      isBound: (identifier: string | symbol) => container.isBound(identifier),
      createChild: () => container.createChild(),
    };
  }, [customContainer]);

  return (
    <ContainerContext.Provider value={contextValue}>
      {children}
    </ContainerContext.Provider>
  );
};
    }
  }
  )
}