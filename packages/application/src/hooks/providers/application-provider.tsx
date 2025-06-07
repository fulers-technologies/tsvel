import React, { ReactNode, useMemo, useCallback } from 'react';
import { ApplicationContext, ApplicationContextValue } from '../contexts/application-context';
import { Application } from '../../application';
import { IServiceProvider } from '../../interfaces/service-provider.interface';

/**
 * Props for the ApplicationProvider component.
 * 
 * @interface ApplicationProviderProps
 */
export interface ApplicationProviderProps {
  /**
   * Child components that will have access to the application context.
   */
  children: ReactNode;
  
  /**
   * Optional custom application instance to use.
   * If not provided, a default application will be created.
   */
  application?: Application;

  /**
   * Optional service providers to register automatically.
   */
  providers?: IServiceProvider[];
}

/**
 * React provider component for application dependency injection.
 * Provides application instances and utility methods to child components.
 * 
 * @param props - The provider props
 * @returns JSX.Element - The provider component
 */
export const ApplicationProvider: React.FC<ApplicationProviderProps> = ({
  children,
  application: customApplication,
  providers = [],
}) => {
  /**
   * Memoized application instance.
   */
  const application = useMemo(() => {
    const app = customApplication || new Application();
    
    // Register provided service providers
    providers.forEach(provider => {
      app.register(provider);
    });
    
    return app;
  }, [customApplication, providers]);

  /**
   * Memoized application context value to prevent unnecessary re-renders.
   * Creates a stable reference to the application and utility methods.
   */
  const contextValue = useMemo<ApplicationContextValue>(() => {
    return {
      application,
      resolve: <T>(identifier: string | symbol) => application.get<T>(identifier),
      isBound: (identifier: string | symbol) => application.isBound(identifier),
      registerProvider: (provider: IServiceProvider) => application.register(provider),
      boot: () => application.boot(),
    };
  }, [application]);

  return (
    <ApplicationContext.Provider value={contextValue}>
      {children}
    </ApplicationContext.Provider>
  );
};
    }
  }
  )
}