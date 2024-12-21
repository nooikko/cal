import type { Config } from 'jest';

const config: Config = {
  // Automatically clear mock calls, instances, contexts, and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',

  // Map module paths to resolve aliases, e.g., for absolute imports using "@/"
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Adjust to correctly map the alias "@" to your src folder
  },

  // Use ts-jest for transforming TypeScript files
  preset: 'ts-jest',

  // The test environment that will be used for testing
  testEnvironment: 'node',

  // Transform settings to correctly handle TypeScript and JavaScript files
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }], // Ensure tsconfig is properly referenced
  },

  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  transformIgnorePatterns: ['<rootDir>/node_modules/', '\\.pnp\\.[^\\\\]+$'],

  // Resolve Jest issue with mocked function type errors by enhancing the way mocks are typed
  resetMocks: true,

  // Verbose setting to display individual test results during the run
  verbose: true,
};

export default config;
