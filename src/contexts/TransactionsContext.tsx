import React, { createContext, useContext, useState, useEffect } from 'react';
import { ShoppingCart, Car, Coffee, GraduationCap, Utensils, FileText } from 'lucide-react';

export interface Transaction {
  id: string;
  title: string;
  time: string;
  amount: number;
  type: string;
  notes?: string;
  iconType: 'ShoppingCart' | 'Car' | 'Coffee' | 'GraduationCap' | 'Utensils' | 'FileText';
}

interface TransactionsContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'time'>) => void;
}

const INITIAL_TRANSACTIONS: Transaction[] = [];

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

export function TransactionsProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('save_nest_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  useEffect(() => {
    localStorage.setItem('save_nest_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (t: Omit<Transaction, 'id' | 'time'>) => {
    const newTransaction: Transaction = {
      ...t,
      id: Math.random().toString(36).substr(2, 9),
      time: new Date().toLocaleString('en-US', { 
        hour: 'numeric', 
        minute: 'numeric', 
        hour12: true,
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  return (
    <TransactionsContext.Provider value={{ transactions, addTransaction }}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionsContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }
  return context;
}
