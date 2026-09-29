import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCharacterSprite } from '../../utils/assetHelper';
import {
  X,
  Users,
  AlertOctagon,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

const SUSPECTS = [
  {
    id: 'elena',
    name: 'Dr. Elena Cruz',
    role: 'Senior Spectrometry Lead',
    defaultSprite: 'elena_defensive',
    breakdownSprite: 'elena_shocked',
    alibi: 'Claims she left through the turnstile at 2:30 AM and drove straight home.',
    requiredClue: 'E3',
    hint: 'Examine her lab suit for chemical trace anomalies.',
  },
  {
    id: 'kevin',
    name: 'Kevin Lin',
    role: 'Lead Firmware & CCTV Engineer',
    defaultSprite: 'kevin_neutral',
    breakdownSprite: 'kevin_panicked',
    alibi: 'Claims he was asleep in the bunk room with his phone turned off from 1:00 AM.',
    requiredClue: 'E4',
    hint: 'Check digital console logs during the 03:14 AM camera glitch.',
  },
  {
    id: 'vance',
    name: 'Marcus Vance',
    role: 'CEO & Founder, Aether Biometrix',
    defaultSprite: 'vance_neutral',
    breakdownSprite: 'vance_angry',
    alibi: 'Claims he had an ordinary business dispute and spent all night reviewing earnings.',
    requiredClue: 'E5',
    hint: 'Check Thorne\'s encrypted drafts for Vance\'s multi-million-dollar motive.',
  },
];

export const InterrogationSelector = ({
  isOpen,
  onClose,
  unlockedClueIds = [],
  allClues = [],
  onPresentEvidence,
}) => {
  const [selectedSuspect, setSelectedSuspect] = useState(SUSPECTS[0]);
  const [selectedClueId, setSelectedClueId] = useState('');
  const [result, setResult] = useState(null);
  const [activeSprite, setActiveSprite] = useState(SUSPECTS[0].defaultSprite);

  if (!isOpen) return null;

  const handleSelectSuspect = (suspect) => {
    setSelectedSuspect(suspect);
    setActiveSprite(suspect.defaultSprite);
    setSelectedClueId('');
    setResult(null);
  };

  const handlePresent = async () => {
    if (!selectedClueId) return;
    const res = await onPresentEvidence(selectedSuspect.id, selectedClueId);
    if (res) {
      setResult(res);
      if (res.success && res.sprite) {
        setActiveSprite(res.sprite);
      }
    }
  };

  const currentSpriteUrl = getCharacterSprite(activeSprite);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass-panel w-full max-w-5xl max-h-[90vh] rounded-2xl border border-amber-500/40 shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/70">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-amber-400" />
              <div>
                <h2 className="text-base font-mono font-bold tracking-wider text-slate-100 uppercase">
                  Interrogation Chamber: Suspect Confrontation
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  Present forensic clues to break false alibis and reveal testimonies
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

          {/* Suspect Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 pt-3 gap-2 overflow-x-auto">
            {SUSPECTS.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSelectSuspect(s)}
                className={`px-4 py-2.5 rounded-t-lg font-mono text-xs font-semibold border-t border-x transition-all ${
                  selectedSuspect.id === s.id
                    ? 'bg-slate-900 border-amber-500/60 text-amber-300 shadow-[0_-4px_12px_rgba(245,158,11,0.15)]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6 flex-1">
            {/* Left: Suspect Portrait & Info (5 cols) */}
            <div className="md:col-span-5 flex flex-col items-center bg-slate-900/50 p-5 rounded-xl border border-slate-800">
              <div className="relative w-48 h-64 flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-t from-slate-950 via-slate-900 to-transparent border border-slate-700/60 shadow-inner">
                {currentSpriteUrl ? (
                  <img
                    src={currentSpriteUrl}
                    alt={selectedSuspect.name}
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] transition-all duration-300"
                  />
                ) : (
                  <HelpCircle className="w-16 h-16 text-slate-600" />
                )}
                {result?.success && (
                  <div className="absolute top-2 right-2 bg-rose-500 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow">
                    CONTRADICTED!
                  </div>
                )}
              </div>

              <div className="w-full mt-4 text-center">
                <h3 className="text-base font-bold text-slate-100 font-sans">
                  {selectedSuspect.name}
                </h3>
                <span className="text-xs font-mono text-amber-400">
                  {selectedSuspect.role}
                </span>

                <div className="mt-3 p-3 bg-slate-950/70 rounded-lg border border-slate-800 text-left">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                    Official Alibi Statement:
                  </span>
                  <p className="text-xs text-slate-300 italic font-serif leading-relaxed">
                    "{selectedSuspect.alibi}"
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Evidence Presentation & Feedback (7 cols) */}
            <div className="md:col-span-7 flex flex-col justify-between gap-4">
              {/* Evidence Presenter */}
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300 block mb-2 font-bold">
                  Select Contradiction Evidence to Present:
                </label>

                {unlockedClueIds.length === 0 ? (
                  <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-500">
                    No clues collected yet. Investigate the crime scene and logs first!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {unlockedClueIds.map((cId) => {
                      const clue = allClues.find((c) => c.clue_id === cId);
                      const isSelected = selectedClueId === cId;
                      return (
                        <div
                          key={cId}
                          onClick={() => setSelectedClueId(cId)}
                          className={`p-2.5 rounded-lg border cursor-pointer text-left transition-all text-xs flex flex-col justify-between ${
                            isSelected
                              ? 'bg-amber-950/70 border-amber-400 text-amber-200'
                              : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                            <span className="font-bold text-amber-400">[{cId}]</span>
                            <span className="text-slate-500 uppercase">{clue?.category}</span>
                          </div>
                          <span className="font-medium line-clamp-1">{clue?.name}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                <button
                  onClick={handlePresent}
                  disabled={!selectedClueId}
                  className={`mt-4 w-full py-2.5 px-4 rounded-lg font-mono text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg ${
                    selectedClueId
                      ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white hover:from-amber-500 hover:to-rose-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <AlertOctagon className="w-4 h-4" />
                  <span>Present Evidence [Hold It!]</span>
                </button>
              </div>

              {/* Interrogation Reaction / Testimony Result */}
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl border ${
                    result.success
                      ? 'bg-rose-950/80 border-rose-500/70 shadow-[0_0_20px_rgba(239,68,68,0.25)]'
                      : 'bg-slate-900/80 border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2 font-mono text-xs uppercase font-bold">
                    {result.success ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">{result.headline}</span>
                      </>
                    ) : (
                      <>
                        <AlertOctagon className="w-4 h-4 text-amber-400" />
                        <span className="text-amber-400">{result.headline}</span>
                      </>
                    )}
                  </div>

                  <p className="text-xs md:text-sm text-slate-100 italic font-serif leading-relaxed mb-2">
                    "{result.dialogue}"
                  </p>

                  {result.testimony && (
                    <div className="mt-2 pt-2 border-t border-rose-500/30 text-xs font-mono text-rose-300">
                      ★ Breakthrough: {result.testimony}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/40 flex justify-between items-center text-xs font-mono text-slate-400">
            <span>Press [I] or [Esc] to exit interrogation</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              Back to Crime Scene
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
