/**
 * Validation decorator usage examples
 */

import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  ValidationDecorator,
} from '../src';

// Example 1: Basic validation decorators
class UserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  bio?: string;

  constructor(name: string, email: string, bio?: string) {
    this.name = name;
    this.email = email;
    this.bio = bio;
  }
}

// Example 2: Custom validation decorators
class ProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidationDecorator.IsLongerThan(10, 'Description must be longer than 10 characters')
  description: string;

  @ValidationDecorator.IsInRange(0, 1000, 'Price must be between 0 and 1000')
  price: number;

  constructor(name: string, description: string, price: number) {
    this.name = name;
    this.description = description;
    this.price = price;
  }
}

// Example 3: Using validation
function validationExample() {
  console.log('=== Validation Example ===');
  
  const user = new UserDto('John Doe', 'john@example.com');
  console.log('Created user:', user);
  
  const product = new ProductDto('Test Product', 'This is a test product description', 99.99);
  console.log('Created product:', product);
  
  // Validate custom decorators
  const validationResult = ValidationDecorator.validate(product);
  console.log('Validation result:', validationResult);
}

// Export for main.ts
export {
  UserDto,
  ProductDto,
  validationExample,
};