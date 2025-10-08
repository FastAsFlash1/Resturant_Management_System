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
      
      const response = await apiService.login(credentials);
      console.log('🔵 API Response:', response);
      
      if (response.success && response.data) {
        const { token: authToken, role, restaurant, kitchen } = response.data;
        console.log('🔵 Response data:', { token: !!authToken, role, hasRestaurant: !!restaurant, hasKitchen: !!kitchen });
        
        if (authToken && role) {
          // Transform backend data to frontend format
          if (role === 'admin' && restaurant) {
            const adminUser: User = {
              id: restaurant.restaurantId,
              restaurantId: restaurant.restaurantId,
              restaurantName: restaurant.restaurantName,
              ownerName: restaurant.ownerName,
              phoneNumber: restaurant.phoneNumber,
              location: restaurant.location,
              establishmentYear: restaurant.establishmentYear,
              isActive: restaurant.isActive,
              planAmount: restaurant.planAmount || 0,
              selectedServices: restaurant.selectedServices || [],
              createdAt: restaurant.createdAt || new Date().toISOString(),
              lastLogin: restaurant.lastLogin || new Date().toISOString(),
              role: 'admin'
            };
            login(adminUser, authToken, role);
            return { success: true, message: response.message || 'Admin login successful' };
          } else if (role === 'kitchen' && kitchen) {
            const kitchenUser: KitchenUser = {
              id: kitchen.id,
              username: kitchen.username,
              kitchenName: kitchen.kitchenName,
              restaurantId: kitchen.restaurantId,
              contactNumber: kitchen.contactNumber,
              isActive: kitchen.isActive,
              role: 'kitchen',
              createdAt: kitchen.createdAt || new Date().toISOString(),
              lastLogin: kitchen.lastLogin || new Date().toISOString()
            };
            login(kitchenUser, authToken, role);
            return { success: true, message: response.message || 'Kitchen login successful' };
          } else {
            throw new Error('Invalid user data received from server');
          }
        } else {
          throw new Error('Missing token or role in server response');
        }
      } else {
        return { 
          success: false, 
          message: response.message || 'Invalid credentials. Please check your identifier and password.' 
        };
      }
    } catch (error) {
      console.error('🔴 Login error:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Connection failed. Please check if the server is running.' 
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