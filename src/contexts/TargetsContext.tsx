import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Target {
  id: string;
  title: string;
  amount: number;
  saved: number;
  icon: string;
  image?: string;
  status: 'ACTIVE' | 'PAUSED';
  targetDate: string;
}

interface TargetsContextType {
  targets: Target[];
  addTarget: (target: Omit<Target, 'id'>) => void;
  updateTarget: (id: string, updates: Partial<Target>) => void;
  deleteTarget: (id: string) => void;
}

const INITIAL_TARGETS: Target[] = [];

const TargetsContext = createContext<TargetsContextType | undefined>(undefined);

export function TargetsProvider({ children }: { children: React.ReactNode }) {
  const [targets, setTargets] = useState<Target[]>(() => {
    const saved = localStorage.getItem('save_nest_targets');
    return saved ? JSON.parse(saved) : INITIAL_TARGETS;
  });

  useEffect(() => {
    localStorage.setItem('save_nest_targets', JSON.stringify(targets));
  }, [targets]);

  const addTarget = (target: Omit<Target, 'id'>) => {
    const newTarget: Target = {
      ...target,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTargets(prev => [...prev, newTarget]);
  };

  const updateTarget = (id: string, updates: Partial<Target>) => {
    setTargets(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTarget = (id: string) => {
    setTargets(prev => prev.filter(t => t.id !== id));
  };

  return (
    <TargetsContext.Provider value={{ targets, addTarget, updateTarget, deleteTarget }}>
      {children}
    </TargetsContext.Provider>
  );
}

export function useTargets() {
  const context = useContext(TargetsContext);
  if (context === undefined) {
    throw new Error('useTargets must be used within a TargetsProvider');
  }
  return context;
}
