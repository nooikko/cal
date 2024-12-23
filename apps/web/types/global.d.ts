// global.d.ts
export type {};

declare global {
  interface Window {
    scrollIntoView: jest.Mock;
  }

  interface Global {
    scrollIntoView: jest.Mock;
    ResizeObserver: jest.Mock;
  }

  var scrollIntoView: jest.Mock;
}
