import React from 'react';
import { User, MessageSquare } from 'lucide-react';

interface TranscriptViewProps {
  transcript: string;
  suspectName: string;
  date: string;
}

export const TranscriptView: React.FC<TranscriptViewProps> = ({ transcript, suspectName, date }) => {
  const lines = transcript.split('\n').filter(line => line.trim() !== '');
  
  return (
    <div className="bg-obsidian/50 border border-white/5 rounded-2xl overflow-hidden">
      <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MessageSquare size={14} className="text-crimson" />
          <span className="text-[10px] font-black uppercase tracking-widest">Interrogation Transcript</span>
        </div>
        <span className="text-[10px] font-bold text-muted-grey uppercase">{date}</span>
      </div>
      <div className="p-6 space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar">
        {lines.map((line, i) => {
          const isSuspect = line.startsWith(suspectName + ':');
          const isDetective = line.startsWith('DETECTIVE:');
          const content = line.split(':').slice(1).join(':').trim();
          
          return (
            <div key={i} className={`flex gap-4 ${isDetective ? 'flex-row' : 'flex-row-reverse text-right'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isDetective ? 'bg-crimson/10 text-crimson' : 'bg-white/10 text-white'}`}>
                <User size={16} />
              </div>
              <div className="space-y-1">
                <span className="text-[8px] font-black uppercase tracking-widest opacity-40 block">
                  {isDetective ? 'Detective' : suspectName}
                </span>
                <p className={`text-sm leading-relaxed ${isDetective ? 'text-apple-white' : 'text-muted-grey italic'}`}>
                  {content}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
