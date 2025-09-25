import { TextEncoder, TextDecoder } from 'node:util';
import { webcrypto } from 'node:crypto';

// JSDOM環境用のポリフィル
if (!globalThis.TextEncoder) {
  globalThis.TextEncoder = TextEncoder as unknown as typeof globalThis.TextEncoder;
}

if (!globalThis.TextDecoder) {
  globalThis.TextDecoder = TextDecoder as unknown as typeof globalThis.TextDecoder;
}

if (!globalThis.crypto) {
  globalThis.crypto = webcrypto as unknown as Crypto;
}
