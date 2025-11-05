"use client"; // This file is a Client Component

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { IUser } from '@/lib/models/user.model'; // We'll re-use the interface

// Define the shape of our Auth Context
interface AuthContextType {
  user: IUser | null; // The currently logged-in user
  token: string | null; // The JWT
  isLoading: boolean; // True while checking auth status
  login: (token: string) => void;
  logout: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the AuthProvider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // This effect runs on app load to check for an existing token
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      fetchUserData(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Function to fetch user data using a token
  const fetchUserData = async (currentToken: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${currentToken}`,
        },
      });

      if (res.ok) {
        const { user: fetchedUser } = await res.json();
        setUser(fetchedUser);
      } else {
        // Token is invalid or expired
        logout();
      }
    } catch (error) {
      console.error('Failed to fetch user', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  // Login function: save token and fetch user
  const login = (newToken: string) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    fetchUserData(newToken);
    router.push('/dashboard'); // Redirect to dashboard after login
  };

  // Logout function: clear everything
  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    router.push('/login'); // Redirect to login page
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to easily access the Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
