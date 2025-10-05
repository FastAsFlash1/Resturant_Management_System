import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  restaurantId: string;
  restaurantName: string;
  ownerName: string;
  phoneNumber: string;
  location?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data on mount
    const storedToken = localStorage.getItem('fastasflash_token');
    const storedUser = localStorage.getItem('fastasflash_user');

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(userData);
        
        // Verify token with backend
        verifyToken(storedToken);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        logout();
      }
    }
    
    setIsLoading(false);
  }, []);

  const verifyToken = async (tokenToVerify: string) => {
    try {
      const response = await fetch('/api/auth/verify-token', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenToVerify}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Token verification failed');
      }

      const data = await response.json();
      if (data.success) {
        setUser(data.data.restaurant);
        updateStoredUser(data.data.restaurant);
      } else {
        throw new Error('Invalid token');
      }
    } catch (error) {
      console.error('Token verification error:', error);
      logout();
    }
  };

  const login = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('fastasflash_token', authToken);
    localStorage.setItem('fastasflash_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('fastasflash_token');
    localStorage.removeItem('fastasflash_user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      updateStoredUser(updatedUser);
    }
  };

  const updateStoredUser = (userData: User) => {
    localStorage.setItem('fastasflash_user', JSON.stringify(userData));
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};