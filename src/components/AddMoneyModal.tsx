import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, DollarSign, TrendingUp } from 'lucide-react';
import { useTargets, Target } from '../contexts/TargetsContext';
import { useTransactions } from '../contexts/TransactionsContext';

interface AddMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: Target | null;
}

export default function AddMoneyModal({ isOpen, onClose, target }: AddMoneyModalProps) {
  const { updateTarget } = useTargets();
  const { addTransaction } = useTransactions();
  const [amount, setAmount] = useState('');

  if (!target) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount) && numAmount > 0) {
      // Update target saved amount
      updateTarget(target.id, {
        saved: target.saved + numAmount
      });

      // Add transaction to reduce logical balance
      addTransaction({
        title: `Funding ${target.title}`,
        amount: -numAmount,
        type: 'Savings',
        notes: `Transfer to ${target.title} target`,
        iconType: 'GraduationCap'
      });

      onClose();
      setAmount('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-md">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-lg border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-md">
                <div className="w-10 h-10 bg-secondary-container rounded-lg flex items-center justify-center text-secondary">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-headline-sm text-primary">Add Money</h3>
                  <p className="text-body-xs text-on-surface-variant font-medium uppercase tracking-tight">{target.title}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-lg space-y-lg">
              <div className="space-y-sm">
                <label className="text-label-caps text-on-surface-variant font-bold">Amount to Contribute</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">$</span>
                  <input 
                    autoFocus
                    required
                    type="number" 
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-4 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-2xl font-bold text-primary"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-primary text-white py-lg rounded-xl text-headline-sm font-bold shadow-lg active:scale-[0.98] transition-transform hover:bg-primary-container flex items-center justify-center gap-sm"
              >
                <TrendingUp className="w-5 h-5" />
                Confirm Transfer
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
