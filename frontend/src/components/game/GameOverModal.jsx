import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, RotateCcw, Zap, Clock, Coffee, Play, Home } from 'lucide-react';

export const GameOverModal = ({
  isOpen,
  energy = 0,
  onRestart,
  onResumeInvestigation,
  onFastRecover,
  onGoHome,
}) => {
  const [secondsTick, setSecondsTick] = useState(0);

  // Live timer tick for seconds countdown
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSecondsTick((prev) => (prev + 1) % 60);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const targetAp = 50;
  const isRecovered = energy >= targetAp;
  const apNeeded = Math.max(0, targetAp - energy);
  const minutesRemaining = apNeeded;
  const secondsRemaining = (60 - secondsTick) % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel-danger w-full max-w-xl rounded-2xl p-7 md:p-8 border border-rose-600/60 shadow-2xl flex flex-col items-center text-center relative overflow-hidden"
      >
        {/* Animated Background Ambience */}
        <div className="absolute inset-0 bg-gradient-to-b from-rose-950/30 to-black/60 pointer-events-none" />

        {/* Icon */}
        <div className="relative z-10 w-16 h-16 rounded-full bg-rose-600/20 border border-rose-500/50 flex items-center justify-center text-rose-500 mb-4 animate-bounce">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <span className="relative z-10 font-mono text-xs uppercase tracking-widest text-rose-400 font-bold mb-1">
          Forensic Division Notice • Action Points Exhausted
        </span>

        <h2 className="relative z-10 text-2xl md:text-3xl font-extrabold text-white mb-3 font-sans uppercase tracking-tight">
          Detective Focus Depleted (0 AP)
        </h2>

        {/* Informative Explanation */}
        <div className="relative z-10 p-4 bg-slate-950/80 rounded-xl border border-rose-900/80 text-rose-200 text-xs md:text-sm font-sans mb-5 leading-relaxed text-left">
          <p className="mb-2">
            Due to procedural errors or reckless deductions, your Detective Action Points have dropped to <strong>0 AP</strong>.
          </p>
          <p className="text-slate-300">
            Internal affairs requires you to rest and recover your focus. You must wait until your AP regenerates to at least <strong className="text-amber-400">50 AP</strong> before resuming the investigation.
          </p>
        </div>

        {/* Live AP Regeneration Gauge & Countdown */}
        <div className="relative z-10 w-full p-4 rounded-xl bg-slate-900/90 border border-slate-700 mb-6 flex flex-col gap-3">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" /> Current Focus:
            </span>
            <span className={isRecovered ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
              {energy} / {targetAp} AP (Needed to Resume)
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isRecovered
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : 'bg-gradient-to-r from-rose-600 to-amber-500'
              }`}
              style={{ width: `${Math.min(100, (energy / targetAp) * 100)}%` }}
            />
          </div>

          {/* Live Countdown & Regeneration Rate */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> Rate: +1 AP / minute
            </span>
            <span className="text-amber-300 font-semibold">
              {isRecovered ? (
                '★ Focus Restored! Ready to Resume'
              ) : (
                `Time until 50 AP: ~${minutesRemaining}m ${String(secondsRemaining).padStart(2, '0')}s`
              )}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 w-full flex flex-col gap-2.5">
          {/* Resume button (enabled when energy >= 50) */}
          <button
            onClick={onResumeInvestigation}
            disabled={!isRecovered}
            className={`w-full py-3.5 px-6 rounded-xl font-mono text-xs md:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              isRecovered
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer'
                : 'bg-slate-800/80 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>
              {isRecovered
                ? `Resume Investigation (${energy} AP)`
                : `Waiting for Focus Recovery (${energy}/50 AP)`}
            </span>
          </button>

          {/* Developer / Testing Fast Recover Option */}
          {onFastRecover && (
            <button
              onClick={onFastRecover}
              className="w-full py-2.5 px-4 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 border border-amber-500/40 text-amber-300 font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              title="Instant Recovery for testing"
            >
              <Coffee className="w-4 h-4 text-amber-400" />
              <span>Restorative Espresso (+50 AP Instant Recovery)</span>
            </button>
          )}

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-2 mt-1">
            <button
              onClick={onRestart}
              className="py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-mono text-xs uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart Case</span>
            </button>
            <button
              onClick={onGoHome}
              className="py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-mono text-xs uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-cyan-400" />
              <span>Home Screen</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
