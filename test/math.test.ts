import { describe, it, expect } from 'vitest';

describe('Basic Math Operations', () => {
  it('should add two numbers correctly', () => {
    expect(2 + 3).toBe(5);
  });

  it('should multiply two numbers correctly', () => {
    expect(4 * 5).toBe(20);
  });

  it('should handle string concatenation', () => {
    const space = ' ';
    expect('hello' + space + 'world').toBe('hello world');
  });
});
