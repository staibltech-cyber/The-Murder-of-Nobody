/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { ArrowLeft, LogOut } from "lucide-react";

interface HeaderProps {
  onExit: () => void;
  onBack?: () => void;
}

export function Header({ onExit, onBack }: HeaderProps) {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex flex-row items-center justify-between gap-4 px-1"
    >
      <div className="flex items-center gap-4">
        {onBack && (
          <button 
            onClick={onBack} 
            className="p-2 -ml-2 text-muted-grey hover:text-apple-white transition-colors bg-white/5 rounded-full"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Case #0822</h2>
          <p className="text-muted-grey font-light text-[10px] md:text-sm uppercase tracking-widest">Bangalore Police Dept • Terminal 4</p>
        </div>
      </div>
      <button onClick={onExit} className="md:hidden text-muted-grey hover:text-crimson transition-colors p-2">
        <LogOut size={20} />
      </button>
    </motion.header>
  );
}
