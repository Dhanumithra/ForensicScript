import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Lock,
  HeartPulse,
  Cog,
  FlaskConical,
  Watch,
  MailWarning,
  Flame,
  FileCheck2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

const CLUE_ICONS = {
  E1: HeartPulse,
  E2: Cog,
  E3: FlaskConical,
  E4: Watch,
  E5: MailWarning,
  E6: Flame,
};

export const EvidenceModal = ({
  isOpen,
  onClose,
  allClues = [],
  unlockedClueIds = [],
}) => {
  const [selectedClue, setSelectedClue] = useState(null);

  if (!isOpen) return null;

  const getClueData = (id) => allClues.find((c) => c.clue_id === id);

  const evidenceSlots = ['E1', 'E2', 'E3', 'E4', 'E5', 'E6'].map((id) => {
    const isUnlocked = unlockedClueIds.includes(id);
    const data = getClueData(id);
    return {
      id,
      isUnlocked,
      data,
    };
  });

  const activeDetail = selectedClue
    ? evidenceSlots.find((s) => s.id === selectedClue && s.isUnlocked)?.data
    : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass-panel w-full max-w-4xl max-h-[85vh] rounded-2xl border border-cyan-500/40 shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
            <div className="flex items-center gap-3">
              <FileCheck2 className="w-5 h-5 text-cyan-400" />
              <div>
                <h2 className="text-base font-mono font-bold tracking-wider text-slate-100 uppercase">
                  Case Dossier: Forensic Inventory
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  {unlockedClueIds.length} / 6 Clues Collected & Verified (
                  {unlockedClueIds.length >= 3 ? 'Indictment Gate Unlocked (50%)' : 'Minimum 3 Required (50%)'}
                  )
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body: 6-Slot Grid + Detail Inspector */}
          <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            {evidenceSlots.map((slot) => {
              const IconComponent = CLUE_ICONS[slot.id] || HelpCircle;
              const isSelected = selectedClue === slot.id;

              if (!slot.isUnlocked) {
                return (
                  <div
                    key={slot.id}
                    className="p-4 rounded-xl border border-slate-800 bg-slate-900/30 flex flex-col items-center justify-center min-h-[160px] text-center opacity-60"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-500 mb-3 border border-slate-700">
                      <Lock className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-400 tracking-wider">
                      {slot.id}: CLASSIFIED
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1">Undiscovered Evidence</span>
                  </div>
                );
              }

              return (
                <div
                  key={slot.id}
                  onClick={() => setSelectedClue(slot.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between min-h-[160px] ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                      : 'bg-slate-900/70 border-slate-700/80 hover:border-cyan-500/50 hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold">
                      {slot.id}
                    </span>
                  </div>

                  <div className="mt-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400/80">
                      {slot.data?.category}
                    </span>
                    <h3 className="text-sm font-semibold text-slate-100 line-clamp-1 mt-0.5">
                      {slot.data?.name}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 mt-1">
                      {slot.data?.summary}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Clue Inspector Sub-panel */}
          {activeDetail && (
            <div className="px-6 py-4 bg-slate-900/90 border-t border-cyan-500/30">
              <div className="flex items-center gap-2 mb-1 text-cyan-400 font-mono text-xs uppercase font-bold">
                <AlertCircle className="w-4 h-4" />
                <span>Forensic Contradiction Analysis [{activeDetail.clue_id}]</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-sans">
                {activeDetail.contradiction || activeDetail.inference}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/40 flex justify-between items-center text-xs font-mono text-slate-400">
            <span>Press [E] or [Esc] to close dossier</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
