import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Utensils, Car, FileText, Delete, Save, ShoppingCart, Coffee, GraduationCap, DollarSign } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTransactions, Transaction } from '../contexts/TransactionsContext';

const getIcon = (type: string) => {
  switch (type) {
    case 'ShoppingCart': return <ShoppingCart className="w-6 h-6" />;
    case 'Car': return <Car className="w-6 h-6" />;
    case 'Coffee': return <Coffee className="w-6 h-6" />;
    case 'GraduationCap': return <GraduationCap className="w-6 h-6" />;
    case 'Utensils': return <Utensils className="w-6 h-6" />;
    case 'FileText': return <FileText className="w-6 h-6" />;
    default: return <DollarSign className="w-6 h-6" />;
  }
};

export default function Log() {
  const { transactions, addTransaction } = useTransactions();
  const [amount, setAmount] = useState("24.50");
  const [category, setCategory] = useState("Food");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleNumpad = (val: string) => {
    setError(null);
    if (val === "delete") {
      setAmount(prev => prev.length > 1 ? prev.slice(0, -1) : "0");
    } else {
      setAmount(prev => prev === "0" ? val : prev + val);
    }
  };

  const handleConfirm = () => {
    if (!notes.trim()) {
      setError("Please add a short description (Notes).");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    let iconType: Transaction['iconType'] = 'DollarSign' as any;
    if (category === "Food") iconType = "Utensils";
    if (category === "Transport") iconType = "Car";
    if (category === "Bills") iconType = "FileText";

    addTransaction({
      title: notes,
      amount: -numAmount,
      type: category,
      notes: notes,
      iconType: iconType
    });

    // Reset
    setNotes("");
    setAmount("0");
    setError(null);
  };

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-gutter space-y-xl lg:space-y-0">
      {/* Transaction Input Section */}
      <div className="lg:col-span-7 space-y-lg">
        <section className="bg-white rounded-xl p-lg shadow-[0_4px_12px_rgba(26,43,60,0.05)] border border-surface-container">
          <div className="mb-lg">
            <h2 className="text-headline-md text-primary mb-xs">Log Transaction</h2>
            <p className="text-body-sm text-on-surface-variant">Enter the details of your latest expenditure.</p>
          </div>

          {/* Amount Display */}
          <div className={cn(
            "mb-lg bg-surface-container-low rounded-lg p-lg text-center border-2 transition-all",
            error && !amount ? "border-error" : "border-transparent focus-within:border-primary-container"
          )}>
            <span className="text-label-caps text-on-surface-variant block mb-base uppercase">Amount (USD)</span>
            <div className="text-[48px] font-bold text-primary flex items-center justify-center gap-xs">
              <span className="text-on-surface-variant text-4xl">$</span>
              <span>{amount}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            <div className="space-y-lg">
              <div>
                <span className="text-label-caps text-on-surface-variant block mb-md uppercase">Category</span>
                <div className="grid grid-cols-3 gap-sm">
                  <CategoryButton active={category === "Food"} onClick={() => setCategory("Food")} icon={<Utensils />} label="Food" />
                  <CategoryButton active={category === "Transport"} onClick={() => setCategory("Transport")} icon={<Car />} label="Transport" />
                  <CategoryButton active={category === "Bills"} onClick={() => setCategory("Bills")} icon={<FileText />} label="Bills" />
                </div>
              </div>
              <div>
                <span className="text-label-caps text-on-surface-variant block mb-md uppercase">Notes</span>
                <textarea 
                  value={notes}
                  onChange={(e) => {
                    setNotes(e.target.value);
                    setError(null);
                  }}
                  className={cn(
                    "w-full bg-surface-container-low border rounded-xl p-md text-body-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none outline-none",
                    error && !notes.trim() ? "border-error" : "border-outline-variant/30"
                  )}
                  placeholder="Add a short description..." 
                  rows={3} 
                />
              </div>
            </div>

            {/* Numpad */}
            <div className="grid grid-cols-3 gap-3 bg-surface-container/30 rounded-xl p-md border border-surface-container">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"].map(num => (
                <button 
                  key={num}
                  onClick={() => handleNumpad(num)}
                  className="h-14 bg-white rounded-lg font-headline-md text-primary active:bg-surface-container transition-colors shadow-sm hover:bg-surface-container-low"
                >
                  {num}
                </button>
              ))}
              <button 
                onClick={() => handleNumpad("delete")}
                className="h-14 bg-error-container/20 text-error rounded-lg flex items-center justify-center active:scale-90 transition-all hover:bg-error-container/30"
              >
                <Delete className="w-6 h-6" />
              </button>
            </div>
          </div>

          {error && <p className="mt-md text-error text-sm font-medium">{error}</p>}

          <button 
            onClick={handleConfirm}
            className="w-full mt-lg bg-primary text-white py-md rounded-xl text-headline-md flex items-center justify-center gap-sm active:scale-[0.98] transition-transform hover:bg-primary-container shadow-lg"
          >
            <Save className="w-6 h-6" />
            Confirm Transaction
          </button>
        </section>
      </div>

      {/* History Section */}
      <div className="lg:col-span-5 space-y-lg">
        <section className="bg-white rounded-xl p-lg shadow-[0_4px_12px_rgba(26,43,60,0.05)] border border-surface-container h-full">
          <div className="flex items-center justify-between mb-lg">
            <h2 className="text-headline-md text-primary">Recent Activity</h2>
            <span className="text-label-caps text-primary cursor-pointer hover:underline font-bold">View All</span>
          </div>
          <div className="space-y-md">
            <AnimatePresence>
              {transactions.slice(0, 5).map((activity, index) => (
                <motion.div 
                  key={activity.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-md bg-surface-container-low/30 border border-surface-container rounded-xl hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-md">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center shadow-sm",
                      activity.amount > 0 ? "bg-secondary text-white" : "bg-white text-primary border border-surface-container"
                    )}>
                      {getIcon(activity.iconType)}
                    </div>
                    <div>
                      <p className="text-data-mono text-primary font-bold">{activity.title}</p>
                      <p className="text-body-sm text-on-surface-variant font-medium">{activity.time}</p>
                    </div>
                  </div>
                  <p className={cn(
                    "text-headline-md font-bold",
                    activity.amount > 0 ? "text-secondary" : "text-error"
                  )}>
                    {activity.amount > 0 ? "+" : "-"}${Math.abs(activity.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
}

function CategoryButton({ active, icon, label, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-md rounded-xl border-2 transition-all active:scale-95",
        active 
          ? "bg-secondary-container text-on-secondary-container border-secondary shadow-md" 
          : "bg-surface-container-low text-on-surface-variant border-transparent hover:border-outline-variant shadow-sm"
      )}
    >
      <span className="mb-xs text-xl">{icon}</span>
      <span className="text-label-caps text-[10px] leading-tight">{label}</span>
    </button>
  );
}
