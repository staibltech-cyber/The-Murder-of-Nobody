/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Clock } from "lucide-react";
import { Evidence } from "../types";

interface TerminalHubProps {
  inventory: string[];
  evidence: Evidence[];
  viewedClues: string[];
  phase: number;
  hasFailedPhase1Quiz: boolean;
  onRetryPhase1Quiz: () => void;
  onStartMiniGame1: () => void;
  gowdaSolved: boolean;
  phase3Unlocked: boolean;
  onStartPhase3Game: () => void;
}

export function TerminalHub({ 
  inventory, 
  evidence, 
  viewedClues, 
  phase, 
  hasFailedPhase1Quiz, 
  onRetryPhase1Quiz, 
  onStartMiniGame1, 
  gowdaSolved,
  phase3Unlocked,
  onStartPhase3Game
}: TerminalHubProps) {
  const stats = [
    { label: "Evidence Collected", value: inventory.length },
  ];

  const showLotteryDate = evidence.find(e => e.id === "e_lottery")?.unlocked || inventory.includes("e_lottery") || viewedClues.includes("e_lottery");
  const showResignationDate = inventory.includes("e_resignation") || viewedClues.includes("e_resignation");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, i) => (
        <motion.div 
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass p-6 squircle"
        >
          <span className="text-muted-grey text-xs font-bold uppercase tracking-widest block mb-2">{stat.label}</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-apple-white">{stat.value}</span>
          </div>
        </motion.div>
      ))}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="lg:col-span-2 glass p-8 squircle relative overflow-hidden group"
      >
        <div className="relative z-10">
          <h3 className="text-3xl font-extrabold mb-4">The Story So Far</h3>
          <p className="text-muted-grey text-lg font-light max-w-2xl">
            {phase === 1 ? (
              "Aruna Bhanjara, a woman living a double life in Bangalore, has been found dead at Hebbal Lake. She recently won a massive lottery, but the money is missing. Her husband Jatin, a silent painter, is the primary suspect. The investigation has just begun."
            ) : (
              "The post-mortem confirms a calculated, professional attack. Jatin Bhanjara has no history of violence and was denied money for paint the same day — a motive, but not a method. The lottery win happened after Aruna quit her job, not before. Something — or someone — paid her first. Two new persons of interest have been flagged: Anish Ambedkar, Chairman of Amber Group, and Satish Nath, his chartered accountant. The money trail begins here."
            )}
          </p>
          {phase === 1 && hasFailedPhase1Quiz && (
            <button 
              onClick={onRetryPhase1Quiz}
              className="mt-6 px-6 py-3 bg-crimson/20 text-crimson font-bold rounded-xl border border-crimson/30 hover:bg-crimson hover:text-white transition-all uppercase tracking-widest text-sm shadow-lg shadow-crimson/10"
            >
              Retry Phase 1 Quiz
            </button>
          )}
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-crimson/5 blur-[80px] rounded-full -mr-20 -mt-20 group-hover:bg-crimson/10 transition-all duration-700" />
      </motion.div>

      {phase >= 2 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-3 glass p-6 squircle border-orange-500/30 bg-orange-500/5 flex items-center justify-between"
        >
          <div>
            <h4 className="text-xl font-extrabold text-orange-500 mb-1">New Lead: Lottery Audit</h4>
            <p className="text-sm text-muted-grey">Investigate the ticket purchasing patterns to find the money trail.</p>
          </div>
          <button 
            onClick={onStartMiniGame1}
            disabled={inventory.includes("e_lottery_audit")}
            className={`px-6 py-3 font-bold rounded-xl transition-all uppercase tracking-widest text-sm shadow-lg ${inventory.includes("e_lottery_audit") ? "bg-emerald-600 text-white cursor-default shadow-emerald-500/20" : "bg-orange-600 text-white hover:bg-orange-500 shadow-orange-500/20"}`}
          >
            {inventory.includes("e_lottery_audit") ? "Audit Completed" : "Progress and find the money trail here"}
          </button>
        </motion.div>
      )}

      {phase3Unlocked && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-3 glass p-6 squircle border-orange-500/30 bg-orange-500/5 flex items-center justify-between"
        >
          <div>
            <h4 className="text-xl font-extrabold text-orange-500 mb-1">Final Lead: Shree Vedanta Trace</h4>
            <p className="text-sm text-muted-grey">Trace the beneficial owner of the shell company through GST PAN decoding.</p>
          </div>
          <button 
            onClick={onStartPhase3Game}
            disabled={inventory.includes("e_satish_owner")}
            className={`px-6 py-3 font-bold rounded-xl transition-all uppercase tracking-widest text-sm shadow-lg ${inventory.includes("e_satish_owner") ? "bg-emerald-600 text-white cursor-default shadow-emerald-500/20" : "bg-orange-600 text-white hover:bg-orange-500 shadow-orange-500/20"}`}
          >
            {inventory.includes("e_satish_owner") ? "Ownership Confirmed" : "Access MCA Terminal"}
          </button>
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="lg:col-span-1 glass p-8 squircle border-crimson/20"
      >
        <h3 className="text-xl font-extrabold mb-4 flex items-center gap-2">
          <Clock size={20} className="text-crimson" /> Important Dates
        </h3>
        <div className="space-y-4">
          {phase >= 2 && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={`flex justify-between items-center border-b pb-2 ${gowdaSolved ? "border-orange-500/50" : "border-orange-500/30 border-dashed opacity-60"}`}>
              <span className={`text-xs font-bold uppercase ${gowdaSolved ? "text-orange-400" : "text-orange-400/70"}`}>Jan 03</span>
              <span className={`text-sm font-bold text-right ${gowdaSolved ? "text-orange-100" : "text-orange-200/70"}`}>Anish contacts Aruna<br/>{!gowdaSolved && <span className="text-[8px] uppercase tracking-widest text-orange-500/50">Unconfirmed</span>}</span>
            </motion.div>
          )}
          {phase >= 2 && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={`flex justify-between items-center border-b pb-2 ${gowdaSolved ? "border-orange-500/50" : "border-orange-500/30 border-dashed opacity-60"}`}>
              <span className={`text-xs font-bold uppercase ${gowdaSolved ? "text-orange-400" : "text-orange-400/70"}`}>Jan 05</span>
              <span className={`text-sm font-bold text-right ${gowdaSolved ? "text-orange-100" : "text-orange-200/70"}`}>Aruna drives 'S. Nath'<br/>{!gowdaSolved && <span className="text-[8px] uppercase tracking-widest text-orange-500/50">Unconfirmed</span>}</span>
            </motion.div>
          )}
          {showResignationDate && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-xs font-bold text-muted-grey uppercase">Jan 06</span>
              <span className="text-sm font-bold">Resignation Filed</span>
            </motion.div>
          )}
          {phase >= 2 && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={`flex justify-between items-center border-b pb-2 ${gowdaSolved ? "border-orange-500/50" : "border-orange-500/30 border-dashed opacity-60"}`}>
              <span className={`text-xs font-bold uppercase ${gowdaSolved ? "text-orange-400" : "text-orange-400/70"}`}>Jan 06-08</span>
              <span className={`text-sm font-bold text-right ${gowdaSolved ? "text-orange-100" : "text-orange-200/70"}`}>Shell companies buy shares<br/>{!gowdaSolved && <span className="text-[8px] uppercase tracking-widest text-orange-500/50">Unconfirmed</span>}</span>
            </motion.div>
          )}
          {showLotteryDate && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-xs font-bold text-muted-grey uppercase">Jan 11</span>
              <span className="text-sm font-bold">Lottery Announced</span>
            </motion.div>
          )}
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-xs font-bold text-muted-grey uppercase">Feb 01</span>
            <span className="text-sm font-bold text-crimson">Body Found</span>
          </div>
          {phase >= 2 && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={`flex justify-between items-center border-b pb-2 ${gowdaSolved ? "border-orange-500/50" : "border-orange-500/30 border-dashed opacity-60"}`}>
              <span className={`text-xs font-bold uppercase ${gowdaSolved ? "text-orange-400" : "text-orange-400/70"}`}>Feb 12</span>
              <span className={`text-sm font-bold text-right ${gowdaSolved ? "text-orange-100" : "text-orange-200/70"}`}>Amber Group Acquisition<br/>{!gowdaSolved && <span className="text-[8px] uppercase tracking-widest text-orange-500/50">Unconfirmed</span>}</span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
