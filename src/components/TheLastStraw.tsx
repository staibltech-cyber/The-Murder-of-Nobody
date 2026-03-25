import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  X, 
  FileText, 
  Search, 
  Gavel,
  Target,
  Database,
  Camera
} from 'lucide-react';

interface Question {
  id: number;
  label: string;
  text: string;
  source: string;
  type: 'text' | 'mcq';
  correctAnswer?: string;
  options?: { id: string; text: string; feedback: string; isCorrect: boolean }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    label: "QUESTION 01 OF 05",
    text: "What was Aruna Bhanjara's CIBIL credit score at the time of her death?",
    source: "",
    type: 'text',
    correctAnswer: "420"
  },
  {
    id: 2,
    label: "QUESTION 02 OF 05",
    text: "What is Satish Nath's professional designation?",
    source: "",
    type: 'mcq',
    options: [
      { id: 'A', text: "Company secretary", feedback: "A company secretary handles filings and compliance — not financial accounts. Satish controlled Anish's money.", isCorrect: false },
      { id: 'B', text: "Chartered accountant", feedback: "Correct. Chartered accountant — and Anish Ambedkar's trusted fixer. He handled the money, the shell companies, and ultimately, the decision to make Aruna disappear.", isCorrect: true },
      { id: 'C', text: "Investment banker", feedback: "Investment bankers operate in public markets. Satish operated in the shadows, through shell companies registered to retired clerks.", isCorrect: false },
      { id: 'D', text: "Corporate lawyer", feedback: "Lawyers didn't come into this story until after the arrest. Satish was the accountant.", isCorrect: false }
    ]
  },
  {
    id: 3,
    label: "QUESTION 03 OF 05",
    text: "What was the age of the victim?",
    source: "",
    type: 'text',
    correctAnswer: "28"
  },
  {
    id: 4,
    label: "QUESTION 04 OF 05",
    text: "Who is charged with the murder of Aruna Bhanjara?",
    source: "",
    type: 'mcq',
    options: [
      { id: 'A', text: "Jatin Bhanjara", feedback: "Jatin Bhanjara was at his gallery show from 20:00 to 22:40 on February 1st. The murder window is 22:00 to 23:30. He cannot be in two places. He is eliminated.", isCorrect: false },
      { id: 'B', text: "Anish Ambedkar", feedback: "Anish Ambedkar is guilty of insider trading, lottery fraud, and using Aruna as an unknowing courier. He did not order the murder. Satish acted without his knowledge or instruction.", isCorrect: false },
      { id: 'C', text: "Satish Nath", feedback: "Correct. Satish Nath — CA, NathCorp Advisory, Koramangala. He commissioned the murder through a shell payment to a professional using a fabricated identity. Every thread leads back to him.", isCorrect: true },
      { id: 'D', text: "Vikram Sood", feedback: "Vikram Sood is the alias of the hired professional who carried out the act. Satish Nath is the person who commissioned it and paid for it. The charge goes to the one who gave the order.", isCorrect: false }
    ]
  },
  {
    id: 5,
    label: "QUESTION 05 OF 05",
    text: "What object was used to incapacitate Aruna Bhanjara before she was pushed into Hebbal Lake?",
    source: "",
    type: 'mcq',
    options: [
      { id: 'A', text: "Steel pipe, unidentified", feedback: "The object has a confirmed serial number — ASP-BLR-0344. It is not unidentified. It was traced from the lake to a dealer to a payment.", isCorrect: false },
      { id: 'B', text: "ASP tactical baton", feedback: "Correct. ASP tactical baton — serial number ASP-BLR-0344. Purchased January 28th using a fabricated Aadhaar in the name Rajan Kumar. Funded one day earlier by NathCorp Advisory LLP. Recovered from Hebbal Lake, 4 metres north of the body site.", isCorrect: true },
      { id: 'C', text: "Cobalt blue paint tube", feedback: "The cobalt blue paint was found on Aruna's collar — but it was planted there after the murder to implicate Jatin. It was part of the frame, not the weapon.", isCorrect: false },
      { id: 'D', text: "Unknown blunt instrument", feedback: "The post-mortem report describes a specific diameter — 1.5 inches — and the lake recovery produced a specific object with a traceable serial number. It is not unknown.", isCorrect: false }
    ]
  }
];

export function TheLastStraw({ 
  currentStep, 
  setCurrentStep, 
  answers, 
  setAnswers, 
  typedValue, 
  setTypedValue, 
  isQuizComplete, 
  setIsQuizComplete, 
  isCaseFiled, 
  setIsCaseFiled 
}: {
  currentStep: number;
  setCurrentStep: (s: number) => void;
  answers: Record<number, { value: string; isCorrect: boolean; feedback?: string }>;
  setAnswers: (a: any) => void;
  typedValue: string;
  setTypedValue: (v: string) => void;
  isQuizComplete: boolean;
  setIsQuizComplete: (c: boolean) => void;
  isCaseFiled: boolean;
  setIsCaseFiled: (f: boolean) => void;
}) {
  const handleTextSubmit = (qId: number) => {
    const question = QUESTIONS.find(q => q.id === qId);
    if (!question) return;

    const isCorrect = typedValue.trim() === question.correctAnswer;
    
    setAnswers((prev: any) => ({
      ...prev,
      [qId]: { 
        value: typedValue, 
        isCorrect, 
        feedback: isCorrect 
          ? (qId === 1 
            ? "Correct. Score 420 — multiple defaults on personal loans and credit cards. Despite working 18-hour days, Aruna was drowning in debt. That vulnerability is what made her usable."
            : "Correct. Aruna Bhanjara was 28 years old. She had been working 18-hour days since she was in her early twenties. She had twenty-one days of believing it was finally over.")
          : (qId === 1
            ? "Incorrect. Score 420 — multiple defaults on personal loans and credit cards. Despite working 18-hour days, Aruna was drowning in debt. That vulnerability is what made her usable."
            : "Incorrect. Aruna Bhanjara was 28 years old. She had been working 18-hour days since she was in her early twenties. She had twenty-one days of believing it was finally over.")
      }
    }));
    
    setTypedValue("");
    if (qId < 5) setCurrentStep(qId + 1);
    else setIsQuizComplete(true);
  };

  const handleMCQSelect = (qId: number, optionId: string) => {
    if (answers[qId]) return;

    const question = QUESTIONS.find(q => q.id === qId);
    const option = question?.options?.find(o => o.id === optionId);
    if (!option) return;

    setAnswers((prev: any) => ({
      ...prev,
      [qId]: { value: optionId, isCorrect: option.isCorrect, feedback: option.feedback }
    }));

    if (qId < 5) setCurrentStep(qId + 1);
    else setIsQuizComplete(true);
  };

  const correctCount = Object.values(answers).filter((a: any) => a.isCorrect).length;
  const accuracy = Math.round((correctCount / 5) * 100);
  
  let status = "Incomplete — review";
  if (correctCount === 5) status = "Accepted";
  else if (correctCount >= 3) status = "Filed with notes";

  return (
    <div className="min-h-screen bg-black text-apple-white p-6 md:p-12 font-sans selection:bg-crimson selection:text-white">
      <div className="max-w-3xl mx-auto space-y-16 pb-32">
        
        {/* Section 1: Recap Card */}
        <section className="space-y-8">
          <div className="space-y-4">
            <div className="glass p-6 md:p-8 border-l-4 border-crimson relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <Shield size={80} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-crimson mb-6 block">INTERROGATION ROOM · FEB 14 · FINAL STATEMENT</span>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500 shrink-0">
                  <span className="font-black text-xs">SN</span>
                </div>
                <p className="text-xl font-medium leading-relaxed italic">
                  "She was a cab driver. She drove people around. That's all she ever did."
                </p>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass p-6 md:p-8 bg-white/5 border border-white/10"
            >
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-crimson/20 flex items-center justify-center text-crimson shrink-0">
                  <span className="font-black text-xs">DP</span>
                </div>
                <div className="space-y-4">
                  <p className="text-muted-grey text-sm leading-relaxed">
                    "He used the past tense without being told she was dead. He said 'drove' — not 'drives.' He knew. He's known since February 1st. That's the last thing he'll say voluntarily. Satish Nath is formally charged. The case moves to court."
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
          <div className="h-px bg-white/10 w-full" />
        </section>

        {/* Section 2: Court Submission Quiz */}
        <section className="space-y-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-black uppercase tracking-tighter">SESSIONS COURT, BENGALURU · PROSECUTION FILING</h2>
            <p className="text-muted-grey text-sm font-light max-w-xl leading-relaxed">
              Before Case #0822 goes to trial, the court requires a verified evidence record. Five questions. Every answer must be supported by documents in your evidence locker.
            </p>
          </div>

          <div className="space-y-12">
            {QUESTIONS.map((q) => {
              const isLocked = q.id > currentStep;
              const isAnswered = !!answers[q.id];
              const answer = answers[q.id];

              return (
                <div 
                  key={q.id} 
                  className={`space-y-6 transition-all duration-500 ${isLocked ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-grey">{q.label}</span>
                    <h3 className="text-xl font-bold">{q.text}</h3>
                    <p className="text-[10px] italic text-muted-grey">{q.source}</p>
                  </div>

                  {q.type === 'text' ? (
                    <div className="space-y-4">
                      {!isAnswered ? (
                        <div className="flex gap-3">
                          <input 
                            id={`q-${q.id}-input`}
                            type="number"
                            value={typedValue}
                            onChange={(e) => setTypedValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit(q.id)}
                            placeholder="Enter value..."
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-crimson transition-colors w-40 font-mono"
                          />
                          <button 
                            onClick={() => handleTextSubmit(q.id)}
                            className="px-6 py-3 bg-white text-black font-black uppercase text-xs tracking-widest rounded-xl hover:bg-crimson hover:text-white transition-all"
                          >
                            Confirm
                          </button>
                        </div>
                      ) : (
                        <div className={`p-4 border rounded-xl ${answer.isCorrect ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-crimson/10 border-crimson/20'}`}>
                          <p className={`${answer.isCorrect ? 'text-emerald-400' : 'text-crimson'} text-sm font-medium`}>{answer.feedback}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {q.options?.map((opt) => {
                        const isSelected = answer?.value === opt.id;
                        const showCorrect = isAnswered && opt.isCorrect;
                        const showWrong = isAnswered && isSelected && !opt.isCorrect;

                        return (
                          <button
                            key={opt.id}
                            onClick={() => handleMCQSelect(q.id, opt.id)}
                            disabled={isAnswered}
                            className={`p-4 rounded-xl border text-left transition-all ${
                              isSelected 
                                ? opt.isCorrect ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-crimson/10 border-crimson text-crimson'
                                : showCorrect ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-white/5 border-white/10 text-muted-grey hover:bg-white/10'
                            }`}
                          >
                            <div className="flex gap-3">
                              <span className="font-black opacity-50">{opt.id}</span>
                              <span className="text-sm font-bold">{opt.text}</span>
                            </div>
                            {isSelected && (
                              <p className="mt-3 text-xs leading-relaxed opacity-90">{opt.feedback}</p>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {isQuizComplete && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 pt-12 border-t border-white/10"
            >
              <div className="grid grid-cols-3 gap-4">
                <div className="glass p-6 text-center">
                  <span className="text-[10px] font-black uppercase text-muted-grey block mb-2">CORRECT</span>
                  <span className="text-3xl font-black">{correctCount}/5</span>
                </div>
                <div className="glass p-6 text-center">
                  <span className="text-[10px] font-black uppercase text-muted-grey block mb-2">ACCURACY</span>
                  <span className="text-3xl font-black">{accuracy}%</span>
                </div>
                <div className="glass p-6 text-center">
                  <span className="text-[10px] font-black uppercase text-muted-grey block mb-2">STATUS</span>
                  <span className={`text-sm font-black uppercase tracking-widest mt-2 block ${status === 'Accepted' ? 'text-emerald-500' : status === 'Filed with notes' ? 'text-orange-500' : 'text-crimson'}`}>
                    {status}
                  </span>
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="text-xs text-muted-grey font-bold uppercase tracking-widest">Screenshot now! for your reference before reload</p>
              </div>

              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase text-muted-grey block text-center">EVIDENCE SUBMITTED TO COURT</span>
                <div className="flex flex-wrap justify-center gap-2">
                  {['CIBIL Report', 'NathCorp Registration', 'PM Report', 'Case File #0822', 'Lake Recovery', 'Dealer Invoice'].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider text-muted-grey">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {Object.values(answers).some(a => !a.isCorrect) && (
                <div className="space-y-6 p-8 bg-crimson/5 border border-crimson/20 rounded-3xl">
                  <h4 className="text-crimson font-black uppercase tracking-widest text-xs flex items-center gap-2">
                    <AlertCircle size={14} /> Incorrect Findings Summary
                  </h4>
                  <div className="space-y-6">
                    {QUESTIONS.map(q => {
                      const answer = answers[q.id];
                      if (answer && !answer.isCorrect) {
                        const correctAnswerText = q.type === 'text' 
                          ? q.correctAnswer 
                          : q.options?.find(o => o.isCorrect)?.text;
                        const userAnswerText = q.type === 'mcq' 
                          ? q.options?.find(o => o.id === answer.value)?.text 
                          : answer.value;
                        
                        return (
                          <div key={q.id} className="text-sm space-y-2 border-l-2 border-crimson/30 pl-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-crimson/60">{q.label}</span>
                            <p className="font-bold text-apple-white">{q.text}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <p className="text-crimson/80"><span className="text-[10px] uppercase font-black block opacity-50">Your Submission</span>{userAnswerText}</p>
                              <p className="text-emerald-500/80"><span className="text-[10px] uppercase font-black block opacity-50">Correct Evidence</span>{correctAnswerText}</p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-center pt-4">
                <button 
                  onClick={() => setIsCaseFiled(true)}
                  className="px-12 py-4 bg-emerald-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-500/20"
                >
                  File case — close #0822
                </button>
              </div>
            </motion.div>
          )}
        </section>

        {/* Section 3: The Closing Card */}
        <AnimatePresence>
          {isCaseFiled && (
            <motion.section 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12 pt-12 border-t border-white/10"
            >
              <div className="text-center space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-grey">CASE #0822 — BHANJARA, ARUNA — CLOSED · MAR 4</span>
              </div>

              <div className="glass p-8 md:p-12 bg-white/5 border border-white/10 rounded-3xl">
                <div className="max-w-xl mx-auto space-y-8 font-serif text-lg leading-relaxed text-apple-white/90">
                  <p>
                    Satish Nath was arrested on March 4th and charged with murder in the first degree and criminal conspiracy. He has not named the professional he hired.
                  </p>
                  <p>
                    Anish Ambedkar's lawyers filed for a stay of the SEBI referral on the same afternoon the charges were read. The stay was granted.
                  </p>
                  <p>
                    Jatin Bhanjara was released from custody. He returned to the apartment in RT Nagar. The gallery show he attended on February 1st — the one that gave him his alibi — was the last show he attended. He has not painted since.
                  </p>
                  <p>
                    Aruna Bhanjara never read the note. She never knew what she was carrying. She thought, for twenty-one days, that her life had changed.
                  </p>
                  <p className="font-bold italic">It had.</p>
                  <p>
                    Case #0822 is closed. The city moves on. It always does.
                  </p>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
