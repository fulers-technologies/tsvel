import { tagged as inversifyTagged } from 'inversify';

/**
 * Adds a tagged constraint to an injection.
 * This is a wrapper around InversifyJS's @tagged decorator.
 * 
 * @param key - The tag key
 * @param value - The tag value
 * @returns ParameterDecorator | PropertyDecorator - The tagged decorator
 */
export function Tagged(key: string | number | symbol, value: any): ParameterDecorator | PropertyDecorator {
  return inversifyTagged(key, value);
}

/**
 * Alternative export for consistency with InversifyJS naming.
 */
export const tagged = Tagged;