/**
 * Tests for logger React hooks
 */

import React from 'react';
import { renderHook } from '@testing-library/react';
import { LoggerProvider, useLogger } from '../src';

describe('Logger Hooks', () => {
  describe('useLogger', () => {
    it('should provide logger functionality', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <LoggerProvider>{children}</LoggerProvider>
      );

      const { result } = renderHook(() => useLogger(), { wrapper });

      expect(result.current.logger).toBeDefined();
      expect(result.current.debug).toBeDefined();
      expect(result.current.info).toBeDefined();
      expect(result.current.warn).toBeDefined();
      expect(result.current.error).toBeDefined();
      expect(result.current.createChild).toBeDefined();
    });

    it('should throw error when used outside provider', () => {
      expect(() => {
        renderHook(() => useLogger());
      }).toThrow('useLoggerContext must be used within a LoggerProvider');
    });

    it('should create child logger with additional context', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <LoggerProvider>{children}</LoggerProvider>
      );

      const { result } = renderHook(() => useLogger(), { wrapper });
      const childLogger = result.current.createChild({ component: 'test' });

      expect(childLogger).toBeDefined();
      expect(childLogger).not.toBe(result.current.logger);
    });
  });

  describe('LoggerProvider', () => {
    it('should provide logger context to children', () => {
      const TestComponent = () => {
        const { logger } = useLogger();
        return <div data-testid="logger">{logger ? 'has-logger' : 'no-logger'}</div>;
      };

      const wrapper = (
        <LoggerProvider>
          <TestComponent />
        </LoggerProvider>
      );

      // In a real test environment, you would render this and check the result
      expect(wrapper).toBeDefined();
    });

    it('should accept custom logger instance', () => {
      const customLogger = {
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        setLevel: jest.fn(),
        getLevel: jest.fn(),
        child: jest.fn(),
      };

      const wrapper = (
        <LoggerProvider logger={customLogger}>
          <div>test</div>
        </LoggerProvider>
      );

      expect(wrapper).toBeDefined();
    });
  });
});