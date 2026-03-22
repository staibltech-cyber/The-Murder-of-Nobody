/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";

interface LandingProps {
  onStart: () => void;
}

export function Landing({ onStart }: LandingProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-[100dvh] flex flex-col items-center justify-center p-6 md:p-8 text-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-crimson/15 via-obsidian to-obsidian"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-4xl"
      >
        <span className="text-crimson font-extrabold tracking-[0.4em] uppercase text-[10px] md:text-sm mb-4 block">Bangalore Noir • Case #0822</span>
        <h1 className="text-5xl md:text-9xl font-extrabold mb-6 leading-[0.9] tracking-tighter">
          The Murder of a <br /> <span className="text-crimson">Nobody</span>
        </h1>
        <p className="text-muted-grey max-w-xl mx-auto mb-10 font-light text-base md:text-xl leading-relaxed px-4">
          A woman who lived two lives, won a fortune, and lost it all in the freezing fog of Hebbal Lake. Bangalore, Case #0822.
        </p>
        <button 
          onClick={onStart}
          className="group relative px-10 md:px-14 py-4 md:py-6 bg-crimson text-white font-extrabold rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-crimson/30"
        >
          <span className="relative z-10 flex items-center gap-3 text-sm md:text-base">
            INITIATE INVESTIGATION <ChevronRight size={20} />
          </span>
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>
      </motion.div>
    </motion.div>
  );
}
