/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from "react";
import { motion } from "motion/react";
import { LayoutGrid, Fingerprint, MessageSquare, Settings, LogOut, Shield } from "lucide-react";
import { Screen } from "../types";

interface SidebarProps {
  current: Screen;
  setScreen: (s: Screen) => void;
  onExit: () => void;
}

export function Sidebar({ current, setScreen, onExit }: SidebarProps) {
  const items: { id: Screen; icon: ReactNode; label: string }[] = [
    { id: "terminal", icon: <LayoutGrid size={22} />, label: "Hub" },
    { id: "evidence", icon: <Fingerprint size={22} />, label: "Evidence" },
    { id: "interrogation", icon: <MessageSquare size={22} />, label: "Suspect" },
  ];

  return (
    <motion.aside 
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 md:relative md:bottom-auto md:left-auto md:right-auto w-full md:w-24 glass md:squircle p-3 md:p-6 flex flex-row md:flex-col items-center justify-around md:justify-start gap-4 md:gap-8 z-50 border-t md:border-t-0 md:border-r border-white/10"
    >
      <div className="w-10 h-10 md:w-12 md:h-12 bg-crimson rounded-xl md:rounded-2xl flex items-center justify-center crimson-glow shrink-0 hidden md:flex">
        <Shield size={20} className="text-white" />
      </div>
      
      <nav className="flex flex-row md:flex-col gap-2 md:gap-6 flex-1 justify-around md:justify-center w-full">
        {items.map(item => (
          <button 
            key={item.id}
            onClick={() => setScreen(item.id)}
            className={`p-3 md:p-3 rounded-xl md:rounded-2xl transition-all relative group flex flex-col items-center gap-1 ${current === item.id ? 'bg-crimson text-white' : 'text-muted-grey hover:bg-white/5 hover:text-apple-white'}`}
          >
            {item.icon}
            <span className="text-[8px] font-bold uppercase md:hidden">{item.label}</span>
            <span className="absolute left-full ml-4 px-2 py-1 bg-white text-obsidian text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      <div className="hidden md:flex flex-col gap-6 items-center mt-auto">
        <button className="text-muted-grey hover:text-crimson transition-colors"><Settings size={22} /></button>
        <button onClick={onExit} className="text-muted-grey hover:text-crimson transition-colors"><LogOut size={22} /></button>
      </div>
    </motion.aside>
  );
}
