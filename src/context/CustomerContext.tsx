import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
  lastOrderAt?: string;
}

interface CustomerContextType {
  customers: Customer[];
  addOrUpdateCustomer: (data: { id: string; name: string; email: string; phone?: string; orderAmount?: number }) => void;
  getCustomerById: (id: string) => Customer | undefined;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('elitos_customers');
    if (saved) {
      try {
        setCustomers(JSON.parse(saved));
      } catch {
        setCustomers([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('elitos_customers', JSON.stringify(customers));
  }, [customers]);

  const addOrUpdateCustomer = (data: { id: string; name: string; email: string; phone?: string; orderAmount?: number }) => {
    setCustomers(prev => {
      const existing = prev.find(c => c.id === data.id || c.email === data.email);
      if (existing) {
        return prev.map(c => 
          (c.id === data.id || c.email === data.email) 
            ? { 
                ...c, 
                name: data.name,
                phone: data.phone || c.phone,
                totalOrders: c.totalOrders + 1,
                totalSpent: c.totalSpent + (data.orderAmount || 0),
                lastOrderAt: new Date().toISOString()
              } 
            : c
        );
      } else {
        const newCustomer: Customer = {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          totalOrders: 1,
          totalSpent: data.orderAmount || 0,
          createdAt: new Date().toISOString(),
          lastOrderAt: new Date().toISOString(),
        };
        return [newCustomer, ...prev];
      }
    });
  };

  const getCustomerById = (id: string) => {
    return customers.find(c => c.id === id);
  };

  return (
    <CustomerContext.Provider value={{ customers, addOrUpdateCustomer, getCustomerById }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomers = () => {
  const context = useContext(CustomerContext);
  if (!context) throw new Error('useCustomers must be used within CustomerProvider');
  return context;
};
