import React, { createContext, useContext, useState, useEffect } from 'react';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
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
  addToCart: (item: MenuItem, customization?: MenuItemCustomization) => void;
  removeFromCart: (cartIndex: number) => void;
  updateQuantity: (cartIndex: number, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (tableId: string, paymentType: Order['paymentType']) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
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
  const [menu, setMenu] = useState<MenuItem[]>(DUMMY_MENU);
  const [orders, setOrders] = useState<Order[]>(DUMMY_ORDERS);
  const [cart, setCart] = useState<CartItem[]>([]);

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

  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: `item-${Date.now()}`,
    };
    setMenu((prev) => [...prev, newItem]);
  };

  const updateMenuItem = (id: string, item: Partial<MenuItem>) => {
    setMenu((prev) =>
      prev.map((menuItem) => (menuItem.id === id ? { ...menuItem, ...item } : menuItem))
    );
  };

  const deleteMenuItem = (id: string) => {
    setMenu((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <RestaurantContext.Provider
      value={{
        menu,
        orders,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        placeOrder,
        updateOrderStatus,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
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
