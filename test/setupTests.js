import '@testing-library/jest-dom';

/* eslint-disable no-global-assign */
console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
/* eslint-enable no-global-assign */
