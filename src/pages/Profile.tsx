import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Camera, Save, User as UserIcon, ArrowLeft, Landmark, RefreshCw, LogOut, Shield, Lock, Globe } from 'lucide-react';
import { useProfile } from '../contexts/ProfileContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function Profile() {
  const { profile, updateProfile } = useProfile();
  const navigate = useNavigate();
  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState(profile.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateProfile({ name, avatar });
    // In a real app we'd show success, here we just go back or stay
    alert("Profile Updated");
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset your vault? This will clear all local data.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-xl pb-20">
      <div className="flex items-center gap-md">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-surface-container transition-colors font-bold"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-display-lg-mobile text-primary">Vault Settings</h2>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-xl shadow-sm border border-surface-container flex flex-col md:flex-row items-center gap-xl"
      >
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface-container shadow-inner">
             <img 
              src={avatar} 
              alt="Profile" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg group-hover:scale-110 transition-transform"
          >
            <Camera className="w-5 h-5" />
          </button>
          <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
        </div>
        <div className="flex-1 text-center md:text-left space-y-sm">
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-display-md text-primary bg-transparent border-b-2 border-transparent focus:border-secondary transition-all outline-none"
          />
          <p className="text-body-lg text-on-surface-variant max-w-md">
            Wealth Builder since May 2026. Securely linked via <span className="text-primary font-bold">{profile.bankName}</span>.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-md pt-md">
            <span className="px-md py-sm bg-secondary-container/30 text-secondary text-label-caps rounded-full border border-secondary/20 flex items-center gap-sm font-bold">
              <Shield className="w-4 h-4" /> Vault Verified
            </span>
            <span className="px-md py-sm bg-surface-container text-on-surface-variant text-label-caps rounded-full flex items-center gap-sm font-bold">
              <Landmark className="w-4 h-4" /> {profile.bankName}
            </span>
          </div>
          <button 
            onClick={handleSave}
            className="mt-md text-secondary font-bold text-sm bg-secondary/10 px-md py-sm rounded-lg hover:bg-secondary/20 transition-all flex items-center gap-xs"
          >
            <Save className="w-4 h-4" /> Update Profile
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        {/* Account Security */}
        <section className="bg-white rounded-2xl p-lg border border-surface-container space-y-lg">
          <div className="flex items-center gap-sm border-b border-surface-container pb-md">
            <Shield className="w-6 h-6 text-primary" />
            <h3 className="text-headline-sm text-primary">Vault Security</h3>
          </div>
          <div className="space-y-md">
            <ProfileOption icon={<Lock className="w-5 h-5" />} label="Biometric Authentication" value="Enabled" />
            <ProfileOption icon={<Shield className="w-5 h-5" />} label="Bank Link Status" value="Secure" active />
            <ProfileOption icon={<Globe className="w-5 h-5" />} label="Data Residency" value="US East (Vault)" />
          </div>
        </section>

        {/* Account Management */}
        <section className="bg-white rounded-2xl p-lg border border-surface-container space-y-lg">
          <div className="flex items-center gap-sm border-b border-surface-container pb-md">
            <RefreshCw className="w-6 h-6 text-primary" />
            <h3 className="text-headline-sm text-primary">System Control</h3>
          </div>
          <div className="space-y-md">
            <button 
              onClick={handleReset}
              className="w-full flex items-center justify-between p-md hover:bg-error/5 rounded-xl transition-colors group border border-transparent hover:border-error/20"
            >
              <div className="flex items-center gap-md">
                 <div className="p-sm bg-error/10 text-error rounded-lg">
                   <RefreshCw className="w-5 h-5" />
                 </div>
                 <div className="text-left">
                   <p className="text-label-lg font-bold text-error">Reset Vault Data</p>
                   <p className="text-body-xs text-on-surface-variant">Clear all local financial records</p>
                 </div>
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-md hover:bg-surface-container-low rounded-xl transition-colors group">
              <div className="flex items-center gap-md">
                 <div className="p-sm bg-surface-container text-on-surface-variant rounded-lg">
                   <LogOut className="w-5 h-5" />
                 </div>
                 <div className="text-left">
                   <p className="text-label-lg font-bold text-primary">Disconnect {profile.bankName}</p>
                   <p className="text-body-xs text-on-surface-variant">Sever secure banking API link</p>
                 </div>
              </div>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function ProfileOption({ icon, label, value, active }: any) {
  return (
    <div className="flex items-center justify-between p-md bg-surface-container-low rounded-xl">
      <div className="flex items-center gap-md">
        <div className={cn(
          "p-sm rounded-lg",
          active ? "bg-secondary-container text-secondary" : "bg-white text-on-surface-variant border border-surface-container"
        )}>
          {icon}
        </div>
        <p className="text-label-lg font-medium text-primary">{label}</p>
      </div>
      <span className={cn(
        "text-data-mono text-sm font-bold",
        active ? "text-secondary" : "text-on-surface-variant"
      )}>{value}</span>
    </div>
  );
}
