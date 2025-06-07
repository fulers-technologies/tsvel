import { BaseServiceProvider } from '@tsvel/application';
import { DecoratorRegistry } from '../utilities/decorator-registry';
import { DecoratorType } from '../enums/decorator-type.enum';

/**
 * Service provider for decorator functionality.
 * Manages registration and configuration of decorator services within the application.
 * 
 * @class DecoratorsServiceProvider
 * @extends {BaseServiceProvider}
 */
export class DecoratorsServiceProvider extends BaseServiceProvider {
  /**
   * Register the decorator service with the application container.
   * Sets up default decorator configuration and bindings.
   * 
   * @returns void
   */
  register(): void {
    // Register the decorator registry
    this.singleton<DecoratorRegistry>('DecoratorRegistry', DecoratorRegistry);
    
    // Register decorator factory for creating registry instances
    this.bind<() => DecoratorRegistry>('DecoratorRegistryFactory', () => {
      return () => DecoratorRegistry.make();
    });
    
    // Register the default registry instance
    this.bind<DecoratorRegistry>('DefaultDecoratorRegistry', () => DecoratorRegistry.getInstance());
  }

  /**
   * Boot the decorator service after all services are registered.
   * Performs any initialization that requires other services to be available.
   * 
   * @returns void
   */
  boot(): void {
    // Initialize the decorator registry
    this.initializeRegistry();
    
    // Register built-in decorators
    this.registerBuiltInDecorators();
  }

  /**
   * Initialize the decorator registry with default settings.
   * Sets up the registry configuration.
   * 
   * @private
   * @returns void
   */
  private initializeRegistry(): void {
    const registry = this.resolve<DecoratorRegistry>('DecoratorRegistry');
    
    // Clear any existing registrations
    registry.clear();
    
    // Set up registry configuration
    this.configureRegistry();
  }

  /**
   * Register built-in decorators from class-validator and class-transformer.
   * Sets up the default decorator ecosystem.
   * 
   * @private
   * @returns void
   */
  private registerBuiltInDecorators(): void {
    const registry = this.resolve<DecoratorRegistry>('DecoratorRegistry');
    
    // Register validation decorators
    this.registerValidationDecorators(registry);
    
    // Register transformation decorators
    this.registerTransformationDecorators(registry);
    
    // Register framework-specific decorators
    this.registerFrameworkDecorators(registry);
  }

  /**
   * Register validation decorators from class-validator.
   * 
   * @private
   * @param registry - The decorator registry
   * @returns void
   */
  private registerValidationDecorators(registry: DecoratorRegistry): void {
    const validationDecorators = [
      { name: 'IsDefined', description: 'Checks if the value is defined' },
      { name: 'IsString', description: 'Checks if the value is a string' },
      { name: 'IsNumber', description: 'Checks if the value is a number' },
      { name: 'IsInt', description: 'Checks if the value is an integer' },
      { name: 'IsBoolean', description: 'Checks if the value is a boolean' },
      { name: 'IsEmail', description: 'Checks if the value is an email' },
      { name: 'IsUrl', description: 'Checks if the value is a URL' },
      { name: 'IsUUID', description: 'Checks if the value is a UUID' },
      { name: 'IsDate', description: 'Checks if the value is a date' },
      { name: 'IsArray', description: 'Checks if the value is an array' },
      { name: 'IsObject', description: 'Checks if the value is an object' },
      { name: 'IsNotEmpty', description: 'Checks if the value is not empty' },
      { name: 'IsEmpty', description: 'Checks if the value is empty' },
      { name: 'IsOptional', description: 'Marks the property as optional' },
    ];

    validationDecorators.forEach(({ name, description }) => {
      registry.registerDecorator(
        function () { /* stub */ },
        {
          id: `class-validator.${name}`,
          type: DecoratorType.VALIDATION,
          name,
          description,
          source: 'class-validator',
          enabled: true,
        }
      );
    });
  }

  /**
   * Register transformation decorators from class-transformer.
   * 
   * @private
   * @param registry - The decorator registry
   * @returns void
   */
  private registerTransformationDecorators(registry: DecoratorRegistry): void {
    const transformationDecorators = [
      { name: 'Expose', description: 'Marks a property to be exposed during transformation' },
      { name: 'Exclude', description: 'Marks a property to be excluded during transformation' },
      { name: 'Transform', description: 'Transforms a property using a custom function' },
      { name: 'Type', description: 'Specifies the type of a property for transformation' },
      { name: 'PlainToClass', description: 'Transforms plain object to class instance' },
      { name: 'ClassToPlain', description: 'Transforms class instance to plain object' },
    ];

    transformationDecorators.forEach(({ name, description }) => {
      registry.registerDecorator(
        function () { /* stub */ },
        {
          id: `class-transformer.${name}`,
          type: DecoratorType.TRANSFORMATION,
          name,
          description,
          source: 'class-transformer',
          enabled: true,
        }
      );
    });
  }

  /**
   * Register framework-specific decorators.
   * 
   * @private
   * @param registry - The decorator registry
   * @returns void
   */
  private registerFrameworkDecorators(registry: DecoratorRegistry): void {
    // Register decorators from other TSVEL packages
    const frameworkDecorators = [
      { name: 'Injectable', type: DecoratorType.INJECTION, description: 'Marks a class as injectable' },
      { name: 'Inject', type: DecoratorType.INJECTION, description: 'Injects a dependency' },
      { name: 'Controller', type: DecoratorType.ROUTING, description: 'Marks a class as a controller' },
      { name: 'Get', type: DecoratorType.ROUTING, description: 'Defines a GET route' },
      { name: 'Post', type: DecoratorType.ROUTING, description: 'Defines a POST route' },
      { name: 'Cacheable', type: DecoratorType.CACHING, description: 'Marks a method as cacheable' },
      { name: 'Log', type: DecoratorType.LOGGING, description: 'Logs method execution' },
      { name: 'Middleware', type: DecoratorType.MIDDLEWARE, description: 'Applies middleware to a route' },
    ];

    frameworkDecorators.forEach(({ name, type, description }) => {
      registry.registerDecorator(
        function () { /* stub */ },
        {
          id: `tsvel.${name}`,
          type,
          name,
          description,
          source: 'tsvel-framework',
          enabled: true,
        }
      );
    });
  }

  /**
   * Configure the decorator registry with application-specific settings.
   * 
   * @private
   * @returns void
   */
  private configureRegistry(): void {
    // Configure based on environment variables or config files
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (isDevelopment) {
      // Enable additional debugging decorators in development
      console.log('Decorator registry configured for development environment');
    }
  }
}

/**
 * Singleton instance of the decorators service provider.
 * Provides convenient access to the service provider throughout the application.
 */
export const decoratorsServiceProvider = new DecoratorsServiceProvider(null as any);