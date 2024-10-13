'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'penyawer';
}

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: string,
  ) => Promise<void>;
  me: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const sessionKey = localStorage.getItem('sessionKey');
      if (sessionKey) {
        const response = await fetch('http://localhost:8080/me', {
          headers: { 'Session-Key': sessionKey },
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      }
    };
    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
      localStorage.setItem('sessionKey', data.sessionKey);
      if (data.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/donasi');
      }
    } else {
      console.error('Login failed');
    }
  };

  const logout = async () => {
    const sessionKey = localStorage.getItem('sessionKey');

    if (sessionKey) {
      await fetch('http://localhost:8080/logout', {
        method: 'DELETE',
        headers: { 'Session-Key': sessionKey },
      });
    } else {
      console.error('No session key found. Cannot log out.');
    }

    localStorage.removeItem('sessionKey');
    setUser(null);
    router.push('/');
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: string = 'penyawer',
  ) => {
    const res = await fetch('http://localhost:8080/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        password,
        password_confirm: password,
        role,
      }),
    });

    if (res.ok) {
      router.push('/');
    } else {
      const errorData = await res.json();
      console.error('Registration failed', errorData);
    }
  };

  const me = async () => {
    const sessionKey = localStorage.getItem('sessionKey');
    if (!sessionKey) {
      console.error('No session key found');
      return null;
    }
  
    try {
      const response = await fetch('http://localhost:8080/me', {
        headers: { 'Session-Key': sessionKey },
      });
  
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        return userData;
      } else {
        console.error('Failed to fetch user data', await response.json());
        return null;
      }
    } catch (error) {
      console.error('Error fetching user data', error);
      return null;
    }
  };
  

  return (
    <AuthContext.Provider value={{ user, login, logout, register, me }}>
      {children}
    </AuthContext.Provider>
  );
};
