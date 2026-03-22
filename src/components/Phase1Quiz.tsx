import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Check, X, ArrowRight, AlertCircle } from 'lucide-react';

interface Phase1QuizProps {
  onSuccess: () => void;
  onFail: () => void;
  onClose: () => void;
}

export const Phase1Quiz: React.FC<Phase1QuizProps> = ({ onSuccess, onFail, onClose }) => {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [error, setError] = useState(false);

  const questions = [
    {
      q: "What was Aruna's primary financial motivation?",
      options: ["She was debt-free", "She had a massive 45 Lakh debt", "She was a millionaire", "She was stealing from her job"],
      correct: 1,
      hint: "Check the CIBIL report and her lottery winnings."
    },
    {
      q: "What was the official cause of Aruna's death according to the PM report?",
      options: ["Poisoning", "Heart Attack", "Drowning secondary to blunt force trauma", "Strangulation"],
      correct: 2,
      hint: "Review the 'CAUSE OF DEATH' section in the Post-Mortem report."
    },
    {
      q: "What physical evidence directly links Jatin's studio to the victim?",
      options: ["A bloody knife", "Cobalt blue paint residue", "A missing paintbrush", "A torn canvas"],
      correct: 1,
      hint: "The PM report mentions a specific pigment residue on her collar."
    }
  ];

  const handleAnswer = () => {
    if (selected === questions[step].correct) {
      setIsCorrect(true);
      setTimeout(() => {
        if (step < questions.length - 1) {
          setStep(step + 1);
          setSelected(null);
          setIsCorrect(null);
        } else {
          onSuccess();
        }
      }, 1500);
    } else {
      setIsCorrect(false);
      setError(true);
      setTimeout(() => {
        setIsCorrect(null);
        setError(false);
        onFail();
      }, 2000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-obsidian/95 backdrop-blur-xl"
    >
      <div className="max-w-xl w-full">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-crimson/20 rounded-xl flex items-center justify-center text-crimson">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter">Phase 1: Knowledge Verification</h2>
              <p className="text-[10px] text-muted-grey uppercase tracking-widest">Question {step + 1} of {questions.length}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div 
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <h3 className="text-2xl font-bold leading-tight">{questions[step].q}</h3>
              
              <div className="space-y-3">
                {questions[step].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setSelected(i)}
                    className={`w-full p-5 rounded-2xl text-left font-bold transition-all border-2 flex items-center justify-between group ${
                      selected === i 
                        ? 'bg-crimson border-crimson text-white' 
                        : 'bg-white/5 border-white/5 hover:border-white/20 text-muted-grey'
                    }`}
                  >
                    <span>{opt}</span>
                    {selected === i && isCorrect === true && <Check size={20} />}
                    {selected === i && isCorrect === false && <X size={20} />}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-4">
                <button
                  disabled={selected === null || isCorrect !== null}
                  onClick={handleAnswer}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    selected !== null 
                      ? 'bg-white text-obsidian hover:bg-white/90 shadow-xl shadow-white/10' 
                      : 'bg-white/5 text-muted-grey cursor-not-allowed'
                  }`}
                >
                  VERIFY ANSWER <ArrowRight size={20} />
                </button>
                
                {error && (
                  <div className="flex items-center gap-2 text-crimson text-xs font-bold uppercase tracking-widest justify-center animate-pulse">
                    <AlertCircle size={14} /> Incorrect. Review the evidence.
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
