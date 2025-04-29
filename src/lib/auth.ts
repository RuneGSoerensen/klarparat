export type UserRole = 'admin' | 'basic';

export interface User {
  name: string;
  role: UserRole;
}

export const getUserRole = (): UserRole | null => {
  if (typeof window === 'undefined') return null;
  
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  if (!isAuthenticated) return null;
  
  return localStorage.getItem("userRole") as UserRole;
};

export const getUserName = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  return localStorage.getItem("userName");
};

export const getUser = (): User | null => {
  const role = getUserRole();
  const name = getUserName();
  
  if (!role || !name) return null;
  
  return { name, role };
};

export const isAdmin = (): boolean => {
  return getUserRole() === 'admin';
};

export const requireAdmin = (): boolean => {
  const role = getUserRole();
  if (!role) {
    window.location.href = '/login';
    return false;
  }
  if (role !== 'admin') {
    window.location.href = '/';
    return false;
  }
  return true;
}; 