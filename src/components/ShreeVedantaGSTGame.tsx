/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Shield, Info, CheckCircle, AlertCircle, ArrowRight, X, Database, FileText } from 'lucide-react';

interface ShreeVedantaGSTGameProps {
  onSuccess: () => void;
  onClose: () => void;
  initialStep?: number;
  onStepChange?: (step: number) => void;
}

export function ShreeVedantaGSTGame({ onSuccess, onClose, initialStep = 1, onStepChange }: ShreeVedantaGSTGameProps) {
  const [step, setStep] = useState(initialStep);
  const [panInput, setPanInput] = useState('');
  const [selectedDirector, setSelectedDirector] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (onStepChange) onStepChange(step);
  }, [step, onStepChange]);

  const handlePANSearch = () => {
    setIsSearching(true);
    setError(null);
    
    // Simulate network delay
    setTimeout(() => {
      if (panInput.toUpperCase() === 'AADVS8821B') {
        setStep(3);
      } else {
        setError("No records found for this PAN segment. Check the GST structure.");
      }
      setIsSearching(false);
    }, 1500);
  };

  const handleDirectorSubmit = () => {
    if (selectedDirector === 'Satish Nath') {
      onSuccess();
    } else {
      setError("Incorrect. This PAN does not match the person's profile in our database.");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-obsidian/95 backdrop-blur-xl"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="glass squircle max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-orange-500/30 shadow-2xl shadow-orange-500/20 relative"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-orange-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-500">
              <Database size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter text-orange-500">GST Structure Decode</h2>
              <p className="text-[10px] text-muted-grey uppercase tracking-widest font-bold">Phase 3: Beneficial Ownership Trace</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all text-muted-grey">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                  <h3 className="text-orange-400 font-bold mb-3 flex items-center gap-2">
                    <Info size={18} /> GST Primer: Format Guide
                  </h3>
                  <p className="text-sm text-muted-grey leading-relaxed mb-4">
                    Indian GST numbers follow a strict 15-digit format. Decoding the structure reveals the underlying tax identity:
                  </p>
                  <div className="font-mono text-xs space-y-2 bg-black/40 p-4 rounded-xl border border-white/5">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-orange-500/70">[State Code]</span>
                      <span className="text-apple-white">First 2 digits</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-orange-500/70">[PAN]</span>
                      <span className="text-apple-white">Next 10 digits</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-orange-500/70">[Entity/Checksum]</span>
                      <span className="text-apple-white">Last 3 digits</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setStep(2)}
                  className="w-full py-4 bg-orange-600 text-white font-black rounded-xl hover:bg-orange-500 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  Access MCA Portal <ArrowRight size={18} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-muted-grey uppercase tracking-widest mb-2">
                  <Database size={14} /> MCA / GST Portal Lookup
                </div>
                
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-muted-grey">
                    Enter the 10-digit PAN segment extracted from the GSTIN:
                  </label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={panInput}
                      onChange={(e) => setPanInput(e.target.value.toUpperCase())}
                      placeholder="XXXXXXXXXX"
                      maxLength={10}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 font-mono text-xl tracking-widest focus:border-orange-500 outline-none transition-all"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500/50">
                      <Search size={20} />
                    </div>
                  </div>
                  {error && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-crimson text-xs flex items-center gap-1">
                      <AlertCircle size={14} /> {error}
                    </motion.p>
                  )}
                </div>

                <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                  <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold mb-1">System Note</p>
                  <p className="text-xs text-muted-grey">The PAN is the core identifier. Looking up the PAN segment will reveal the registered entity (SV Distributors PVT LTD) and its associated directors.</p>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 bg-white/5 text-white font-black rounded-xl hover:bg-white/10 transition-all uppercase tracking-widest"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handlePANSearch}
                    disabled={panInput.length !== 10 || isSearching}
                    className="flex-[2] py-4 bg-orange-600 text-white font-black rounded-xl hover:bg-orange-500 transition-all uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSearching ? "Searching..." : "Verify PAN"}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-2xl">
                  <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
                    <CheckCircle size={18} /> PAN Verified: Shree Vedanta Distributors
                  </h3>
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-muted-grey">Registered Entity:</span>
                      <span className="text-apple-white">Shree Vedanta Distributors Pvt Ltd</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-muted-grey">Director PAN on file:</span>
                      <span className="text-orange-400 font-bold">AADCN4471C</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold">The director PAN <span className="text-orange-400">AADCN4471C</span> belongs to which person of interest?</h3>
                  <div className="space-y-3">
                    {['Anish Ambedkar', 'Satish Nath', 'Gopal Krishna Rao'].map(name => (
                      <button 
                        key={name}
                        onClick={() => setSelectedDirector(name)}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${selectedDirector === name ? 'bg-orange-500/20 border-orange-500 text-white' : 'bg-white/5 border-white/10 text-muted-grey hover:bg-white/10'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold">{name}</span>
                          {selectedDirector === name && <CheckCircle size={18} className="text-orange-500" />}
                        </div>
                      </button>
                    ))}
                  </div>
                  {error && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-crimson text-xs flex items-center gap-1">
                      <AlertCircle size={14} /> {error}
                    </motion.p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setStep(2)}
                    className="flex-1 py-4 bg-white/5 text-white font-black rounded-xl hover:bg-white/10 transition-all uppercase tracking-widest"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleDirectorSubmit}
                    disabled={!selectedDirector}
                    className="flex-[2] py-4 bg-orange-600 text-white font-black rounded-xl hover:bg-orange-500 transition-all uppercase tracking-widest disabled:opacity-50"
                  >
                    Confirm Identification
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Info */}
        <div className="p-4 bg-black/20 border-t border-white/5 flex items-center gap-2">
          <FileText size={14} className="text-muted-grey" />
          <p className="text-[10px] text-muted-grey uppercase tracking-widest">
            Data persistence active. You can close this terminal and return later.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
