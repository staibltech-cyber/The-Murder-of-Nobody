/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { FileText, Camera, Database, Eye, MessageSquare, Shield } from "lucide-react";
import { Evidence } from "../types";

interface EvidenceLockerProps {
  evidence: Evidence[];
  onSelect: (e: Evidence) => void;
  onUnlock: (id: string) => void;
  phase: number;
}

export function EvidenceLocker({ evidence, onSelect, onUnlock, phase }: EvidenceLockerProps) {
  const phase1Evidence = [...evidence]
    .filter(e => (!e.parentClueId || evidence.find(p => p.id === e.parentClueId)?.unlocked) && (!e.phase || e.phase === 1));
  
  const phase2Evidence = [...evidence]
    .filter(e => (!e.parentClueId || evidence.find(p => p.id === e.parentClueId)?.unlocked) && e.phase === 2);
  
  const renderEvidenceCard = (item: Evidence, i: number) => (
    <motion.div 
      key={item.id}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: i * 0.05 }}
      onClick={() => {
        if (!item.unlocked) {
          onUnlock(item.id);
        }
        onSelect(item);
      }}
      className={`glass p-6 squircle cursor-pointer hover:bg-white/10 transition-all group relative overflow-hidden ${!item.unlocked ? 'border-white/5 opacity-60' : item.phase === 2 ? 'border-orange-500/50 bg-orange-500/5' : 'border-crimson/20'}`}
    >
      {!item.unlocked && (
        <div className="absolute top-2 right-2 text-crimson">
          <Shield size={14} />
        </div>
      )}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all ${!item.unlocked ? 'bg-white/5 text-muted-grey' : item.phase === 2 ? 'bg-orange-500/20 text-orange-500 group-hover:bg-orange-500 group-hover:text-white' : 'bg-crimson/10 text-crimson group-hover:bg-crimson group-hover:text-white'}`}>
        {item.type === "document" && <FileText size={20} />}
        {item.type === "photo" && <Camera size={20} />}
        {item.type === "object" && <Database size={20} />}
        {item.type === "digital" && <Eye size={20} />}
        {item.type === "statement" && <MessageSquare size={20} />}
      </div>
      <h4 className={`font-extrabold text-sm mb-1 ${!item.unlocked ? 'text-muted-grey' : 'text-apple-white'}`}>{item.title}</h4>
      <span className="text-[10px] text-muted-grey uppercase font-bold tracking-widest">{item.location}</span>
      {!item.unlocked && (
        <div className="mt-2 text-[8px] font-bold text-crimson uppercase tracking-tighter">Click to Unlock</div>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-crimson mb-4 flex items-center gap-2">
          <div className="w-1 h-4 bg-crimson rounded-full" />
          Phase 1: The Victim & The Husband
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {phase1Evidence.map((item, i) => renderEvidenceCard(item, i))}
        </div>
      </div>

      {phase >= 2 && phase2Evidence.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500 mb-4 flex items-center gap-2">
            <div className="w-1 h-4 bg-orange-500 rounded-full" />
            Phase 2: The Corporate Conspiracy
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {phase2Evidence.map((item, i) => renderEvidenceCard(item, i))}
          </div>
        </div>
      )}
    </div>
  );
}
