import { motion } from 'motion/react';
import { TrendingUp, Award, ArrowUpRight, Plus, ShieldCheck, Building2, Wallet } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTargets, Target } from '../contexts/TargetsContext';
import { useTransactions } from '../contexts/TransactionsContext';
import { useProfile } from '../contexts/ProfileContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddTargetModal from '../components/AddTargetModal';
import AddMoneyModal from '../components/AddMoneyModal';

export default function Dashboard() {
  const { targets } = useTargets();
  const { transactions } = useTransactions();
  const { profile } = useProfile();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMoneyModalOpen, setIsMoneyModalOpen] = useState(false);
  const [activeTarget, setActiveTarget] = useState<Target | null>(null);
  const navigate = useNavigate();

  // Fresh users start with a base balance from their bank
  const baseBalance = 12450.00;
  const totalBalance = baseBalance + transactions.reduce((acc, t) => acc + t.amount, 0);

  const handleAddMoney = (target: Target) => {
    setActiveTarget(target);
    setIsMoneyModalOpen(true);
  };

  return (
    <div className="space-y-xl">
      {/* Security Status Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-secondary/10 border border-secondary/20 rounded-lg px-md py-sm flex items-center justify-between"
      >
        <div className="flex items-center gap-sm">
          <ShieldCheck className="w-4 h-4 text-secondary" />
          <span className="text-body-xs font-bold text-secondary uppercase tracking-wider">Vault Connection Secure</span>
        </div>
        <div className="flex items-center gap-sm">
          <span className="text-body-xs text-on-surface-variant">Linked to </span>
          <span className="text-body-xs font-bold text-primary">{profile.bankName}</span>
        </div>
      </motion.div>

      {/* Balance Overview */}
      <section className="grid grid-cols-1 gap-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-lg shadow-[0_4px_12px_rgba(26,43,60,0.05)] border border-surface-container"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md mb-xl">
            <div>
              <p className="text-label-caps text-on-surface-variant mb-xs">TOTAL LIQUIDITY</p>
              <h2 className="text-display-lg text-primary">${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
            </div>
            <div className="flex items-center gap-sm bg-secondary-container/30 px-md py-sm rounded-lg">
              <TrendingUp className="w-5 h-5 text-secondary" />
              <span className="text-data-mono text-on-secondary-container text-sm">Real-time Sync</span>
            </div>
          </div>

          <div className="space-y-lg border-t border-surface-container pt-lg">
            <div className="flex justify-between items-end">
              <div className="space-y-xs">
                <p className="text-label-caps text-on-surface-variant">TARGET UTILIZATION</p>
                <p className="text-headline-md text-primary">Goal Allocation</p>
              </div>
              <p className="text-data-mono text-secondary">{targets.length > 0 ? `${Math.round((targets.reduce((acc, t) => acc + t.saved, 0) / totalBalance) * 100)}% Allocated` : '0% Allocated'}</p>
            </div>
            <div className="w-full h-4 bg-secondary-container/20 rounded-full overflow-hidden flex">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: targets.length > 0 ? "20%" : "0%" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-secondary"
              />
              <div className="h-full bg-outline-variant opacity-30 flex-1" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Savings Targets Preview */}
      <section className="space-y-md">
        <div className="flex justify-between items-center">
          <h3 className="text-headline-md text-primary">Active Targets</h3>
          <button
            onClick={() => navigate('/targets')}
            className="flex items-center gap-xs text-label-caps text-on-primary-fixed-variant hover:text-primary transition-colors"
          >
            Manage Targets <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
        
        {targets.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white border-2 border-dashed border-outline-variant rounded-2xl p-xl flex flex-col items-center justify-center text-center space-y-md"
          >
            <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center">
              <Wallet className="w-8 h-8 text-outline-variant" />
            </div>
            <div className="space-y-xs">
              <h4 className="text-headline-sm text-primary">No Active Targets</h4>
              <p className="text-body-sm text-on-surface-variant max-w-xs mx-auto">
                Setting your first target is the secret to financial discipline. What are we building today?
              </p>
            </div>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-primary text-white px-lg py-md rounded-xl text-label-caps font-bold hover:bg-primary-container transition-all flex items-center gap-sm"
            >
              <Plus className="w-5 h-5" /> Create First Target
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {targets.slice(0, 2).map(target => (
              <TargetCard
                key={target.id}
                icon={target.icon}
                title={target.title}
                current={target.saved}
                target={target.amount}
                progress={Math.round((target.saved / target.amount) * 100)}
                color="bg-primary-fixed"
                onClick={() => handleAddMoney(target)}
              />
            ))}
            <div
              onClick={() => setIsAddModalOpen(true)}
              className="bg-surface border-2 border-dashed border-outline-variant rounded-xl p-lg flex flex-col items-center justify-center text-center space-y-md hover:bg-surface-container-low transition-colors cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 text-on-surface-variant" />
              </div>
              <p className="text-label-caps text-on-surface-variant font-bold">New Target</p>
            </div>
          </div>
        )}
      </section>

      <AddTargetModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <AddMoneyModal isOpen={isMoneyModalOpen} onClose={() => setIsMoneyModalOpen(false)} target={activeTarget} />
    </div>
  );
}

function TargetCard({ icon, title, current, target, progress, color, onClick }: any) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="bg-white rounded-xl p-lg shadow-[0_4px_12px_rgba(26,43,60,0.05)] border border-surface-container cursor-pointer"
    >
      <div className="flex justify-between items-start mb-lg">
        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center text-2xl shadow-inner", color)}>
          {icon}
        </div>
        <span className="text-data-mono text-secondary font-bold">{progress}%</span>
      </div>
      <div className="space-y-xs mb-lg">
        <h4 className="text-headline-md text-primary">{title}</h4>
        <p className="text-body-sm text-on-surface-variant">${current.toLocaleString()} / ${target.toLocaleString()}</p>
      </div>
      <div className="w-full h-2 bg-secondary-container/20 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-secondary rounded-full" 
        />
      </div>
    </motion.div>
  );
}
