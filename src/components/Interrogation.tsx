/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback, ReactNode } from "react";
import { motion } from "motion/react";
import { MessageSquare, User, Shield, ArrowLeft, CheckCircle } from "lucide-react";
import { Evidence } from "../types";

interface InterrogationProps {
  onAddEvidence: (e: Evidence) => void;
  phase: number;
  inventory: string[];
  anishStep: number;
  onAnishStepChange: (step: number) => void;
  anishTranscript: { q: string; a: string }[];
  onAnishTranscriptChange: (t: { q: string; a: string }[]) => void;
  onBack: () => void;
}

export function Interrogation({ 
  onAddEvidence, 
  phase, 
  inventory, 
  anishStep, 
  onAnishStepChange, 
  anishTranscript, 
  onAnishTranscriptChange, 
  onBack 
}: InterrogationProps) {
  const [activeSuspect, setActiveSuspect] = useState(0);
  const [askedQuestions, setAskedQuestions] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<string | null>(null);
  const [wrongQuestionId, setWrongQuestionId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<{ type: 'q' | 'a'; text: string; id?: string }[]>([]);
  const dialogueRef = useRef<HTMLDivElement>(null);

  const handleBack = useCallback(() => {
    if (chatHistory.length > 0) {
      setChatHistory([]);
      setCurrentAnswer(null);
    } else {
      onBack();
    }
  }, [chatHistory, onBack]);

  useEffect(() => {
    const listener = () => handleBack();
    window.addEventListener('interrogation-back', listener);
    return () => window.removeEventListener('interrogation-back', listener);
  }, [handleBack]);

  useEffect(() => {
    if (dialogueRef.current) {
      dialogueRef.current.scrollTop = dialogueRef.current.scrollHeight;
    }
  }, [chatHistory, currentAnswer]);

  // Reset chat when suspect changes
  useEffect(() => {
    setChatHistory([]);
    setCurrentAnswer(null);
    setAskedQuestions([]);
  }, [activeSuspect]);

  const suspects: {
    name: string;
    role: string;
    image: string;
    profile: string[];
    locked: boolean;
    lockedReason?: string;
    borderColor?: string;
    bgColor?: string;
    textColor?: string;
    questions: { id: string; text: string; answer: string; isCorrect?: boolean }[];
  }[] = [
    {
      name: "Jatin Bhanjara",
      role: "Husband • Painter",
      image: "https://picsum.photos/seed/painter/200/200",
      profile: ["UNCOOPERATIVE", "LACUNARY"],
      locked: false,
      questions: [
        { id: "q1", text: "If she won a lottery, why was she working in a call center or a cab?", answer: "I didn't know about any lottery until you cops asked me." },
        { id: "q2", text: "When was the last time you spoke to her?", answer: "I spoke to her on call at 5 pm to ask her for some money to buy paints and she denied." },
        { id: "q3", text: "Where did the money go?", answer: "I don't know about any money." }
      ]
    }
  ];

  if (phase >= 2) {
    const isAnishUnlocked = inventory.includes("e_lottery_audit");
    
    // Anish Interrogation Steps
    const anishQuestionsRaw = [
      // Step 0
      [
        { id: "a0_c", text: "Mr. Ambedkar, we found your business card in Aruna's apartment. Care to explain?", answer: "I meet many people, Detective. A business card is hardly a confession.", isCorrect: true },
        { id: "a0_w", text: "Why did you kill Aruna Bhanjara?", answer: "That is a preposterous accusation. I will not answer such nonsense.", isCorrect: false }
      ],
      // Step 1
      [
        { id: "a1_c", text: "Your shell company, Shree Vedanta, purchased the exact lottery batch Aruna won. Coincidence?", answer: "Shree Vedanta is a subsidiary. I don't track every minor acquisition.", isCorrect: true },
        { id: "a1_w", text: "We know you're laundering money through the lottery.", answer: "You have no proof of such claims. Watch your tongue.", isCorrect: false }
      ],
      // Step 2
      [
        { id: "a2_c", text: "The board resolution for the acquisition was dated Dec 28. Two weeks BEFORE the draw.", answer: "Strategic planning, Detective. We saw potential in the distribution network.", isCorrect: true },
        { id: "a2_w", text: "Why did you use a 71-year-old nominee director?", answer: "Gopal is a trusted associate. His age is irrelevant to his competence.", isCorrect: false }
      ],
      // Step 3
      [
        { id: "a3_c", text: "Aruna resigned the same day the acquisition was finalized. She was your inside person, wasn't she?", answer: "She was a temporary contractor. Her resignation was her own choice.", isCorrect: true },
        { id: "a3_w", text: "Did you pay her to win the lottery?", answer: "The lottery is a game of chance. I don't control the universe.", isCorrect: false }
      ],
      // Step 4
      [
        { id: "a4_c", text: "Satish Nath, your CA, was in her cab on Jan 5th. What was he delivering?", answer: "Satish handles many errands. I don't micromanage his travel schedule.", isCorrect: true },
        { id: "a4_w", text: "Where is the 4.2 crores now?", answer: "The company's finances are private and perfectly legal.", isCorrect: false }
      ],
      // Step 5
      [
        { id: "a5_c", text: "We have the audit trail. The money didn't go to Aruna. It went to a third party. Who?", answer: "Fine. It was a settlement. For a supplier we couldn't pay directly. A firm called Gowda Pharma.", isCorrect: true },
        { id: "a5_w", text: "Confess now and we might go easy on you.", answer: "I have nothing to confess. This interview is over.", isCorrect: false }
      ]
    ];

    // Shuffle questions for Anish to avoid top-always-correct
    const currentStepQuestions = anishStep < 6 ? [...anishQuestionsRaw[anishStep]].sort(() => Math.random() - 0.5) : [];

    suspects.push({
      name: "Anish Ambedkar",
      role: "Chairman • Amber Group",
      image: "https://picsum.photos/seed/chairman/200/200",
      profile: ["POWERFUL", "EVASIVE"],
      locked: !isAnishUnlocked,
      lockedReason: isAnishUnlocked ? undefined : "Unlock the 'Lottery Audit Extract' to confront him with the money trail.",
      borderColor: "border-amber-500",
      bgColor: "bg-amber-500/10",
      textColor: "text-amber-500",
      questions: currentStepQuestions
    });
    
    suspects.push({
      name: "Satish Nath",
      role: "Chartered Accountant",
      image: "https://picsum.photos/seed/accountant/200/200",
      profile: ["METICULOUS", "PARANOID"],
      locked: true,
      lockedReason: "Aruna's cab app log shows she drove a passenger named 'S. Nath' from Whitefield on January 5th — one day before she resigned.",
      borderColor: "border-purple-500",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-500",
      questions: []
    });
  }

  const handleAsk = (qId: string, answer: string, isCorrect?: boolean, questionText?: string) => {
    if (activeSuspect === 1) { // Anish
      // Add question to chat
      setChatHistory(prev => [...prev, { type: 'q', text: questionText || "", id: qId }]);
      
      if (isCorrect) {
        setWrongQuestionId(null);
        // Delay answer for realism
        setTimeout(() => {
          setCurrentAnswer(answer);
          setChatHistory(prev => [...prev, { type: 'a', text: answer }]);
          const newTranscript = [...anishTranscript, { q: questionText || "", a: answer }];
          onAnishTranscriptChange(newTranscript);
          
          setTimeout(() => {
            if (anishStep === 5) {
              // Interrogation complete
              onAnishStepChange(6);
              const transcriptStr = newTranscript.map(t => `DET. PRABHAKAR: ${t.q}\nANISH: ${t.a}`).join("\n\n");
              onAddEvidence({
                id: "e_gowda_pharma",
                title: "Lead: Gowda Pharma",
                description: `Anish Ambedkar revealed that the lottery money was a 'settlement' paid to a firm called Gowda Pharma. This is the missing link in the money trail. The stock movement of Gowda Pharma (GOWDA:NSE) shows a suspicious 1,200% spike in February. The timeline of events leading up to this needs reconstruction.\n\n--- INTERROGATION TRANSCRIPT ---\n\n${transcriptStr}`,
                location: "Interrogation Room",
                type: "statement",
                unlocked: true,
                phase: 2
              });
            } else {
              onAnishStepChange(anishStep + 1);
              setCurrentAnswer(null);
            }
          }, 3500);
        }, 600);
      } else {
        setWrongQuestionId(qId);
        setTimeout(() => {
          setCurrentAnswer(answer);
          setChatHistory(prev => [...prev, { type: 'a', text: answer }]);
          setTimeout(() => {
            setWrongQuestionId(null);
            setCurrentAnswer(null);
            onAnishStepChange(0); // RESTART on wrong question
            onAnishTranscriptChange([]); // CLEAR transcript
            setChatHistory([]); // Clear chat on fail
          }, 2500);
        }, 600);
      }
      return;
    }

    if (!askedQuestions.includes(qId)) {
      const newAsked = [...askedQuestions, qId];
      setAskedQuestions(newAsked);
      setChatHistory(prev => [...prev, { type: 'q', text: questionText || "", id: qId }]);
      
      setTimeout(() => {
        setCurrentAnswer(answer);
        setChatHistory(prev => [...prev, { type: 'a', text: answer }]);

        // Clear current answer after a delay to allow next question for non-Anish suspects
        setTimeout(() => {
          setCurrentAnswer(null);
        }, 2000);

        if (newAsked.length === 3 && activeSuspect === 0) {
          // All Jatin's questions asked
          onAddEvidence({
            id: "e_house_search",
            title: "Aruna's House Search",
            description: "Authorization for a thorough search of the RT Nagar apartment. We need to find where she hid that ticket or the cash.",
            location: "RT Nagar Apartment",
            type: "document",
            unlocked: true
          });
        }
      }, 600);
    } else {
      setChatHistory(prev => [...prev, { type: 'q', text: questionText || "", id: qId }]);
      setTimeout(() => {
        setCurrentAnswer(answer);
        setChatHistory(prev => [...prev, { type: 'a', text: answer }]);
      }, 600);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4 md:gap-6">
      {/* Suspect Selector - Grid Blocks - Hidden on mobile during active interrogation */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${chatHistory.length > 0 ? 'hidden md:grid' : 'grid'}`}>
        {suspects.map((s, i) => (
          <button
            key={i}
            onClick={() => {
              setActiveSuspect(i);
              setAskedQuestions([]);
              setCurrentAnswer(null);
            }}
            className={`relative flex flex-col p-4 rounded-2xl transition-all text-left border-2 ${
              activeSuspect === i 
                ? s.locked ? `${s.bgColor} ${s.borderColor} text-white shadow-lg` : 'bg-crimson/10 border-crimson text-white shadow-lg shadow-crimson/10' 
                : s.locked ? `glass border-l-4 ${s.borderColor} border-y-transparent border-r-transparent text-muted-grey hover:bg-white/5` : 'glass border-transparent text-muted-grey hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-full overflow-hidden border-2 ${activeSuspect === i ? (s.locked ? s.borderColor : 'border-crimson') : 'border-white/10'}`}>
                <img src={s.image} alt={s.name} className={`w-full h-full object-cover ${s.locked ? 'grayscale opacity-50' : ''}`} referrerPolicy="no-referrer" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold">{s.name}</h4>
                <p className="text-[10px] font-medium opacity-60">{s.role}</p>
              </div>
            </div>
            {s.locked && (
              <div className="absolute top-2 right-2">
                <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${s.bgColor} ${s.textColor}`}>Person of Interest</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Suspect Header - Compact during interrogation */}
      <div className={`glass squircle p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300 ${chatHistory.length > 0 ? 'md:p-3 p-2' : ''}`}>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-muted-grey hover:text-white"
            title="Back to Terminal"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className={`flex items-center gap-3 md:gap-6 transition-all w-full md:w-auto ${chatHistory.length > 0 ? 'scale-75 md:scale-100 origin-right justify-end ml-auto' : 'justify-center md:justify-start'}`}>
            <div className={`transition-all ${chatHistory.length > 0 ? 'w-10 h-10 md:w-16 md:h-16' : 'w-14 h-14 md:w-20 md:h-20'} bg-white/10 rounded-full overflow-hidden border-2 ${suspects[activeSuspect].locked ? suspects[activeSuspect].borderColor : 'border-crimson/30'}`}>
              <img src={suspects[activeSuspect].image} alt={suspects[activeSuspect].name} className={`w-full h-full object-cover ${suspects[activeSuspect].locked ? 'grayscale opacity-50' : ''}`} referrerPolicy="no-referrer" />
            </div>
            <div className={chatHistory.length > 0 ? 'text-right' : ''}>
              <h3 className={`font-extrabold transition-all ${chatHistory.length > 0 ? 'text-sm md:text-xl' : 'text-lg md:text-2xl'}`}>{suspects[activeSuspect].name}</h3>
              <p className={`text-muted-grey font-light transition-all ${chatHistory.length > 0 ? 'text-[9px] md:text-sm' : 'text-xs md:text-sm'}`}>{suspects[activeSuspect].role}</p>
            </div>
          </div>
        </div>
        
        <div className={`flex flex-col items-center md:items-end transition-all ${chatHistory.length > 0 ? 'hidden md:flex' : 'flex'}`}>
          <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${suspects[activeSuspect].locked ? suspects[activeSuspect].textColor : 'text-crimson'}`}>Psychological Profile</span>
          <div className="flex items-center gap-2">
            {suspects[activeSuspect].profile.map(p => (
              <div key={p} className={`px-3 py-1 rounded-full text-[10px] font-bold ${p === 'UNCOOPERATIVE' || p === 'EVASIVE' ? 'bg-crimson/10 border border-crimson/30 text-crimson' : 'bg-white/5 border border-white/10 text-muted-grey'}`}>
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat-like Interrogation Area */}
      <div className="flex-1 flex flex-col gap-4 min-h-0 relative overflow-hidden">
        {/* Dialogue History Area */}
        <div 
          ref={dialogueRef} 
          className="flex-1 glass squircle p-4 md:p-8 overflow-y-auto custom-scrollbar space-y-4 pb-8"
        >
          {suspects[activeSuspect].locked ? (
             <div className="h-full flex flex-col items-center justify-center text-center py-12">
               <div className={`w-16 h-16 rounded-full ${suspects[activeSuspect].bgColor} flex items-center justify-center mb-6`}>
                 <User size={32} className={suspects[activeSuspect].textColor} />
               </div>
               <h4 className="text-lg font-bold mb-4">Person of Interest</h4>
               <p className="font-light text-sm md:text-base px-6 max-w-md leading-relaxed text-muted-grey">
                 {suspects[activeSuspect].lockedReason}
               </p>
             </div>
          ) : chatHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-12">
              <MessageSquare size={48} className="mb-4" />
              <p className="font-light text-sm md:text-base px-6">Select a question below to begin the interrogation.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {chatHistory.map((chat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${chat.type === 'q' ? 'justify-end' : 'justify-start'} gap-3`}
                >
                  {chat.type === 'a' && (
                    <div className={`w-8 h-8 rounded-full ${suspects[activeSuspect].bgColor} flex items-center justify-center shrink-0`}>
                      <User size={16} className={suspects[activeSuspect].textColor} />
                    </div>
                  )}
                  <div className={`max-w-[85%] p-3 rounded-2xl ${
                    chat.type === 'q' 
                      ? 'bg-crimson/20 border border-crimson/30 rounded-tr-none text-apple-white' 
                      : 'bg-white/5 border border-white/10 rounded-tl-none text-muted-grey italic'
                  }`}>
                    <p className="text-xs md:text-sm leading-relaxed">
                      {chat.type === 'a' ? `"${chat.text}"` : chat.text}
                    </p>
                  </div>
                  {chat.type === 'q' && (
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Shield size={16} className="text-apple-white" />
                    </div>
                  )}
                </motion.div>
              ))}
              {currentAnswer && activeSuspect === 1 && anishStep < 6 && (
                <div className="flex justify-center py-2">
                  <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] font-bold text-amber-500 animate-pulse">
                    WAITING FOR NEXT OPENING...
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Questions Selector - Moved outside scrollable area at the bottom */}
        {!suspects[activeSuspect].locked && (activeSuspect !== 1 || anishStep < 6) && (
          <div className="mt-2 pt-4 border-t border-white/5">
            <div className="max-w-4xl mx-auto">
              {activeSuspect === 1 && (
                <div className="mb-3 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center justify-between">
                  <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">Pressure: {anishStep}/6</span>
                  <div className="flex gap-1 w-32">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${i < anishStep ? 'bg-amber-500' : 'bg-white/10'}`} />
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-2 overflow-y-auto max-h-[30vh] custom-scrollbar pr-1">
                {suspects[activeSuspect].questions.map((q) => (
                  <button
                    key={q.id}
                    disabled={!!currentAnswer || askedQuestions.includes(q.id)}
                    onClick={() => handleAsk(q.id, q.answer, q.isCorrect, q.text)}
                    className={`flex-1 p-2.5 md:p-3 rounded-xl text-left text-[10px] md:text-[11px] font-bold transition-all border shadow-lg ${
                      wrongQuestionId === q.id
                        ? 'bg-red-500/20 border-red-500 text-red-200'
                        : askedQuestions.includes(q.id)
                          ? 'bg-white/5 border-white/10 text-muted-grey opacity-50'
                          : !!currentAnswer
                            ? 'bg-white/5 border-white/10 text-muted-grey opacity-30 cursor-not-allowed'
                            : activeSuspect === 1 
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-100 hover:bg-amber-500/20 active:scale-95'
                              : 'bg-crimson/10 border-crimson/30 text-apple-white hover:bg-crimson/20 active:scale-95'
                    }`}
                  >
                    {q.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSuspect === 1 && anishStep === 6 && (
          <div className="absolute inset-0 flex items-center justify-center bg-obsidian/80 backdrop-blur-sm z-10">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center p-8 glass squircle border-emerald-500/30"
            >
              <CheckCircle size={48} className="text-emerald-500 mx-auto mb-4" />
              <h4 className="text-xl font-black text-emerald-500 uppercase tracking-widest mb-2">Interrogation Successful</h4>
              <p className="text-sm text-muted-grey max-w-xs mx-auto">Anish has revealed the connection to Gowda Pharma. Check your evidence files.</p>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
