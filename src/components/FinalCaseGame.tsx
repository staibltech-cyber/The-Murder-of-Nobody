/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  X, 
  FileText, 
  Search, 
  Link as LinkIcon, 
  Gavel,
  ChevronDown,
  Target,
  Database
} from 'lucide-react';

interface FinalCaseGameProps {
  onSuccess: () => void;
  onClose: () => void;
  onEliminateJatin: () => void;
  onUnlockEvidence: (id: string) => void;
  // Persistence props
  part: 1 | 2;
  setPart: (part: 1 | 2) => void;
  selectedFindings: string[];
  setSelectedFindings: (findings: string[]) => void;
  part1Solved: boolean;
  setPart1Solved: (solved: boolean) => void;
  links: { [key: string]: string };
  setLinks: (links: { [key: string]: string }) => void;
  part2Solved: boolean;
  setPart2Solved: (solved: boolean) => void;
}

export function FinalCaseGame({ 
  onSuccess, 
  onClose, 
  onEliminateJatin, 
  onUnlockEvidence,
  part,
  setPart,
  selectedFindings,
  setSelectedFindings,
  part1Solved,
  setPart1Solved,
  links,
  setLinks,
  part2Solved,
  setPart2Solved
}: FinalCaseGameProps) {
  const [part1Feedback, setPart1Feedback] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(part2Solved);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const findings = [
    { id: 'F1', text: "Time of death: 22:00–23:30, Sunday February 1st", isCorrect: true },
    { id: 'F2', text: "Cause: asphyxia due to drowning, secondary to blunt force trauma", isCorrect: false },
    { id: 'F3', text: "Laceration: 6cm, right parietal — cylindrical metallic object, 1.5 inch diameter", isCorrect: false },
    { id: 'F4', text: "The precision of the strike indicates a calculated blow rather than a crime of passion", isCorrect: true },
    { id: 'F5', text: "No struggle marks on the victim's body", isCorrect: false },
    { id: 'F6', text: "Toxicology: negative for alcohol, narcotics, sedatives", isCorrect: false },
    { id: 'F7', text: "The assailant was highly efficient and likely a professional", isCorrect: true },
  ];

  const handleFindingToggle = (id: string) => {
    if (part1Solved) return;
    setPart1Feedback(null);
    setSelectedFindings(
      selectedFindings.includes(id) 
        ? selectedFindings.filter(f => f !== id) 
        : (selectedFindings.length < 3 ? [...selectedFindings, id] : selectedFindings)
    );
  };

  const handlePart1Submit = () => {
    const correctIds = findings.filter(f => f.isCorrect).map(f => f.id);
    const isCorrect = selectedFindings.length === 3 && selectedFindings.every(id => correctIds.includes(id));
    
    if (isCorrect) {
      setPart1Solved(true);
      onEliminateJatin();
      onUnlockEvidence("e_pm_revisit");
      setTimeout(() => {
        setPart(2);
      }, 2000);
    } else {
      setPart1Feedback("These findings describe the method. They tell you HOW Aruna died — not WHO killed her. Re-read with the timeline in mind.");
    }
  };

  const part2Links = {
    ab: [
      { id: 'ab_1', text: "Serial Match: The weapon's serial matches the dealer's sales record exactly.", isCorrect: true },
      { id: 'ab_2', text: "Date Match: The purchase was made on the day of the murder.", isCorrect: false },
      { id: 'ab_3', text: "Visual Match: The baton looks like the one in the PM report.", isCorrect: false },
    ],
    bc: [
      { id: 'bc_1', text: "Financial Trail: The purchase by Rajan Kumar was funded by Shree Vedanta one day prior.", isCorrect: true },
      { id: 'bc_2', text: "Location Trail: The bank branch is near the weapon dealer's shop.", isCorrect: false },
      { id: 'bc_3', text: "Identity Trail: The buyer used the same bank as Shree Vedanta.", isCorrect: false },
    ],
    cd: [
      { id: 'cd_1', text: "Beneficial Owner: Shree Vedanta is a shell entity registered under Satish Nath's PAN.", isCorrect: true },
      { id: 'cd_2', text: "Address Match: Shree Vedanta is located in the same building as Amber Group.", isCorrect: false },
      { id: 'cd_3', text: "Director Match: Satish Nath is listed as the only employee of Shree Vedanta.", isCorrect: false },
    ]
  };

  const handleLinkSelect = (key: string, id: string) => {
    setLinks({ ...links, [key]: id });
  };

  useEffect(() => {
    const allCorrect = 
      part2Links.ab.find(o => o.id === links.ab)?.isCorrect &&
      part2Links.bc.find(o => o.id === links.bc)?.isCorrect &&
      part2Links.cd.find(o => o.id === links.cd)?.isCorrect;
    
    if (allCorrect && !part2Solved) {
      setPart2Solved(true);
      onUnlockEvidence("e_baton_recovery");
      onUnlockEvidence("e_satish_owner");
      setTimeout(() => {
        setShowSummary(true);
      }, 1000);
    }
  }, [links, part2Solved, onUnlockEvidence]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-obsidian/98 backdrop-blur-2xl"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="glass squircle max-w-4xl w-full max-h-[90vh] overflow-hidden border-2 border-crimson/30 shadow-2xl shadow-crimson/20 flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-crimson/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-crimson/20 rounded-lg flex items-center justify-center text-crimson">
              <Shield size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter text-crimson">Final Conviction</h2>
              <p className="text-[10px] text-muted-grey uppercase tracking-widest font-bold">Phase 3: The Closing Argument</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all text-muted-grey">
            <X size={20} />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar space-y-12">
          {/* PART 1 */}
          <section className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-crimson">
                <div className="w-8 h-8 rounded-full bg-crimson/20 flex items-center justify-center font-black text-sm">1</div>
                <h3 className="text-lg font-black uppercase tracking-tight">Part 1: The Body (PM Report Re-read)</h3>
              </div>
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-sm text-muted-grey leading-relaxed">
                  The post-mortem report has been in your locker since Phase 1. You read it as a document. Read it again now — as a detective.
                </p>
              </div>
            </div>

            <div className="bg-stone-50 text-stone-900 p-8 rounded shadow-xl font-serif border-4 border-double border-stone-300 relative">
              <div className="text-center border-b border-stone-800 pb-4 mb-6">
                <h4 className="text-lg font-black uppercase tracking-widest">Post-Mortem Examination Report</h4>
                <p className="text-[10px] font-bold tracking-widest mt-1 uppercase">Department of Forensic Medicine</p>
              </div>
              
              <div className="space-y-4 text-xs md:text-sm leading-relaxed">
                <div className="grid grid-cols-2 gap-4 mb-6 opacity-70">
                  <div><span className="font-bold">Victim:</span> Aruna Bhanjara</div>
                  <div><span className="font-bold">Date:</span> 15-Mar-2026</div>
                </div>

                <div className="space-y-3">
                  {findings.map((f, idx) => (
                    <motion.div 
                      key={f.id}
                      onClick={() => handleFindingToggle(f.id)}
                      className={`p-3 rounded border transition-all cursor-pointer flex gap-3 items-start ${
                        selectedFindings.includes(f.id) 
                          ? (part1Solved && f.isCorrect ? 'bg-emerald-100 border-emerald-500 text-emerald-900' : 'bg-crimson/10 border-crimson text-crimson') 
                          : 'bg-white/50 border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <span className="font-bold shrink-0">{idx + 1}.</span>
                      <span className={part1Solved && f.isCorrect ? 'font-bold' : ''}>{f.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {!part1Solved && (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-sm font-bold text-muted-grey mb-4">
                    Select the three findings that, taken together, eliminate Jatin Bhanjara as a suspect.
                  </p>
                  <div className="flex justify-center gap-2 mb-6">
                    {[1, 2, 3].map(i => (
                      <div 
                        key={i} 
                        className={`w-3 h-3 rounded-full transition-all ${i <= selectedFindings.length ? 'bg-crimson scale-110' : 'bg-white/10'}`} 
                      />
                    ))}
                  </div>
                  
                  {part1Feedback && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-crimson/10 border border-crimson/30 rounded-xl text-crimson text-sm font-medium"
                    >
                      <AlertCircle size={16} className="inline mr-2" />
                      {part1Feedback}
                    </motion.div>
                  )}

                  <button 
                    onClick={handlePart1Submit}
                    disabled={selectedFindings.length !== 3}
                    className="px-10 py-4 bg-crimson text-white font-black rounded-xl hover:bg-crimson/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-sm shadow-lg shadow-crimson/20"
                  >
                    Submit Deductions
                  </button>
                </div>
              </div>
            )}

            {part1Solved && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl"
              >
                <div className="flex items-center gap-3 text-emerald-400 mb-3">
                  <CheckCircle size={20} />
                  <h4 className="font-black uppercase tracking-tight">Case Note: Suspect Eliminated</h4>
                </div>
                <p className="text-sm text-muted-grey leading-relaxed italic">
                  "Gallery CCTV confirms Jatin Bhanjara was present 20:00–22:40. The murder window is 22:00–23:30. The strike was calculated, not passionate. The assailant was a professional. Jatin Bhanjara is eliminated."
                </p>
              </motion.div>
            )}
          </section>

          {/* PART 2 */}
          <AnimatePresence>
            {part === 2 && (
              <motion.section 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8 pt-12 border-t border-white/10"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-orange-500">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center font-black text-sm">2</div>
                    <h3 className="text-lg font-black uppercase tracking-tight">Part 2: The Weapon (Baton Chain)</h3>
                  </div>
                  <div className="p-6 bg-orange-500/5 border border-orange-500/20 rounded-2xl space-y-3">
                    <p className="text-sm text-muted-grey leading-relaxed">
                      Divers recovered an object from Hebbal Lake, 4 metres north of the body site. 
                      <span className="block mt-2 font-mono text-orange-400">Serial number: ASP-BLR-0344 | Diameter: 1.5 inches.</span>
                    </p>
                    <p className="text-xs text-orange-500/70 font-bold italic">
                      "The PM report described a cylindrical metallic object, 1.5 inches in diameter. This is it."
                    </p>
                  </div>
                </div>

                <div className="space-y-6 relative">
                  {/* Panel A */}
                  <div className="glass p-6 border-l-4 border-orange-500 bg-white/5">
                    <div className="flex items-center gap-2 text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2">
                      <Target size={12} /> Evidence: Lake Recovery
                    </div>
                    <p className="text-sm font-mono">Object: ASP tactical baton. Serial: <span className="text-orange-400 font-bold">ASP-BLR-0344</span>. Diameter: 1.5in. Recovered 4m north of body.</p>
                  </div>

                  {/* Link AB */}
                  <div className="flex justify-center py-2">
                    <LinkSlot 
                      id="ab" 
                      options={part2Links.ab} 
                      selectedId={links.ab} 
                      onSelect={(id) => handleLinkSelect('ab', id)} 
                      isSolved={part2Solved}
                    />
                  </div>

                  {/* Panel B */}
                  <div className="glass p-6 border-l-4 border-orange-500 bg-white/5">
                    <div className="flex items-center gap-2 text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2">
                      <FileText size={12} /> Document: Dealer Invoice
                    </div>
                    <p className="text-sm font-mono"><span className="text-orange-400 font-bold">ASP-BLR-0344</span> sold Jan 28. Cash. Buyer: <span className="text-orange-400 font-bold">Rajan Kumar</span>. Aadhaar: 4471 8821 0344. UIDAI: INVALID.</p>
                  </div>

                  {/* Link BC */}
                  <div className="flex justify-center py-2">
                    <LinkSlot 
                      id="bc" 
                      options={part2Links.bc} 
                      selectedId={links.bc} 
                      onSelect={(id) => handleLinkSelect('bc', id)} 
                      isSolved={part2Solved}
                    />
                  </div>

                  {/* Panel C */}
                  <div className="glass p-6 border-l-4 border-orange-500 bg-white/5">
                    <div className="flex items-center gap-2 text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2">
                      <Database size={12} /> Record: Bank Transfer
                    </div>
                    <p className="text-sm font-mono">Jan 27 — IMPS. From: <span className="text-orange-400 font-bold">Shree Vedanta Distributors</span> (GST 29AADVS8821B1Z3). To: <span className="text-orange-400 font-bold">Rajan Kumar</span>. ₹1,80,000. Ref: Consulting.</p>
                  </div>

                  {/* Link CD */}
                  <div className="flex justify-center py-2">
                    <LinkSlot 
                      id="cd" 
                      options={part2Links.cd} 
                      selectedId={links.cd} 
                      onSelect={(id) => handleLinkSelect('cd', id)} 
                      isSolved={part2Solved}
                    />
                  </div>

                  {/* Panel D */}
                  <div className="glass p-6 border-l-4 border-orange-500 bg-white/5">
                    <div className="flex items-center gap-2 text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2">
                      <Shield size={12} /> Registry: Shree Vedanta Registration
                    </div>
                    <p className="text-sm font-mono">Beneficial Owner: <span className="text-orange-400 font-bold">Satish Nath</span>. PAN: <span className="text-orange-400 font-bold">AADCN4471C</span>. Verified via GST trace.</p>
                  </div>

                  {part2Solved && (
                    <motion.div 
                      className="absolute left-0 top-0 w-1 bg-emerald-500 z-10"
                      initial={{ height: 0 }}
                      animate={{ height: '100%' }}
                      transition={{ duration: 1 }}
                    />
                  )}
                </div>

                {showSummary && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-8"
                  >
                    <div className="p-8 bg-white/5 border-2 border-emerald-500/30 rounded-3xl space-y-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Gavel size={120} />
                      </div>
                      <h4 className="text-2xl font-black uppercase tracking-tighter text-emerald-500">Case Summary: The Money Trail</h4>
                      <p className="text-lg text-apple-white font-light leading-relaxed italic">
                        "Aruna Bhanjara was killed between 22:00 and 23:30 on February 1st by a professional assailant. 
                        The weapon — a steel baton, serial ASP-BLR-0344 — was purchased on January 28th by Rajan Kumar, a known hitman. 
                        Prabhakar's investigation reveals Rajan was hired by Satish Nath. 
                        The purchase was funded one day earlier by Shree Vedanta Distributors. Shree Vedanta is a shell entity wholly owned by Satish Nath. 
                        Satish Nath was in Aruna Bhanjara's cab on January 5th. His GST and PAN numbers appear in every shell company connected to this case. 
                        One person connects every thread."
                      </p>
                    </div>

                    <button 
                      onClick={onSuccess}
                      className="w-full py-6 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-500/40 uppercase tracking-[0.3em] text-lg flex items-center justify-center gap-4 group"
                    >
                      <Gavel size={24} className="group-hover:rotate-12 transition-transform" />
                      File Conviction
                    </button>
                  </motion.div>
                )}
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

function LinkSlot({ id, options, selectedId, onSelect, isSolved }: { 
  id: string; 
  options: { id: string; text: string; isCorrect: boolean }[]; 
  selectedId: string; 
  onSelect: (id: string) => void;
  isSolved: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(o => o.id === selectedId);
  const isCorrect = selectedOption?.isCorrect;

  return (
    <div className="relative w-full max-w-md">
      <button 
        onClick={() => !isSolved && setIsOpen(!isOpen)}
        disabled={isSolved}
        className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
          isCorrect 
            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
            : selectedId 
              ? 'bg-crimson/10 border-crimson text-crimson' 
              : 'bg-white/5 border-dashed border-white/20 text-muted-grey hover:border-white/40'
        }`}
      >
        <div className="flex items-center gap-3">
          <LinkIcon size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">
            {selectedOption ? selectedOption.text : "Establish Link"}
          </span>
        </div>
        {!isSolved && <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
        {isSolved && <CheckCircle size={16} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-20 top-full mt-2 w-full bg-zinc-900 border border-white/20 rounded-xl overflow-hidden shadow-2xl"
          >
            {options.map(opt => (
              <button 
                key={opt.id}
                onClick={() => {
                  onSelect(opt.id);
                  setIsOpen(false);
                }}
                className="w-full p-4 text-left text-xs font-medium hover:bg-white/10 transition-colors border-b border-white/5 last:border-0"
              >
                {opt.text}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
