'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'ADMIN' | 'TEACHER' | 'EMPLOYEE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  title: string;
  teacherId?: string;
  employeeId?: string;
}

export const PRESET_USERS: Record<UserRole, User> = {
  ADMIN: {
    id: 'usr-admin',
    name: 'Admin Karim',
    email: 'admin@elnadjah.dz',
    role: 'ADMIN',
    title: 'Super Administrator',
  },
  TEACHER: {
    id: 'usr-teacher',
    name: 'Ahmed Benali',
    email: 'ahmed.benali@elnadjah.dz',
    role: 'TEACHER',
    teacherId: 'tch-ahmed',
    title: 'Senior Mathematics Instructor',
  },
  EMPLOYEE: {
    id: 'usr-employee',
    name: 'Fatima Zohra',
    email: 'fatima.zohra@elnadjah.dz',
    role: 'EMPLOYEE',
    employeeId: 'emp-001',
    title: 'Registrar & Admissions Officer',
  },
};

interface AuthContextType {
  user: User;
  isAuthenticated: boolean;
  login: (role: UserRole, email?: string, password?: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(PRESET_USERS.ADMIN);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Hydrate from localStorage if available
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('elnadjah_auth_user');
      const savedAuth = localStorage.getItem('elnadjah_auth_state');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(savedAuth === 'true');
      }
    } catch {
      // ignore SSR or storage exceptions
    }
  }, []);

  const login = async (role: UserRole, _email?: string, _password?: string): Promise<boolean> => {
    const selected = PRESET_USERS[role] || PRESET_USERS.ADMIN;
    setUser(selected);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('elnadjah_auth_user', JSON.stringify(selected));
      localStorage.setItem('elnadjah_auth_state', 'true');
    } catch {
      // ignore
    }
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.setItem('elnadjah_auth_state', 'false');
    } catch {
      // ignore
    }
    window.location.href = '/login';
  };

  const switchRole = (role: UserRole) => {
    const selected = PRESET_USERS[role] || PRESET_USERS.ADMIN;
    setUser(selected);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('elnadjah_auth_user', JSON.stringify(selected));
      localStorage.setItem('elnadjah_auth_state', 'true');
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
