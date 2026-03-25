import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, MapPin, Shield, Plus, ChevronRight, 
  CheckCircle, TrendingUp, FileText, AlertCircle, Smartphone 
} from 'lucide-react';
import { Evidence } from '../types';
import { TranscriptView } from './TranscriptView';
import { GowdaPharmaGame } from './GowdaPharmaGame';

interface ClueModalProps {
  clue: Evidence;
  allEvidence: Evidence[];
  inventory: string[];
  gowdaSolved: boolean;
  showGowdaGame: boolean;
  setShowGowdaGame: (show: boolean) => void;
  setGowdaSolved: (solved: boolean) => void;
  onClose: () => void;
  onUnlock: (id: string) => void;
  onSend: (id: string) => void;
  onAddEvidence: (e: Evidence) => void;
  onView: () => void;
  onShadowLedgerStart?: () => void;
  finalGameSolved?: boolean;
}

export const ClueModal: React.FC<ClueModalProps> = ({
  clue,
  allEvidence,
  inventory,
  gowdaSolved,
  showGowdaGame,
  setShowGowdaGame,
  setGowdaSolved,
  onClose,
  onUnlock,
  onSend,
  onAddEvidence,
  onView,
  onShadowLedgerStart,
  finalGameSolved,
}) => {
  const [pincode, setPincode] = useState('');
  const [panInput, setPanInput] = useState('');
  const [cibilStep, setCibilStep] = useState<'verify' | 'report'>('verify');
  const [subClueId, setSubClueId] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const handleSend = () => {
    if (pincode === clue.requiresPincode) {
      onSend(clue.id);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const handlePanVerify = () => {
    if (panInput.toUpperCase() === "ARUNAK8821") {
      setCibilStep('report');
      setSubClueId("e_cibil");
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-obsidian/95 backdrop-blur-xl overflow-y-auto"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="glass squircle max-w-3xl w-full my-auto p-6 md:p-10 border border-white/10 relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-crimson/20 rounded-2xl flex items-center justify-center text-crimson">
            <FileText size={24} />
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">{clue.title}</h3>
            <p className="text-[10px] text-muted-grey uppercase tracking-widest">Evidence File #{clue.id.split('_')[1]}</p>
          </div>
        </div>

        {clue.id === "e_lottery" ? (
          <div className="bg-orange-50 text-orange-900 p-8 md:p-12 rounded shadow-2xl font-serif mb-8 border-t-8 border-orange-600 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <div className="w-24 h-24 border-4 border-orange-900 rounded-full flex items-center justify-center rotate-12">
                <span className="text-xs font-bold text-center leading-tight">STATE<br/>LOTTERY</span>
              </div>
            </div>
            
            <div className="text-center border-b border-orange-200 pb-6 mb-8">
              <h4 className="text-xl md:text-2xl font-black uppercase tracking-widest text-orange-800">Karnataka State Lottery</h4>
              <p className="text-sm font-bold tracking-widest mt-2 uppercase text-orange-600">Official Result Sheet — Jan 11</p>
            </div>
            
            <div className="space-y-6 text-sm">
              <div className="flex justify-between items-center bg-white/50 p-4 rounded border border-orange-100">
                <div>
                  <span className="text-[10px] font-bold uppercase opacity-60 block mb-1">Winning Ticket</span>
                  <span className="text-2xl font-black tracking-tighter">#88219</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase opacity-60 block mb-1">Prize Amount</span>
                  <span className="text-2xl font-black tracking-tighter text-emerald-700">₹ 4.20 Cr</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase opacity-60 block mb-1">Draw Date</span>
                  <span className="font-bold">11-Jan-2026</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase opacity-60 block mb-1">Series</span>
                  <span className="font-bold">KA-88</span>
                </div>
              </div>

              <div className="bg-orange-100 p-4 rounded border border-orange-200 text-orange-900 italic">
                <span className="text-[10px] font-bold uppercase not-italic block mb-1">Note:</span>
                "The jackpot was claimed within 24 hours. The claimant's identity was protected under privacy laws at the time of payout."
              </div>
            </div>
          </div>
        ) : clue.id === "e_cibil" ? (
          <div className="space-y-6">
            {cibilStep === 'verify' ? (
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl text-center">
                <Shield size={48} className="text-crimson mx-auto mb-6" />
                <h4 className="text-xl font-bold mb-4">Secure Credit Access</h4>
                <p className="text-muted-grey text-sm mb-8 leading-relaxed">
                  To access the full CIBIL report for Aruna Kumari, please verify her PAN number. 
                  (Hint: Check her personal documents or ID cards)
                </p>
                <div className="max-w-xs mx-auto space-y-4">
                  <input 
                    type="text" 
                    value={panInput}
                    onChange={(e) => setPanInput(e.target.value)}
                    placeholder="ENTER PAN (10 CHARS)"
                    className={`w-full bg-obsidian border ${error ? 'border-crimson' : 'border-white/10'} rounded-xl px-4 py-4 text-center tracking-widest font-mono text-lg focus:outline-none focus:border-crimson transition-all`}
                  />
                  <button 
                    onClick={handlePanVerify}
                    className="w-full py-4 bg-crimson text-white font-black rounded-xl hover:bg-crimson/90 transition-all shadow-lg shadow-crimson/20 uppercase tracking-widest text-sm"
                  >
                    VERIFY & DECRYPT
                  </button>
                  {error && <p className="text-[10px] text-crimson font-bold uppercase">Invalid PAN. Access Denied.</p>}
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 text-slate-900 p-8 md:p-12 rounded shadow-2xl font-serif mb-8 border-t-8 border-slate-800 relative overflow-hidden">
                <div className="flex justify-between items-start mb-10 border-b border-slate-200 pb-6">
                  <div>
                    <h4 className="text-2xl font-black uppercase tracking-tighter text-slate-800">CIBIL™ Report</h4>
                    <p className="text-[10px] font-bold uppercase text-slate-500">TransUnion CIBIL Limited — Confidential</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase text-slate-500">Report Date</p>
                    <p className="text-sm font-bold">14-Feb-2026</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center gap-8">
                    <div className="w-32 h-32 rounded-full border-8 border-red-500 flex flex-col items-center justify-center bg-white">
                      <span className="text-3xl font-black text-red-600">420</span>
                      <span className="text-[8px] font-bold uppercase text-slate-400">Score</span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-red-600 uppercase tracking-widest">Risk Category: VERY HIGH</p>
                      <p className="text-xs text-slate-600 leading-relaxed">Multiple defaults on personal loans (₹12L) and credit cards (₹4.5L). Legal notices served by three different banks in 2025.</p>
                    </div>
                  </div>

                  <div className="bg-slate-100 p-4 rounded border border-slate-200">
                    <h5 className="text-xs font-black uppercase tracking-widest mb-3 text-slate-700">Recent Activity</h5>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between border-b border-slate-200 pb-1">
                        <span>HDFC Personal Loan</span>
                        <span className="text-red-600 font-bold">DEFAULT (90+ DPD)</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-1">
                        <span>ICICI Credit Card</span>
                        <span className="text-red-600 font-bold">WRITTEN OFF</span>
                      </div>
                      <div className="flex justify-between">
                        <span>SBI Gold Loan</span>
                        <span className="text-red-600 font-bold">AUCTION NOTICE</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : clue.id === "e_lottery_audit" ? (
          <div className="bg-orange-50 text-orange-900 p-8 md:p-12 rounded shadow-2xl font-serif mb-8 border-t-8 border-orange-600 relative overflow-hidden">
            <div className="text-center border-b border-orange-200 pb-6 mb-8">
              <h4 className="text-xl md:text-2xl font-black uppercase tracking-widest text-orange-800">Lottery Audit Extract</h4>
              <p className="text-sm font-bold tracking-widest mt-2 uppercase text-orange-600">Karnataka State Lottery Board — Audit Division</p>
            </div>
            
            <div className="space-y-6 text-sm">
              <div className="grid grid-cols-2 gap-4 border-b border-orange-200 pb-6">
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
        ) : clue.id === "e_gowda_pharma" ? (
          <div className="space-y-6">
            {!showGowdaGame ? (
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
                        suspectName="ANISH"
                        date="FEB 02"
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

                {!gowdaSolved ? (
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
                )}
              </>
            ) : (
              <div className="h-[600px]">
                <GowdaPharmaGame onSolved={() => {
                  setGowdaSolved(true);
                  setShowGowdaGame(false);
                }} />
              </div>
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
};
