import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, KitchenUser, AuthContextType } from '@/types/auth';
import { apiService, LoginData } from '@/services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | KitchenUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<'admin' | 'kitchen' | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing auth on app load
  useEffect(() => {
    console.log('🔵 AuthProvider: Initializing...');
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('userData');
    const storedRole = localStorage.getItem('userRole');
    
    console.log('🔵 Stored token exists:', !!storedToken);
    console.log('🔵 Stored user exists:', !!storedUser);
    console.log('🔵 Stored role:', storedRole);
    
    if (storedToken && storedUser && storedRole) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('🟢 Restoring auth state:', parsedUser);
        setToken(storedToken);
        setUser(parsedUser);
        setRole(storedRole as 'admin' | 'kitchen');
      } catch (error) {
        console.error('🔴 Error parsing stored user data:', error);
        // Clear invalid data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('userRole');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData: User | KitchenUser, authToken: string, userRole: 'admin' | 'kitchen') => {
    console.log('🔵 AuthContext: Login called');
    console.log('🔵 User data:', userData);
    console.log('🔵 Role:', userRole);
    
    // Store in state
    setUser(userData);
    setToken(authToken);
    setRole(userRole);
    
    // Store in localStorage
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('userRole', userRole);
    
    console.log('🟢 Auth state updated successfully');
  };

  const loginWithCredentials = async (credentials: LoginData): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      console.log('🔵 AuthContext: Login attempt with:', credentials.identifier);
      
      // Try API first, fallback to mock for demo
      try {
        const response = await apiService.login(credentials);
        
        if (response.success && response.data) {
          const { user: userData, token: authToken } = response.data;
          const userRole = userData.role || 'admin';
          
          login(userData, authToken, userRole);
          return { success: true, message: response.message || 'Login successful' };
        } else {
          throw new Error(response.message || 'Login failed');
        }
      } catch (apiError) {
        console.log('🟡 API failed, using mock login for demo:', apiError);
        
        // Mock login for demo purposes
        const { identifier, password } = credentials;
        
        // Mock admin login
        if ((identifier === 'admin' || identifier.includes('RID') || /^[0-9]{10}$/.test(identifier)) && password === 'admin123') {
          const mockAdminUser: User = {
            id: 'admin_001',
            restaurantId: 'RID123456',
            restaurantName: 'FastAsFlash Demo Restaurant',
            ownerName: 'Demo Owner',
            phoneNumber: '9876543210',
            location: 'Demo City, Demo State',
            establishmentYear: 2023,
            isActive: true,
            planAmount: 15000,
            selectedServices: ['basic-menu', 'advanced-pos', 'analytics'],
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            role: 'admin'
          };
          
          login(mockAdminUser, 'mock_admin_token', 'admin');
          return { success: true, message: 'Mock admin login successful' };
        }
        
        // Mock kitchen login
        if (identifier.includes('kitchen') && password === 'kitchen123') {
          const mockKitchenUser: KitchenUser = {
            id: 'kitchen_001',
            username: 'kitchen_main',
            kitchenName: 'Main Kitchen',
            restaurantId: 'RID123456',
            isActive: true,
            role: 'kitchen',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          };
          
          login(mockKitchenUser, 'mock_kitchen_token', 'kitchen');
          return { success: true, message: 'Mock kitchen login successful' };
        }
        
        return { 
          success: false, 
          message: 'Invalid credentials. Try: admin/admin123 or kitchen_main/kitchen123' 
        };
      }
    } catch (error) {
      console.error('🔴 Login error:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'An unexpected error occurred' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('🔵 AuthContext: Logout called');
    
    // Clear state
    setUser(null);
    setToken(null);
    setRole(null);
    
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userRole');
    
    console.log('🟢 Auth state cleared');
  };

  // Compute isAuthenticated based on current state
  const isAuthenticated = !!(user && token && role);

  const contextValue: AuthContextType = {
    user,
    token,
    role,
    isAuthenticated,
    login,
    loginWithCredentials,
    logout,
    loading
  };

  console.log('🔵 AuthContext current state:', {
    hasUser: !!user,
    hasToken: !!token,
    role,
    isAuthenticated,
    loading
  });

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;