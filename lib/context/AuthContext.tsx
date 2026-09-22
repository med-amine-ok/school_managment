'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'ADMIN' | 'TEACHER' | 'EMPLOYEE';

export interface User {
  id: string;
  name: string;
  username?: string;
  password?: string;
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
    username: 'admin',
    email: 'admin@elnadjah.dz',
    password: 'admin',
    role: 'ADMIN',
    title: 'Super Administrator',
  },
  TEACHER: {
    id: 'usr-teacher',
    name: 'Ahmed Benali',
    username: 'ahmed.benali',
    email: 'ahmed.benali@elnadjah.dz',
    password: 'teacher123',
    role: 'TEACHER',
    teacherId: 'tch-ahmed',
    title: 'Senior Mathematics Instructor',
  },
  EMPLOYEE: {
    id: 'usr-employee',
    name: 'Fatima Zohra',
    username: 'fatima.zohra',
    email: 'fatima.zohra@elnadjah.dz',
    password: 'staff123',
    role: 'EMPLOYEE',
    employeeId: 'emp-001',
    title: 'Registrar & Admissions Officer',
  },
};

const INITIAL_ACCOUNTS: User[] = [
  PRESET_USERS.ADMIN,
  PRESET_USERS.TEACHER,
  PRESET_USERS.EMPLOYEE,
];

interface AuthContextType {
  user: User;
  isAuthenticated: boolean;
  registeredAccounts: User[];
  login: (role?: UserRole, identifier?: string, password?: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  registerAccount: (account: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(PRESET_USERS.ADMIN);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [registeredAccounts, setRegisteredAccounts] = useState<User[]>(INITIAL_ACCOUNTS);

  // Hydrate from localStorage if available
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('elnadjah_auth_user');
      const savedAuth = localStorage.getItem('elnadjah_auth_state');
      const savedAccounts = localStorage.getItem('elnadjah_registered_accounts');

      if (savedAccounts) {
        const parsed = JSON.parse(savedAccounts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRegisteredAccounts(parsed);
        }
      }

      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(savedAuth === 'true');
      }
    } catch {
      // ignore SSR or storage exceptions
    }
  }, []);

  const registerAccount = (account: User) => {
    setRegisteredAccounts((prev) => {
      // Replace if existing with same id or username, else append
      const filtered = prev.filter(
        (a) => a.id !== account.id && a.username?.toLowerCase() !== account.username?.toLowerCase()
      );
      const updated = [account, ...filtered];
      try {
        localStorage.setItem('elnadjah_registered_accounts', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const login = async (role?: UserRole, identifier?: string, password?: string): Promise<boolean> => {
    // 1. If identifier (username or email) provided, match against registered accounts
    if (identifier && identifier.trim()) {
      const trimmedId = identifier.trim().toLowerCase();
      const matched = registeredAccounts.find(
        (a) =>
          a.username?.toLowerCase() === trimmedId ||
          a.email.toLowerCase() === trimmedId
      );

      if (matched) {
        // Check password if provided and stored
        if (matched.password && password && matched.password !== password) {
          throw new Error('Incorrect password for this account.');
        }
        setUser(matched);
        setIsAuthenticated(true);
        try {
          localStorage.setItem('elnadjah_auth_user', JSON.stringify(matched));
          localStorage.setItem('elnadjah_auth_state', 'true');
        } catch {
          // ignore
        }
        return true;
      }
    }

    // 2. Fallback to preset role login
    const targetRole = role || 'ADMIN';
    const selected = PRESET_USERS[targetRole] || PRESET_USERS.ADMIN;
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
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        registeredAccounts,
        login,
        logout,
        switchRole,
        registerAccount,
      }}
    >
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
