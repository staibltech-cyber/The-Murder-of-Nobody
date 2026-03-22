import React from 'react';
import { motion } from 'motion/react';
import { LogOut, X, ArrowRight } from 'lucide-react';

interface ExitConfirmationProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const ExitConfirmation: React.FC<ExitConfirmationProps> = ({ onConfirm, onCancel }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-obsidian/95 backdrop-blur-xl"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="max-w-md w-full bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-12 opacity-5">
          <LogOut size={160} />
        </div>
        
        <div className="relative z-10">
          <div className="w-16 h-16 bg-crimson/20 rounded-2xl flex items-center justify-center mb-6 text-crimson">
            <LogOut size={32} />
          </div>
          
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 leading-none">Terminate Session?</h2>
          <p className="text-muted-grey text-lg font-medium mb-8 leading-relaxed">
            All unsaved progress in the current investigation phase will be lost. Are you sure you want to exit the terminal?
          </p>
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={onConfirm}
              className="w-full py-5 bg-crimson text-white font-black rounded-2xl hover:bg-crimson/90 transition-all shadow-xl shadow-crimson/20 flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
            >
              TERMINATE INVESTIGATION <ArrowRight size={20} />
            </button>
            <button 
              onClick={onCancel}
              className="w-full py-5 bg-white/5 text-muted-grey font-black rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
            >
              RESUME <X size={20} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
