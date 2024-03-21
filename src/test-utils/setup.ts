import matchers, { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

import { expect } from 'vitest';

expect.extend(matchers);

declare module 'vitest' {
  interface Assertion<T = any> extends jest.Matchers<void, T>, TestingLibraryMatchers<T, void> {}
}
