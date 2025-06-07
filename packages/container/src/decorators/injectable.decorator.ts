import { injectable as inversifyInjectable } from 'inversify';

/**
 * Marks a class as injectable for dependency injection.
 * This is a wrapper around InversifyJS's @injectable decorator.
 * 
 * @returns ClassDecorator - The injectable decorator
 */
export function Injectable(): ClassDecorator {
  return inversifyInjectable();
}

/**
 * Alternative export for consistency with InversifyJS naming.
 */
export const injectable = Injectable;