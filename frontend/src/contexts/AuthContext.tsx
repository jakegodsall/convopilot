'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { authAPI, userAPI, User, LoginData, RegisterData } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginData) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = Cookies.get('access_token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await userAPI.getCurrentUser();
      setUser(response.data);
    } catch (error) {
      console.error('Failed to load user:', error);
      Cookies.remove('access_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginData) => {
    try {
      const response = await authAPI.login(credentials);
      const { access_token } = response.data;
      
      // Store token in cookie
      Cookies.set('access_token', access_token, { 
        expires: 7, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      // Load user data
      await loadUser();
      
      toast.success('Successfully logged in!');
    } catch (error: any) {
      const message = getErrorMessage(error) || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await authAPI.register(userData);
      
      // Auto-login after registration
      await login({
        email: userData.email,
        password: userData.password,
      });
      
      toast.success('Account created successfully!');
    } catch (error: any) {
      const message = getErrorMessage(error) || 'Registration failed';
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove('access_token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const refreshUser = async () => {
    try {
      const response = await userAPI.getCurrentUser();
      setUser(response.data);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext; 