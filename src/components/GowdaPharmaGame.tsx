import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, AlertCircle, CheckCircle2, Info, ArrowRight, Hash } from 'lucide-react';
import * as d3 from 'd3';

interface Card {
  id: string;
  number: number;
  title: string;
  hint: string;
  correctZoneId: string | null;
}

const CARDS: Card[] = [
  { id: 'c1', number: 1, title: 'Shell companies buy Gowda Pharma shares', hint: 'Massive volume spike detected', correctZoneId: 'z4' },
  { id: 'c2', number: 2, title: 'Anish meets Aruna in cab', hint: 'First contact recorded in City-Cab log', correctZoneId: 'z1' },
  { id: 'c3', number: 3, title: 'Amber Group acquisition announced', hint: 'Official NSE filing released', correctZoneId: 'z5' },
  { id: 'c4', number: 4, title: 'Aruna drives S. Nath to dentist', hint: 'Passenger "S. Nath" trip logged', correctZoneId: 'z2' },
  { id: 'c5', number: 5, title: 'Aruna resigns from call center', hint: 'Manyata Tech Park HR records exit', correctZoneId: 'z3' },
  { id: 'c6', number: 6, title: 'Aruna wins lottery — ₹4.2Cr', hint: 'Karnataka State Lottery results', correctZoneId: null }, // Distractor
];

const ZONES = [
  { id: 'z1', label: 'Point A', x: 10 },
  { id: 'z2', label: 'Point B', x: 25 },
  { id: 'z3', label: 'Point C', x: 40 },
  { id: 'z4', label: 'Point D', x: 60 },
  { id: 'z5', label: 'Point E', x: 90 },
];

interface GowdaPharmaGameProps {
  onSolved: () => void;
}

export const GowdaPharmaGame: React.FC<GowdaPharmaGameProps> = ({ onSolved }) => {
  const [inputs, setInputs] = useState<{ [key: string]: string }>({
    z1: '', z2: '', z3: '', z4: '', z5: ''
  });
  const [isSolved, setIsSolved] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [shakingZoneId, setShakingZoneId] = useState<string | null>(null);
  const chartRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Chart Dimensions (will be responsive)
  const [dimensions, setDimensions] = useState({ width: 800, height: 300 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        const isMobile = window.innerWidth < 768;
        setDimensions({ 
          width: Math.max(width - (isMobile ? 20 : 40), 300), 
          height: isMobile ? 200 : 300 
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;

    const { width, height } = dimensions;
    const margin = { 
      top: 20, 
      right: 20, 
      bottom: 40, 
      left: window.innerWidth < 768 ? 30 : 40 
    };

    const svg = d3.select(chartRef.current);
    svg.selectAll("*").remove();

    const x = d3.scaleTime()
      .domain([new Date(2026, 0, 1), new Date(2026, 1, 14)])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, 250])
      .range([height - margin.bottom, margin.top]);

    // Data points
    const data: [Date, number][] = [
      [new Date(2026, 0, 1), 18],
      [new Date(2026, 0, 15), 18],
      [new Date(2026, 1, 1), 18],
      [new Date(2026, 1, 5), 50],
      [new Date(2026, 1, 10), 150],
      [new Date(2026, 1, 14), 214],
    ];

    const line = d3.line<[Date, number]>()
      .x(d => x(d[0]))
      .y(d => y(d[1]))
      .curve(d3.curveMonotoneX);

    // Grid lines
    svg.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(5).tickSize(-(height - margin.top - margin.bottom)).tickFormat(() => ""))
      .attr("stroke-opacity", 0.1)
      .attr("stroke", "#ffffff");

    svg.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickSize(-(width - margin.left - margin.right)).tickFormat(() => ""))
      .attr("stroke-opacity", 0.1)
      .attr("stroke", "#ffffff");

    // Axes
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(window.innerWidth < 768 ? 3 : 5).tickFormat(d3.timeFormat("%b %d") as any))
      .attr("color", "#888")
      .style("font-size", window.innerWidth < 768 ? "8px" : "10px");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `₹${d}`))
      .attr("color", "#888")
      .style("font-size", window.innerWidth < 768 ? "8px" : "10px");

    // Line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#f59e0b")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Area
    const area = d3.area<[Date, number]>()
      .x(d => x(d[0]))
      .y0(height - margin.bottom)
      .y1(d => y(d[1]))
      .curve(d3.curveMonotoneX);

    svg.append("path")
      .datum(data)
      .attr("fill", "url(#gradient)")
      .attr("d", area);

    // Gradient
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#f59e0b")
      .attr("stop-opacity", 0.2);

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#f59e0b")
      .attr("stop-opacity", 0);

  }, [dimensions]);

  const handleInputChange = (zoneId: string, value: string) => {
    if (isSolved) return;
    // Only allow numbers 1-6
    if (value !== '' && !/^[1-6]$/.test(value)) return;
    
    setInputs(prev => ({ ...prev, [zoneId]: value }));
    setErrorMsg(null);
  };

  const handleSubmit = () => {
    const allCorrect = ZONES.every(zone => {
      const inputVal = inputs[zone.id];
      const card = CARDS.find(c => c.number.toString() === inputVal);
      return card && card.correctZoneId === zone.id;
    });
    
    if (allCorrect) {
      setIsSolved(true);
      setShowSuccess(true);
      onSolved();
    } else {
    // Find incorrect zones
    const incorrectZoneIds = ZONES.filter(zone => {
      const inputVal = inputs[zone.id];
      const card = CARDS.find(c => c.number.toString() === inputVal);
      return !card || card.correctZoneId !== zone.id;
    }).map(z => z.id);

    if (incorrectZoneIds.length > 0) {
      incorrectZoneIds.forEach(zId => {
        setShakingZoneId(zId);
        setTimeout(() => setShakingZoneId(null), 1000);
      });

      // Check for distractor
      const distractorUsed = Object.values(inputs).includes('6');
      if (distractorUsed) {
        setErrorMsg("Event #6 lacks a direct causal link. The lottery win happened later and served a different purpose.");
      } else {
        setErrorMsg("The timeline is incorrect. Review the event dates and the stock spike.");
      }
      setTimeout(() => setErrorMsg(null), 4000);
    }
    }
  };

  const allInputsFilled = Object.values(inputs).every(v => v !== '');

  return (
    <div ref={containerRef} className="flex flex-col h-full bg-obsidian text-white p-3 md:p-6 overflow-y-auto custom-scrollbar">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-4 md:mb-6">
        <div>
          <h3 className="text-lg md:text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
            <TrendingUp className="text-amber-500" size={18} md:size={24} /> Gowda Pharma Analysis
          </h3>
          <p className="text-[8px] md:text-[10px] text-muted-grey uppercase tracking-widest">Stock Movement: Jan 1 – Feb 14, 2026</p>
        </div>
        {isSolved && (
          <div className="flex items-center gap-2 text-emerald-500 font-bold text-[10px] md:text-xs bg-emerald-500/10 px-3 md:px-4 py-1 md:py-2 rounded-full border border-emerald-500/20">
            <CheckCircle2 size={12} md:size={14} /> ANALYSIS COMPLETE
          </div>
        )}
      </div>

      {/* Chart Section */}
      <div className="relative bg-black/40 rounded-xl md:rounded-2xl border border-white/5 p-1 md:p-4 mb-6 md:mb-8">
        <div className="relative" style={{ height: dimensions.height }}>
          <svg 
            ref={chartRef} 
            width={dimensions.width}
            height={dimensions.height}
            className="w-full h-full"
          />
          
          {/* Input Zones Overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{ margin: `20px 20px 40px ${window.innerWidth < 768 ? '30px' : '40px'}` }}>
            <div className="relative w-full h-full">
              {ZONES.map((zone) => (
                <div 
                  key={zone.id}
                  className={`absolute pointer-events-auto flex flex-col items-center`}
                  style={{ 
                    left: `${zone.x}%`, 
                    top: window.innerWidth < 768 ? '15%' : '10%',
                    transform: 'translateX(-50%)'
                  }}
                >
                  <div className="text-[8px] md:text-[9px] font-black text-muted-grey uppercase mb-1">
                    {window.innerWidth < 768 ? zone.label.replace('Point ', '') : zone.label}
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={inputs[zone.id]}
                    onChange={(e) => handleInputChange(zone.id, e.target.value)}
                    disabled={isSolved}
                    placeholder="?"
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white/5 border-2 text-center font-black text-base md:text-lg transition-all outline-none ${
                      isSolved 
                        ? 'border-emerald-500 text-emerald-500 bg-emerald-500/10' 
                        : shakingZoneId === zone.id
                          ? 'border-crimson bg-crimson/10 animate-shake'
                          : inputs[zone.id]
                            ? 'border-amber-500 text-amber-500 bg-amber-500/10'
                            : 'border-white/10 focus:border-white/30'
                    }`}
                  />
                  <div className="h-full w-px bg-white/10 mt-1 border-dashed border-l" style={{ height: dimensions.height * 0.6 }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cards List */}
      {!isSolved ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[8px] md:text-[10px] text-muted-grey uppercase font-black tracking-widest mb-2">
            <Hash size={10} md:size={12} /> Event Log
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
            {CARDS.map((card) => (
              <div
                key={card.id}
                className="bg-white/5 border border-white/10 rounded-lg md:rounded-xl p-2 md:p-3 flex gap-3 md:gap-4 items-center"
              >
                <div className="w-6 h-6 md:w-8 md:h-8 rounded md:rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-black shrink-0 text-xs md:text-base">
                  {card.number}
                </div>
                <div>
                  <div className="text-[10px] md:text-xs font-bold leading-tight mb-0.5 md:mb-1">{card.title}</div>
                  <div className="text-[8px] md:text-[9px] font-black uppercase text-muted-grey tracking-tighter">{card.hint}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 md:mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
             <div className="flex items-center gap-2 text-[8px] md:text-[10px] text-muted-grey italic">
              <Info size={12} md:size={14} className="text-amber-500" />
              Enter the event numbers in the correct chronological order on the chart.
            </div>
            <button
              disabled={!allInputsFilled}
              onClick={handleSubmit}
              className={`w-full sm:w-auto px-8 md:px-10 py-3 md:py-4 rounded-lg md:rounded-xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 text-xs md:text-base ${
                allInputsFilled 
                  ? 'bg-amber-500 text-black hover:bg-amber-400 shadow-xl shadow-amber-500/20' 
                  : 'bg-white/5 text-muted-grey cursor-not-allowed'
              }`}
            >
              Verify Timeline <ArrowRight size={16} md:size={18} />
            </button>
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-500/10 border border-emerald-500/20 p-4 md:p-6 rounded-xl md:rounded-2xl"
        >
          <h4 className="text-emerald-500 font-black uppercase mb-2 flex items-center gap-2 text-sm md:text-base">
            <CheckCircle2 size={16} md:size={20} /> Timeline Reconstructed
          </h4>
          <p className="text-xs md:text-sm leading-relaxed text-muted-grey">
            The sequence is clear: Anish used Aruna's cab rides to coordinate with Satish Nath. 
            The shell companies (Shree Vedanta) were registered months in advance, but the actual 
            buying spree triggered the spike just before the acquisition announcement. 
            The lottery win on Jan 11 was the <span className="text-white font-bold">payout</span> — 
            a pre-arranged jackpot used to move ₹4.2Cr of "clean" money to Aruna for her silence and cooperation.
          </p>
        </motion.div>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-md p-4 bg-crimson text-white rounded-xl flex items-center gap-3 text-xs font-bold shadow-2xl z-50"
          >
            <AlertCircle size={18} />
            {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};
