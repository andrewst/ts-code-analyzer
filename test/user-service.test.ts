import { describe, it, expect, beforeEach } from 'vitest';
import { type User, createUser, deactivateUser, updateEmail } from '../src/userService.js';

describe('User Service', () => {
  let mockUser: User;

  beforeEach(() => {
    mockUser = createUser('John Doe', 'john@example.com');
  });

  it('should create a mock user with correct properties', () => {
    expect(mockUser.name).toBe('John Doe');
    expect(mockUser.email).toBe('john@example.com');
    expect(mockUser.isActive).toBe(true);
  });

  it('should deactivate a user', () => {
    const deactivated = deactivateUser(mockUser);
    expect(deactivated.isActive).toBe(false);
  });

  it('should update user email', () => {
    const updated = updateEmail(mockUser, 'newemail@example.com');
    expect(updated.email).toBe('newemail@example.com');
  });

  it('should handle user object serialization', () => {
    const serialized = JSON.stringify(mockUser);
    const parsed = JSON.parse(serialized);
    expect(parsed).toEqual(mockUser);
  });
});
