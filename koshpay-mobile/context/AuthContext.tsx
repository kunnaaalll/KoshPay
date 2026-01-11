import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';
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
      const userData = await storage.getItem('user');
      if (userData) {
        let parsedUser = JSON.parse(userData);
        // Migration: Fix legacy ID "1" to valid UUID for Backend
        if (parsedUser.id === '1') {
             console.log("Migrating legacy user ID '1' to valid UUID");
             parsedUser.id = '553e789c-4b10-488b-b875-2c8f003f0533';
             await storage.setItem('user', JSON.stringify(parsedUser));
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
      // Normalize phone
      const normalizedPhone = phone.replace(/\s/g, '').replace(/^\+91/, '');
      if (normalizedPhone === '9999999999' && otp === '123456') {
          console.log("Demo Login Detected - Calling Backend to Create Session");
          const response = await axios.post(`${API_URL}/auth/demo-login`, {});
          const { token, user: userData } = response.data;
          
          if (token && userData) {
             // Ensure kycStatus matches frontend interface
             userData.kycStatus = 'approved'; 
             setUser(userData);
             await storage.setItem('user', JSON.stringify(userData));
             await storage.setItem('authToken', token);
             return;
          }
      }

      const response = await axios.post(`${API_URL}/auth/verify-otp`, {
        phoneNumber: phone,
        code: otp
      });

      const { token, user: userData } = response.data;
      
      if (token && userData) {
          setUser(userData);
          await storage.setItem('user', JSON.stringify(userData));
          await storage.setItem('authToken', token);
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
    await storage.deleteItem('user');
  };

  const updateKYCStatus = (status: User['kycStatus']) => {
    if (user) {
      const updatedUser = { ...user, kycStatus: status };
      setUser(updatedUser);
      storage.setItem('user', JSON.stringify(updatedUser));
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
