import { describe, it, expect } from 'vitest';
import { add, multiply, concatenate } from '../src/math.js';

describe('Basic Math Operations', () => {
  it('should add two numbers correctly', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('should multiply two numbers correctly', () => {
    expect(multiply(4, 5)).toBe(20);
  });

  it('should handle string concatenation', () => {
    const space = ' ';
    expect(concatenate('hello', 'world', space)).toBe('hello world');
  });
});
