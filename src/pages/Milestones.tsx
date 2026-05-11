import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Award, ShieldCheck, Zap, Rocket, Heart, Briefcase, TrendingUp, Search } from 'lucide-react';
import { cn } from '../lib/utils';

type Category = 'All' | 'Savings' | 'Discipline' | 'Investing';

const MILESTONES = [
  { id: 1, title: "First $1000", category: 'Savings', desc: "Saved your first four digits. A foundation built.", unlocked: true, icon: <Zap className="w-6 h-6" /> },
  { id: 2, title: "No Spend Week", category: 'Discipline', desc: "Seven days of zero non-essential spending.", unlocked: true, icon: <ShieldCheck className="w-6 h-6" /> },
  { id: 3, title: "Emergency Buffer", category: 'Savings', desc: "3 months of expenses secured in vault.", unlocked: true, icon: <Heart className="w-6 h-6" /> },
  { id: 4, title: "Five Digit Club", category: 'Savings', desc: "Unlock by reaching a $10,000 total balance.", unlocked: false, icon: <Rocket className="w-6 h-6" /> },
  { id: 5, title: "Bull Market", category: 'Investing', desc: "Investment portfolio up by 15% this year.", unlocked: true, icon: <TrendingUp className="w-6 h-6" /> },
  { id: 6, title: "Debt Free Hero", category: 'Discipline', desc: "Clear all high-interest liabilities.", unlocked: false, icon: <Briefcase className="w-6 h-6" /> },
  { id: 7, title: "Legacy Giver", category: 'Savings', desc: "Contribute $5,000 to charitable causes.", unlocked: false, icon: <Search className="w-6 h-6" /> },
  { id: 8, title: "Budget Master", category: 'Discipline', desc: "Stayed within budget for 6 consecutive months.", unlocked: true, icon: <Briefcase className="w-6 h-6" /> },
];

export default function Milestones() {
  const [activeFilter, setActiveFilter] = useState<Category>('All');

  const filteredMilestones = activeFilter === 'All' 
    ? MILESTONES 
    : MILESTONES.filter(m => m.category === activeFilter);

  return (
    <div className="space-y-xl">
      {/* Progress Card */}
      <section className="bg-white rounded-xl p-lg shadow-[0_4px_12px_rgba(26,43,60,0.05)] border border-surface-container overflow-hidden relative">
        <div className="relative z-10 flex flex-col md:flex-row gap-lg items-center">
          <div className="flex-1 space-y-md">
            <div>
              <p className="text-label-caps text-secondary font-bold mb-xs">YOUR PROGRESS</p>
              <h2 className="text-display-lg text-primary">12 Milestones Achieved</h2>
            </div>
            <p className="text-body-lg text-on-surface-variant max-w-lg">
              You've unlocked {Math.round((MILESTONES.filter(m => m.unlocked).length / MILESTONES.length) * 100)}% of our financial resilience badges. Keep building your vault to reach Legendary status.
            </p>
            <div className="space-y-xs pt-md">
              <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(MILESTONES.filter(m => m.unlocked).length / MILESTONES.length) * 100}%` }}
                  className="h-full bg-secondary" 
                />
              </div>
              <div className="flex justify-between text-label-caps text-on-surface-variant font-bold">
                <span>{Math.round((MILESTONES.filter(m => m.unlocked).length / MILESTONES.length) * 100)}% Complete</span>
                <span className="text-secondary">{MILESTONES.filter(m => !m.unlocked).length} more to Elite</span>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 opacity-10 md:opacity-100">
            <Award className="w-32 h-32 text-outline-variant" />
          </div>
        </div>
      </section>

      {/* Stats Quick Grid */}
      <section className="bg-primary-container text-white rounded-xl p-lg shadow-lg">
        <div className="flex flex-col md:flex-row gap-lg justify-around text-center">
          <div>
            <p className="text-label-caps text-on-primary-container font-bold mb-xs">CURRENT STREAK</p>
            <p className="text-display-lg-mobile md:text-display-lg font-bold">14 Weeks</p>
          </div>
          <div className="w-px bg-surface-container-high/20 hidden md:block" />
          <div className="max-w-xs text-left md:text-center">
            <p className="text-body-sm text-on-primary-container italic pt-2">
              "Maintaining a No Spend Week streak for 3+ months unlocks the 'Iron Discipline' badge."
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="flex gap-sm overflow-x-auto pb-2 scrollbar-none">
        {(['All', 'Savings', 'Discipline', 'Investing'] as Category[]).map(cat => (
          <BadgeFilter 
            key={cat} 
            label={cat === 'All' ? 'All Badges' : cat} 
            active={activeFilter === cat}
            onClick={() => setActiveFilter(cat)}
          />
        ))}
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-lg min-h-[400px]">
        {filteredMilestones.map((badge, idx) => (
          <motion.div 
            key={badge.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: idx * 0.05 }}
            className={cn(
              "flex flex-col items-center justify-between gap-md p-lg rounded-xl border border-surface-container aspect-[3/4] text-center transition-all",
              badge.unlocked ? "bg-white shadow-sm hover:shadow-md" : "bg-surface-container-low opacity-50 border-dashed"
            )}
          >
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center mb-2",
              badge.unlocked ? "bg-secondary-container text-on-secondary-container" : "bg-surface-container text-outline"
            )}>
              {badge.icon}
            </div>
            <div className="space-y-xs flex-1">
              <h4 className="text-headline-md text-primary text-sm font-bold">{badge.title}</h4>
              <p className="text-body-sm text-on-surface-variant text-[10px] leading-tight">{badge.desc}</p>
            </div>
            {badge.unlocked && (
              <span className="text-label-caps bg-secondary-container/50 px-sm py-xs rounded text-[9px] text-secondary font-bold">UNLOCKED</span>
            )}
          </motion.div>
        ))}
        {filteredMilestones.length === 0 && (
          <div className="col-span-full py-20 text-center text-on-surface-variant">
            No badges found in this category yet.
          </div>
        )}
      </div>
    </div>
  );
}

function BadgeFilter({ label, active, onClick }: { label: string, active?: boolean, onClick: () => void, key?: any }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-6 py-2 rounded-full text-label-caps border transition-all whitespace-nowrap active:scale-95",
        active 
          ? "bg-secondary text-white border-secondary shadow-md" 
          : "bg-surface-container-low border-surface-container text-on-surface-variant hover:bg-surface-container-high"
      )}
    >
      {label}
    </button>
  );
}

