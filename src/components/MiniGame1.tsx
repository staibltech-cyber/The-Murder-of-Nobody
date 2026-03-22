import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Check, X, ArrowRight, AlertCircle, Terminal } from 'lucide-react';

interface MiniGame1Props {
  onSuccess: () => void;
  onClose: () => void;
}

export const MiniGame1: React.FC<MiniGame1Props> = ({ onSuccess, onClose }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [status, setStatus] = useState<'playing' | 'success'>('playing');

  const TARGET_CODE = "88219";

  const handleVerify = () => {
    if (code === TARGET_CODE) {
      setStatus('success');
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-obsidian/95 backdrop-blur-xl"
    >
      <div className="max-w-md w-full">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-500">
              <Terminal size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter">Terminal Decryption</h2>
              <p className="text-[10px] text-muted-grey uppercase tracking-widest">Enter the winning ticket number</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {status === 'playing' ? (
              <motion.div 
                key="playing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <p className="text-sm text-muted-grey text-center">
                    The encrypted file requires the 5-digit winning ticket number from the Karnataka State Lottery draw on Jan 11.
                  </p>
                  <div className="flex flex-col gap-2">
                    <input 
                      type="text" 
                      maxLength={5}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="00000"
                      className={`bg-obsidian border ${error ? 'border-crimson' : 'border-white/10'} rounded-2xl px-4 py-6 text-center tracking-[0.5em] font-mono text-3xl focus:outline-none focus:border-amber-500 transition-all`}
                    />
                    {error && (
                      <div className="flex items-center gap-2 text-crimson text-[10px] font-bold uppercase tracking-widest justify-center animate-pulse">
                        <AlertCircle size={14} /> Invalid Decryption Key
                      </div>
                    )}
                  </div>
                </div>

                <button
                  disabled={code.length !== 5}
                  onClick={handleVerify}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    code.length === 5 
                      ? 'bg-amber-500 text-black hover:bg-amber-400 shadow-xl shadow-amber-500/20' 
                      : 'bg-white/5 text-muted-grey cursor-not-allowed'
                  }`}
                >
                  DECRYPT FILE <ArrowRight size={20} />
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-8 space-y-4"
              >
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500">
                  <Check size={40} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-emerald-500">Access Granted</h3>
                <p className="text-muted-grey text-center">Decryption successful. Loading evidence...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
