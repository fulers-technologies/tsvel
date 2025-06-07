import { named as inversifyNamed } from 'inversify';

/**
 * Adds a named constraint to an injection.
 * This is a wrapper around InversifyJS's @named decorator.
 * 
 * @param name - The name constraint
 * @returns ParameterDecorator | PropertyDecorator - The named decorator
 */
export function Named(name: string | number | symbol): ParameterDecorator | PropertyDecorator {
  return inversifyNamed(name);
}

/**
 * Alternative export for consistency with InversifyJS naming.
 */
export const named = Named;