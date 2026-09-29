import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, RotateCcw, ShieldCheck } from 'lucide-react';
import { getCharacterSprite } from '../../utils/assetHelper';

export const VictoryModal = ({ isOpen, victoryData, onReturnHome, onPlayAgain }) => {
  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const defeatedSpriteUrl = getCharacterSprite('vance_defeated');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel w-full max-w-4xl my-8 rounded-2xl border border-emerald-500/50 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-teal-950/90 p-6 border-b border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                Case Solved: Conviction Secured
              </span>
              <h1 className="text-2xl font-bold text-white font-sans">
                {victoryData?.grade || 'MASTER FORENSIC DETECTIVE'}
              </h1>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-emerald-300 font-mono text-xs font-bold">
            <Award className="w-4 h-4" />
            <span>AP SCORE: {victoryData?.final_energy || 100}</span>
          </div>
        </div>

        {/* Content: Sprite + Breakdown */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Defeated Vance Sprite */}
          <div className="md:col-span-4 flex flex-col items-center justify-center bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div className="relative w-44 h-64 flex items-center justify-center overflow-hidden rounded-lg bg-slate-950/80 mb-3 border border-slate-700/50 shadow-inner">
              {defeatedSpriteUrl && (
                <img
                  src={defeatedSpriteUrl}
                  alt="Marcus Vance Defeated"
                  className="max-h-full max-w-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)]"
                />
              )}
            </div>
            <span className="font-bold text-sm text-slate-200">Marcus Vance</span>
            <span className="text-[11px] font-mono text-rose-400 font-bold">IN HANDCUFFS</span>
          </div>

          {/* Case Narrative Reconstruction */}
          <div className="md:col-span-8 flex flex-col justify-between gap-4">
            {/* Confession Quote */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-rose-500/30">
              <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400 font-bold block mb-1">
                Culprit's Confession on Record:
              </span>
              <p className="text-xs md:text-sm text-slate-200 italic font-serif leading-relaxed">
                "{victoryData?.confession || 'He was going to destroy this company over a rounding error!'}"
              </p>
            </div>

            {/* Timeline Breakdown */}
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block mb-3">
                Reconstructed Sequence of Events:
              </span>
              <div className="flex flex-col gap-2">
                {victoryData?.case_summary?.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions: Return to Home Screen & Play Again */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button
                onClick={onReturnHome}
                className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs md:text-sm font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)] flex items-center justify-center gap-2"
              >
                <span>Return to Home Screen</span>
              </button>
              <button
                onClick={onPlayAgain}
                className="py-3.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs md:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-slate-700"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Replay Case</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
