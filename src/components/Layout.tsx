import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Target, ReceiptText, Trophy, Plus, Bell } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useProfile } from '../contexts/ProfileContext';
import { useState } from 'react';
import AddTargetModal from './AddTargetModal';

export default function Layout() {
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Top App Bar */}
      <header className="sticky top-0 z-50 bg-white shadow-[0_4px_12px_rgba(26,43,60,0.05)] border-b border-surface-container">
        <div className="max-w-7xl mx-auto px-container-margin py-md flex items-center justify-between">
          <div className="flex items-center gap-md">
            <motion.div 
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/profile')}
              className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high ring-2 ring-primary/5 cursor-pointer"
            >
              <img 
                src={profile.avatar} 
                alt="Profile" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="flex flex-col">
              <h1 className="text-display-lg-mobile md:text-headline-md text-primary leading-tight">SaveNest</h1>
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">{profile.name}</p>
            </div>
          </div>
          <button className="p-2 rounded-full hover:bg-surface-container transition-colors text-primary relative active:scale-90">
            <Bell className="w-6 h-6" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-container-margin md:pb-32 pb-24">
        <Outlet />
      </main>

      {/* FAB */}
      <div className="fixed bottom-24 right-container-margin z-40 md:bottom-28">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddModalOpen(true)}
          className="w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-container transition-colors"
        >
          <Plus className="w-8 h-8" />
        </motion.button>
      </div>

      <AddTargetModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-surface-container rounded-t-xl shadow-[0_-4px_12px_rgba(26,43,60,0.05)] z-50 backdrop-blur-md bg-opacity-90">
        <div className="max-w-7xl mx-auto flex justify-around items-center px-4 py-3 pb-4">
          <NavItem to="/" icon={<LayoutDashboard />} label="Dashboard" />
          <NavItem to="/targets" icon={<Target />} label="Targets" />
          <NavItem to="/log" icon={<ReceiptText />} label="Log" />
          <NavItem to="/milestones" icon={<Trophy />} label="Milestones" />
        </div>
      </nav>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) {
  return (
    <NavLink 
      to={to}
      className={({ isActive }) => cn(
        "flex flex-col items-center justify-center gap-1 py-1 px-4 rounded-full transition-all duration-200 active:scale-90",
        isActive 
          ? "bg-secondary-container text-on-secondary-container font-semibold" 
          : "text-on-surface-variant hover:bg-surface-container"
      )}
    >
      {icon}
      <span className="text-label-caps text-[10px]">{label}</span>
    </NavLink>
  );
}
