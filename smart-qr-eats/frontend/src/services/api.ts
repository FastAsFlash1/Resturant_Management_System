const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

interface SignupData {
  restaurantName: string;
  ownerName: string;
  location: string;
  establishmentYear: number;
  phoneNumber: string;
  password: string;
  documentUrl?: string;
  selectedServices: string[];
  planAmount: number;
}

interface LoginData {
  identifier: string;
  password: string;
}

interface UpdateUsernameData {
  ownerName: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

class ApiService {
  private getAuthHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const authToken = token || localStorage.getItem('fastasflash_token');
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    return headers;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async signup(signupData: SignupData): Promise<ApiResponse> {
    return this.makeRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(signupData),
    });
  }

  async login(loginData: LoginData): Promise<ApiResponse> {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });
  }

  async verifyToken(token: string): Promise<ApiResponse> {
    return this.makeRequest('/auth/verify-token', {
      method: 'POST',
      headers: this.getAuthHeaders(token),
    });
  }

  // Admin endpoints
  async getProfile(): Promise<ApiResponse> {
    return this.makeRequest('/admin/profile', {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
  }

  async updateUsername(data: UpdateUsernameData): Promise<ApiResponse> {
    return this.makeRequest('/admin/update-username', {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
  }

  async changePassword(data: ChangePasswordData): Promise<ApiResponse> {
    return this.makeRequest('/admin/change-password', {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
  }

  async updateProfile(data: {
    restaurantName?: string;
    location?: string;
    establishmentYear?: number;
  }): Promise<ApiResponse> {
    return this.makeRequest('/admin/update-profile', {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
  }

  async deleteAccount(password: string): Promise<ApiResponse> {
    return this.makeRequest('/admin/delete-account', {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ password }),
    });
  }

  // Menu endpoints
  async getMenu(restaurantId?: string): Promise<ApiResponse> {
    const endpoint = restaurantId ? `/menu/public/${restaurantId}` : '/menu';
    return this.makeRequest(endpoint, {
      method: 'GET',
      headers: restaurantId ? {} : this.getAuthHeaders(),
    });
  }

  async addMenuItem(data: {
    name: string;
    description?: string;
    price: number;
    category: string;
    imageUrl?: string;
  }): Promise<ApiResponse> {
    return this.makeRequest('/menu', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
  }

  async updateMenuItem(id: string, data: {
    name?: string;
    description?: string;
    price?: number;
    category?: string;
    imageUrl?: string;
    isActive?: boolean;
  }): Promise<ApiResponse> {
    return this.makeRequest(`/menu/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
  }

  async deleteMenuItem(id: string): Promise<ApiResponse> {
    return this.makeRequest(`/menu/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
  }

  // Order endpoints
  async placeOrder(data: {
    restaurantId: string;
    tableId: string;
    items: Array<{
      menuItemId: string;
      quantity: number;
      customization?: any;
    }>;
    paymentType: string;
    customerInfo?: any;
    notes?: string;
  }): Promise<ApiResponse> {
    return this.makeRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getOrders(params?: {
    status?: string;
    tableId?: string;
    limit?: number;
  }): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.tableId) queryParams.append('tableId', params.tableId);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const endpoint = `/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.makeRequest(endpoint, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
  }

  async updateOrderStatus(orderId: string, status: string, assignedTo?: string): Promise<ApiResponse> {
    return this.makeRequest(`/orders/${orderId}/status`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status, assignedTo }),
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.makeRequest('/health');
  }
}

export const apiService = new ApiService();
export type { SignupData, LoginData, UpdateUsernameData, ChangePasswordData };