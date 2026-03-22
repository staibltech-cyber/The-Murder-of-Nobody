/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface BriefingProps {
  onComplete: () => void;
}

export function Briefing({ onComplete }: BriefingProps) {
  const [step, setStep] = useState(0);
  const narrative = [
    {
      title: "The Victim",
      text: "Aruna Bhanjara. Late 20s. By day, she was 'Sarah' at a cold, blue-lit call center in Manyata. By night, she drove a yellow-and-black cab through the neon-soaked smog of Bangalore. 18 hours of survival every single day, fueled by filter coffee and desperation.",
      meta: "Status: Deceased"
    },
    {
      title: "The Fortune",
      text: "On January 11th, she won 4.2 Crores in the state lottery. A ticket to a new life, or a target on her back. She kept it a secret from everyone—even Jatin. But secrets in this city have a way of leaking into the gutters.",
      meta: "Motive: Greed?"
    },
    {
      title: "The Silence",
      text: "Her husband, Jatin. A failed painter who speaks in riddles and shadows. They say he's a 'man of ten words'—not because he's limited, but because he chooses his silence like a weapon. He watched her work herself to death, then watched her win.",
      meta: "Suspect: Jatin Bhanjara"
    },
    {
      title: "The End",
      text: "Found on February 1st in the freezing fog of Hebbal Lake. The money is gone. The 'Nobody' is dead. The city moves on, but Case #0822 remains open. Find the truth.",
      meta: "Case: Open"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[100dvh] flex flex-col items-center justify-center p-4 md:p-12 bg-obsidian overflow-y-auto"
    >
      <AnimatePresence mode="wait">
        <motion.div 
          key={step}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className="max-w-2xl w-full glass squircle p-6 md:p-12 border-crimson/20 flex flex-col min-h-[400px] md:min-h-[500px]"
        >
          <div className="flex-1">
            <span className="text-crimson font-bold text-[10px] uppercase tracking-widest mb-2 block">{narrative[step].meta}</span>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 md:mb-6 leading-tight">{narrative[step].title}</h2>
            <p className="text-muted-grey text-base md:text-xl font-light leading-relaxed mb-8 md:mb-10">
              {narrative[step].text}
            </p>
          </div>
          
          <div className="flex justify-between items-center gap-4 mt-auto pt-6 border-t border-white/5">
            <div className="flex gap-1.5 md:gap-2">
              {narrative.map((_, i) => (
                <div key={i} className={`h-1 w-4 md:w-8 rounded-full transition-all ${i === step ? 'bg-crimson w-8 md:w-12' : 'bg-white/10'}`} />
              ))}
            </div>
            <button 
              onClick={() => step < narrative.length - 1 ? setStep(step + 1) : onComplete()}
              className="px-6 md:px-8 py-3 md:py-4 bg-white text-obsidian font-extrabold rounded-xl hover:bg-apple-white transition-all flex items-center justify-center gap-2 shadow-2xl shadow-white/5 text-xs md:text-base whitespace-nowrap"
            >
              {step < narrative.length - 1 ? "Next" : "Begin Case"}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
