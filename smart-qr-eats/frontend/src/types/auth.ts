export interface User {
  id: string;
  restaurantId: string;
  restaurantName: string;
  ownerName: string;
  phoneNumber: string;
  location: string;
  establishmentYear: number;
  isActive: boolean;
  planAmount: number;
  selectedServices: string[];
  createdAt: string;
  lastLogin?: string;
  role?: string;
}

export interface KitchenUser {
  id: string;
  username: string;
  kitchenName: string;
  restaurantId: string;
  contactNumber?: string;
  isActive: boolean;
  role: 'kitchen';
  createdAt: string;
  lastLogin?: string;
}

export interface AuthContextType {
  user: User | KitchenUser | null;
  token: string | null;
  role: 'admin' | 'kitchen' | null;
  isAuthenticated: boolean;
  login: (userData: User | KitchenUser, authToken: string, userRole: 'admin' | 'kitchen') => void;
  loginWithCredentials: (credentials: { identifier: string; password: string }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  loading: boolean;
}