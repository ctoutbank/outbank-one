import '@testing-library/jest-dom';

// Mock for Radix UI components that use modern browser APIs not present in JSDOM

// Mock scrollIntoView
if (global.window) {
  global.window.HTMLElement.prototype.scrollIntoView = jest.fn();
}

// Mock Pointer Events
if (global.window) {
  global.window.HTMLElement.prototype.hasPointerCapture = jest.fn();
  global.window.HTMLElement.prototype.releasePointerCapture = jest.fn();
}

// Mock ResizeObserver
if (typeof global.ResizeObserver === 'undefined') {
  global.ResizeObserver = class ResizeObserver {
    observe() {
      // do nothing
    }
    unobserve() {
      // do nothing
    }
    disconnect() {
      // do nothing
    }
  };
}