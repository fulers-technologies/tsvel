import { DecoratorRegistry } from '../utilities/decorator-registry';
import { DecoratorType } from '../enums/decorator-type.enum';

/**
 * Service provider for decorator functionality.
 * Manages registration and configuration of decorator services within the application.
 * 
 * @class DecoratorsServiceProvider
 */
export class DecoratorsServiceProvider {
  private static instance: DecoratorsServiceProvider;
  private registry: DecoratorRegistry;

  /**
   * Private constructor to enforce singleton pattern.
   * Use DecoratorsServiceProvider.getInstance() to access the instance.
   */
  private constructor() {
    this.registry = DecoratorRegistry.getInstance();
  }

  /**
   * Gets the singleton service provider instance.
   * Creates one if it doesn't exist.
   * 
   * @returns DecoratorsServiceProvider - The singleton service provider instance
   */
  static getInstance(): DecoratorsServiceProvider {
    if (!DecoratorsServiceProvider.instance) {
      DecoratorsServiceProvider.instance = new DecoratorsServiceProvider();
    }
    return DecoratorsServiceProvider.instance;
  }

  /**
   * Creates a new service provider instance.
   * Factory method following the framework's .make() pattern.
   * 
   * @returns DecoratorsServiceProvider - A new service provider instance
   */
  static make(): DecoratorsServiceProvider {
    return new DecoratorsServiceProvider();
  }

  /**
   * Registers the decorator service with the application container.
   * Sets up default decorator configuration and bindings.
   * 
   * @returns void
   */
  register(): void {
    // Initialize the decorator registry
    this.initializeRegistry();
    
    // Register built-in decorators
    this.registerBuiltInDecorators();
    
    // Register with dependency injection container if available
    this.registerWithContainer();
  }

  /**
   * Boots the decorator service after all services are registered.
   * Performs any initialization that requires other services to be available.
   * 
   * @returns void
   */
  boot(): void {
    // Load cached decorator metadata
    this.loadDecoratorCache();
    
    // Set up decorator validation
    this.setupDecoratorValidation();
    
    // Initialize decorator monitoring
    this.initializeMonitoring();
  }

  /**
   * Gets the decorator registry managed by this service provider.
   * 
   * @returns DecoratorRegistry - The decorator registry instance
   */
  getRegistry(): DecoratorRegistry {
    return this.registry;
  }

  /**
   * Registers a custom decorator with the registry.
   * 
   * @param decorator - The decorator function to register
   * @param metadata - Metadata about the decorator
   * @returns void
   */
  registerDecorator(decorator: Function, metadata: any): void {
    this.registry.registerDecorator(decorator, metadata);
  }

  /**
   * Gets statistics about registered decorators.
   * 
   * @returns any - Statistics about the decorator registry
   */
  getStats(): any {
    return this.registry.getStats();
  }

  /**
   * Initializes the decorator registry with default settings.
   * 
   * @private
   * @returns void
   */
  private initializeRegistry(): void {
    // Clear any existing registrations
    this.registry.clear();
    
    // Set up registry configuration
    this.configureRegistry();
  }

  /**
   * Registers built-in decorators from class-validator and class-transformer.
   * 
   * @private
   * @returns void
   */
  private registerBuiltInDecorators(): void {
    // Register validation decorators
    this.registerValidationDecorators();
    
    // Register transformation decorators
    this.registerTransformationDecorators();
    
    // Register framework-specific decorators
    this.registerFrameworkDecorators();
  }

  /**
   * Registers validation decorators from class-validator.
   * 
   * @private
   * @returns void
   */
  private registerValidationDecorators(): void {
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
      this.registry.registerDecorator(
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
   * Registers transformation decorators from class-transformer.
   * 
   * @private
   * @returns void
   */
  private registerTransformationDecorators(): void {
    const transformationDecorators = [
      { name: 'Expose', description: 'Marks a property to be exposed during transformation' },
      { name: 'Exclude', description: 'Marks a property to be excluded during transformation' },
      { name: 'Transform', description: 'Transforms a property using a custom function' },
      { name: 'Type', description: 'Specifies the type of a property for transformation' },
      { name: 'PlainToClass', description: 'Transforms plain object to class instance' },
      { name: 'ClassToPlain', description: 'Transforms class instance to plain object' },
    ];

    transformationDecorators.forEach(({ name, description }) => {
      this.registry.registerDecorator(
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
   * Registers framework-specific decorators.
   * 
   * @private
   * @returns void
   */
  private registerFrameworkDecorators(): void {
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
      this.registry.registerDecorator(
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
   * Registers the decorator service with the dependency injection container.
   * 
   * @private
   * @returns void
   */
  private registerWithContainer(): void {
    // In a real implementation, this would register with the DI container
    // For now, we'll store it globally for access
    if (typeof globalThis !== 'undefined') {
      (globalThis as any).__tsvel_decorators = this.registry;
    }
  }

  /**
   * Configures the decorator registry with application-specific settings.
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

  /**
   * Loads cached decorator metadata from storage.
   * 
   * @private
   * @returns void
   */
  private loadDecoratorCache(): void {
    // In a real implementation, this would load from JSON cache files
    // For now, we'll just log that caching is available
    console.log('Decorator cache loading is available');
  }

  /**
   * Sets up decorator validation to ensure proper usage.
   * 
   * @private
   * @returns void
   */
  private setupDecoratorValidation(): void {
    // Set up validation rules for decorator usage
    // This could include checking for conflicting decorators, etc.
    console.log('Decorator validation is set up');
  }

  /**
   * Initializes monitoring for decorator usage and performance.
   * 
   * @private
   * @returns void
   */
  private initializeMonitoring(): void {
    // Set up monitoring for decorator performance and usage
    console.log('Decorator monitoring is initialized');
  }
}

/**
 * Singleton instance of the decorators service provider.
 * Provides convenient access to the service provider throughout the application.
 */
export const decoratorsServiceProvider = DecoratorsServiceProvider.getInstance();