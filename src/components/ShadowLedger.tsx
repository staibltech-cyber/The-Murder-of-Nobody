import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, 
  Lock, 
  Unlock, 
  MessageSquare, 
  Search, 
  FileText, 
  Shield, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Globe, 
  Cpu, 
  Maximize2,
  Scan,
  Share2,
  Network,
  User,
  ArrowRight,
  Fingerprint
} from 'lucide-react';

interface ShadowLedgerProps {
  page: number;
  setPage: (page: number) => void;
  onComplete: () => void;
  inventory: string[];
  onAddEvidence: (e: any) => void;
  onClose: () => void;
}

export default function ShadowLedger({ 
  page, 
  setPage, 
  onComplete, 
  inventory, 
  onAddEvidence,
  onClose
}: ShadowLedgerProps) {
  const [passcode, setPasscode] = useState('');
  const [aesCode, setAesCode] = useState('');
  const [aesDecrypted, setAesDecrypted] = useState(false);
  const [dinSearch, setDinSearch] = useState('00918545');
  const [dinVerified, setDinVerified] = useState(true);
  const [prakashName, setPrakashName] = useState('');
  const [chitAnswer, setChitAnswer] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhanceProgress, setEnhanceProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handlePasscodeSubmit = () => {
    if (passcode === '141024') {
      setPage(2);
      setError(null);
    } else {
      setError('INVALID PASSCODE. HINT: CHECK SHREE VEDANTA REGISTRATION DATE.');
      setPasscode('');
    }
  };

  const handleAesSubmit = () => {
    if (aesCode.toUpperCase() === 'AES256') {
      setAesDecrypted(true);
      setError(null);
      // Auto-advance after a short delay to let them see the message
      setTimeout(() => {
        setPage(3);
      }, 3000);
    } else {
      setError('INVALID CIPHER. CLUE: THE CHAT IS PROTECTED BY A MILITARY-GRADE ENCRYPTION. SEARCH THE WEB FOR THE ONLY CIPHER APPROVED BY THE NSA FOR "TOP SECRET" DATA.');
      setAesCode('');
    }
  };

  const handleDinSubmit = () => {
    // DIN is pre-filled now, so this just confirms
    setDinVerified(true);
    setError(null);
  };

  const handleNameSubmit = () => {
    const normalized = prakashName.toLowerCase().trim();
    if (normalized.includes('prakash') && normalized.includes('tiwari')) {
      setPage(4);
      setError(null);
    } else {
      setError('IDENTITY NOT VERIFIED. SEARCH THE WEB FOR THE REAL NAME LINKED TO THIS DIN.');
    }
  };

  const handleEnhance = () => {
    setIsEnhancing(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setEnhanceProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsEnhancing(false);
      }
    }, 100);
  };

  const handleChitSubmit = () => {
    const normalized = chitAnswer.toLowerCase().trim();
    if (normalized.includes('sunday ticket') || normalized.includes('lottery ticket')) {
      setPage(5);
      setError(null);
    } else {
      setError('INCORRECT. WHAT WAS PROMISED TO ARUNA AS A PAYOFF?');
    }
  };

  const renderPage1 = () => (
    <div className="flex flex-col items-center justify-center min-h-full py-4 space-y-6">
      <div className="w-full max-w-sm text-center space-y-3 px-4">
        <h4 className="text-xl font-black text-crimson uppercase tracking-tighter">Device Locked</h4>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Rajan Kumar's burner phone is encrypted. To unlock it, you need the 6-digit passcode.
          <span className="block mt-2 font-bold text-white">Hint: The passcode is the Date of Registration of Shree Vedanta Distributors (DDMMYY).</span>
        </p>
      </div>

      <div className="w-64 h-[420px] bg-zinc-900 rounded-[2.5rem] border-8 border-zinc-800 shadow-2xl overflow-hidden relative shrink-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-zinc-800 rounded-b-xl z-10" />
        
        <div className="h-full flex flex-col items-center justify-center p-6 space-y-6 bg-gradient-to-b from-zinc-900 to-black">
          <div className="text-center space-y-1">
            <Smartphone className="w-10 h-10 text-crimson mx-auto mb-2" />
            <h3 className="text-sm font-black text-white uppercase tracking-tighter">Enter Passcode</h3>
          </div>

          <div className="w-full space-y-6">
            <div className="flex justify-center gap-2">
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full border-2 ${passcode.length > i ? 'bg-crimson border-crimson' : 'border-zinc-700'}`}
                />
              ))}
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((num) => (
                <button
                  key={num}
                  onClick={() => passcode.length < 6 && setPasscode(prev => prev + num)}
                  className="w-12 h-12 rounded-full bg-zinc-800/50 text-white font-bold hover:bg-zinc-700 active:scale-95 transition-all flex items-center justify-center text-lg"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button 
              onClick={() => setPasscode('')}
              className="text-[10px] text-zinc-500 uppercase tracking-widest hover:text-white transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm px-4 space-y-4">
        {error && <p className="text-xs text-crimson font-bold text-center animate-pulse">{error}</p>}
        <button 
          onClick={handlePasscodeSubmit}
          className="w-full py-4 bg-crimson text-white font-black rounded-2xl hover:bg-crimson/80 transition-all uppercase tracking-widest text-sm shadow-lg shadow-crimson/20"
        >
          Unlock Device
        </button>
      </div>
    </div>
  );

  const renderPage2 = () => (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-800 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
            <MessageSquare className="text-emerald-500" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-tighter">WhatsApp Decryptor</h3>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Secure Communication Protocol</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-zinc-800 rounded-full self-start md:self-center">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-500 uppercase">VPN Active</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-6 py-4">
        <div className="w-full max-w-lg text-center space-y-4">
          <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl space-y-4">
            <Shield className="w-12 h-12 text-emerald-500 mx-auto" />
            <p className="text-sm text-zinc-300 italic">
              "The chat is locked behind a military-grade encryption. You'll need to search the web for the only cipher approved by the NSA for 'Top Secret' data to find the key."
            </p>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Enter Encryption Standard</label>
            <div className="flex justify-center">
              <input 
                type="text"
                value={aesCode}
                onChange={(e) => setAesCode(e.target.value.toUpperCase())}
                placeholder="XXXXXX"
                maxLength={6}
                className="w-full max-w-[240px] bg-black border-2 border-zinc-800 rounded-xl px-4 py-4 text-center font-mono text-2xl tracking-[0.5em] text-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            {error && <p className="text-xs text-crimson font-bold animate-pulse">{error}</p>}
          </div>
        </div>

        <div className="w-full max-w-2xl min-h-[200px] bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 overflow-hidden relative flex flex-col justify-center">
          {!aesDecrypted ? (
            <>
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="text-center space-y-2">
                  <Lock className="w-8 h-8 text-zinc-500 mx-auto" />
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Encrypted Payload</p>
                </div>
              </div>
              
              <div className="space-y-4 opacity-20 select-none">
                <div className="flex justify-start"><div className="bg-zinc-800 p-3 rounded-2xl rounded-tl-none w-2/3 h-12" /></div>
                <div className="flex justify-end"><div className="bg-emerald-600/20 p-3 rounded-2xl rounded-tr-none w-1/2 h-8" /></div>
                <div className="flex justify-start"><div className="bg-zinc-800 p-3 rounded-2xl rounded-tl-none w-3/4 h-16" /></div>
              </div>
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex justify-start">
                <div className="bg-zinc-800 p-4 rounded-2xl rounded-tl-none max-w-[80%] shadow-lg">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Anish Ambedkar</p>
                  <p className="text-white font-medium">Aruna Bhanjara, 28.</p>
                </div>
              </div>
              <div className="text-center pt-4">
                <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest animate-pulse">Decryption Successful • Redirecting...</p>
              </div>
            </motion.div>
          )}
        </div>

        {!aesDecrypted && (
          <button 
            onClick={handleAesSubmit}
            className="w-full max-w-sm py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-500 transition-all uppercase tracking-widest text-sm shadow-lg shadow-emerald-500/20"
          >
            Decrypt Chat
          </button>
        )}
      </div>
    </div>
  );

  const renderPage3 = () => (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
            <Globe className="text-blue-500" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-tighter">MCA Advanced Portal</h3>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Ministry of Corporate Affairs</p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-6">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 md:p-10 space-y-8 min-h-[400px]">
          <div className="space-y-4">
            <h4 className="text-blue-400 font-black text-xl tracking-tighter uppercase">Identity Verification</h4>
            <p className="text-sm text-zinc-300 leading-relaxed max-w-2xl">
              We have identified a DIN linked to Rajan Kumar: <span className="text-blue-400 font-black tracking-widest">00918545</span>.
              This DIN is registered to a shell entity, and 'Rajan Kumar' is confirmed to be an alias.
            </p>
            
            <div className="p-8 bg-black/50 rounded-3xl border-2 border-zinc-800 space-y-6 shadow-2xl">
              <div className="space-y-3">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest block">
                  Search the web for the real name linked to DIN 00918545
                </label>
                <input 
                  type="text"
                  value={prakashName}
                  onChange={(e) => setPrakashName(e.target.value)}
                  placeholder="Enter Real Name (e.g. First Last)"
                  className="w-full bg-black border-2 border-zinc-800 rounded-2xl px-6 py-5 text-lg text-white focus:border-blue-500 outline-none transition-all uppercase font-black tracking-tight"
                />
              </div>
              {error && <p className="text-sm text-crimson font-bold animate-pulse">{error}</p>}
              
              <button 
                onClick={handleNameSubmit}
                className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 transition-all uppercase tracking-widest text-sm shadow-lg shadow-blue-500/20"
              >
                Verify Identity
              </button>
            </div>
          </div>

          <AnimatePresence>
            {prakashName.toLowerCase().trim().includes('prakash') && prakashName.toLowerCase().trim().includes('tiwari') && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 bg-crimson/10 rounded-[2.5rem] border-2 border-crimson/30 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-2xl"
              >
                <div className="w-16 h-16 rounded-2xl bg-crimson/20 flex items-center justify-center shrink-0 shadow-lg">
                  <AlertTriangle className="text-crimson w-8 h-8" />
                </div>
                <div className="space-y-3 text-center md:text-left">
                  <h5 className="text-2xl font-black text-crimson uppercase tracking-tighter">Identity Confirmed: Prakash Tiwari</h5>
                  <p className="text-base text-zinc-300 leading-relaxed">
                    Intelligence records reveal that <span className="text-white font-bold">Prakash Tiwari</span> is a known hitman and contract killer. 
                    He has been operating under the alias 'Rajan Kumar' to infiltrate corporate circles and eliminate liabilities.
                  </p>
                  <div className="pt-2">
                    <span className="inline-block px-4 py-2 bg-crimson text-white text-xs font-black rounded-xl uppercase tracking-widest shadow-lg">High Risk Subject • Hitman</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  const renderPage4 = () => (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
            <Scan className="text-purple-500" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-tighter">The Crumpled Chit Scan</h3>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Evidence Analysis</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="relative aspect-square max-w-[600px] mx-auto bg-zinc-900 rounded-[2.5rem] border-4 border-zinc-800 overflow-hidden shadow-2xl group flex flex-col items-center justify-center p-8 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center border-2 border-purple-500/20">
              <Globe className="text-purple-500 w-10 h-10" />
            </div>
            
            <div className="space-y-2">
              <h4 className="text-xl font-black text-white uppercase tracking-tighter">External Evidence Link</h4>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
                The forensic scan is hosted on a secure external server. Please copy and paste the link below into a <span className="text-purple-400 font-bold">new tab</span> to analyze the evidence without losing your current progress.
              </p>
            </div>

            <div className="w-full space-y-3">
              <div className="p-4 bg-black border-2 border-zinc-800 rounded-2xl font-mono text-xs text-purple-400 break-all select-all">
                https://ibb.co/7xLfrt1h
              </div>
              <a 
                href="https://ibb.co/7xLfrt1h" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-black rounded-xl hover:bg-purple-500 transition-all uppercase tracking-widest text-[10px] shadow-lg shadow-purple-500/20"
              >
                Open Evidence <ArrowRight size={14} />
              </a>
            </div>
          </div>

          <div className="p-6 bg-purple-500/5 border border-purple-500/20 rounded-2xl">
            <p className="text-[11px] text-zinc-400 leading-relaxed text-center">
              <span className="text-purple-400 font-bold uppercase block mb-1">Forensic Note:</span> 
              The chit was found near the crime scene. It contains direct instructions from 'A.A.' regarding the Gowda Pharma acquisition.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-96 space-y-6">
          <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] space-y-6 shadow-xl">
            <div className="space-y-2">
              <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                <FileText size={16} className="text-purple-500" /> Case Analysis
              </h4>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Analyze the deciphered chit. What specific item was Aruna promised as a payoff for her cooperation?
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Your Findings</label>
                <input 
                  type="text"
                  value={chitAnswer}
                  onChange={(e) => setChitAnswer(e.target.value)}
                  placeholder="Enter Key Phrase"
                  className="w-full bg-black border-2 border-zinc-800 rounded-xl px-4 py-4 text-sm text-white focus:border-purple-500 outline-none transition-all font-bold"
                />
              </div>
              {error && <p className="text-xs text-crimson font-bold animate-pulse">{error}</p>}
              <button 
                onClick={handleChitSubmit}
                className="w-full py-4 bg-purple-600 text-white font-black rounded-xl hover:bg-purple-500 transition-all uppercase tracking-widest text-xs shadow-lg shadow-purple-500/20"
              >
                Submit Findings
              </button>
            </div>
          </div>

          <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              <span className="text-zinc-500 font-bold uppercase block mb-1">Intelligence Note:</span> 
              The 'Sunday Ticket' refers to the winning lottery batch. This confirms the lottery was a pre-meditated payoff mechanism orchestrated by the Amber Group.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPage5 = () => (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
            <Network className="text-amber-500" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-tighter">The Conspiracy Map</h3>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Final Case Synthesis</p>
          </div>
        </div>
      </div>

      <div className="flex-1 relative bg-zinc-900/20 rounded-[2.5rem] border border-zinc-800 p-6 md:p-10">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #f59e0b 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center h-full">
          {/* Column 1: The Mastermind */}
          <div className="space-y-8">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-amber-500/10 border-2 border-amber-500 rounded-3xl text-center space-y-3 shadow-xl shadow-amber-500/5"
            >
              <User className="w-10 h-10 text-amber-500 mx-auto" />
              <div>
                <h5 className="text-sm font-black text-white uppercase tracking-tight">Anish Ambedkar</h5>
                <p className="text-[9px] text-amber-500/70 font-bold uppercase tracking-widest">The Architect</p>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl text-center space-y-3 shadow-lg"
            >
              <FileText className="w-10 h-10 text-zinc-500 mx-auto" />
              <div>
                <h5 className="text-sm font-black text-white uppercase tracking-tight">The Chit</h5>
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest">Direct Instructions</p>
              </div>
            </motion.div>
          </div>

          {/* Column 2: The Connectors */}
          <div className="space-y-8">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-purple-500/10 border-2 border-purple-500 rounded-3xl text-center space-y-3 shadow-xl shadow-purple-500/5"
            >
              <Shield className="w-10 h-10 text-purple-500 mx-auto" />
              <div>
                <h5 className="text-sm font-black text-white uppercase tracking-tight">Satish Nath</h5>
                <p className="text-[9px] text-purple-500/70 font-bold uppercase tracking-widest">The Fixer (NathCorp)</p>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-crimson/10 border-2 border-crimson rounded-3xl text-center space-y-3 shadow-xl shadow-crimson/5"
            >
              <User className="w-10 h-10 text-crimson mx-auto" />
              <div>
                <h5 className="text-sm font-black text-white uppercase tracking-tight">Rajan Kumar*</h5>
                <p className="text-[9px] text-crimson/70 font-bold uppercase tracking-widest">The Inside Person</p>
              </div>
            </motion.div>
          </div>

          {/* Column 3: The Entities */}
          <div className="space-y-8">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-blue-500/10 border-2 border-blue-500 rounded-3xl text-center space-y-3 shadow-xl shadow-blue-500/5"
            >
              <Globe className="w-10 h-10 text-blue-500 mx-auto" />
              <div>
                <h5 className="text-sm font-black text-white uppercase tracking-tight">Shree Vedanta</h5>
                <p className="text-[9px] text-blue-500/70 font-bold uppercase tracking-widest">The Shell Entity</p>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-emerald-500/10 border-2 border-emerald-500 rounded-3xl text-center space-y-3 shadow-xl shadow-emerald-500/5"
            >
              <TrendingUp className="w-10 h-10 text-emerald-500 mx-auto" />
              <div>
                <h5 className="text-sm font-black text-white uppercase tracking-tight">Gowda Pharma</h5>
                <p className="text-[9px] text-emerald-500/70 font-bold uppercase tracking-widest">The Acquisition Target</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900/80 border border-zinc-800 p-6 md:p-8 rounded-[2.5rem] space-y-6 shadow-2xl">
        <div className="space-y-2">
          <h4 className="text-lg font-black text-white uppercase tracking-tighter">Case Synthesis Complete</h4>
          <p className="text-sm text-zinc-400 leading-relaxed">
            The evidence is undeniable. <span className="text-white font-bold">Anish Ambedkar</span> orchestrated a massive corporate heist using <span className="text-white font-bold">Satish Nath</span> as his legal fixer. 
            <span className="text-white font-bold">Rajan Kumar*</span> was the inside person who leaked the data for a promised lottery payoff, but was eliminated by <span className="text-white font-bold">Prakash Tiwari</span> when he became a liability.
          </p>
        </div>
        <button 
          onClick={onComplete}
          className="w-full py-5 bg-amber-600 text-white font-black rounded-2xl hover:bg-amber-500 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-lg shadow-amber-600/20"
        >
          Proceed to Final Interrogation <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-5xl h-[85vh] bg-zinc-950 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-3 md:px-8 py-3 md:py-6 bg-zinc-900/50 border-b border-white/5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-4 min-w-0">
            <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-2xl bg-crimson/20 flex items-center justify-center shrink-0">
              <Smartphone className="text-crimson w-4 h-4 md:w-6 md:h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm md:text-2xl font-black text-white uppercase tracking-tighter truncate">The Shadow Ledger</h2>
              <div className="hidden xs:flex items-center gap-2 overflow-hidden">
                <span className="text-[8px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-widest truncate">Case Phase: Final Trace</span>
                <div className="w-1 h-1 rounded-full bg-zinc-700 shrink-0" />
                <span className="text-[8px] md:text-[10px] font-bold text-crimson uppercase tracking-widest truncate">Evidence: e_satish_owner</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-6 shrink-0">
            <div className="hidden sm:flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((p) => (
                <div 
                  key={p}
                  className={`h-1.5 rounded-full transition-all duration-500 ${p <= page ? 'w-8 bg-crimson' : 'w-4 bg-zinc-800'}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-lg border border-white/5">
              <span className="text-[10px] font-black text-crimson">{page}</span>
              <span className="text-[10px] font-bold text-zinc-700">/</span>
              <span className="text-[10px] font-bold text-zinc-700">5</span>
            </div>
            <button 
              onClick={onClose}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-crimson/10 hover:bg-crimson/20 rounded-xl transition-all text-crimson hover:text-white border border-crimson/20 active:scale-95 shadow-lg shadow-crimson/5"
            >
              <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
              <X size={14} className="md:w-6 md:h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              {page === 1 && renderPage1()}
              {page === 2 && renderPage2()}
              {page === 3 && renderPage3()}
              {page === 4 && renderPage4()}
              {page === 5 && renderPage5()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Info */}
        <div className="px-8 py-4 bg-black/40 border-t border-white/5 flex justify-between items-center">
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">
            Progress Saved Automatically • Page {page} of 5
          </p>
          <div className="flex items-center gap-2 text-[10px] text-zinc-600 uppercase tracking-widest">
            <Fingerprint size={12} /> Biometric Authentication Active
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function TrendingUp({ size, className }: { size?: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
