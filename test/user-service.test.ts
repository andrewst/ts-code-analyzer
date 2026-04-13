import { describe, it, expect, beforeEach, afterEach } from 'vitest';

interface MockUser {
  name: string;
  email: string;
  isActive: boolean;
}

describe('Mock User Service', () => {
  let mockUser: MockUser;

  beforeEach(() => {
    mockUser = {
      name: 'John Doe',
      email: 'john@example.com',
      isActive: true,
    };
  });

  afterEach(() => {
    mockUser = {} as MockUser;
  });

  it('should create a mock user with correct properties', () => {
    expect(mockUser.name).toBe('John Doe');
    expect(mockUser.email).toBe('john@example.com');
    expect(mockUser.isActive).toBe(true);
  });

  it('should deactivate a user', () => {
    mockUser.isActive = false;
    expect(mockUser.isActive).toBe(false);
  });

  it('should update user email', () => {
    mockUser.email = 'newemail@example.com';
    expect(mockUser.email).toBe('newemail@example.com');
  });

  it('should handle user object serialization', () => {
    const serialized = JSON.stringify(mockUser);
    const parsed = JSON.parse(serialized);
    expect(parsed).toEqual(mockUser);
  });
});
