# Contributing to @tsvel/routing-adapter-remix

Thank you for your interest in contributing to the TSVEL Framework! This document provides guidelines and information for contributors.

## Getting Started

### Prerequisites

- Node.js 16.0.0 or higher
- npm, yarn, or pnpm
- TypeScript 4.5.0 or higher

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/tsvel.git
   cd tsvel
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

4. Navigate to the package:
   ```bash
   cd packages/routing-adapter-remix
   ```

5. Start development:
   ```bash
   npm run dev
   ```

## Development Workflow

### Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our coding standards
3. Add tests for new functionality
4. Run tests to ensure everything works:
   ```bash
   npm test
   ```

5. Run linting and formatting:
   ```bash
   npm run lint
   npm run format
   ```

### Coding Standards

- Follow TypeScript best practices
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Follow the existing code style
- Write unit tests for new features
- Update documentation as needed

### Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

Example:
```
feat(routing-adapter-remix): add new validation decorator

- Add @IsCustom decorator for custom validation
- Include comprehensive tests
- Update documentation
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Place test files in the `__tests__` directory
- Use descriptive test names
- Follow the AAA pattern (Arrange, Act, Assert)
- Mock external dependencies
- Aim for high test coverage

Example test structure:
```typescript
describe('FeatureName', () => {
  describe('methodName', () => {
    it('should do something when condition is met', () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = methodName(input);
      
      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

## Documentation

### Code Documentation

- Add JSDoc comments for all public APIs
- Include examples in documentation
- Document complex algorithms or business logic
- Keep documentation up to date with code changes

### README Updates

When adding new features:
- Update the main README.md
- Add usage examples
- Update the API reference section
- Include any breaking changes in CHANGELOG.md

## Pull Request Process

1. Ensure your code follows the coding standards
2. Add or update tests as needed
3. Update documentation
4. Run the full test suite
5. Create a pull request with a clear description
6. Link any related issues
7. Wait for code review and address feedback

### Pull Request Template

Please use the provided pull request template and fill out all relevant sections.

## Issue Reporting

### Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (Node.js version, OS, etc.)
- Code examples if applicable

### Feature Requests

For feature requests, please include:
- Clear description of the proposed feature
- Use case and motivation
- Possible implementation approach
- Examples of how it would be used

## Code Review Guidelines

### For Contributors

- Be open to feedback
- Respond to review comments promptly
- Make requested changes in separate commits
- Keep discussions focused and professional

### For Reviewers

- Be constructive and helpful
- Focus on code quality and maintainability
- Suggest improvements rather than just pointing out problems
- Approve when the code meets our standards

## Release Process

Releases are handled by maintainers and follow semantic versioning:

- **Patch** (0.0.x): Bug fixes and small improvements
- **Minor** (0.x.0): New features that are backward compatible
- **Major** (x.0.0): Breaking changes

## Getting Help

If you need help:

- Check the documentation
- Search existing issues
- Ask questions in discussions
- Contact maintainers

## Recognition

Contributors will be recognized in:
- CHANGELOG.md for significant contributions
- README.md contributors section
- Release notes for major features

Thank you for contributing to the TSVEL Framework!

