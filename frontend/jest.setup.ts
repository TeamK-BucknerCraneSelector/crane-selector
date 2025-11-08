import "@testing-library/jest-dom";

// Polyfill TextEncoder/TextDecoder for react-router in Jest (jsdom)
import { TextEncoder, TextDecoder } from "node:util";

if (!globalThis.TextEncoder) {
  // @ts-ignore
  globalThis.TextEncoder = TextEncoder;
}
if (!globalThis.TextDecoder) {
  // @ts-ignore
  globalThis.TextDecoder = TextDecoder as typeof globalThis.TextDecoder;
}