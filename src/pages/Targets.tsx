import { motion } from 'motion/react';
import { Clock, Plus, Edit2, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTargets, Target } from '../contexts/TargetsContext';
import { useState } from 'react';
import AddTargetModal from '../components/AddTargetModal';
import AddMoneyModal from '../components/AddMoneyModal';

export default function Targets() {
  const { targets, deleteTarget } = useTargets();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMoneyModalOpen, setIsMoneyModalOpen] = useState(false);
  const [activeTarget, setActiveTarget] = useState<Target | null>(null);
  const [editTarget, setEditTarget] = useState<Target | null>(null);

  const handleEdit = (target: Target) => {
    setEditTarget(target);
    setIsAddModalOpen(true);
  };

  const handleAddMoney = (target: Target) => {
    setActiveTarget(target);
    setIsMoneyModalOpen(true);
  };

  const handleCloseAdd = () => {
    setIsAddModalOpen(false);
    setEditTarget(null);
  };

  const handleCloseMoney = () => {
    setIsMoneyModalOpen(false);
    setActiveTarget(null);
  };

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex flex-col gap-xs">
        <h2 className="text-headline-md text-primary">Savings Targets</h2>
        <p className="text-body-sm text-on-surface-variant">Track your financial goals and upcoming milestones.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
        {targets.map(target => (
          <DetailedTargetCard 
            key={target.id}
             image={target.image}
             status={target.status}
             title={target.title}
             icon={target.icon}
             amount={target.amount}
             saved={target.saved}
             progress={Math.round((target.saved / target.amount) * 100)}
             daysRemaining={Math.max(0, Math.ceil((new Date(target.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}
             onClick={() => handleAddMoney(target)}
             onEdit={() => handleEdit(target)}
             onDelete={() => deleteTarget(target.id)}
          />
        ))}

        <motion.div 
          whileHover={{ y: -8 }}
          onClick={() => setIsAddModalOpen(true)}
          className="bg-surface border-2 border-dashed border-outline-variant rounded-xl p-lg flex flex-col items-center justify-center text-center space-y-md hover:bg-surface-container-low transition-colors cursor-pointer min-h-[400px] group"
        >
          <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="w-8 h-8 text-on-surface-variant" />
          </div>
          <div>
            <p className="text-headline-md text-on-surface-variant">Create New Target</p>
            <p className="text-body-sm text-outline">Set a goal and start saving today.</p>
          </div>
        </motion.div>
      </div>

      <AddTargetModal 
        isOpen={isAddModalOpen} 
        onClose={handleCloseAdd} 
        editTarget={editTarget}
      />

      <AddMoneyModal 
        isOpen={isMoneyModalOpen}
        onClose={handleCloseMoney}
        target={activeTarget}
      />
    </div>
  );
}

function DetailedTargetCard({ image, status, title, icon, amount, saved, progress, daysRemaining, onClick, onEdit, onDelete }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      onClick={onClick}
      className="bg-white rounded-xl shadow-[0_4px_12px_rgba(26,43,60,0.05)] overflow-hidden flex flex-col transition-all hover:shadow-xl border border-outline-variant/10 group/card cursor-pointer"
    >
      <div className="h-48 w-full overflow-hidden relative bg-surface-container flex items-center justify-center">
        {image ? (
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform hover:scale-110 duration-700" 
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="text-6xl">{icon}</span>
        )}
        <div className="absolute top-md right-md flex gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm text-primary hover:bg-primary hover:text-white transition-all opacity-0 group-hover/card:opacity-100"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm text-error hover:bg-error hover:text-white transition-all opacity-0 group-hover/card:opacity-100"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="bg-white/90 backdrop-blur-sm px-sm py-xs rounded-lg shadow-sm">
            <span className={cn(
              "text-label-caps font-bold",
              status === "ACTIVE" ? "text-secondary" : "text-outline"
            )}>{status}</span>
          </div>
        </div>
      </div>
      <div className="p-lg flex flex-col gap-md">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-sm">
             <span className="text-2xl">{icon}</span>
             <h3 className="text-headline-md text-primary">{title}</h3>
          </div>
          <p className="text-display-lg-mobile text-primary font-bold">${amount.toLocaleString()}</p>
        </div>
        <div className="flex flex-col gap-xs">
          <div className="flex justify-between items-end">
            <p className="text-body-sm text-on-surface-variant font-medium">Saved: ${saved.toLocaleString()}</p>
            <p className="text-label-caps text-secondary font-bold">{progress}%</p>
          </div>
          <div className="h-2.5 w-full bg-secondary-container/20 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: `${progress}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-full bg-secondary rounded-full" 
            />
          </div>
        </div>
        <div className="flex items-center gap-sm pt-sm border-t border-outline-variant/20">
          <Clock className="w-4 h-4 text-outline" />
          <p className="text-body-sm text-on-surface-variant font-medium">Est. {daysRemaining} days remaining</p>
        </div>
      </div>
    </motion.div>
  );
}
