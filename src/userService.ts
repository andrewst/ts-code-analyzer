export interface User {
  name: string;
  email: string;
  isActive: boolean;
}

export function createUser(name: string, email: string): User {
  return {
    name,
    email,
    isActive: true,
  };
}

export function deactivateUser(user: User): User {
  return { ...user, isActive: false };
}

export function updateEmail(user: User, email: string): User {
  return { ...user, email };
}
