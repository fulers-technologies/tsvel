import { inject as inversifyInject } from 'inversify';

/**
 * Injects a dependency into a constructor parameter or property.
 * This is a wrapper around InversifyJS's @inject decorator.
 * 
 * @param serviceIdentifier - The service identifier to inject
 * @returns ParameterDecorator | PropertyDecorator - The inject decorator
 */
export function Inject(serviceIdentifier: string | symbol): ParameterDecorator | PropertyDecorator {
  return inversifyInject(serviceIdentifier);
}

/**
 * Alternative export for consistency with InversifyJS naming.
 */
export const inject = Inject;