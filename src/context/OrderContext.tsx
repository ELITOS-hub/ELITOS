import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ordersAPI } from '../services/api';
import { localStorageHelper } from '../hooks/useAPI';

const STORAGE_KEY = 'elitos_orders';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  image: string;
}

export interface Order {
  id: string;
  orderNumber?: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  subtotal?: number;
  shippingCost?: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
  trackingNumber?: string;
  trackingUrl?: string;
  createdAt: string;
}

interface OrderContextType {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  isUsingAPI: boolean;
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Promise<string>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  getOrdersByUser: (userId: string) => Order[];
  getOrderById: (id: string) => Order | undefined;
  trackOrder: (orderNumber: string) => Promise<Order | null>;
  refreshOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUsingAPI, setIsUsingAPI] = useState(false);

  // Load orders from localStorage on mount and fetch from API
  useEffect(() => {
    const saved = localStorageHelper.get<Order[]>(STORAGE_KEY, []);
    setOrders(saved);
    // Also fetch from API
    refreshOrders();
  }, []);

  // Save to localStorage when orders change
  useEffect(() => {
    if (orders.length > 0) {
      localStorageHelper.set(STORAGE_KEY, orders);
    }
  }, [orders]);

  const refreshOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const apiOrders = await ordersAPI.getAll();
      if (apiOrders && apiOrders.length > 0) {
        const mappedOrders: Order[] = apiOrders.map((o: any) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          userId: o.userId || 'guest',
          customerName: o.customerName,
          customerEmail: o.customerEmail,
          customerPhone: o.customerPhone,
          items: o.items?.map((item: any) => ({
            productId: item.productId,
            name: item.product?.name || 'Product',
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            image: item.product?.images?.[0] || '',
          })) || [],
          total: o.totalAmount,
          subtotal: o.subtotal,
          shippingCost: o.shippingCost,
          status: o.status?.toLowerCase() || 'pending',
          paymentStatus: o.paymentStatus?.toLowerCase(),
          shippingAddress: {
            street: o.shippingAddress1 || '',
            city: o.shippingCity || '',
            state: o.shippingState || '',
            pincode: o.shippingPincode || '',
          },
          paymentMethod: o.paymentMethod,
          trackingNumber: o.trackingNumber,
          trackingUrl: o.trackingUrl,
          createdAt: o.createdAt,
        }));
        setOrders(mappedOrders);
        setIsUsingAPI(true);
      }
    } catch (err) {
      console.log('Could not fetch orders from API');
    } finally {
      setIsLoading(false);
    }
  }, []);


  const addOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      // Try API first
      const apiOrder = await ordersAPI.create({
        items: orderData.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
        })),
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.customerPhone,
        shippingAddress: {
          name: orderData.customerName,
          phone: orderData.customerPhone,
          addressLine1: orderData.shippingAddress.street,
          city: orderData.shippingAddress.city,
          state: orderData.shippingAddress.state,
          pincode: orderData.shippingAddress.pincode,
        },
        paymentMethod: orderData.paymentMethod === 'COD' ? 'COD' : 'RAZORPAY',
      });

      if (apiOrder) {
        const newOrder: Order = {
          id: apiOrder.id,
          orderNumber: apiOrder.orderNumber,
          ...orderData,
          total: apiOrder.totalAmount || orderData.total,
          status: apiOrder.status?.toLowerCase() || 'pending',
          createdAt: apiOrder.createdAt || new Date().toISOString(),
        };
        setOrders(prev => [newOrder, ...prev]);
        setIsUsingAPI(true);
        return apiOrder.orderNumber || apiOrder.id;
      }
    } catch (err) {
      console.log('API order creation failed, using localStorage');
    }

    // Fallback to localStorage
    const id = 'ORD-' + Date.now();
    const newOrder: Order = {
      ...orderData,
      id,
      orderNumber: id,
      createdAt: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);
    setIsLoading(false);
    return id;
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const getOrdersByUser = (userId: string) => {
    return orders.filter(o => o.userId === userId);
  };

  const getOrderById = (id: string) => {
    return orders.find(o => o.id === id || o.orderNumber === id);
  };

  const trackOrder = async (orderNumber: string): Promise<Order | null> => {
    try {
      const order = await ordersAPI.track(orderNumber);
      if (order) {
        return {
          id: order.id,
          orderNumber: order.orderNumber,
          userId: '',
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          items: order.items?.map((item: any) => ({
            productId: item.productId,
            name: item.product?.name || 'Product',
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            image: item.product?.images?.[0] || '',
          })) || [],
          total: 0,
          status: order.status?.toLowerCase() || 'pending',
          paymentStatus: order.paymentStatus?.toLowerCase(),
          shippingAddress: { street: '', city: '', state: '', pincode: '' },
          paymentMethod: '',
          trackingNumber: order.trackingNumber,
          trackingUrl: order.trackingUrl,
          createdAt: order.createdAt,
        };
      }
    } catch (err) {
      // Try local
      const localOrder = orders.find(o => o.orderNumber === orderNumber || o.id === orderNumber);
      if (localOrder) return localOrder;
    }
    return null;
  };

  return (
    <OrderContext.Provider value={{ 
      orders, 
      isLoading,
      error,
      isUsingAPI,
      addOrder, 
      updateOrderStatus, 
      getOrdersByUser, 
      getOrderById,
      trackOrder,
      refreshOrders,
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within OrderProvider');
  return context;
};
