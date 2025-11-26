import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

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
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (phone: string, otp: string) => {
    // TODO: Replace with actual API call
    // For now, mock the login
    const mockUser: User = {
      id: '1',
      phone,
      name: 'Kunal Sharma',
      koshpayId: `${phone.slice(-4)}@koshpay`,
      kycStatus: 'pending', // Will be 'pending' for new users
    };

    setUser(mockUser);
    await SecureStore.setItemAsync('user', JSON.stringify(mockUser));
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
