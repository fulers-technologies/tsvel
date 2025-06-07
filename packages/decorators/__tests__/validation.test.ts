/**
 * Tests for validation decorators
 */

import { ValidationDecorator } from '../src';

describe('ValidationDecorator', () => {
  describe('custom validation decorators', () => {
    it('should create IsLongerThan decorator', () => {
      const decorator = ValidationDecorator.IsLongerThan(5);
      expect(decorator).toBeDefined();
      expect(typeof decorator).toBe('function');
    });

    it('should create MatchesPattern decorator', () => {
      const pattern = /^[A-Z]+$/;
      const decorator = ValidationDecorator.MatchesPattern(pattern);
      expect(decorator).toBeDefined();
      expect(typeof decorator).toBe('function');
    });

    it('should create IsInRange decorator', () => {
      const decorator = ValidationDecorator.IsInRange(0, 100);
      expect(decorator).toBeDefined();
      expect(typeof decorator).toBe('function');
    });
  });

  describe('validation logic', () => {
    class TestClass {
      @ValidationDecorator.IsLongerThan(5)
      name: string;

      @ValidationDecorator.IsInRange(0, 100)
      age: number;

      constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
      }
    }

    it('should validate valid data', () => {
      const instance = new TestClass('John Doe', 25);
      const result = ValidationDecorator.validate(instance);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect validation errors', () => {
      const instance = new TestClass('John', 150);
      const result = ValidationDecorator.validate(instance);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should provide detailed error information', () => {
      const instance = new TestClass('Jo', -5);
      const result = ValidationDecorator.validate(instance);
      
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            property: 'name',
            value: 'Jo',
            message: expect.stringContaining('longer than'),
          }),
          expect.objectContaining({
            property: 'age',
            value: -5,
            message: expect.stringContaining('between'),
          }),
        ])
      );
    });
  });

  describe('custom validation creation', () => {
    it('should create custom validation decorator', () => {
      const IsEven = ValidationDecorator.create(
        'IsEven',
        (value: any) => typeof value === 'number' && value % 2 === 0,
        { message: 'Value must be even' }
      );

      expect(IsEven).toBeDefined();
      expect(typeof IsEven).toBe('function');
    });

    it('should validate with custom decorator', () => {
      const IsEven = ValidationDecorator.create(
        'IsEven',
        (value: any) => typeof value === 'number' && value % 2 === 0,
        { message: 'Value must be even' }
      );

      class TestClass {
        @IsEven
        number: number;

        constructor(number: number) {
          this.number = number;
        }
      }

      const validInstance = new TestClass(4);
      const invalidInstance = new TestClass(3);

      const validResult = ValidationDecorator.validate(validInstance);
      const invalidResult = ValidationDecorator.validate(invalidInstance);

      expect(validResult.isValid).toBe(true);
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.errors[0].message).toBe('Value must be even');
    });
  });
});