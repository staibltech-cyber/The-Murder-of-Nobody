import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, FileText, Download } from 'lucide-react';

const TICKET_DATA = [
  { id: "88219", correct: true },
  { id: "88214", correct: true },
  { id: "88217", correct: true },
  { id: "88191", correct: false },
  { id: "88193", correct: false },
  { id: "882l8", correct: false },
  { id: "77312", correct: false },
  { id: "77318", correct: false },
  { id: "66421", correct: false },
  { id: "66429", correct: false },
  { id: "99031", correct: false },
  { id: "99037", correct: false },
  { id: "44182", correct: false },
  { id: "44189", correct: false },
  { id: "55601", correct: false },
  { id: "55608", correct: false },
  { id: "33714", correct: false },
  { id: "33719", correct: false },
  { id: "21843", correct: false },
  { id: "10956", correct: false },
];

function generateTickets() {
  let shuffled = [];
  let valid = false;
  while (!valid) {
    shuffled = [...TICKET_DATA].sort(() => Math.random() - 0.5);
    valid = true;
    for (let i = 0; i < shuffled.length - 1; i++) {
      if (shuffled[i].correct && shuffled[i+1].correct) {
        valid = false;
        break;
      }
    }
  }
  return shuffled.map(t => ({
    ...t,
    date: `Jan 0${Math.floor(Math.random() * 4) + 6}`,
    retailer: `R-${Math.floor(Math.random() * 800) + 100}`
  }));
}

export function LotteryAuditMiniGame({ onSuccess, onClose }: { onSuccess: () => void; onClose: () => void }) {
  const [tickets, setTickets] = useState(generateTickets());
  const [selected, setSelected] = useState<string[]>([]);
  const [status, setStatus] = useState<'playing' | 'error' | 'success'>('playing');

  const toggleSelect = (id: string) => {
    if (status !== 'playing') return;
    if (selected.includes(id)) {
      setSelected(selected.filter(s => s !== id));
    } else if (selected.length < 3) {
      setSelected([...selected, id]);
    }
  };

  const handleSubmit = () => {
    const isCorrect = selected.length === 3 && selected.every(id => TICKET_DATA.find(t => t.id === id)?.correct);
    if (isCorrect) {
      setStatus('success');
    } else {
      setStatus('error');
      setTimeout(() => setStatus('playing'), 3000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-4 bg-obsidian/95 backdrop-blur-xl overflow-y-auto"
    >
      <div className="max-w-4xl w-full my-auto">
        <div className="flex justify-between items-start mb-4 md:mb-6 gap-4">
          <div>
            <h2 className="text-xl md:text-3xl font-black uppercase tracking-tighter text-orange-500 leading-tight">Lottery Batch Audit</h2>
            <p className="text-muted-grey mt-1 md:mt-2 text-[10px] md:text-base leading-relaxed">Flag all tickets in the same transaction as #88219. Same batch = same first 4 digits.</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors shrink-0">
            <X size={20} md:size={24} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {status !== 'success' ? (
            <motion.div 
              key="table"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl overflow-hidden flex flex-col max-h-[50vh] md:max-h-[60vh]"
            >
              <div className="overflow-y-auto custom-scrollbar p-2 md:p-4">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-muted-grey text-[8px] md:text-xs uppercase tracking-widest">
                      <th className="p-2 md:p-3">Ticket</th>
                      <th className="p-2 md:p-3">Date</th>
                      <th className="p-2 md:p-3">Retailer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((t, i) => (
                      <tr 
                        key={i} 
                        onClick={() => toggleSelect(t.id)}
                        className={`cursor-pointer transition-colors border-b border-white/5 last:border-0 ${selected.includes(t.id) ? 'bg-orange-500/20' : 'hover:bg-white/5'}`}
                      >
                        <td className="p-2 md:p-3 font-mono text-apple-white text-xs md:text-base">#{t.id}</td>
                        <td className="p-2 md:p-3 text-muted-grey text-[10px] md:text-base">{t.date}</td>
                        <td className="p-2 md:p-3 text-muted-grey font-mono text-[10px] md:text-sm">{t.retailer}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-3 md:p-4 bg-obsidian border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-4 text-center sm:text-left">
                  <span className="text-[10px] md:text-sm font-bold text-muted-grey uppercase tracking-widest">{selected.length} of 3 selected</span>
                  {status === 'error' && (
                    <span className="text-crimson text-[9px] md:text-sm font-bold animate-pulse">Incorrect batch. Check leading digits.</span>
                  )}
                </div>
                <button 
                  onClick={handleSubmit}
                  disabled={selected.length !== 3 || status !== 'playing'}
                  className="w-full sm:w-auto px-5 md:px-6 py-2.5 md:py-3 bg-orange-600 text-white font-bold rounded-lg md:rounded-xl hover:bg-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-[10px] md:text-sm flex items-center justify-center gap-2"
                >
                  <Check size={16} md:size={18} /> Submit Batch
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-50 text-slate-900 p-5 md:p-8 rounded-xl md:rounded-2xl shadow-2xl font-serif relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 md:h-2 bg-orange-600"></div>
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 border-b border-slate-300 pb-4 md:pb-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-200 rounded-full flex items-center justify-center border-2 border-slate-300 shrink-0">
                  <FileText size={24} md:size={32} className="text-slate-500" />
                </div>
                <div>
                  <h3 className="text-lg md:text-2xl font-black uppercase tracking-widest text-slate-900 leading-tight">Lottery Audit Extract</h3>
                  <p className="text-[10px] md:text-sm font-bold tracking-widest mt-0.5 md:mt-1 text-slate-500 uppercase">Karnataka State Lottery Board</p>
                </div>
              </div>
              
              <div className="space-y-4 md:space-y-6 text-xs md:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <span className="text-[8px] md:text-[10px] font-bold uppercase text-slate-500 block mb-0.5 md:mb-1">Ticket Batch</span>
                    <span className="font-mono font-bold text-sm md:text-lg">#88214, #88217, #88219</span>
                  </div>
                  <div>
                    <span className="text-[8px] md:text-[10px] font-bold uppercase text-slate-500 block mb-0.5 md:mb-1">Purchasing Entity</span>
                    <span className="font-bold text-sm md:text-lg">Shree Vedanta Distributors</span>
                  </div>
                </div>
                
                <div className="bg-red-50 border border-red-200 p-3 md:p-4 rounded text-red-800 font-bold text-[10px] md:text-sm">
                  FLAGGED: Bulk purchase by non-retail entity. Under review.
                </div>
                
                <div className="pt-4 md:pt-8 border-t border-slate-300 text-[8px] md:text-[10px] text-slate-400 font-mono flex flex-col sm:flex-row justify-between gap-1">
                  <span>DOC-REF: LTR-AUD-01-26</span>
                  <span>GST: 29AADVS8821B1Z3</span>
                </div>
              </div>
              
              <div className="mt-6 md:mt-8 flex justify-end">
                <button 
                  onClick={onSuccess}
                  className="w-full sm:w-auto px-5 md:px-6 py-2.5 md:py-3 bg-orange-600 text-white font-bold rounded-lg md:rounded-xl hover:bg-orange-500 transition-all uppercase tracking-widest text-[10px] md:text-sm shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                >
                  <Download size={16} md:size={18} /> Add to Evidence
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Gag ticket display */}
        <div className="mt-4 md:mt-8 opacity-50 pointer-events-none flex justify-center">
          <div className="bg-yellow-100/10 border border-yellow-500/30 p-2.5 md:p-4 rounded-lg flex items-center gap-3 md:gap-4">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-yellow-500/20 rounded flex items-center justify-center">
              <span className="text-yellow-500 font-black text-sm md:text-xl">₹</span>
            </div>
            <div>
              <div className="text-[8px] md:text-xs text-yellow-500/70 uppercase tracking-widest font-bold">Reference Ticket</div>
              <div className="font-mono text-yellow-500 text-sm md:text-lg">#88219</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
