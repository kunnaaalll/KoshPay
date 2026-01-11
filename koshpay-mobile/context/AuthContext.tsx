import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../constants/config';
import axios from 'axios';

type User = {
  id: string;
  phone: string;
  name?: string;
  koshpayId: string;
  kycStatus: 'pending' | 'submitted' | 'approved' | 'rejected';
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (phone: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  updateKYCStatus: (status: User['kycStatus']) => void;
  canMakePayments: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await SecureStore.getItemAsync('user');
      if (userData) {
        let parsedUser = JSON.parse(userData);
        // Migration: Fix legacy ID "1" to valid UUID for Backend
        if (parsedUser.id === '1') {
             console.log("Migrating legacy user ID '1' to valid UUID");
             parsedUser.id = '553e789c-4b10-488b-b875-2c8f003f0533';
             await SecureStore.setItemAsync('user', JSON.stringify(parsedUser));
        }
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (phone: string, otp: string) => {
    try {
      // --- DEMO LOGIN BYPASS ---
      // Normalize phone: remove spaces and +91 prefix
      const normalizedPhone = phone.replace(/\s/g, '').replace(/^\+91/, '');
      if (normalizedPhone === '9999999999' && otp === '123456') {
          console.log("Demo Login Detected");
          const demoUser: User = {
              id: '553e789c-4b10-488b-b875-2c8f003f0533', 
              phone: '9999999999',
              name: 'Demo User',
              koshpayId: 'demo@koshpay',
              kycStatus: 'approved' 
          };
          setUser(demoUser);
          await SecureStore.setItemAsync('user', JSON.stringify(demoUser));
          await SecureStore.setItemAsync('authToken', 'demo-token');
          return;
      }

      const response = await axios.post(`${API_URL}/auth/verify-otp`, {
        phoneNumber: phone,
        code: otp
      });

      const { token, user: userData } = response.data;
      
      if (token && userData) {
          setUser(userData);
          await SecureStore.setItemAsync('user', JSON.stringify(userData));
          await SecureStore.setItemAsync('authToken', token);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      throw new Error(error.response?.data?.error || "Login failed");
    }
  };

  const logout = async () => {
    setUser(null);
    await SecureStore.deleteItemAsync('user');
  };

  const updateKYCStatus = (status: User['kycStatus']) => {
    if (user) {
      const updatedUser = { ...user, kycStatus: status };
      setUser(updatedUser);
      SecureStore.setItemAsync('user', JSON.stringify(updatedUser));
    }
  };

  const canMakePayments = user?.kycStatus === 'approved';

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        updateKYCStatus,
        canMakePayments,
      }}
    >
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
