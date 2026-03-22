import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, FileText, ArrowRight } from 'lucide-react';

interface PostMortemAlertProps {
  onClose: () => void;
}

export const PostMortemAlert: React.FC<PostMortemAlertProps> = ({ onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-obsidian/95 backdrop-blur-xl"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="max-w-md w-full bg-crimson p-8 rounded-3xl shadow-2xl text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <AlertCircle size={160} />
        </div>
        
        <div className="relative z-10">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
            <FileText size={32} />
          </div>
          
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 leading-none">New Evidence Available</h2>
          <p className="text-white/80 text-lg font-medium mb-8 leading-relaxed">
            The Toxicology & Post-Mortem report for <span className="font-black underline decoration-white/30 underline-offset-4">Aruna Kumari</span> has just been uploaded to the Evidence Locker.
          </p>
          
          <button 
            onClick={onClose}
            className="w-full py-5 bg-white text-crimson font-black rounded-2xl hover:bg-white/90 transition-all shadow-xl shadow-black/20 flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
          >
            ACCESS REPORT <ArrowRight size={20} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
