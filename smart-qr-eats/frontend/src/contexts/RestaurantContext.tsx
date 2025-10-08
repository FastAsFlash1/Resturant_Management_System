import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '@/services/api';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

export interface MenuItem {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image?: string;
  imageUrl?: string;
  available?: boolean;
  isActive?: boolean;
  restaurantId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PortionSize {
  id: string;
  name: string;
  multiplier: number;
  description?: string;
}

export interface MenuItemCustomization {
  itemId: string;
  portionSize: PortionSize;
  customizations: Record<string, string | string[]>;
  specialInstructions?: string;
  totalPrice: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
  customization?: MenuItemCustomization;
  displayPrice?: number; // Override price for customized items
}

export interface Order {
  id: string;
  tableId: string;
  items: CartItem[];
  status: 'pending' | 'preparing' | 'served';
  paymentType: 'cash' | 'upi' | 'razorpay';
  total: number;
  timestamp: Date;
}

interface RestaurantContextType {
  menu: MenuItem[];
  orders: Order[];
  cart: CartItem[];
  loading: boolean;
  addToCart: (item: MenuItem, customization?: MenuItemCustomization) => void;
  removeFromCart: (cartIndex: number) => void;
  updateQuantity: (cartIndex: number, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (tableId: string, paymentType: Order['paymentType']) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addMenuItem: (item: Omit<MenuItem, 'id' | '_id'>) => Promise<{ success: boolean; data?: MenuItem; error?: string }>;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => Promise<{ success: boolean; error?: string }>;
  deleteMenuItem: (id: string) => Promise<{ success: boolean; error?: string }>;
  loadMenu: () => Promise<void>;
  loadOrders: () => Promise<void>;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

const DUMMY_MENU: MenuItem[] = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Classic tomato sauce, mozzarella, and fresh basil',
    price: 299,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002',
    available: true,
  },
  {
    id: '2',
    name: 'Chicken Biryani',
    description: 'Fragrant basmati rice with tender chicken and aromatic spices',
    price: 349,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8',
    available: true,
  },
  {
    id: '3',
    name: 'Caesar Salad',
    description: 'Crispy romaine lettuce, parmesan, croutons, and Caesar dressing',
    price: 199,
    category: 'Salads',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1',
    available: true,
  },
  {
    id: '4',
    name: 'Paneer Tikka',
    description: 'Marinated cottage cheese grilled to perfection with spices',
    price: 249,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8',
    available: true,
  },
  {
    id: '5',
    name: 'Chocolate Brownie',
    description: 'Rich, fudgy brownie with vanilla ice cream',
    price: 149,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51',
    available: true,
  },
  {
    id: '6',
    name: 'Butter Chicken',
    description: 'Creamy tomato curry with tender chicken pieces',
    price: 329,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398',
    available: true,
  },
];

const DUMMY_ORDERS: Order[] = [
  {
    id: 'ord-1',
    tableId: '5',
    items: [
      { ...DUMMY_MENU[0], quantity: 2 },
      { ...DUMMY_MENU[3], quantity: 1 },
    ],
    status: 'preparing',
    paymentType: 'cash',
    total: 847,
    timestamp: new Date(Date.now() - 15 * 60000),
  },
  {
    id: 'ord-2',
    tableId: '3',
    items: [
      { ...DUMMY_MENU[1], quantity: 1 },
      { ...DUMMY_MENU[4], quantity: 2 },
    ],
    status: 'pending',
    paymentType: 'upi',
    total: 647,
    timestamp: new Date(Date.now() - 5 * 60000),
  },
];

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Load menu data when component mounts or when user changes
  useEffect(() => {
    loadMenu();
    if (isAuthenticated) {
      loadOrders();
    }
  }, [user, isAuthenticated]);

  const loadMenu = async () => {
    try {
      setLoading(true);
      console.log('🔵 Loading menu for restaurant:', user?.restaurantId);
      
      const response = user?.restaurantId 
        ? await apiService.getMenu(user.restaurantId)
        : await apiService.getMenu();
      
      if (response.success && response.data) {
        const menuItems = response.data.map((item: any) => ({
          id: item._id || item.id,
          _id: item._id,
          name: item.name,
          description: item.description || '',
          price: item.price,
          category: item.category,
          image: item.imageUrl || item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
          available: item.isActive !== undefined ? item.isActive : item.available,
          isActive: item.isActive,
          restaurantId: item.restaurantId,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        }));
        
        console.log('🟢 Menu loaded successfully:', menuItems.length, 'items');
        setMenu(menuItems);
      } else {
        console.log('🟡 No menu items found, using empty menu');
        setMenu([]);
      }
    } catch (error) {
      console.error('🔴 Error loading menu:', error);
      toast({
        title: "Error",
        description: "Failed to load menu items",
        variant: "destructive"
      });
      setMenu([]);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const response = await apiService.getOrders();
      if (response.success && response.data) {
        console.log('🟢 Orders loaded successfully:', response.data.length, 'orders');
        setOrders(response.data);
      }
    } catch (error) {
      console.error('🔴 Error loading orders:', error);
      setOrders([]);
    }
  };

  const addToCart = (item: MenuItem, customization?: MenuItemCustomization) => {
    setCart((prev) => {
      // If no customization, try to find existing item and increment quantity
      if (!customization) {
        const existing = prev.find((i) => i.id === item.id && !i.customization);
        if (existing) {
          return prev.map((i) =>
            i.id === item.id && !i.customization 
              ? { ...i, quantity: i.quantity + 1 } 
              : i
          );
        }
        return [...prev, { ...item, quantity: 1 }];
      }

      // For customized items, always add as new item (each customization is unique)
      const customizedItem: CartItem = {
        ...item,
        quantity: 1,
        customization,
        displayPrice: customization.totalPrice,
      };
      
      return [...prev, customizedItem];
    });
  };

  const removeFromCart = (cartIndex: number) => {
    setCart((prev) => prev.filter((_, index) => index !== cartIndex));
  };

  const updateQuantity = (cartIndex: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartIndex);
      return;
    }
    setCart((prev) =>
      prev.map((item, index) => (index === cartIndex ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = (tableId: string, paymentType: Order['paymentType']) => {
    const total = cart.reduce((sum, item) => {
      const itemPrice = item.displayPrice || item.price;
      return sum + itemPrice * item.quantity;
    }, 0);
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      tableId,
      items: [...cart],
      status: 'pending',
      paymentType,
      total,
      timestamp: new Date(),
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
  };

  const addMenuItem = async (item: Omit<MenuItem, 'id' | '_id'>) => {
    try {
      console.log('🔵 Adding menu item:', item);
      
      const response = await apiService.addMenuItem({
        name: item.name,
        description: item.description || '',
        price: item.price,
        category: item.category,
        imageUrl: item.image || item.imageUrl || ''
      });

      if (response.success && response.data) {
        const newItem: MenuItem = {
          id: response.data._id,
          _id: response.data._id,
          name: response.data.name,
          description: response.data.description || '',
          price: response.data.price,
          category: response.data.category,
          image: response.data.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
          available: response.data.isActive,
          isActive: response.data.isActive,
          restaurantId: response.data.restaurantId,
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt
        };

        setMenu((prev) => [...prev, newItem]);
        console.log('🟢 Menu item added successfully');
        
        toast({
          title: "Success",
          description: "Menu item added successfully!",
        });

        return { success: true, data: newItem };
      } else {
        throw new Error(response.message || 'Failed to add menu item');
      }
    } catch (error: any) {
      console.error('🔴 Error adding menu item:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add menu item",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    }
  };

  const updateMenuItem = async (id: string, item: Partial<MenuItem>) => {
    try {
      console.log('🔵 Updating menu item:', id, item);
      
      const response = await apiService.updateMenuItem(id, {
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        imageUrl: item.image || item.imageUrl,
        isActive: item.available !== undefined ? item.available : item.isActive
      });

      if (response.success && response.data) {
        const updatedItem = {
          ...item,
          id: response.data._id,
          _id: response.data._id,
          image: response.data.imageUrl,
          available: response.data.isActive
        };

        setMenu((prev) =>
          prev.map((menuItem) => 
            (menuItem.id === id || menuItem._id === id) 
              ? { ...menuItem, ...updatedItem } 
              : menuItem
          )
        );

        console.log('🟢 Menu item updated successfully');
        toast({
          title: "Success",
          description: "Menu item updated successfully!",
        });

        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to update menu item');
      }
    } catch (error: any) {
      console.error('🔴 Error updating menu item:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update menu item",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      console.log('🔵 Deleting menu item:', id);
      
      const response = await apiService.deleteMenuItem(id);

      if (response.success) {
        setMenu((prev) => prev.filter((item) => item.id !== id && item._id !== id));
        
        console.log('🟢 Menu item deleted successfully');
        toast({
          title: "Success",
          description: "Menu item deleted successfully!",
        });

        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to delete menu item');
      }
    } catch (error: any) {
      console.error('🔴 Error deleting menu item:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete menu item",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    }
  };

  return (
    <RestaurantContext.Provider
      value={{
        menu,
        orders,
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        placeOrder,
        updateOrderStatus,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        loadMenu,
        loadOrders,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within RestaurantProvider');
  }
  return context;
};
