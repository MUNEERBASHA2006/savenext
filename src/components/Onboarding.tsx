import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Landmark, Lock, ArrowRight, CheckCircle2, Building2 } from 'lucide-react';
import { useProfile } from '../contexts/ProfileContext';
import { cn } from '../lib/utils';

const BANKS = [
  { id: 'chase', name: 'Chase Bank', icon: '🏦' },
  { id: 'boa', name: 'Bank of America', icon: '🏢' },
  { id: 'wells', name: 'Wells Fargo', icon: '🏪' },
  { id: 'citibank', name: 'Citibank', icon: '🏛️' },
];

export default function Onboarding() {
  const { updateProfile } = useProfile();
  const [step, setStep] = useState<'welcome' | 'bank-select' | 'connecting' | 'success'>('welcome');
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  const handleConnect = () => {
    if (!selectedBank) return;
    setStep('connecting');
    // Simulate connection lag
    setTimeout(() => {
      setStep('success');
    }, 3000);
  };

  const handleFinish = () => {
    updateProfile({ 
      isOnboarded: true, 
      isBankConnected: true, 
      bankName: BANK_MAP[selectedBank || ''] || 'Bank'
    });
  };

  const BANK_MAP: Record<string, string> = {
    chase: 'Chase Bank',
    boa: 'Bank of America',
    wells: 'Wells Fargo',
    citibank: 'Citibank'
  };

  return (
    <div className="fixed inset-0 z-[200] bg-surface flex items-center justify-center p-md">
      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <motion.div 
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-md w-full text-center space-y-xl"
          >
            <div className="w-20 h-20 bg-primary-container rounded-3xl flex items-center justify-center mx-auto shadow-lg">
              <Landmark className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-md">
              <h1 className="text-display-lg text-primary">Welcome to SaveNest</h1>
              <p className="text-body-lg text-on-surface-variant">
                Your high-security digital vault for wealth building. Let's start by securing your financial data.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-md">
              <div className="flex items-center gap-md p-md bg-surface-container-low rounded-xl border border-surface-container">
                <ShieldCheck className="w-6 h-6 text-secondary" />
                <p className="text-body-sm text-left font-medium">Bank-grade 256-bit AES encryption.</p>
              </div>
              <div className="flex items-center gap-md p-md bg-surface-container-low rounded-xl border border-surface-container">
                <Lock className="w-6 h-6 text-secondary" />
                <p className="text-body-sm text-left font-medium">Read-only access. We never touch your funds.</p>
              </div>
            </div>
            <button 
              onClick={() => setStep('bank-select')}
              className="w-full bg-primary text-white py-lg rounded-2xl text-headline-sm font-bold flex items-center justify-center gap-sm hover:bg-primary-container transition-all shadow-xl shadow-primary/20"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {step === 'bank-select' && (
          <motion.div 
            key="bank-select"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="max-w-md w-full space-y-lg"
          >
            <div className="text-center space-y-sm">
              <h2 className="text-display-md text-primary">Connect Your Bank</h2>
              <p className="text-body-sm text-on-surface-variant italic">Securely linked via Plaid Protocol</p>
            </div>
            
            <div className="grid grid-cols-2 gap-md">
              {BANKS.map((bank) => (
                <button
                  key={bank.id}
                  onClick={() => setSelectedBank(bank.id)}
                  className={cn(
                    "p-md rounded-2xl border-2 transition-all flex flex-col items-center gap-sm aspect-square justify-center",
                    selectedBank === bank.id 
                      ? "border-primary bg-primary-container/20 shadow-md" 
                      : "border-surface-container-high bg-white hover:border-outline-variant"
                  )}
                >
                  <span className="text-4xl">{bank.icon}</span>
                  <span className="text-label-caps font-bold text-primary">{bank.name}</span>
                </button>
              ))}
            </div>

            <button 
              disabled={!selectedBank}
              onClick={handleConnect}
              className={cn(
                "w-full py-lg rounded-2xl text-headline-sm font-bold transition-all shadow-lg",
                selectedBank 
                  ? "bg-primary text-white hover:bg-primary-container shadow-primary/20" 
                  : "bg-surface-container-high text-on-surface-variant cursor-not-allowed"
              )}
            >
              Connect Securely
            </button>
          </motion.div>
        )}

        {step === 'connecting' && (
          <motion.div 
            key="connecting"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full text-center space-y-xl py-20"
          >
            <div className="relative w-24 h-24 mx-auto">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div className="space-y-sm">
              <h3 className="text-headline-lg text-primary">Establishing Secure Link</h3>
              <p className="text-body-md text-on-surface-variant">Encrypting your credentials...</p>
            </div>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full text-center space-y-xl"
          >
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto shadow-xl shadow-secondary/30">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <div className="space-y-sm">
              <h2 className="text-display-md text-primary">Connection Verified</h2>
              <p className="text-body-lg text-on-surface-variant font-medium">
                Your account at {BANK_MAP[selectedBank || '']} is now safely linked to your vault.
              </p>
            </div>
            <button 
              onClick={handleFinish}
              className="w-full bg-secondary text-white py-lg rounded-2xl text-headline-sm font-bold shadow-xl shadow-secondary/20 hover:bg-secondary/90 transition-all"
            >
              Enter My Vault
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
