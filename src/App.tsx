/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, Bell, User, LayoutGrid, Settings, LogOut, 
  FileText, MapPin, MessageSquare, Clock, Shield, 
  ChevronRight, AlertCircle, Camera, Database, 
  Fingerprint, Eye, Info, X, Plus, CheckCircle, TrendingUp, ArrowLeft, ArrowRight, Gavel, Smartphone
} from "lucide-react";
import { ReactNode } from "react";
import { LotteryAuditMiniGame } from "./components/LotteryAuditMiniGame";
import { GowdaPharmaGame } from "./components/GowdaPharmaGame";
import { ShreeVedantaGSTGame } from "./components/ShreeVedantaGSTGame";
import { FinalCaseGame } from "./components/FinalCaseGame";
import ShadowLedger from "./components/ShadowLedger";
import { TheLastStraw } from "./components/TheLastStraw";

// --- Types & Data ---

type Screen = "landing" | "briefing" | "terminal" | "evidence" | "interrogation" | "the-last-straw";

interface Evidence {
  id: string;
  title: string;
  description: string;
  location: string;
  type: "document" | "photo" | "object" | "digital" | "statement";
  unlocked: boolean;
  requiresPincode?: string;
  sent?: boolean;
  parentClueId?: string;
  phase?: number;
}

const INITIAL_EVIDENCE: Evidence[] = [
  { 
    id: "e_pm", 
    title: "Post-Mortem Request", 
    description: "Official request form for the autopsy of Aruna Bhanjara. Found dead on Feb 1st at Hebbal Lake. Needs to be sent to Columbia Asia Hebbal for processing.", 
    location: "Columbia Asia", 
    type: "document", 
    unlocked: false,
    requiresPincode: "560024"
  },
  { 
    id: "e_alibi", 
    title: "Jatin's Initial Statement", 
    description: "He looks terrified, his hands stained with cobalt blue paint. 'I... I was just painting,' he stammers. 'I was working on the landscape for the gallery. I didn't even realize she hadn't come home. The hours... they just bleed into each other when I'm at the canvas. I thought she was just working an extra shift at the call center...'", 
    location: "RT Nagar Apartment", 
    type: "statement", 
    unlocked: false 
  },
  { 
    id: "e_lottery", 
    title: "Lottery Result Sheet", 
    description: "11th Jan Sunday results. Karnataka State Lottery. Ticket #88219: 1st Prize - 4.2 Crores.", 
    location: "Apartment", 
    type: "document", 
    unlocked: false,
    parentClueId: "e_house_search"
  },
  {
    id: "e_cibil",
    title: "CIBIL Report",
    description: "Credit score: 420. Multiple defaults on personal loans and credit cards. Aruna was drowning in debt despite her hard work.",
    location: "Apartment Drawer",
    type: "document",
    unlocked: false,
    parentClueId: "e_house_search"
  },
  {
    id: "e_paints",
    title: "Paint Supplies",
    description: "A collection of high-end cobalt blue and titanium white paint tubes. All empty. Jatin's obsession was expensive.\n\n(Fine print: CCTV alibi confirmed — Jatin was seen entering his studio at 21:45 on Feb 1st and did not exit until 08:00 the next morning. 22:00–23:30 alibi established.)",
    location: "Studio Corner",
    type: "object",
    unlocked: false,
    parentClueId: "e_house_search"
  },
  {
    id: "e_resignation",
    title: "Resignation Letter",
    description: "Official email printout. Aruna resigned from Manyata Call Center on Jan 6th, citing 'personal reasons'. This was 5 days BEFORE the lottery win.",
    location: "Laptop Bag",
    type: "document",
    unlocked: false,
    parentClueId: "e_house_search"
  },
  {
    id: "e_cab_invoices",
    title: "Cab Invoices",
    description: "Invoices show she used to work 4 hours daily. Recently, this dropped to just 2 hours a day. She was pulling back.",
    location: "Glove Box",
    type: "document",
    unlocked: false,
    parentClueId: "e_house_search"
  },
  {
    id: "e_cab_log",
    title: "City-Cab Trip Record",
    description: "Date: Jan 5\nPickup: Whitefield Tech Park Gate 3\nDrop: Koramangala Dental Clinic\nDuration: 34 min\nDriver ID: 4471\nPassenger name: S. Nath\n\nPassenger rating: 4.1 — No notes.",
    location: "City-Cab Database",
    type: "digital",
    unlocked: true,
    phase: 2
  },
  {
    id: "e_anish_profile",
    title: "Anish Ambedkar Profile",
    description: "Name: Anish Ambedkar\nTitle: Chairman, Amber Group of Companies\nEst. net worth: ₹480Cr (Forbes India, 2023)\n\nSEBI preliminary query filed 2019 — matter lapsed, no charges.",
    location: "Corporate Database",
    type: "document",
    unlocked: true,
    phase: 2
  },
  {
    id: "e_lottery_audit",
    title: "Lottery Audit Extract",
    description: "Ticket batch: #88214, #88217, #88219 — all prefix 8821\nPurchasing entity: Shree Vedanta Distributors\nGST: 29AADVS8821B1Z3\n\nFlagged: bulk purchase by non-retail entity. Under review.",
    location: "Lottery Board",
    type: "document",
    unlocked: false,
    phase: 2
  },
  {
    id: "e_shell_reg",
    title: "MCA Registration: Shree Vedanta",
    description: `MINISTRY OF CORPORATE AFFAIRS - CERTIFICATE OF INCORPORATION
---------------------------------------------------------
Company Name: SHREE VEDANTA DISTRIBUTORS PVT LTD
Registration Number: 088214
Date of Incorporation: 2023-05-12
Registered Office: 42/A, Industrial Suburb, Mangaluru, KA
Director(s): 
1. Gopal Krishna (Age: 71) - Nominee Director
2. [REDACTED] - Beneficial Owner
GSTIN: 29AADVS8821B1Z3
---------------------------------------------------------
Status: ACTIVE
(Fine print: PAN: AADCN4471C - Verified)`,
    location: "MCA Database",
    type: "document",
    unlocked: false,
    phase: 2
  },
  {
    id: "e_amber_filing",
    title: "ROC Filing: Amber Group",
    description: `REGISTRAR OF COMPANIES - FORM PAS-3 (RETURN OF ALLOTMENT)
---------------------------------------------------------
Reporting Entity: AMBER GROUP HOLDINGS
Subject: Acquisition of SHREE VEDANTA DISTRIBUTORS
---------------------------------------------------------
Board Resolution Date: 2023-12-28
Acquisition Effective: 2024-02-12
Transaction Value: 4.20 Crores
Authorised Signatory: Anish Ambedkar (Chairman)
---------------------------------------------------------
Note: The board resolution was passed 14 days PRIOR to the lottery draw.`,
    location: "ROC Database",
    type: "document",
    unlocked: false,
    phase: 2
  },
  {
    id: "e_pm_revisit",
    title: "PM Report: Re-read",
    description: "The post-mortem report has been in your locker since Phase 1. You read it as a document. Read it again now — as a detective.",
    location: "Locker",
    type: "document",
    unlocked: false,
    phase: 3
  },
  {
    id: "e_baton_recovery",
    title: "Baton Recovery Report",
    description: "Divers recovered an object from Hebbal Lake, 4 metres north of the body site. Serial number: ASP-BLR-0344. Diameter: 1.5 inches.",
    location: "Hebbal Lake",
    type: "document",
    unlocked: false,
    phase: 3
  },
  {
    id: "e_satish_owner",
    title: "NathCorp Registration",
    description: "Director: Satish Nath. PAN: AADCN4471C. Incorporated 2019. Koramangala.",
    location: "MCA Database",
    type: "document",
    unlocked: false,
    phase: 3
  }
];

// --- Components ---

function Phase1Quiz({ onSuccess, onFail }: { onSuccess: () => void; onFail: () => void }) {
  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);
  const [status, setStatus] = useState<'answering' | 'success' | 'failed'>('answering');

  const handleSubmit = () => {
    if (q1 === 'B' && q2 === 'C') {
      setStatus('success');
    } else {
      setStatus('failed');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-obsidian/95 backdrop-blur-xl"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="glass squircle max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-10 border-2 border-crimson/30 shadow-2xl shadow-crimson/20"
      >
        {status === 'answering' && (
          <>
            <h2 className="text-2xl md:text-3xl font-black mb-2 tracking-tighter uppercase text-crimson">Phase 1 Review: Deductions</h2>
            <p className="text-muted-grey text-sm mb-8">Answer the following questions based on the evidence collected to proceed.</p>
            
            <div className="space-y-8 mb-8">
              {/* Question 1 */}
              <div>
                <h3 className="text-lg font-bold mb-4">1. Reviewing the timeline of events, what is the most glaring anomaly regarding Aruna's financial situation?</h3>
                <div className="space-y-3">
                  {[
                    { id: 'A', text: "She bought the winning lottery ticket on Jan 6th, the exact same day she submitted her resignation to the call center." },
                    { id: 'B', text: "She resigned on Jan 6th, but the lottery draw wasn't until Jan 11th, meaning she quit her only job while drowning in debt." },
                    { id: 'C', text: "She received the 4.2 Crore lottery payout on Jan 11th, but her bank accounts show no trace of the deposit." },
                    { id: 'D', text: "She resigned from her call center job on Jan 11th, immediately after the lottery results were published in the newspaper." }
                  ].map(opt => (
                    <button 
                      key={opt.id}
                      onClick={() => setQ1(opt.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${q1 === opt.id ? 'bg-crimson/20 border-crimson text-white' : 'bg-white/5 border-white/10 text-muted-grey hover:bg-white/10'}`}
                    >
                      <span className="font-bold mr-2">{opt.id}.</span> {opt.text}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2 */}
              <div>
                <h3 className="text-lg font-bold mb-4">2. Based on the Medical Examiner's notes in the Post-Mortem report, what does the nature of the fatal blow suggest about the assailant?</h3>
                <div className="space-y-3">
                  {[
                    { id: 'A', text: "The killer struck her from behind with immense force, indicating a crime of passion fueled by sudden rage." },
                    { id: 'B', text: "The lack of struggle marks and hyper-inflated lungs indicate she was drugged before being pushed into the lake." },
                    { id: 'C', text: "The trauma was incapacitating, struck from behind with immense force, suggesting a highly efficient, professional assailant." },
                    { id: 'D', text: "She was struck from behind and rendered unconscious, but the diatoms in her lungs prove she struggled extensively underwater." }
                  ].map(opt => (
                    <button 
                      key={opt.id}
                      onClick={() => setQ2(opt.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${q2 === opt.id ? 'bg-crimson/20 border-crimson text-white' : 'bg-white/5 border-white/10 text-muted-grey hover:bg-white/10'}`}
                    >
                      <span className="font-bold mr-2">{opt.id}.</span> {opt.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={handleSubmit}
              disabled={!q1 || !q2}
              className="w-full py-4 bg-crimson text-white font-black rounded-xl hover:bg-crimson/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
            >
              Submit Deductions
            </button>
          </>
        )}

        {status === 'success' && (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
              <Shield size={40} />
            </div>
            <h2 className="text-2xl md:text-3xl font-black mb-6 tracking-tighter uppercase text-emerald-500">Deductions Confirmed</h2>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-8 text-left">
              <p className="text-apple-white font-light leading-relaxed italic text-lg">
                "The post-mortem confirms a calculated, professional attack. Jatin Bhanjara has no history of violence and was denied money for paint the same day — a motive, but not a method. The lottery win happened after Aruna quit her job, not before. Something — or someone — paid her first. Two new persons of interest have been flagged: Anish Ambedkar, Chairman of Amber Group, and Satish Nath, his chartered accountant. The money trail begins here."
              </p>
            </div>
            <button 
              onClick={onSuccess}
              className="w-full py-4 bg-emerald-600 text-white font-black rounded-xl hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20 uppercase tracking-widest"
            >
              Begin Phase 2
            </button>
          </div>
        )}

        {status === 'failed' && (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-crimson/20 rounded-full flex items-center justify-center mx-auto mb-6 text-crimson">
              <AlertCircle size={40} />
            </div>
            <h2 className="text-2xl md:text-3xl font-black mb-4 tracking-tighter uppercase text-crimson">Deductions Flawed</h2>
            <p className="text-muted-grey mb-8">Your conclusions do not align with the evidence. Review the timeline and the post-mortem report carefully.</p>
            <button 
              onClick={onFail}
              className="w-full py-4 bg-white/10 text-white font-black rounded-xl hover:bg-white/20 transition-all uppercase tracking-widest"
            >
              Return to Hub
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [evidence, setEvidence] = useState<Evidence[]>(INITIAL_EVIDENCE);
  const [inventory, setInventory] = useState<string[]>([]);
  const [viewedClues, setViewedClues] = useState<string[]>([]);
  const [gowdaSolved, setGowdaSolved] = useState(false);
  const [showGowdaGame, setShowGowdaGame] = useState(false);
  const [phase3Unlocked, setPhase3Unlocked] = useState(false);
  const [showPhase3Game, setShowPhase3Game] = useState(false);
  const [phase3GameStep, setPhase3GameStep] = useState(1);
  const [showShadowLedger, setShowShadowLedger] = useState(false);
  const [shadowLedgerPage, setShadowLedgerPage] = useState(1);
  const [shadowLedgerComplete, setShadowLedgerComplete] = useState(false);
  const [showFinalGame, setShowFinalGame] = useState(false);
  const [finalGamePart, setFinalGamePart] = useState<1 | 2>(1);
  const [finalGameFindings, setFinalGameFindings] = useState<string[]>([]);
  const [finalGamePart1Solved, setFinalGamePart1Solved] = useState(false);
  const [finalGameLinks, setFinalGameLinks] = useState<{ [key: string]: string }>({ ab: '', bc: '', cd: '' });
  const [finalGamePart2Solved, setFinalGamePart2Solved] = useState(false);
  const [jatinEliminated, setJatinEliminated] = useState(false);
  const [selectedClue, setSelectedClue] = useState<Evidence | null>(null);
  const [showPostMortemAlert, setShowPostMortemAlert] = useState(false);
  const [phase, setPhase] = useState<1 | 2 | 3>(1);
  const [showPhase1Quiz, setShowPhase1Quiz] = useState(false);
  const [hasFailedPhase1Quiz, setHasFailedPhase1Quiz] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showSkipToPhase2, setShowSkipToPhase2] = useState(false);
  const [skipPasscode, setSkipPasscode] = useState("");
  const [skipError, setSkipError] = useState(false);
  const [showInitialPasscode, setShowInitialPasscode] = useState(false);
  const [initialPasscode, setInitialPasscode] = useState("");
  const [initialPasscodeError, setInitialPasscodeError] = useState(false);
  const [showMiniGame1, setShowMiniGame1] = useState(false);
  const [anishInterrogationStep, setAnishInterrogationStep] = useState(0);
  const [anishTranscript, setAnishTranscript] = useState<{q: string, a: string}[]>([]);
  const [lastStrawUnlocked, setLastStrawUnlocked] = useState(false);
  const [lastStrawStep, setLastStrawStep] = useState(1);
  const [lastStrawAnswers, setLastStrawAnswers] = useState<Record<number, { value: string; isCorrect: boolean; feedback?: string }>>({});
  const [lastStrawTypedValue, setLastStrawTypedValue] = useState("");
  const [lastStrawQuizComplete, setLastStrawQuizComplete] = useState(false);
  const [lastStrawCaseFiled, setLastStrawCaseFiled] = useState(false);

  const startPhase2 = () => {
    setPhase(2);
    setShowPhase1Quiz(false);
    // Ensure initial Phase 2 evidence is in inventory
    const initialPhase2Ids = evidence.filter(e => e.phase === 2 && e.unlocked).map(e => e.id);
    setInventory(prev => {
      const toAdd = initialPhase2Ids.filter(id => !prev.includes(id));
      if (toAdd.length === 0) return prev;
      return [...prev, ...toAdd];
    });
  };

  // Check for all evidence collected to trigger Post Mortem Report
  useEffect(() => {
    const requiredIds = [
      "e_lottery", "e_cibil", "e_paints", "e_resignation", "e_cab_invoices"
    ];
    const allUnlocked = requiredIds.every(id => inventory.includes(id));
    const pmRequestSent = evidence.find(e => e.id === "e_pm")?.sent;
    
    if (allUnlocked && pmRequestSent && !inventory.includes("e_pm_report")) {
      setShowPostMortemAlert(true);
      addEvidence({
        id: "e_pm_report",
        title: "Official Post-Mortem Report",
        description: `GOVERNMENT OF KARNATAKA - DEPARTMENT OF FORENSIC MEDICINE
COLUMBIA ASIA, HEBBAL - FORENSIC UNIT
POST-MORTEM EXAMINATION REPORT
---------------------------------------------------------
Victim Name: Aruna Bhanjara
Age: 28 | Sex: Female
Date of Examination: 15-Mar-2026
Examining Medical Officer: Dr. Harish Reddy, Columbia Asia, Hebbal
Time of Death (Estimated): Between 22:00 and 23:30, Sunday.

CAUSE OF DEATH:
Asphyxia due to drowning, secondary to severe blunt force trauma to the cranium.

EXTERNAL INJURIES:
1. Laceration (6cm) on the right parietal region of the skull. The shape and depth of the contusion suggest a heavy, cylindrical metallic object (approx. 1.5 inches in diameter) was used. The precision of the strike indicates a calculated blow rather than a crime of passion.
2. Minor defensive bruising on the left forearm.
3. Trace pigment residue (cobalt blue) identified on the left collar and upper shoulder region. Submitted for paint analysis — pending.

INTERNAL FINDINGS:
- Lungs hyper-inflated; presence of diatoms matching Hebbal Lake water, confirming the victim was alive and breathing when submerged.
- Toxicology: Negative for alcohol, narcotics, or sedatives.

NOTES:
The trauma was incapacitating. The victim was struck from behind with immense force, rendering her instantly unconscious before being pushed into the water. The lack of struggle marks on the body suggests the assailant was highly efficient and likely a professional.`,
        location: "Columbia Asia Hebbal",
        type: "document",
        unlocked: true
      });
    }
  }, [inventory]);

  const addEvidence = (newEvidence: Evidence) => {
    setEvidence(prev => {
      const existing = prev.find(e => e.id === newEvidence.id);
      if (existing) {
        // If it exists but we are now unlocking it
        if (newEvidence.unlocked && !existing.unlocked) {
          return prev.map(e => e.id === newEvidence.id ? { ...e, ...newEvidence, unlocked: true } : e);
        }
        return prev;
      }
      return [...prev, newEvidence];
    });
    if (newEvidence.unlocked && !inventory.includes(newEvidence.id)) {
      setInventory(prev => [...prev, newEvidence.id]);
    }
  };

  const unlockEvidence = (id: string) => {
    setEvidence(prev => prev.map(e => e.id === id ? { ...e, unlocked: true } : e));
    if (!inventory.includes(id)) setInventory(prev => [...prev, id]);
  };

  const handleGowdaSuccess = () => {
    setGowdaSolved(true);
    setShowGowdaGame(false);
  };

  const handlePhase3Success = () => {
    setPhase(3);
    setShowPhase3Game(false);
    unlockEvidence("e_pm_revisit");
    // Automatically trigger final game after GST trace
    setTimeout(() => {
      setShowFinalGame(true);
    }, 1000);
  };

  const handleShadowLedgerComplete = () => {
    setShadowLedgerComplete(true);
    setShowShadowLedger(false);
    unlockEvidence("e_baton_recovery");
    // Satish is now fully interrogatable
  };

  // Sync inventory with unlocked evidence
  useEffect(() => {
    const unlockedIds = evidence.filter(e => e.unlocked).map(e => e.id);
    setInventory(prev => {
      const toAdd = unlockedIds.filter(id => !prev.includes(id));
      if (toAdd.length === 0) return prev;
      return [...prev, ...toAdd];
    });
  }, [evidence]);

  // Check for Phase 3 unlock
  useEffect(() => {
    if (gowdaSolved && !phase3Unlocked) {
      // Check if all Phase 2 evidence is collected/viewed
      const phase2EvidenceIds = evidence.filter(e => e.phase === 2).map(e => e.id);
      const allPhase2Collected = phase2EvidenceIds.every(id => inventory.includes(id));
      
      if (allPhase2Collected) {
        setPhase3Unlocked(true);
        setPhase(3);
      }
    }
  }, [gowdaSolved, inventory, evidence, phase3Unlocked]);

  const sendEvidence = (id: string) => {
    setEvidence(prev => prev.map(e => e.id === id ? { ...e, sent: true } : e));
  };

  return (
    <div className="min-h-[100dvh] bg-obsidian text-apple-white font-manrope selection:bg-crimson/30 overflow-x-hidden">
      <AnimatePresence mode="wait">
        {screen === "landing" && <Landing onStart={() => setShowInitialPasscode(true)} />}

        {showInitialPasscode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-obsidian/95 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass squircle max-w-sm w-full p-8 border-2 border-crimson/30 shadow-2xl shadow-crimson/20 text-center"
            >
              <div className="w-16 h-16 bg-crimson/10 rounded-full flex items-center justify-center mx-auto mb-6 text-crimson">
                <Shield size={32} />
              </div>
              <h2 className="text-xl font-black mb-2 uppercase tracking-tighter">Event Access Required</h2>
              <p className="text-muted-grey text-xs font-bold uppercase tracking-widest mb-6">Ask your host or wait for your host to give you the password</p>
              
              <div className="space-y-4">
                <input 
                  type="text"
                  maxLength={4}
                  value={initialPasscode}
                  onChange={(e) => setInitialPasscode(e.target.value.toLowerCase())}
                  placeholder="Enter 4-letter code"
                  className={`w-full bg-white/5 border ${initialPasscodeError ? 'border-crimson' : 'border-white/10'} rounded-xl px-4 py-4 text-center tracking-[0.5em] font-mono text-xl focus:outline-none focus:border-crimson transition-all uppercase`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (initialPasscode === "tmon") {
                        setShowInitialPasscode(false);
                        setScreen("briefing");
                      } else {
                        setInitialPasscodeError(true);
                        setTimeout(() => setInitialPasscodeError(false), 2000);
                      }
                    }
                  }}
                />
                {initialPasscodeError && <p className="text-[10px] text-crimson font-black uppercase animate-pulse">Access Denied. Invalid Passcode.</p>}
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowInitialPasscode(false)}
                    className="flex-1 py-4 bg-white/5 text-muted-grey font-black rounded-xl hover:bg-white/10 transition-all uppercase tracking-widest text-xs"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      if (initialPasscode === "tmon") {
                        setShowInitialPasscode(false);
                        setScreen("briefing");
                      } else {
                        setInitialPasscodeError(true);
                        setTimeout(() => setInitialPasscodeError(false), 2000);
                      }
                    }}
                    className="flex-1 py-4 bg-crimson text-white font-black rounded-xl hover:bg-crimson/90 transition-all shadow-lg shadow-crimson/20 uppercase tracking-widest text-xs"
                  >
                    Authorize
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
        {screen === "briefing" && <Briefing onComplete={() => setScreen("terminal")} />}
        {screen !== "landing" && screen !== "briefing" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col md:flex-row h-[100dvh] md:h-screen overflow-hidden p-2 md:p-6 gap-2 md:gap-6"
          >
            <Sidebar current={screen} setScreen={setScreen} onExit={() => setShowExitConfirm(true)} lastStrawUnlocked={lastStrawUnlocked} />
            
            <main className="flex-1 flex flex-col gap-2 md:gap-6 overflow-hidden">
              <Header 
                onExit={() => setShowExitConfirm(true)} 
                onBack={screen === "interrogation" ? () => {
                  // This will be handled by a ref or state passed to Interrogation
                  // But for now, let's just use a simple event bus or state
                  window.dispatchEvent(new CustomEvent('interrogation-back'));
                } : (screen === "evidence" ? () => setScreen("terminal") : undefined)}
              />
              
              <div className={`flex-1 pr-1 md:pr-2 custom-scrollbar pb-16 md:pb-0 ${screen === "interrogation" ? "overflow-hidden" : "overflow-y-auto"}`}>
                {screen === "terminal" && (
                  <TerminalHub 
                    inventory={inventory} 
                    evidence={evidence} 
                    viewedClues={viewedClues} 
                    phase={phase} 
                    hasFailedPhase1Quiz={hasFailedPhase1Quiz} 
                    onRetryPhase1Quiz={() => setShowPhase1Quiz(true)} 
                    onStartMiniGame1={() => setShowMiniGame1(true)} 
                    gowdaSolved={gowdaSolved}
                    phase3Unlocked={phase3Unlocked}
                    onStartPhase3Game={() => setShowPhase3Game(true)}
                    setShowFinalGame={setShowFinalGame}
                  />
                )}
                {screen === "evidence" && (
                  <EvidenceLocker 
                    evidence={evidence.filter(e => !e.phase || e.phase <= phase)} 
                    inventory={inventory}
                    onSelect={setSelectedClue} 
                    onUnlock={unlockEvidence} 
                  />
                )}
                {screen === "interrogation" && (
                  <Interrogation 
                    onAddEvidence={addEvidence} 
                    phase={phase} 
                    inventory={inventory}
                    anishStep={anishInterrogationStep}
                    onAnishStepChange={setAnishInterrogationStep}
                    anishTranscript={anishTranscript}
                    onAnishTranscriptChange={setAnishTranscript}
                    onBack={() => setScreen("terminal")}
                    jatinEliminated={jatinEliminated}
                    onJatinEliminated={() => setJatinEliminated(true)}
                    shadowLedgerComplete={shadowLedgerComplete}
                    onProceedToLastStraw={() => {
                      setLastStrawUnlocked(true);
                      setScreen("the-last-straw");
                    }}
                  />
                )}
                {screen === "the-last-straw" && (
                  <TheLastStraw 
                    currentStep={lastStrawStep}
                    setCurrentStep={setLastStrawStep}
                    answers={lastStrawAnswers}
                    setAnswers={setLastStrawAnswers}
                    typedValue={lastStrawTypedValue}
                    setTypedValue={setLastStrawTypedValue}
                    isQuizComplete={lastStrawQuizComplete}
                    setIsQuizComplete={setLastStrawQuizComplete}
                    isCaseFiled={lastStrawCaseFiled}
                    setIsCaseFiled={setLastStrawCaseFiled}
                  />
                )}
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFinalGame && (
          <FinalCaseGame 
            onSuccess={() => {
              setShowFinalGame(false);
              setScreen("terminal");
              // In a real app we'd show a nice reveal screen
            }}
            onClose={() => setShowFinalGame(false)}
            onEliminateJatin={() => setJatinEliminated(true)}
            onUnlockEvidence={unlockEvidence}
            part={finalGamePart}
            setPart={setFinalGamePart}
            selectedFindings={finalGameFindings}
            setSelectedFindings={setFinalGameFindings}
            part1Solved={finalGamePart1Solved}
            setPart1Solved={setFinalGamePart1Solved}
            links={finalGameLinks}
            setLinks={setFinalGameLinks}
            part2Solved={finalGamePart2Solved}
            setPart2Solved={setFinalGamePart2Solved}
          />
        )}
      </AnimatePresence>

      {/* Clue Detail Modal */}
      <AnimatePresence>
        {selectedClue && (
          <ClueModal 
            clue={evidence.find(e => e.id === selectedClue.id) || selectedClue} 
            allEvidence={evidence}
            onClose={() => {
              if (selectedClue.id === "e_pm_report" && phase === 1) {
                setShowPhase1Quiz(true);
              }
              setSelectedClue(null);
              setShowGowdaGame(false);
            }} 
            onSend={sendEvidence}
            onAddEvidence={addEvidence}
            onUnlock={unlockEvidence}
            inventory={inventory}
            onView={() => {
              if (!viewedClues.includes(selectedClue.id)) {
                setViewedClues(prev => [...prev, selectedClue.id]);
              }
            }}
            gowdaSolved={gowdaSolved}
            setGowdaSolved={setGowdaSolved}
            showGowdaGame={showGowdaGame}
            setShowGowdaGame={setShowGowdaGame}
            onShadowLedgerStart={() => {
              if (finalGamePart2Solved) {
                setShowShadowLedger(true);
                setSelectedClue(null);
              }
            }}
            finalGameSolved={finalGamePart2Solved}
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showPostMortemAlert && (
          <PostMortemAlert onClose={() => setShowPostMortemAlert(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPhase1Quiz && (
          <Phase1Quiz 
            onSuccess={startPhase2} 
            onFail={() => {
              setShowPhase1Quiz(false);
              setHasFailedPhase1Quiz(true);
            }} 
          />
        )}
      </AnimatePresence>

      {/* Exit Confirmation Modal */}
      <AnimatePresence>
        {showExitConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-obsidian/95 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-md w-full bg-obsidian border border-white/10 p-8 rounded-2xl shadow-2xl"
            >
              <div className="w-16 h-16 bg-crimson/20 rounded-full flex items-center justify-center mx-auto mb-6 text-crimson">
                <AlertCircle size={32} />
              </div>
              <h2 className="text-2xl font-black mb-4 text-center uppercase tracking-tighter">Exit Game?</h2>
              <p className="text-muted-grey text-center mb-8">Are you sure you want to exit? All progress will be lost.</p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 py-3 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-all uppercase tracking-widest text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setShowExitConfirm(false);
                    setShowSkipToPhase2(true);
                  }}
                  className="flex-1 py-3 bg-crimson text-white font-bold rounded-xl hover:bg-crimson/90 transition-all uppercase tracking-widest text-sm"
                >
                  Exit Game
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip to Phase 2 Modal */}
      <AnimatePresence>
        {showSkipToPhase2 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-obsidian/95 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-md w-full bg-obsidian border border-orange-500/30 p-8 rounded-2xl shadow-2xl"
            >
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-500">
                <Settings size={32} />
              </div>
              <h2 className="text-2xl font-black mb-4 text-center uppercase tracking-tighter text-orange-500">Developer Testing</h2>
              <p className="text-muted-grey text-center mb-6">Enter passcode to skip to Phase 2:</p>
              
              <div className="mb-8">
                <input 
                  type="password"
                  value={skipPasscode}
                  onChange={(e) => {
                    setSkipPasscode(e.target.value);
                    setSkipError(false);
                  }}
                  placeholder="****"
                  maxLength={4}
                  className={`w-full bg-white/5 border ${skipError ? 'border-crimson' : 'border-white/10'} rounded-xl py-4 text-center text-2xl tracking-[1em] font-mono focus:border-orange-500 outline-none transition-all`}
                />
                {skipError && (
                  <p className="text-crimson text-xs text-center mt-2 font-bold uppercase tracking-widest">Invalid Passcode</p>
                )}
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    setShowSkipToPhase2(false);
                    setSkipPasscode("");
                    setSkipError(false);
                  }}
                  className="flex-1 py-3 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-all uppercase tracking-widest text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (skipPasscode === "1212") {
                      setPhase(2);
                      
                      // Unlock all Phase 1 and Phase 2 evidence
                      setEvidence(prev => {
                        const newEvidence = [...prev];
                        const addIfMissing = (item: Evidence) => {
                          if (!newEvidence.some(e => e.id === item.id)) {
                            newEvidence.push(item);
                          }
                        };
                        
                        addIfMissing({
                          id: "e_jatin_record",
                          title: "Jatin's Next Questions Answered",
                          description: "Full transcript of the initial questioning. Jatin claims ignorance of the lottery and mentions a 5 PM call where Aruna refused him money for paints.\n\n--- INTERROGATION TRANSCRIPT ---\n\nDET. PRABHAKAR: If she won a lottery, why was she working in a call center or a cab?\n\nJATIN: I didn't know about any lottery until you cops asked me.\n\nDET. PRABHAKAR: When was the last time you spoke to her?\n\nJATIN: I spoke to her on call at 5 pm to ask her for some money to buy paints and she denied.\n\nDET. PRABHAKAR: Where did the money go?\n\nJATIN: I don't know about any money.",
                          location: "Police Station",
                          type: "statement",
                          unlocked: true,
                          phase: 1
                        });
                        
                        addIfMissing({
                          id: "e_house_search",
                          title: "Aruna's House Search",
                          description: "Authorization for a thorough search of the RT Nagar apartment. We need to find where she hid that ticket or the cash.",
                          location: "RT Nagar Apartment",
                          type: "document",
                          unlocked: true
                        });
                        
                        addIfMissing({
                          id: "e_pm_report",
                          title: "Official Post-Mortem Report",
                          description: `GOVERNMENT OF KARNATAKA - DEPARTMENT OF FORENSIC MEDICINE
COLUMBIA ASIA, HEBBAL - FORENSIC UNIT
POST-MORTEM EXAMINATION REPORT
---------------------------------------------------------
Victim Name: Aruna Bhanjara
Age: 28 | Sex: Female
Date of Examination: 15-Mar-2026
Examining Medical Officer: Dr. Harish Reddy
Time of Death (Estimated): Between 22:00 and 23:30, Sunday.

EXTERNAL FINDINGS:
1. Severe contusion on the occipital region (back of head). The blow was incapacitating, struck with a smooth, heavy object.
2. No defensive wounds on hands or forearms. The attack was sudden and from behind.
3. Trace pigment residue (cobalt blue) identified on the left collar and upper shoulder region. Submitted for paint analysis — pending.

INTERNAL FINDINGS:
1. Asphyxia due to drowning. Lungs hyper-inflated, presence of diatoms matching Hebbal lake water. Victim was alive when she entered the water.
2. Toxicology: Negative for alcohol or common sedatives.

CONCLUSION: Homicide. The victim was struck from behind, rendered unconscious, and pushed into the lake. The lack of struggle indicates a highly efficient, possibly professional, attack.`,
                          location: "Columbia Asia Hebbal",
                          type: "document",
                          unlocked: true
                        });

                        const phase1Ids = [
                          "e_pm", "e_alibi", "e_jatin_record", "e_house_search", 
                          "e_lottery", "e_cibil", "e_paints", "e_resignation", "e_cab_invoices", "e_pm_report"
                        ];
                        return newEvidence.map(e => {
                          if (phase1Ids.includes(e.id)) {
                            return { ...e, unlocked: true };
                          }
                          return e;
                        });
                      });

                      setInventory(prev => {
                        const allItems = [
                          "e_pm", "e_alibi", "e_jatin_record", "e_house_search", 
                          "e_lottery", "e_cibil", "e_paints", "e_resignation", "e_cab_invoices", "e_pm_report",
                          "e_cab_log", "e_anish_profile"
                        ];
                        const toAdd = allItems.filter(item => !prev.includes(item));
                        return [...prev, ...toAdd];
                      });
                      
                      setShowSkipToPhase2(false);
                      setSkipPasscode("");
                    } else {
                      setSkipError(true);
                    }
                  }}
                  className="flex-1 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-500 transition-all uppercase tracking-widest text-sm"
                >
                  Skip to Phase 2
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini Game 1 */}
      <AnimatePresence>
        {showMiniGame1 && (
          <LotteryAuditMiniGame 
            onClose={() => setShowMiniGame1(false)}
            onSuccess={() => {
              setShowMiniGame1(false);
              setEvidence(prev => prev.map(e => 
                ["e_lottery_audit", "e_shell_reg", "e_amber_filing"].includes(e.id) 
                  ? { ...e, unlocked: true } 
                  : e
              ));
              setInventory(prev => {
                const newItems = ["e_lottery_audit", "e_shell_reg", "e_amber_filing"];
                const toAdd = newItems.filter(item => !prev.includes(item));
                return [...prev, ...toAdd];
              });
            }}
          />
        )}
      </AnimatePresence>

      {/* Phase 3 Mini Game */}
      <AnimatePresence>
        {showPhase3Game && (
          <ShreeVedantaGSTGame 
            onClose={() => setShowPhase3Game(false)}
            onSuccess={handlePhase3Success}
            initialStep={phase3GameStep}
            onStepChange={setPhase3GameStep}
          />
        )}
      </AnimatePresence>

      {/* Shadow Ledger Game */}
      <AnimatePresence>
        {showShadowLedger && (
          <ShadowLedger 
            page={shadowLedgerPage}
            setPage={setShadowLedgerPage}
            onComplete={handleShadowLedgerComplete}
            inventory={inventory}
            onAddEvidence={addEvidence}
            onClose={() => setShowShadowLedger(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Sub-components ---

function PostMortemAlert({ onClose }: { onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-obsidian/95 backdrop-blur-xl"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="glass squircle max-w-lg w-full p-8 md:p-12 border-2 border-crimson/30 shadow-2xl shadow-crimson/20 text-center"
      >
        <div className="w-20 h-20 bg-crimson/10 rounded-full flex items-center justify-center mx-auto mb-8 text-crimson animate-pulse">
          <AlertCircle size={40} />
        </div>
        
        <h2 className="text-2xl md:text-3xl font-black mb-4 tracking-tighter uppercase">Urgent Transmission</h2>
        <p className="text-muted-grey text-sm md:text-base font-bold uppercase tracking-widest mb-6">Columbia Asia Hebbal</p>
        
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-8 text-left">
          <p className="text-apple-white font-light leading-relaxed italic">
            "The post-mortem report for Aruna Bhanjara has been finalized and transmitted to your terminal. 
            Preliminary findings confirm blunt force trauma as the primary factor leading to her drowning."
          </p>
        </div>

        <button 
          onClick={onClose}
          className="w-full py-4 bg-crimson text-white font-black rounded-xl hover:bg-crimson/90 transition-all shadow-lg shadow-crimson/20 uppercase tracking-widest"
        >
          Acknowledge & View Report
        </button>
      </motion.div>
    </motion.div>
  );
}

function Landing({ onStart }: { onStart: () => void }) {
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

function Briefing({ onComplete }: { onComplete: () => void }) {
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
              {step === narrative.length - 1 ? "ENTER" : "NEXT"} <ChevronRight size={16} />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function Sidebar({ current, setScreen, onExit, lastStrawUnlocked }: { current: Screen; setScreen: (s: Screen) => void; onExit: () => void; lastStrawUnlocked: boolean }) {
  const items: { id: Screen; icon: ReactNode; label: string }[] = [
    { id: "terminal", icon: <LayoutGrid size={22} />, label: "Hub" },
    { id: "evidence", icon: <Fingerprint size={22} />, label: "Evidence" },
    { id: "interrogation", icon: <MessageSquare size={22} />, label: "Suspect" },
  ];

  if (lastStrawUnlocked) {
    items.push({ id: "the-last-straw", icon: <Gavel size={22} />, label: "Court" });
  }

  return (
    <motion.aside 
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 md:relative md:bottom-auto md:left-auto md:right-auto w-full md:w-24 glass md:squircle p-2 md:p-6 flex flex-row md:flex-col items-center justify-around md:justify-start gap-2 md:gap-8 z-50 border-t md:border-t-0 md:border-r border-white/10"
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

function Header({ onExit, onBack }: { onExit: () => void; onBack?: () => void }) {
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
          <h2 className="text-xl md:text-3xl font-extrabold tracking-tight">Case #0822</h2>
          <p className="text-muted-grey font-light text-[8px] md:text-sm uppercase tracking-widest">Bangalore Police Dept • Terminal 4</p>
        </div>
      </div>
      <button onClick={onExit} className="md:hidden text-muted-grey hover:text-crimson transition-colors p-2">
        <LogOut size={20} />
      </button>
    </motion.header>
  );
}

function TerminalHub({ 
  inventory, 
  evidence, 
  viewedClues, 
  phase, 
  hasFailedPhase1Quiz, 
  onRetryPhase1Quiz, 
  onStartMiniGame1, 
  gowdaSolved,
  phase3Unlocked,
  onStartPhase3Game,
  setShowFinalGame
}: { 
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
  setShowFinalGame: (show: boolean) => void;
}) {
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
            <h4 className="text-xl font-extrabold text-orange-500 mb-1">
              {inventory.includes("e_pm_revisit") ? "Final Investigation: The Closing Argument" : "Final Lead: Shree Vedanta Trace"}
            </h4>
            <p className="text-sm text-muted-grey">
              {inventory.includes("e_pm_revisit") ? "Assemble the final pieces of evidence to file a conviction." : "Trace the beneficial owner of the shell company through GST PAN decoding."}
            </p>
          </div>
          <button 
            onClick={inventory.includes("e_pm_revisit") ? () => setShowFinalGame(true) : onStartPhase3Game}
            disabled={inventory.includes("e_satish_owner")}
            className={`px-6 py-3 font-bold rounded-xl transition-all uppercase tracking-widest text-sm shadow-lg ${inventory.includes("e_satish_owner") ? "bg-emerald-600 text-white cursor-default shadow-emerald-500/20" : "bg-orange-600 text-white hover:bg-orange-500 shadow-orange-500/20"}`}
          >
            {inventory.includes("e_satish_owner") ? "All Evidence Unlocked" : (inventory.includes("e_pm_revisit") ? "Start Final Trace" : "Access MCA Terminal")}
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

function EvidenceLocker({ evidence, inventory, onSelect, onUnlock }: { evidence: Evidence[]; inventory: string[]; onSelect: (e: Evidence) => void; onUnlock: (id: string) => void }) {
  const phase1Evidence = [...evidence]
    .filter(e => !e.parentClueId && (!e.phase || e.phase === 1));
  
  const phase2Evidence = [...evidence]
    .filter(e => !e.parentClueId && e.phase === 2);

  // For Phase 3, we show evidence in the order it was unlocked (chronology)
  const phase3Evidence = inventory
    .map(id => evidence.find(e => e.id === id))
    .filter(e => e && e.phase === 3 && !e.parentClueId) as Evidence[];
  
  const renderEvidenceCard = (item: Evidence, i: number) => (
    <motion.div 
      key={item.id}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: i * 0.05 }}
      onClick={() => {
        if (!item.unlocked) {
          onUnlock(item.id);
        }
        onSelect(item);
      }}
      className={`glass p-6 squircle cursor-pointer hover:bg-white/10 transition-all group relative overflow-hidden ${!item.unlocked ? 'border-white/5 opacity-60' : item.phase === 2 ? 'border-orange-500/50 bg-orange-500/5' : item.phase === 3 ? 'border-amber-400/50 bg-amber-400/5' : 'border-crimson/20'}`}
    >
      {!item.unlocked && (
        <div className="absolute top-2 right-2 text-crimson">
          <Shield size={14} />
        </div>
      )}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all ${!item.unlocked ? 'bg-white/5 text-muted-grey' : item.phase === 2 ? 'bg-orange-500/20 text-orange-500 group-hover:bg-orange-500 group-hover:text-white' : item.phase === 3 ? 'bg-amber-400/20 text-amber-400 group-hover:bg-amber-400 group-hover:text-white' : 'bg-crimson/10 text-crimson group-hover:bg-crimson group-hover:text-white'}`}>
        {item.type === "document" && <FileText size={20} />}
        {item.type === "photo" && <Camera size={20} />}
        {item.type === "object" && <Database size={20} />}
        {item.type === "digital" && <Eye size={20} />}
        {item.type === "statement" && <MessageSquare size={20} />}
      </div>
      <h4 className={`font-extrabold text-sm mb-1 ${!item.unlocked ? 'text-muted-grey' : 'text-apple-white'}`}>{item.title}</h4>
      <span className="text-[10px] text-muted-grey uppercase font-bold tracking-widest">{item.location}</span>
      {!item.unlocked && (
        <div className="mt-2 text-[8px] font-bold text-crimson uppercase tracking-tighter">Click to Unlock</div>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-crimson mb-4 flex items-center gap-2">
          <div className="w-1 h-4 bg-crimson rounded-full" />
          Phase 1: The Victim & The Husband
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {phase1Evidence.map((item, i) => renderEvidenceCard(item, i))}
        </div>
      </div>

      {phase2Evidence.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500 mb-4 flex items-center gap-2">
            <div className="w-1 h-4 bg-orange-500 rounded-full" />
            Phase 2: The Corporate Conspiracy
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {phase2Evidence.map((item, i) => renderEvidenceCard(item, i))}
          </div>
        </div>
      )}

      {phase3Evidence.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400 mb-4 flex items-center gap-2">
            <div className="w-1 h-4 bg-amber-400 rounded-full" />
            Phase 3: The Final Trace
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {phase3Evidence.map((item, i) => renderEvidenceCard(item, i))}
          </div>
        </div>
      )}
    </div>
  );
}

function Interrogation({ onAddEvidence, phase, inventory, anishStep, onAnishStepChange, anishTranscript, onAnishTranscriptChange, onBack, jatinEliminated, onJatinEliminated, shadowLedgerComplete, onProceedToLastStraw }: { onAddEvidence: (e: Evidence) => void; phase: number; inventory: string[]; anishStep: number; onAnishStepChange: (step: number) => void; anishTranscript: {q: string, a: string}[]; onAnishTranscriptChange: (t: {q: string, a: string}[]) => void; onBack: () => void; jatinEliminated: boolean; onJatinEliminated: () => void; shadowLedgerComplete: boolean; onProceedToLastStraw: () => void }) {
  const [activeSuspect, setActiveSuspect] = useState(0);
  const [askedQuestions, setAskedQuestions] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<string | null>(null);
  const [wrongQuestionId, setWrongQuestionId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<{ type: 'q' | 'a'; text: string; id?: string }[]>([]);
  const [showProceed, setShowProceed] = useState(false);
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
    if (activeSuspect === 2 && inventory.includes("e_satish_owner")) {
      setChatHistory([{ 
        type: 'a', 
        text: "Everything is assembled. The baton. The NathCorp payment. The fake Aadhaar. The City-Cab log. Satish knows it. His lawyer knows it. Det. Prabhakar puts down the case file and asks the only question that still doesn't have an answer on paper." 
      }]);
    } else {
      setChatHistory([]);
    }
    setCurrentAnswer(null);
    setAskedQuestions([]);
  }, [activeSuspect, inventory]);

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
      locked: !inventory.includes("e_satish_owner") || !shadowLedgerComplete,
      lockedReason: !inventory.includes("e_satish_owner") 
        ? "Aruna's cab app log shows she drove a passenger named 'S. Nath' from Whitefield on January 5th — one day before she resigned."
        : !shadowLedgerComplete 
          ? "You need to decrypt the Shadow Ledger from Rajan Kumar's phone to confront Satish Nath with the full conspiracy."
          : undefined,
      borderColor: "border-purple-500",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-500",
      questions: inventory.includes("e_satish_owner") ? [
        { 
          id: "satish_final", 
          text: "Mr. Nath. You were the last person to receive something from Aruna Bhanjara before she died. A note, passed through a car window, on January 5th. Koramangala Dental Clinic car park. We have a witness. We have the City-Cab log. We have your call to Mr. Ambedkar four minutes later. What do you have to say?", 
          answer: "She was a cab driver. She drove people around. That's all she ever did." 
        }
      ] : []
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
            id: "e_jatin_record",
            title: "Jatin's Next Questions Answered",
            description: "Full transcript of the initial questioning. Jatin claims ignorance of the lottery and mentions a 5 PM call where Aruna refused him money for paints.\n\n--- INTERROGATION TRANSCRIPT ---\n\nDET. PRABHAKAR: If she won a lottery, why was she working in a call center or a cab?\n\nJATIN: I didn't know about any lottery until you cops asked me.\n\nDET. PRABHAKAR: When was the last time you spoke to her?\n\nJATIN: I spoke to her on call at 5 pm to ask her for some money to buy paints and she denied.\n\nDET. PRABHAKAR: Where did the money go?\n\nJATIN: I don't know about any money.",
            location: "Police Station",
            type: "statement",
            unlocked: true,
            phase: 1
          });
          onAddEvidence({
            id: "e_house_search",
            title: "Aruna's House Search",
            description: "Authorization for a thorough search of the RT Nagar apartment. We need to find where she hid that ticket or the cash.",
            location: "RT Nagar Apartment",
            type: "document",
            unlocked: true
          });
          onJatinEliminated();
        }

        if (qId === 'satish_final') {
          setTimeout(() => {
            setChatHistory(prev => [...prev, { 
              type: 'a', 
              text: "He used the past tense without being told she was dead. He said 'drove' — not 'drives.' He knew. He's known since February 1st. That's the last thing he'll say voluntarily. Satish Nath is formally charged. The case moves to court." 
            }]);
            setShowProceed(true);
          }, 2500);
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
    <div className="flex flex-col h-full gap-2 md:gap-6 overflow-hidden">
      {/* Suspect Selector - Grid Blocks - Hidden on mobile during active interrogation */}
      <div className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 ${chatHistory.length > 0 ? 'hidden md:grid' : 'grid'}`}>
        {suspects.map((s, i) => (
          <button
            key={i}
            onClick={() => {
              setActiveSuspect(i);
              setAskedQuestions([]);
              setCurrentAnswer(null);
            }}
            className={`relative flex items-center p-2 md:p-4 rounded-xl md:rounded-2xl transition-all text-left border-2 ${
              activeSuspect === i 
                ? s.locked ? `${s.bgColor} ${s.borderColor} text-white shadow-lg` : 'bg-crimson/10 border-crimson text-white shadow-lg shadow-crimson/10' 
                : s.locked ? `glass border-l-4 ${s.borderColor} border-y-transparent border-r-transparent text-muted-grey hover:bg-white/5` : 'glass border-transparent text-muted-grey hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 shrink-0 ${activeSuspect === i ? (s.locked ? s.borderColor : 'border-crimson') : 'border-white/10'}`}>
                <img src={s.image} alt={s.name} className={`w-full h-full object-cover ${s.locked ? 'grayscale opacity-50' : ''}`} referrerPolicy="no-referrer" />
              </div>
              <div className="min-w-0">
                <h4 className="text-[10px] md:text-sm font-extrabold truncate">{s.name}</h4>
                <p className="text-[8px] md:text-[10px] font-medium opacity-60 truncate">{s.role}</p>
                {/* Removed Eliminated tag */}
              </div>
            </div>
            {s.locked && (
              <div className="absolute top-1 right-1">
                <div className={`w-1.5 h-1.5 rounded-full ${s.bgColor} ${s.borderColor} border`}></div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Suspect Header - Compact during interrogation */}
      <div className={`glass squircle p-2 md:p-6 flex flex-row items-center justify-between gap-2 md:gap-4 transition-all duration-300 ${chatHistory.length > 0 ? 'md:p-3 p-1.5' : ''}`}>
        <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
          <button 
            onClick={onBack}
            className="p-1.5 md:p-2 hover:bg-white/10 rounded-full transition-colors text-muted-grey hover:text-white"
            title="Back to Terminal"
          >
            <ArrowLeft size={18} />
          </button>
          
          <div className={`flex items-center gap-2 md:gap-6 transition-all w-full md:w-auto ${chatHistory.length > 0 ? 'scale-90 md:scale-100 origin-left justify-start' : 'justify-start'}`}>
            <div className={`transition-all ${chatHistory.length > 0 ? 'w-8 h-8 md:w-16 md:h-16' : 'w-10 h-10 md:w-20 md:h-20'} bg-white/10 rounded-full overflow-hidden border-2 ${suspects[activeSuspect].locked ? suspects[activeSuspect].borderColor : 'border-crimson/30'}`}>
              <img src={suspects[activeSuspect].image} alt={suspects[activeSuspect].name} className={`w-full h-full object-cover ${suspects[activeSuspect].locked ? 'grayscale opacity-50' : ''}`} referrerPolicy="no-referrer" />
            </div>
            <div className="">
              <h3 className={`font-extrabold transition-all ${chatHistory.length > 0 ? 'text-xs md:text-xl' : 'text-sm md:text-2xl'}`}>{suspects[activeSuspect].name}</h3>
              <p className={`text-muted-grey font-light transition-all ${chatHistory.length > 0 ? 'text-[8px] md:text-sm' : 'text-[10px] md:text-sm'}`}>{suspects[activeSuspect].role}</p>
            </div>
          </div>
        </div>
        
        <div className={`flex flex-col items-end transition-all ${chatHistory.length > 0 ? 'hidden md:flex' : 'flex'}`}>
          <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-widest mb-0.5 md:mb-1 ${suspects[activeSuspect].locked ? suspects[activeSuspect].textColor : 'text-crimson'}`}>Profile</span>
          <div className="flex items-center gap-1 md:gap-2">
            {suspects[activeSuspect].profile.map(p => (
              <div key={p} className={`px-2 py-0.5 rounded-full text-[8px] md:text-[10px] font-bold ${p === 'UNCOOPERATIVE' || p === 'EVASIVE' ? 'bg-crimson/10 border border-crimson/30 text-crimson' : 'bg-white/5 border border-white/10 text-muted-grey'}`}>
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat-like Interrogation Area */}
      <div className="flex-1 flex flex-col gap-2 md:gap-4 min-h-0 relative overflow-hidden">
        {/* Dialogue History Area */}
        <div 
          ref={dialogueRef} 
          className="flex-1 glass squircle p-3 md:p-8 overflow-y-auto custom-scrollbar space-y-3 md:space-y-4 pb-4"
        >
          {suspects[activeSuspect].locked ? (
             <div className="h-full flex flex-col items-center justify-center text-center py-6 md:py-12">
               <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full ${suspects[activeSuspect].bgColor} flex items-center justify-center mb-4 md:mb-6`}>
                 <User size={24} className={suspects[activeSuspect].textColor} />
               </div>
               <h4 className="text-base md:text-lg font-bold mb-2 md:mb-4">Person of Interest</h4>
               <p className="font-light text-xs md:text-base px-4 md:px-6 max-w-md leading-relaxed text-muted-grey">
                 {suspects[activeSuspect].lockedReason}
               </p>
             </div>
          ) : chatHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-6 md:py-12">
              <MessageSquare size={32} className="mb-2 md:mb-4" />
              <p className="font-light text-xs md:text-base px-4 md:px-6">Select a question below to begin the interrogation.</p>
            </div>
          ) : (
            <div className="space-y-4 md:space-y-6">
              {chatHistory.map((chat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${chat.type === 'q' ? 'justify-end' : 'justify-start'} gap-2 md:gap-3`}
                >
                  {chat.type === 'a' && (
                    <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full ${suspects[activeSuspect].bgColor} flex items-center justify-center shrink-0`}>
                      <User size={12} className={suspects[activeSuspect].textColor} />
                    </div>
                  )}
                  <div className={`max-w-[90%] md:max-w-[85%] p-2.5 md:p-3 rounded-xl md:rounded-2xl ${
                    chat.type === 'q' 
                      ? 'bg-crimson/20 border border-crimson/30 rounded-tr-none text-apple-white' 
                      : 'bg-white/5 border border-white/10 rounded-tl-none text-muted-grey italic'
                  }`}>
                    <p className="text-[11px] md:text-sm leading-relaxed">
                      {chat.type === 'a' ? `"${chat.text}"` : chat.text}
                    </p>
                  </div>
                  {chat.type === 'q' && (
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Shield size={12} className="text-apple-white" />
                    </div>
                  )}
                </motion.div>
              ))}
              
              {showProceed && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center pt-8"
                >
                  <button 
                    onClick={onProceedToLastStraw}
                    className="px-8 py-4 bg-crimson text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-crimson/80 transition-all shadow-xl shadow-crimson/20 flex items-center gap-3"
                  >
                    Proceed to The Last Straw
                    <ArrowRight size={20} />
                  </button>
                </motion.div>
              )}
              {currentAnswer && activeSuspect === 1 && anishStep < 6 && (
                <div className="flex justify-center py-1 md:py-2">
                  <div className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-[8px] md:text-[10px] font-bold text-amber-500 animate-pulse">
                    WAITING FOR NEXT OPENING...
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Questions Selector - Moved outside scrollable area at the bottom */}
        {!suspects[activeSuspect].locked && (activeSuspect !== 1 || anishStep < 6) && (
          <div className="mt-1 pt-2 md:pt-4 border-t border-white/5">
            <div className="max-w-4xl mx-auto">
              {activeSuspect === 1 && (
                <div className="mb-2 px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center justify-between">
                  <span className="text-[8px] md:text-[9px] font-bold text-amber-500 uppercase tracking-widest">Pressure: {anishStep}/6</span>
                  <div className="flex gap-1 w-24 md:w-32">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className={`h-0.5 md:h-1 flex-1 rounded-full ${i < anishStep ? 'bg-amber-500' : 'bg-white/10'}`} />
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[25vh] md:max-h-[30vh] custom-scrollbar pr-1">
                {suspects[activeSuspect].questions.map((q) => (
                  <button
                    key={q.id}
                    disabled={!!currentAnswer || askedQuestions.includes(q.id)}
                    onClick={() => handleAsk(q.id, q.answer, q.isCorrect, q.text)}
                    className={`w-full p-2 md:p-3 rounded-lg md:rounded-xl text-left text-[10px] md:text-[11px] font-bold transition-all border shadow-lg ${
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

        {/* Removed Jatin Eliminated overlay */}
      </div>
    </div>
  );
}

function TranscriptView({ transcript, suspectName, date }: { transcript: string; suspectName: string; date: string }) {
  const lines = transcript.split('\n\n').filter(l => l.trim());
  
  return (
    <div className="bg-[#1a1515] p-6 md:p-10 rounded-2xl border border-white/5 font-mono">
      <div className="flex justify-between items-center mb-6">
        <span className="text-crimson font-black text-[10px] md:text-xs tracking-[0.2em]">TRANSCRIPT #0822-A</span>
        <span className="text-muted-grey font-bold text-[10px] md:text-xs tracking-[0.2em]">DATE: {date}</span>
      </div>
      <div className="h-px bg-white/10 mb-8" />
      
      <div className="space-y-10">
        {lines.map((line, i) => {
          const isQuestion = line.startsWith('DET. PRABHAKAR:');
          const isAnswer = line.startsWith(`${suspectName}:`);
          
          if (isQuestion) {
            const text = line.replace('DET. PRABHAKAR:', '').trim();
            return (
              <div key={i} className="space-y-2">
                <p className="text-crimson font-black text-xs md:text-sm tracking-widest uppercase">DET. PRABHAKAR:</p>
                <p className="text-apple-white text-sm md:text-lg font-medium leading-relaxed">{text}</p>
              </div>
            );
          }
          
          if (isAnswer) {
            const text = line.replace(`${suspectName}:`, '').trim();
            return (
              <div key={i} className="pl-6 border-l-2 border-crimson/40 space-y-2 ml-2">
                <p className="text-muted-grey font-black text-[10px] tracking-widest uppercase">{suspectName}:</p>
                <p className="text-apple-white text-sm md:text-lg italic font-light leading-relaxed">"{text}"</p>
              </div>
            );
          }
          
          return <p key={i} className="text-muted-grey text-xs italic">{line}</p>;
        })}
      </div>
      
      <div className="mt-12 pt-6 border-t border-white/5 text-center">
        <span className="text-[8px] md:text-[10px] font-bold text-muted-grey uppercase tracking-[0.4em] opacity-30">End of Official Record</span>
      </div>
    </div>
  );
}

function ClueModal({ 
  clue, 
  allEvidence, 
  onClose, 
  onSend, 
  onAddEvidence, 
  onUnlock, 
  inventory, 
  onView,
  gowdaSolved,
  setGowdaSolved,
  showGowdaGame,
  setShowGowdaGame,
  onShadowLedgerStart,
  finalGameSolved
}: { 
  clue: Evidence; 
  allEvidence: Evidence[]; 
  onClose: () => void; 
  onSend: (id: string) => void; 
  onAddEvidence: (e: Evidence) => void; 
  onUnlock: (id: string) => void; 
  inventory: string[]; 
  onView: () => void;
  gowdaSolved: boolean;
  setGowdaSolved: (v: boolean) => void;
  showGowdaGame: boolean;
  setShowGowdaGame: (v: boolean) => void;
  onShadowLedgerStart?: () => void;
  finalGameSolved?: boolean;
}) {
  const [pincode, setPincode] = useState("");
  const [panInput, setPanInput] = useState("");
  const [cibilStep, setCibilStep] = useState<"letter" | "firewall" | "report">("letter");
  const [subClueId, setSubClueId] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    onView();
  }, [clue.id, subClueId]);

  const handleSend = () => {
    if (clue.requiresPincode) {
      if (pincode === clue.requiresPincode) {
        onSend(clue.id);
        setError(false);
      } else {
        setError(true);
      }
    } else {
      onSend(clue.id);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-obsidian/90 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="glass squircle max-w-2xl w-full p-6 md:p-12 relative overflow-y-auto max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-muted-grey hover:text-white transition-colors">
          <X size={24} />
        </button>

        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-crimson/10 rounded-2xl flex items-center justify-center text-crimson">
            {clue.type === "document" && <FileText size={24} />}
            {clue.type === "photo" && <Camera size={24} />}
            {clue.type === "object" && <Database size={24} />}
            {clue.type === "digital" && <Eye size={24} />}
            {clue.type === "statement" && <MessageSquare size={24} />}
          </div>
          <div>
            <span className="text-[10px] font-bold text-crimson uppercase tracking-widest">Evidence Item #{clue.id}</span>
            <h3 className="text-2xl md:text-4xl font-extrabold leading-tight">{clue.title}</h3>
          </div>
        </div>

        {clue.id === "e_lottery" ? (
          <div className="bg-[#fdf6e3] text-[#586e75] p-6 md:p-10 rounded-lg border-2 border-dashed border-[#93a1a1] shadow-inner font-serif mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 bg-[#dc322f] text-white text-[10px] font-bold uppercase rotate-12 translate-x-4 -translate-y-2 px-8">WINNER</div>
            <div className="text-center border-b border-[#93a1a1] pb-4 mb-6">
              <h4 className="text-2xl font-black tracking-tighter uppercase italic">Karnataka State Lottery</h4>
              <p className="text-xs uppercase font-bold">Government of Karnataka Gazette Notification</p>
            </div>
            <div className="flex justify-between items-end mb-8">
              <div>
                <span className="text-[10px] uppercase font-bold block opacity-70">Draw Date</span>
                <span className="text-lg font-black">11th Jan Sunday results</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold block opacity-70">Ticket Number</span>
                <span className="text-2xl font-black tracking-widest">#88219</span>
              </div>
            </div>
            <div className="bg-white/50 p-4 rounded border border-[#93a1a1] text-center mb-6">
              <span className="text-[10px] uppercase font-bold block opacity-70 mb-1">Prize Amount</span>
              <span className="text-4xl font-black text-[#dc322f]">₹ 4,20,00,000</span>
              <p className="text-[8px] uppercase mt-2">Payable to the bearer on demand at the state treasury</p>
            </div>
            <div className="flex justify-between items-center opacity-50">
              <div className="w-12 h-12 border border-current rounded-full flex items-center justify-center text-[8px] font-bold rotate-[-15deg]">OFFICIAL SEAL</div>
              <div className="text-[10px] italic">Authorized Signatory</div>
            </div>
            <div className="mt-6 pt-4 border-t border-dashed border-[#93a1a1] text-[8px] leading-tight opacity-70">
              * Subject to verification of the original ticket. Claims must be filed within 30 days of the draw date. Taxes applicable as per government norms.
            </div>
          </div>
        ) : clue.id === "e_house_search" ? (
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <h4 className="text-xs font-bold uppercase tracking-widest text-crimson mb-4">Items Recovered from RT Nagar Apartment</h4>
              <ul className="space-y-3">
                {[
                  { id: "e_lottery", title: "Lottery Result Sheet", desc: "11th Jan Sunday results. Ticket #88219.", icon: <FileText size={16} /> },
                  { id: "e_cibil", title: "CIBIL Report", desc: "Aruna's credit history and scores.", icon: <Database size={16} /> },
                  { id: "e_paints", title: "Paint Supplies", desc: "Empty tubes of high-end cobalt blue.", icon: <Database size={16} /> },
                  { id: "e_resignation", title: "Resignation Letter", desc: "Dated Jan 6th (5 days before lottery).", icon: <FileText size={16} /> },
                  { id: "e_cab_invoices", title: "Cab Invoices", desc: "Recent shift in working hours.", icon: <FileText size={16} /> }
                ].map(item => {
                  const isCollected = inventory.includes(item.id);
                  return (
                    <li key={item.id} className="flex items-center justify-between gap-4 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer group" onClick={() => setSubClueId(item.id)}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${isCollected ? 'bg-emerald-500/20 text-emerald-500' : 'bg-crimson/20 text-crimson'} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          {isCollected ? <Shield size={16} /> : item.icon}
                        </div>
                        <div>
                          <p className="text-sm font-bold">{item.title}</p>
                          <p className="text-[10px] text-muted-grey">{isCollected ? "RECORDED IN EVIDENCE" : item.desc}</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-muted-grey group-hover:text-crimson transition-colors" />
                    </li>
                  );
                })}
              </ul>
            </div>
            
            {subClueId && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-xs font-bold uppercase tracking-widest text-crimson">Item Detail</h5>
                  <button onClick={() => setSubClueId(null)} className="text-[10px] font-bold text-muted-grey hover:text-white uppercase">Back to List</button>
                </div>
                
                {subClueId === "e_lottery" ? (
                  <div className="bg-yellow-50 text-black p-8 rounded shadow-2xl font-mono mb-8 border-4 border-dashed border-yellow-600 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-yellow-600 text-white px-4 py-1 text-[10px] font-bold">STATE LOTTERY</div>
                    <div className="text-center mb-6">
                      <h4 className="text-2xl font-black">KARNATAKA STATE LOTTERY</h4>
                      <p className="text-[10px] font-bold uppercase">Weekly Bumper Draw - Sunday</p>
                    </div>
                    <div className="border-y-2 border-black/10 py-4 mb-4 flex justify-between items-center">
                      <div>
                        <p className="text-[10px] uppercase opacity-50">Draw Date</p>
                        <p className="text-lg font-black">11 JAN 2026</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase opacity-50">Ticket Number</p>
                        <p className="text-lg font-black">#88219</p>
                      </div>
                    </div>
                    <div className="text-center bg-black/5 p-6 rounded-lg">
                      <p className="text-[10px] font-bold uppercase mb-1">Prize Category</p>
                      <p className="text-3xl font-black text-yellow-700">1st PRIZE</p>
                      <p className="text-xl font-black mt-2">₹ 4,20,00,000</p>
                    </div>
                  </div>
                ) : subClueId === "e_cibil" ? (
                  <div className="space-y-4">
                    {cibilStep === "letter" ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white text-black p-10 rounded shadow-2xl font-serif mb-8 border-t-8 border-blue-800">
                        <div className="flex justify-between items-start mb-10">
                          <div className="text-blue-900 font-bold text-xl italic">HDFC BANK</div>
                          <div className="text-right text-xs">
                            <p>Ref: HDFC/CR/2026/01/28</p>
                            <p>Date: Jan 28, 2026</p>
                          </div>
                        </div>
                        <div className="mb-8">
                          <p className="font-bold">To,</p>
                          <p>Ms. Aruna Bhanjara,</p>
                          <p>RT Nagar, Bangalore.</p>
                        </div>
                        <div className="mb-6">
                          <p className="font-bold">Subject: Your Credit Information Report (CIR)</p>
                        </div>
                        <div className="space-y-4 text-sm leading-relaxed">
                          <p>Dear Customer,</p>
                          <p>As per your request, we are enclosing the Credit Information Report (CIR) generated from the CIBIL database.</p>
                          <p>Please note that this report is sensitive and contains your detailed credit history. To access the digital copy of the report, please use your Permanent Account Number (PAN) as the decryption key.</p>
                          <p className="bg-blue-50 p-4 border-l-4 border-blue-800 font-mono text-xs">
                            ASSOCIATED PAN: <span className="font-black">BPZPK7241C</span>
                          </p>
                          <p>We advise you to maintain the confidentiality of this document.</p>
                        </div>
                        <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
                          <button 
                            onClick={() => setCibilStep("firewall")}
                            className="bg-blue-800 text-white px-6 py-2 rounded font-bold text-sm hover:bg-blue-900 transition-all"
                          >
                            ACCESS REPORT
                          </button>
                        </div>
                      </motion.div>
                    ) : cibilStep === "firewall" ? (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-obsidian border-2 border-crimson p-8 rounded-2xl shadow-2xl shadow-crimson/20 mb-8">
                        <div className="flex items-center gap-3 mb-6 text-crimson">
                          <Shield size={24} />
                          <h4 className="text-xl font-black uppercase tracking-tighter">SECURE FIREWALL</h4>
                        </div>
                        <p className="text-xs text-muted-grey mb-6 font-mono">ENCRYPTED DATA DETECTED. AUTHORIZATION REQUIRED. ENTER PAN NUMBER TO DECODE CIBIL™ DATABASE.</p>
                        <div className="space-y-4">
                          <input 
                            type="text" 
                            value={panInput}
                            onChange={(e) => setPanInput(e.target.value.toUpperCase())}
                            placeholder="ENTER PAN (10 CHARS)"
                            className="w-full bg-black/50 border border-crimson/30 rounded-xl px-4 py-4 text-center tracking-[0.3em] font-mono text-xl text-crimson focus:outline-none focus:border-crimson transition-all"
                          />
                          <button 
                            onClick={() => {
                              if (panInput === "BPZPK7241C") {
                                setCibilStep("report");
                                setError(false);
                              } else {
                                setError(true);
                              }
                            }}
                            className="w-full py-4 bg-crimson text-white font-black rounded-xl hover:bg-crimson/90 transition-all"
                          >
                            DECODE ENCRYPTION
                          </button>
                          {error && <p className="text-[10px] text-crimson font-bold uppercase text-center animate-pulse">Access Denied. Invalid Credentials.</p>}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white text-black p-8 rounded shadow-2xl font-sans mb-8 border-t-8 border-crimson">
                        <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
                          <div>
                            <h4 className="text-2xl font-black uppercase italic">CIBIL™</h4>
                            <p className="text-[10px] font-bold">Credit Information Bureau (India) Limited</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-bold uppercase">Report Date</p>
                            <p className="text-sm font-black">28 JAN 2026</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-8 mb-8">
                          <div>
                            <p className="text-[10px] font-bold uppercase opacity-50">Consumer Name</p>
                            <p className="text-lg font-black uppercase">ARUNA BHANJARA</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-bold uppercase opacity-50">Credit Score</p>
                            <p className="text-4xl font-black text-crimson">420</p>
                            <p className="text-[8px] font-bold uppercase">POOR / HIGH RISK</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="bg-gray-100 p-4 rounded">
                            <h5 className="text-xs font-black uppercase mb-2">Account Summary</h5>
                            <div className="grid grid-cols-3 gap-4 text-[10px]">
                              <div>
                                <p className="opacity-50">Total Accounts</p>
                                <p className="font-bold">06</p>
                              </div>
                              <div>
                                <p className="opacity-50">Overdue Accounts</p>
                                <p className="font-bold text-crimson">04</p>
                              </div>
                              <div>
                                <p className="opacity-50">Total Debt</p>
                                <p className="font-bold">₹ 14,52,000</p>
                              </div>
                            </div>
                          </div>
                          <div className="text-[10px] space-y-2">
                            <p className="font-bold border-b border-black/10 pb-1">RECENT DEFAULTS</p>
                            <div className="flex justify-between">
                              <span>HDFC Personal Loan</span>
                              <span className="font-bold text-crimson">90+ DAYS OVERDUE</span>
                            </div>
                            <div className="flex justify-between">
                              <span>ICICI Credit Card</span>
                              <span className="font-bold text-crimson">WRITTEN OFF</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ) : subClueId === "e_cibil" ? (
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center">
                    <Database size={48} className="mx-auto mb-4 text-blue-400 opacity-50" />
                    <h4 className="text-lg font-bold mb-2">CIBIL Report</h4>
                    <p className="text-sm text-muted-grey">A detailed credit history report from HDFC Bank. Contains sensitive financial information that requires closer analysis in the Evidence Locker.</p>
                  </div>
                ) : subClueId === "e_paints" ? (
                  <div className="bg-white/5 border border-white/10 p-8 rounded-2xl mb-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-crimson/20 flex items-center justify-center text-crimson">
                        <Database size={32} />
                      </div>
                      <div>
                        <h4 className="text-xl font-extrabold">Paint Supplies</h4>
                        <p className="text-xs text-muted-grey">Recovered from Jatin's studio corner.</p>
                      </div>
                    </div>
                    <p className="text-muted-grey text-sm mb-6 leading-relaxed italic">
                      "A collection of high-end cobalt blue and titanium white paint tubes. All empty. Jatin's obsession was expensive. Each tube costs more than a week's worth of groceries."
                    </p>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl mb-6">
                      <p className="text-[10px] font-black text-emerald-500 uppercase mb-2">CCTV ALIBI CONFIRMED</p>
                      <p className="text-xs text-emerald-400/90 leading-relaxed">
                        Jatin was seen entering his studio at 21:45 on Feb 1st and did not exit until 08:00 the next morning. 
                        <span className="block mt-1 font-bold">22:00–23:30 alibi established.</span>
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                        <p className="text-[8px] font-bold text-muted-grey uppercase mb-1">Brand</p>
                        <p className="text-xs font-bold">Winsor & Newton</p>
                      </div>
                      <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                        <p className="text-[8px] font-bold text-muted-grey uppercase mb-1">Color</p>
                        <p className="text-xs font-bold text-blue-400">Cobalt Blue</p>
                      </div>
                    </div>
                  </div>
                ) : subClueId === "e_resignation" ? (
                  <div className="bg-white text-black p-10 rounded shadow-2xl font-serif mb-8 border border-gray-200">
                    <div className="text-right mb-10">
                      <p className="text-sm font-bold">January 06, 2026</p>
                    </div>
                    <div className="mb-8">
                      <p className="font-bold">To,</p>
                      <p>The Human Resources Department,</p>
                      <p>Manyata Tech Park, Bangalore.</p>
                    </div>
                    <div className="mb-8">
                      <p className="font-bold">Subject: Resignation from the post of Senior Associate</p>
                    </div>
                    <div className="space-y-4 text-sm leading-relaxed">
                      <p>Dear Sir/Madam,</p>
                      <p>Please accept this letter as formal notification that I am resigning from my position as Senior Associate at Manyata Tech Park. My last day of employment will be January 06, 2026.</p>
                      <p>I have decided to move on for personal reasons that require my immediate and full attention. I appreciate the opportunities I've been given during my time here.</p>
                      <p>Thank you for your understanding.</p>
                    </div>
                    <div className="mt-12">
                      <p>Sincerely,</p>
                      <p className="font-bold mt-4 text-lg italic">Aruna Bhanjara</p>
                      <p className="text-xs opacity-50 mt-1">Employee ID: MTP-8821</p>
                    </div>
                  </div>
                ) : subClueId === "e_cab_invoices" ? (
                  <div className="bg-white text-black p-8 rounded shadow-2xl font-mono mb-8 border-l-8 border-yellow-400">
                    <div className="flex justify-between items-start border-b border-black/10 pb-4 mb-6">
                      <div>
                        <h4 className="text-xl font-black uppercase">CITY-CAB INVOICE</h4>
                        <p className="text-[8px] font-bold">Bangalore Taxi Aggregator Services</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] font-bold uppercase">Partner ID</p>
                        <p className="text-sm font-black">KA-01-AB-8821</p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="bg-gray-50 p-4 rounded">
                        <h5 className="text-[10px] font-black uppercase mb-3 border-b border-black/5 pb-1">Weekly Shift Summary</h5>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px]">DEC 28 - JAN 03</span>
                            <span className="text-xs font-bold">Avg: 4.2 hrs/day</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px]">JAN 04 - JAN 10</span>
                            <span className="text-xs font-bold">Avg: 3.8 hrs/day</span>
                          </div>
                          <div className="flex justify-between items-center text-crimson">
                            <span className="text-[10px] font-bold">JAN 11 - JAN 17</span>
                            <span className="text-xs font-black">Avg: 2.1 hrs/day</span>
                          </div>
                          <div className="flex justify-between items-center text-crimson">
                            <span className="text-[10px] font-bold">JAN 18 - JAN 24</span>
                            <span className="text-xs font-black">Avg: 1.8 hrs/day</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
                
                {/* Removed duplicate Add to Evidence button */}
              </motion.div>
            )}
          </div>
        ) : clue.id === "e_cibil" ? (
          <div className="space-y-4">
            {cibilStep === "letter" ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white text-black p-10 rounded shadow-2xl font-serif mb-8 border-t-8 border-blue-800">
                <div className="flex justify-between items-start mb-10">
                  <div className="text-blue-900 font-bold text-xl italic">HDFC BANK</div>
                  <div className="text-right text-xs">
                    <p>Ref: HDFC/CR/2026/01/28</p>
                    <p>Date: Jan 28, 2026</p>
                  </div>
                </div>
                <div className="mb-8">
                  <p className="font-bold">To,</p>
                  <p>Ms. Aruna Bhanjara,</p>
                  <p>RT Nagar, Bangalore.</p>
                </div>
                <div className="mb-6">
                  <p className="font-bold">Subject: Your Credit Information Report (CIR)</p>
                </div>
                <div className="space-y-4 text-sm leading-relaxed">
                  <p>Dear Customer,</p>
                  <p>As per your request, we are enclosing the Credit Information Report (CIR) generated from the CIBIL database.</p>
                  <p>Please note that this report is sensitive and contains your detailed credit history. To access the digital copy of the report, please use your Permanent Account Number (PAN) as the decryption key.</p>
                  <p className="bg-blue-50 p-4 border-l-4 border-blue-800 font-mono text-xs">
                    ASSOCIATED PAN: <span className="font-black">BPZPK7241C</span>
                  </p>
                  <p>We advise you to maintain the confidentiality of this document.</p>
                </div>
                <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
                  <button 
                    onClick={() => setCibilStep("firewall")}
                    className="bg-blue-800 text-white px-6 py-2 rounded font-bold text-sm hover:bg-blue-900 transition-all"
                  >
                    ACCESS REPORT
                  </button>
                </div>
              </motion.div>
            ) : cibilStep === "firewall" ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-obsidian border-2 border-crimson p-8 rounded-2xl shadow-2xl shadow-crimson/20 mb-8">
                <div className="flex items-center gap-3 mb-6 text-crimson">
                  <Shield size={24} />
                  <h4 className="text-xl font-black uppercase tracking-tighter">SECURE FIREWALL</h4>
                </div>
                <p className="text-xs text-muted-grey mb-6 font-mono">ENCRYPTED DATA DETECTED. AUTHORIZATION REQUIRED. ENTER PAN NUMBER TO DECODE CIBIL™ DATABASE.</p>
                <div className="space-y-4">
                  <input 
                    type="text" 
                    value={panInput}
                    onChange={(e) => setPanInput(e.target.value.toUpperCase())}
                    placeholder="ENTER PAN (10 CHARS)"
                    className="w-full bg-black/50 border border-crimson/30 rounded-xl px-4 py-4 text-center tracking-[0.3em] font-mono text-xl text-crimson focus:outline-none focus:border-crimson transition-all"
                  />
                  <button 
                    onClick={() => {
                      if (panInput === "BPZPK7241C") {
                        setCibilStep("report");
                        setError(false);
                      } else {
                        setError(true);
                      }
                    }}
                    className="w-full py-4 bg-crimson text-white font-black rounded-xl hover:bg-crimson/90 transition-all"
                  >
                    DECODE ENCRYPTION
                  </button>
                  {error && <p className="text-[10px] text-crimson font-bold uppercase text-center animate-pulse">Access Denied. Invalid Credentials.</p>}
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white text-black p-8 rounded shadow-2xl font-sans mb-8 border-t-8 border-crimson">
                <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
                  <div>
                    <h4 className="text-2xl font-black uppercase italic">CIBIL™</h4>
                    <p className="text-[10px] font-bold">Credit Information Bureau (India) Limited</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase">Report Date</p>
                    <p className="text-sm font-black">28 JAN 2026</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <p className="text-[10px] font-bold uppercase opacity-50">Consumer Name</p>
                    <p className="text-lg font-black uppercase">ARUNA BHANJARA</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase opacity-50">Credit Score</p>
                    <p className="text-4xl font-black text-crimson">420</p>
                    <p className="text-[8px] font-bold uppercase">POOR / HIGH RISK</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-100 p-4 rounded">
                    <h5 className="text-xs font-black uppercase mb-2">Account Summary</h5>
                    <div className="grid grid-cols-3 gap-4 text-[10px]">
                      <div>
                        <p className="opacity-50">Total Accounts</p>
                        <p className="font-bold">06</p>
                      </div>
                      <div>
                        <p className="opacity-50">Overdue Accounts</p>
                        <p className="font-bold text-crimson">04</p>
                      </div>
                      <div>
                        <p className="opacity-50">Total Debt</p>
                        <p className="font-bold">₹ 14,52,000</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] space-y-2">
                    <p className="font-bold border-b border-black/10 pb-1">RECENT DEFAULTS</p>
                    <div className="flex justify-between">
                      <span>HDFC Personal Loan</span>
                      <span className="font-bold text-crimson">90+ DAYS OVERDUE</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ICICI Credit Card</span>
                      <span className="font-bold text-crimson">WRITTEN OFF</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        ) : clue.id === "e_resignation" ? (
          <div className="bg-white text-black p-10 rounded shadow-2xl font-serif mb-8 border border-gray-200">
            <div className="text-right mb-10">
              <p className="text-sm font-bold">January 06, 2026</p>
            </div>
            <div className="mb-8">
              <p className="font-bold">To,</p>
              <p>The Human Resources Department,</p>
              <p>Manyata Tech Park, Bangalore.</p>
            </div>
            <div className="mb-8">
              <p className="font-bold">Subject: Resignation from the post of Senior Associate</p>
            </div>
            <div className="space-y-4 text-sm leading-relaxed">
              <p>Dear Sir/Madam,</p>
              <p>Please accept this letter as formal notification that I am resigning from my position as Senior Associate at Manyata Tech Park. My last day of employment will be January 06, 2026.</p>
              <p>I have decided to move on for personal reasons that require my immediate and full attention. I appreciate the opportunities I've been given during my time here.</p>
              <p>Thank you for your understanding.</p>
            </div>
            <div className="mt-12">
              <p>Sincerely,</p>
              <p className="font-bold mt-4 text-lg italic">Aruna Bhanjara</p>
              <p className="text-xs opacity-50 mt-1">Employee ID: MTP-8821</p>
            </div>
            <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center opacity-30 grayscale">
              <div className="w-16 h-16 border-4 border-black rounded-full flex items-center justify-center text-[10px] font-black uppercase">RECEIVED</div>
              <div className="text-[10px]">HR DEPT STAMP</div>
            </div>
          </div>
        ) : clue.id === "e_cab_invoices" ? (
          <div className="bg-white text-black p-8 rounded shadow-2xl font-mono mb-8 border-l-8 border-yellow-400">
            <div className="flex justify-between items-start border-b border-black/10 pb-4 mb-6">
              <div>
                <h4 className="text-xl font-black uppercase">CITY-CAB INVOICE</h4>
                <p className="text-[8px] font-bold">Bangalore Taxi Aggregator Services</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-bold uppercase">Partner ID</p>
                <p className="text-sm font-black">KA-01-AB-8821</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded">
                <h5 className="text-[10px] font-black uppercase mb-3 border-b border-black/5 pb-1">Weekly Shift Summary</h5>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px]">DEC 28 - JAN 03</span>
                    <span className="text-xs font-bold">Avg: 4.2 hrs/day</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px]">JAN 04 - JAN 10</span>
                    <span className="text-xs font-bold">Avg: 3.8 hrs/day</span>
                  </div>
                  <div className="flex justify-between items-center text-crimson">
                    <span className="text-[10px] font-bold">JAN 11 - JAN 17</span>
                    <span className="text-xs font-black">Avg: 2.1 hrs/day</span>
                  </div>
                  <div className="flex justify-between items-center text-crimson">
                    <span className="text-[10px] font-bold">JAN 18 - JAN 24</span>
                    <span className="text-xs font-black">Avg: 1.8 hrs/day</span>
                  </div>
                </div>
              </div>
              <div className="text-[9px] leading-relaxed opacity-70">
                <p className="font-bold">NOTE:</p>
                <p>Significant drop in active hours detected post JAN 11. Partner incentive eligibility suspended due to low engagement levels.</p>
              </div>
            </div>
          </div>
        ) : clue.id === "e_pm_report" ? (
          <div className="bg-slate-50 text-slate-900 p-8 md:p-12 rounded shadow-2xl font-serif mb-8 border border-slate-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-blue-900"></div>
            <div className="text-center border-b-2 border-slate-800 pb-6 mb-8">
              <div className="flex justify-center mb-4 opacity-80">
                <div className="w-16 h-16 border-2 border-slate-800 rounded-full flex items-center justify-center">
                  <span className="text-[8px] font-bold text-center leading-tight">GOVT OF<br/>KARNATAKA</span>
                </div>
              </div>
              <h4 className="text-xl md:text-2xl font-black uppercase tracking-widest text-slate-900">Department of Forensic Medicine</h4>
              <p className="text-sm font-bold tracking-widest mt-2 uppercase text-slate-700">Post-Mortem Examination Report</p>
            </div>
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8 text-sm border-b border-slate-300 pb-8">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Victim Name</span>
                <span className="font-bold text-lg">Aruna Bhanjara</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Age / Sex</span>
                <span className="font-bold text-lg">28 / Female</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Date of Examination</span>
                <span className="font-bold">15-Mar-2026</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Examining Medical Officer</span>
                <span className="font-bold">Dr. Harish Reddy, Columbia Asia, Hebbal</span>
              </div>
              <div className="col-span-2 bg-slate-200 p-3 rounded mt-2">
                <span className="text-[10px] font-bold uppercase text-slate-600 block mb-1">Time of Death (Estimated)</span>
                <span className="font-bold text-slate-900">Between 22:00 and 23:30, Sunday.</span>
              </div>
            </div>

            <div className="space-y-8 text-sm leading-relaxed">
              <div>
                <h5 className="text-xs font-black uppercase tracking-widest border-b border-slate-300 pb-2 mb-3 text-red-800">Cause of Death</h5>
                <p className="font-bold text-base">Asphyxia due to drowning, secondary to severe blunt force trauma to the cranium.</p>
              </div>

              <div>
                <h5 className="text-xs font-black uppercase tracking-widest border-b border-slate-300 pb-2 mb-3">External Injuries</h5>
                <ol className="list-decimal pl-5 space-y-2">
                  <li><span className="font-bold">Laceration (6cm)</span> on the right parietal region of the skull. The shape and depth of the contusion suggest a <span className="font-bold bg-yellow-200 px-1">heavy, cylindrical metallic object (approx. 1.5 inches in diameter)</span> was used. The precision of the strike indicates a calculated blow rather than a crime of passion.</li>
                  <li>Minor defensive bruising on the left forearm.</li>
                  <li><span className="font-bold">Trace pigment residue (cobalt blue)</span> identified on the left collar and upper shoulder region. Submitted for paint analysis — pending.</li>
                </ol>
              </div>

              <div>
                <h5 className="text-xs font-black uppercase tracking-widest border-b border-slate-300 pb-2 mb-3">Internal Findings</h5>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Lungs hyper-inflated; presence of diatoms matching Hebbal Lake water, confirming the victim was alive and breathing when submerged.</li>
                  <li>Toxicology: Negative for alcohol, narcotics, or sedatives.</li>
                </ul>
              </div>

              <div className="bg-slate-100 p-4 border-l-4 border-slate-800 italic">
                <span className="text-[10px] font-bold uppercase not-italic block mb-2">Medical Examiner's Notes:</span>
                "The trauma was incapacitating. The victim was struck from behind with immense force, rendering her instantly unconscious before being pushed into the water. The lack of struggle marks on the body suggests the assailant was highly efficient and likely a professional."
              </div>
            </div>

            <div className="mt-16 pt-8 border-t border-slate-300 flex justify-between items-end relative z-10">
              <div className="text-center">
                <div className="w-32 h-12 border-b border-slate-400 mb-2"></div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Investigating Officer</span>
              </div>
              <div className="text-center">
                <div className="w-40 h-12 border-b border-slate-400 mb-2 flex items-end justify-center pb-1">
                  <span className="font-serif italic text-2xl text-blue-900">Dr. H. Reddy</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Chief Medical Examiner</span>
              </div>
            </div>
            
            <div className="absolute bottom-4 right-4 opacity-10 rotate-[-15deg] pointer-events-none">
              <div className="border-4 border-red-800 text-red-800 p-2 text-4xl font-black uppercase tracking-widest">CONFIDENTIAL</div>
            </div>
          </div>
        ) : clue.id === "e_cab_log" ? (
          <div className="bg-white text-black p-8 rounded shadow-2xl font-mono mb-8 border-l-8 border-yellow-400">
            <div className="flex justify-between items-start border-b border-black/10 pb-4 mb-6">
              <div>
                <h4 className="text-xl font-black uppercase">CITY-CAB — TRIP RECORD</h4>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-bold uppercase">Driver ID</p>
                <p className="text-sm font-black">4471</p>
              </div>
            </div>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-black/5 pb-2">
                <span className="font-bold">Date:</span>
                <span>Jan 5</span>
              </div>
              <div className="flex justify-between border-b border-black/5 pb-2">
                <span className="font-bold">Pickup:</span>
                <span>Whitefield Tech Park Gate 3</span>
              </div>
              <div className="flex justify-between border-b border-black/5 pb-2">
                <span className="font-bold">Drop:</span>
                <span>Koramangala Dental Clinic</span>
              </div>
              <div className="flex justify-between border-b border-black/5 pb-2">
                <span className="font-bold">Duration:</span>
                <span>34 min</span>
              </div>
              <div className="flex justify-between border-b border-black/5 pb-2">
                <span className="font-bold">Passenger Name:</span>
                <span>S. Nath</span>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-black/10 text-xs text-gray-500 italic">
              Passenger rating: 4.1 — No notes.
            </div>
          </div>
        ) : clue.id === "e_anish_profile" ? (
          <div className="bg-slate-50 text-slate-900 p-8 md:p-12 rounded shadow-2xl font-serif mb-8 border border-slate-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-amber-600"></div>
            <div className="flex items-center gap-6 mb-8 border-b border-slate-300 pb-8">
              <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                <User size={48} className="text-slate-400" />
              </div>
              <div>
                <h4 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-slate-900">Anish Ambedkar</h4>
                <p className="text-sm font-bold tracking-widest mt-1 uppercase text-amber-700">Chairman, Amber Group of Companies</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Estimated Net Worth</span>
                <span className="font-bold text-xl">₹480Cr <span className="text-sm font-normal text-slate-500">(Forbes India, 2023)</span></span>
              </div>
            </div>
            <div className="mt-12 pt-6 border-t border-slate-300 text-[10px] text-slate-500 uppercase tracking-wider">
              Note: SEBI preliminary query filed 2019 — matter lapsed, no charges.
            </div>
          </div>
        ) : clue.id === "e_lottery_audit" ? (
          <div className="bg-orange-50 text-orange-950 p-8 md:p-12 rounded shadow-2xl font-mono mb-8 border-2 border-orange-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 bg-orange-600 text-white text-[10px] font-bold uppercase -rotate-45 translate-x-8 -translate-y-4 px-12">AUDIT FLAG</div>
            <div className="text-center border-b border-orange-200 pb-6 mb-8">
              <h4 className="text-xl font-black uppercase tracking-widest">Internal Audit Extract</h4>
              <p className="text-[10px] font-bold uppercase mt-1 opacity-70 tracking-widest">Karnataka State Lottery Board</p>
            </div>
            
            <div className="space-y-6 text-xs md:text-sm">
              <div className="grid grid-cols-2 gap-4 border-b border-orange-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase opacity-60 block mb-1">Purchasing Entity</span>
                  <span className="font-bold">Shree Vedanta Distributors</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase opacity-60 block mb-1">GST Number</span>
                  <span className="font-bold">29AADVS8821B1Z3</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase opacity-60 block mb-2">Transaction Details</span>
                <div className="bg-white/50 p-4 rounded border border-orange-100 space-y-2">
                  <div className="flex justify-between">
                    <span>Batch #88214</span>
                    <span className="font-bold">₹ 1,40,00,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Batch #88217</span>
                    <span className="font-bold">₹ 1,40,00,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Batch #88219</span>
                    <span className="font-bold">₹ 1,40,00,000</span>
                  </div>
                  <div className="pt-2 border-t border-orange-200 flex justify-between text-orange-700 font-black">
                    <span>TOTAL</span>
                    <span>₹ 4,20,00,000</span>
                  </div>
                </div>
              </div>

              <div className="bg-orange-100 p-4 rounded border border-orange-200 text-orange-900 italic">
                <span className="text-[10px] font-bold uppercase not-italic block mb-1">Auditor's Note:</span>
                "Bulk purchase by non-retail entity. Transaction flagged for review. The total amount matches the jackpot prize exactly. Investigating potential money laundering or pre-arranged win."
              </div>
            </div>
          </div>
        ) : clue.id === "e_shell_reg" ? (
          <div className="bg-stone-50 text-stone-900 p-8 md:p-12 rounded shadow-2xl font-serif mb-8 border-4 border-double border-stone-300 relative overflow-hidden">
            <div className="text-center border-b-2 border-stone-800 pb-6 mb-8">
              <div className="flex justify-center mb-4 opacity-80">
                <div className="w-16 h-16 border-2 border-stone-800 rounded-full flex items-center justify-center">
                  <span className="text-[8px] font-bold text-center leading-tight">GOVT OF<br/>INDIA</span>
                </div>
              </div>
              <h4 className="text-xl md:text-2xl font-black uppercase tracking-widest text-stone-900">Ministry of Corporate Affairs</h4>
              <p className="text-sm font-bold tracking-widest mt-2 uppercase text-stone-700">Certificate of Incorporation</p>
            </div>
            
            <div className="space-y-6 text-sm leading-relaxed">
              <p className="italic text-center mb-8">"I hereby certify that <span className="font-bold not-italic">SHREE VEDANTA DISTRIBUTORS PRIVATE LIMITED</span> is this day incorporated under the Companies Act, 2013..."</p>
              
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 border-y border-stone-200 py-6">
                <div>
                  <span className="text-[10px] font-bold uppercase text-stone-500 block mb-1">CIN</span>
                  <span className="font-mono font-bold">U51909KA2024PTC123456</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-stone-500 block mb-1">Registration Date</span>
                  <span className="font-bold">14-Oct-2024</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-stone-500 block mb-1">Registered Office</span>
                  <span className="font-bold">Mangaluru, Karnataka</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-stone-500 block mb-1">GSTIN</span>
                  <span className="font-mono font-bold">29AADVS8821B1Z3</span>
                </div>
              </div>

              <div className="bg-stone-100 p-4 rounded border border-stone-200">
                <h5 className="text-xs font-black uppercase tracking-widest mb-3 text-stone-700">Director Details</h5>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-stone-500">Nominee Director</p>
                    <p className="font-bold">Gopal Krishna Rao</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase text-stone-500">Age</p>
                    <p className="font-bold">71</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-stone-200">
                  <p className="text-[10px] font-bold uppercase text-stone-500">Beneficial Ownership</p>
                  <p className="font-bold text-red-800">[REDACTED BY ORDER]</p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-stone-200 text-[8px] text-stone-400 uppercase tracking-widest leading-relaxed">
                * This document is a certified true copy. Beneficial ownership details are subject to verification via Form MGT-7. 
                Associated PAN for primary signatory: <span className="font-bold">AADCN4471C</span>. 
                Any unauthorized disclosure is punishable under Section 447 of the Companies Act.
              </div>
            </div>

            <div className="mt-12 flex justify-end">
              <div className="text-center">
                <div className="w-40 h-1 border-b border-stone-400 mb-2"></div>
                <span className="text-[10px] uppercase font-bold text-stone-500">Registrar of Companies</span>
              </div>
            </div>
          </div>
        ) : clue.id === "e_amber_filing" ? (
          <div className="bg-slate-50 text-slate-900 p-8 md:p-12 rounded shadow-2xl font-serif mb-8 border-t-8 border-amber-600 relative overflow-hidden">
            <div className="flex justify-between items-start mb-10 border-b border-slate-200 pb-6">
              <div>
                <h4 className="text-2xl font-black uppercase tracking-tighter text-amber-700">Amber Group</h4>
                <p className="text-[10px] font-bold uppercase text-slate-500">Corporate Filings — Form MGT-7</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase text-slate-500">Filing Date</p>
                <p className="text-sm font-bold">12-Feb-2026</p>
              </div>
            </div>

            <div className="space-y-8 text-sm leading-relaxed">
              <div className="bg-amber-50 p-6 rounded border border-amber-100">
                <h5 className="text-xs font-black uppercase tracking-widest mb-4 text-amber-800">Board Resolution Extract</h5>
                <p className="italic mb-4">"Resolved that the company shall proceed with the strategic acquisition of 100% equity in <span className="font-bold not-italic">Shree Vedanta Distributors</span> for a consideration of ₹4.20Cr..."</p>
                <div className="flex justify-between text-[10px] font-bold uppercase text-amber-700">
                  <span>Resolution Date: Dec 28, 2025</span>
                  <span>Meeting ID: AMB-BR-2025-12</span>
                </div>
              </div>

              <div>
                <h5 className="text-xs font-black uppercase tracking-widest border-b border-slate-300 pb-2 mb-4">Shareholding Pattern Changes</h5>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded border border-slate-200">
                    <span className="font-bold">Anish Ambedkar</span>
                    <span className="text-emerald-600 font-bold">+12.5% (via Indirect Holding)</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded border border-slate-200">
                    <span className="font-bold">Public Float</span>
                    <span className="text-red-600 font-bold">-8.2%</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-100 p-4 border-l-4 border-amber-600 italic text-slate-600">
                <span className="text-[10px] font-bold uppercase not-italic block mb-2">Auditor's Note:</span>
                "The acquisition price exactly matches the Karnataka State Lottery jackpot amount. The timing of the board resolution (Dec 28) precedes the lottery draw (Jan 11), suggesting prior knowledge or a pre-arranged transfer mechanism."
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-200 text-[10px] text-slate-400 uppercase tracking-widest text-center">
              Digitally Signed by Satish Nath (CA) — 12-Feb-2026 14:22:10
            </div>
          </div>
        ) : (clue.id === "e_gowda_pharma" || clue.id === "e_jatin_record") ? (
          <div className="space-y-6">
            {clue.id === "e_gowda_pharma" && showGowdaGame ? (
              <div className="h-[600px]">
                <GowdaPharmaGame onSolved={() => {
                  setGowdaSolved(true);
                  setShowGowdaGame(false);
                }} />
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-4 mb-6 md:mb-8">
                  <div>
                    <span className="text-[8px] md:text-[10px] font-bold text-muted-grey uppercase block mb-1">Location</span>
                    <span className="text-base md:text-lg font-extrabold">{clue.location}</span>
                  </div>
                </div>

                <div className="space-y-8 mb-8">
                  {clue.description.includes('--- INTERROGATION TRANSCRIPT ---') ? (
                    <>
                      <div className="space-y-4">
                        <span className="text-[8px] md:text-[10px] font-bold text-muted-grey uppercase block">Analysis Report</span>
                        <p className="text-muted-grey text-sm md:text-lg font-light leading-relaxed italic">
                          {clue.description.split('--- INTERROGATION TRANSCRIPT ---')[0].trim()}
                        </p>
                      </div>
                      
                      <TranscriptView 
                        transcript={clue.description.split('--- INTERROGATION TRANSCRIPT ---')[1].trim()} 
                        suspectName={clue.id === "e_gowda_pharma" ? "ANISH" : "JATIN"}
                        date={clue.id === "e_gowda_pharma" ? "FEB 02" : "FEB 01"}
                      />
                    </>
                  ) : (
                    <div className="space-y-4">
                      <span className="text-[8px] md:text-[10px] font-bold text-muted-grey uppercase block">Analysis Report</span>
                      <p className="text-muted-grey text-sm md:text-lg font-light leading-relaxed italic">
                        {clue.description}
                      </p>
                    </div>
                  )}
                </div>

                {clue.id === "e_gowda_pharma" && (
                  !gowdaSolved ? (
                    <button 
                      onClick={() => setShowGowdaGame(true)}
                      className="w-full py-6 bg-amber-500 text-black font-black rounded-2xl hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-3 uppercase tracking-tighter text-xl"
                    >
                      <TrendingUp size={24} /> RECONSTRUCT TIMELINE
                    </button>
                  ) : (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl">
                      <h4 className="text-emerald-500 font-black uppercase mb-2 flex items-center gap-2">
                        <CheckCircle size={20} className="text-emerald-500" /> TIMELINE RECONSTRUCTED
                      </h4>
                      <p className="text-sm leading-relaxed text-muted-grey">
                        The sequence is clear: Anish used Aruna's cab rides to coordinate with Satish Nath. 
                        The shell companies (Shree Vedanta) were registered months in advance, but the actual 
                        buying spree triggered the spike just before the acquisition announcement. 
                        The lottery win on Jan 11 was the payout — 
                        a pre-arranged jackpot used to move ₹4.2Cr of "clean" money to Aruna for her silence and cooperation.
                      </p>
                    </div>
                  )
                )}
              </>
            )}
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 mb-6 md:mb-8">
              <div>
                <span className="text-[8px] md:text-[10px] font-bold text-muted-grey uppercase block mb-1">Location</span>
                <span className="text-base md:text-lg font-extrabold">{clue.location}</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <span className="text-[8px] md:text-[10px] font-bold text-muted-grey uppercase block">Analysis Report</span>
              <p className="text-muted-grey text-sm md:text-lg font-light leading-relaxed italic">
                {clue.unlocked ? clue.description : "This data is currently encrypted or inaccessible. Specialized tools required."}
              </p>
            </div>

            {clue.id === "e_satish_owner" && finalGameSolved && (
              <button 
                onClick={onShadowLedgerStart}
                className="w-full py-6 bg-crimson text-white font-black rounded-2xl hover:bg-crimson/80 transition-all shadow-xl shadow-crimson/20 flex items-center justify-center gap-3 uppercase tracking-tighter text-xl"
              >
                <Smartphone size={24} /> ACCESS SHADOW LEDGER
              </button>
            )}
          </>
        )}

        {clue.requiresPincode && !clue.sent && (
          <div className="bg-crimson/5 border border-crimson/20 p-6 rounded-2xl mb-8">
            <div className="flex items-center gap-3 mb-4">
              <MapPin size={18} className="text-crimson" />
              <span className="text-xs font-bold uppercase tracking-widest">Destination: Columbia Asia Hebbal</span>
            </div>
            <p className="text-xs text-muted-grey mb-4">Enter the 6-digit hospital pincode to authorize the transfer of this document.</p>
            <div className="flex flex-col gap-2">
              <input 
                type="text" 
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter 6-digit PIN"
                className={`bg-obsidian border ${error ? 'border-crimson' : 'border-white/10'} rounded-xl px-4 py-3 text-center tracking-[0.5em] font-mono text-lg focus:outline-none focus:border-crimson transition-all`}
              />
              {error && <span className="text-[10px] text-crimson font-bold uppercase text-center">Invalid Pincode. Authorization Denied.</span>}
            </div>
          </div>
        )}

        {clue.sent && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl mb-8 flex items-center gap-3 text-emerald-500">
            <Shield size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">Document Successfully Transferred</span>
          </div>
        )}

        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-end items-center gap-4">
          {subClueId && !inventory.includes(subClueId) && (subClueId !== "e_cibil" || cibilStep === "report") && (
            <button 
              onClick={() => onUnlock(subClueId)}
              className="w-full sm:w-auto px-10 py-4 bg-crimson text-white font-extrabold rounded-xl hover:bg-crimson/90 transition-all shadow-lg shadow-crimson/20 flex items-center justify-center gap-2"
            >
              ADD TO EVIDENCE <Plus size={18} />
            </button>
          )}

          {clue.requiresPincode && !clue.sent ? (
            <button 
              onClick={handleSend}
              className="w-full sm:w-auto px-10 py-4 bg-crimson text-white font-extrabold rounded-xl hover:bg-crimson/90 transition-all shadow-lg shadow-crimson/20 flex items-center justify-center gap-2"
            >
              AUTHORIZE & SEND <ChevronRight size={18} />
            </button>
          ) : (
            <button 
              onClick={onClose}
              className="w-full sm:w-auto px-10 py-4 bg-white/5 text-muted-grey font-extrabold rounded-xl hover:bg-white/10 transition-all"
            >
              CLOSE
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

