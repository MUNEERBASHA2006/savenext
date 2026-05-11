import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Target as TargetIcon, TrendingUp, Calendar, ImageIcon } from 'lucide-react';
import { useTargets, Target } from '../contexts/TargetsContext';

interface AddTargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  editTarget?: Target | null;
}

export default function AddTargetModal({ isOpen, onClose, editTarget }: AddTargetModalProps) {
  const { addTarget, updateTarget } = useTargets();
  const [formData, setFormData] = useState({
    title: editTarget?.title || '',
    amount: editTarget?.amount.toString() || '',
    saved: editTarget?.saved.toString() || '0',
    icon: editTarget?.icon || '💰',
    targetDate: editTarget?.targetDate || '',
    image: editTarget?.image || ''
  });

  // Reset form when editTarget changes or modal opens
  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        title: editTarget?.title || '',
        amount: editTarget?.amount.toString() || '',
        saved: editTarget?.saved.toString() || '0',
        icon: editTarget?.icon || '💰',
        targetDate: editTarget?.targetDate || '',
        image: editTarget?.image || ''
      });
    }
  }, [editTarget, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title: formData.title,
      amount: parseFloat(formData.amount),
      saved: parseFloat(formData.saved),
      icon: formData.icon,
      targetDate: formData.targetDate || new Date().toISOString().split('T')[0],
      status: (editTarget?.status || 'ACTIVE') as 'ACTIVE' | 'PAUSED',
      image: formData.image || undefined
    };

    if (editTarget) {
      updateTarget(editTarget.id, data);
    } else {
      addTarget(data);
    }
    onClose();
    setFormData({ title: '', amount: '', saved: '0', icon: '💰', targetDate: '', image: '' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-md">
          {/* ... background overlay ... */}
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
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden overflow-y-auto max-h-[90vh]"
          >
            <div className="p-lg border-b border-surface-container flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-md">
                <div className="w-10 h-10 bg-secondary-container rounded-lg flex items-center justify-center text-on-secondary-container">
                  <TargetIcon className="w-6 h-6" />
                </div>
                <h3 className="text-headline-md text-primary">{editTarget ? 'Edit Target' : 'New Savings Target'}</h3>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-lg space-y-lg">
              {/* ... form fields ... */}
              <div className="space-y-sm">
                <label className="text-label-caps text-on-surface-variant font-bold">Target Title</label>
                <input 
                  required
                  type="text" 
                  value={formData.title}
                  onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Dream Wedding, New Car"
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-md">
                <div className="space-y-sm">
                  <label className="text-label-caps text-on-surface-variant font-bold">Target Amount ($)</label>
                  <input 
                    required
                    type="number" 
                    value={formData.amount}
                    onChange={e => setFormData(f => ({ ...f, amount: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-sm">
                  <label className="text-label-caps text-on-surface-variant font-bold">Already Saved ($)</label>
                  <input 
                    type="number" 
                    value={formData.saved}
                    onChange={e => setFormData(f => ({ ...f, saved: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-md">
                <div className="space-y-sm">
                  <label className="text-label-caps text-on-surface-variant font-bold">Target Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50" />
                    <input 
                      type="date" 
                      value={formData.targetDate}
                      onChange={e => setFormData(f => ({ ...f, targetDate: e.target.value }))}
                      className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-sm">
                  <label className="text-label-caps text-on-surface-variant font-bold">Icon (Emoji)</label>
                  <input 
                    type="text" 
                    value={formData.icon}
                    onChange={e => setFormData(f => ({ ...f, icon: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-center text-xl font-medium"
                  />
                </div>
              </div>

              <div className="space-y-sm">
                <label className="text-label-caps text-on-surface-variant font-bold">Cover Image URL (Optional)</label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50" />
                  <input 
                    type="url" 
                    value={formData.image}
                    onChange={e => setFormData(f => ({ ...f, image: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                    className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="pt-md">
                <button type="submit" className="w-full bg-primary text-white py-lg rounded-xl text-headline-md font-bold shadow-lg active:scale-[0.98] transition-transform hover:bg-primary-container flex items-center justify-center gap-sm">
                  <TrendingUp className="w-6 h-6" />
                  {editTarget ? 'Update Target' : 'Create Target'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
