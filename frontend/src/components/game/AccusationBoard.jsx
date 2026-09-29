import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Scale,
  ShieldAlert,
  AlertTriangle,
  Gavel,
  CheckCircle2,
  Lock,
  RotateCcw,
} from 'lucide-react';

const SUSPECT_CHOICES = [
  { id: 'elena', label: 'Dr. Elena Cruz', desc: 'Senior Spectrometry Lead (Stole the sensor USB drive)' },
  { id: 'kevin', label: 'Kevin Lin', desc: 'Firmware Engineer (Accepted $5,000 crypto bribe to blackout CCTV)' },
  { id: 'vance', label: 'Marcus Vance', desc: 'CEO & Founder (Faced regulatory ruin over falsified sensor yields)' },
];

const METHOD_CHOICES = [
  {
    id: 'ventilation',
    label: 'Ceiling Air Duct Infiltration',
    desc: 'The killer unscrewed the ceiling HEPA ventilation duct to drop into the room.',
  },
  {
    id: 'conveyor',
    label: 'Corridor Murder & Wafer Hatch Conveyor Infiltration',
    desc: 'Thorne was killed in the corridor; body pushed through the wafer intake conveyor into the cleanroom.',
  },
  {
    id: 'master_key',
    label: 'Master Airlock Magnetic Seal Breach',
    desc: 'The killer cloned the security badge and walked right in through the magnetic door.',
  },
];

export const AccusationBoard = ({
  isOpen,
  onClose,
  unlockedClueIds = [],
  onSubmitAccusation,
  caseData = null,
  onRestartInvestigation,
}) => {
  const [selectedSuspect, setSelectedSuspect] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackError, setFeedbackError] = useState(null);

  if (!isOpen) return null;

  const clueCount = unlockedClueIds.length;
  const minRequired = caseData?.min_evidence_required || 3;
  const isGatePassed = clueCount >= minRequired;

  const handleSubmit = async () => {
    if (!selectedSuspect || !selectedMethod) return;
    setIsSubmitting(true);
    setFeedbackError(null);

    const res = await onSubmitAccusation(selectedSuspect, selectedMethod);
    setIsSubmitting(false);

    if (res && !res.success) {
      setFeedbackError(res.message || 'The prosecutor rejected your indictment!');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass-panel w-full max-w-4xl max-h-[90vh] rounded-2xl border border-rose-500/50 shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-rose-950/40">
            <div className="flex items-center gap-3">
              <Scale className="w-5 h-5 text-rose-400" />
              <div>
                <h2 className="text-base font-mono font-bold tracking-wider text-slate-100 uppercase">
                  Grand Indictment Board: Break The Case
                </h2>
                <p className="text-xs text-rose-300/80 font-mono">
                  State Prosecutor Verification Threshold: 50% Clues ({clueCount}/6 Verified)
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

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1">
            {!isGatePassed ? (
              /* Blocked by Officer Miller: 50% Gate Rule */
              <div className="p-8 rounded-xl bg-slate-900/60 border border-amber-500/40 flex flex-col items-center text-center max-w-2xl mx-auto my-6">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
                  <Lock className="w-8 h-8" />
                </div>
                <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-bold mb-1">
                  Evidence Verification Gate Locked
                </span>
                <h3 className="text-lg font-bold text-slate-100 mb-3 font-sans">
                  "Detective, we cannot indict on incomplete hunches!"
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-serif italic mb-6">
                  "The district attorney requires hard forensic evidence before issuing a warrant for the CEO.
                  You currently hold {clueCount} out of 6 clues. We need at least {minRequired} confirmed clues (50%)
                  to avoid a catastrophic dismissal in court. Head back to the lab and inspect the logs."
                </p>
                <div className="flex items-center gap-2 font-mono text-xs text-slate-400 bg-slate-950/80 px-4 py-2 rounded-lg border border-slate-800">
                  <span>Current Progress: {clueCount} / {minRequired} Clues Required</span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                  <button
                    onClick={() => {
                      onClose();
                      onRestartInvestigation?.();
                    }}
                    className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-rose-700 to-amber-700 hover:from-rose-600 hover:to-amber-600 text-white font-bold font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg border border-rose-500/40 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Re-investigate from Start (Find Clues)
                  </button>
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold font-mono text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Return to Holding Area
                  </button>
                </div>
              </div>
            ) : (
              /* Gate Passed: Grand Indictment Form */
              <div className="flex flex-col gap-6">
                {feedbackError && (
                  <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-200 text-xs md:text-sm font-sans flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                    <span>{feedbackError}</span>
                  </div>
                )}

                {/* Section 1: Prime Suspect */}
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold block mb-3">
                    Step 1: Identify Dr. Aris Thorne's Killer
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {SUSPECT_CHOICES.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => setSelectedSuspect(s.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                          selectedSuspect === s.id
                            ? 'bg-rose-950/70 border-rose-400 text-rose-100 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
                            : 'bg-slate-900/60 border-slate-700/80 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-sm">{s.label}</span>
                          {selectedSuspect === s.id && (
                            <CheckCircle2 className="w-4 h-4 text-rose-400" />
                          )}
                        </div>
                        <p className="text-xs text-slate-400">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 2: Method */}
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold block mb-3">
                    Step 2: Reconstruct the Locked-Room Infiltration Method
                  </label>
                  <div className="flex flex-col gap-3">
                    {METHOD_CHOICES.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => setSelectedMethod(m.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-4 ${
                          selectedMethod === m.id
                            ? 'bg-rose-950/70 border-rose-400 text-rose-100 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
                            : 'bg-slate-900/60 border-slate-700/80 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        <div>
                          <span className="font-bold text-sm block mb-1">{m.label}</span>
                          <p className="text-xs text-slate-400 leading-relaxed">{m.desc}</p>
                        </div>
                        {selectedMethod === m.id && (
                          <CheckCircle2 className="w-5 h-5 text-rose-400 flex-shrink-0 mt-1" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Indictment Button */}
                <button
                  onClick={handleSubmit}
                  disabled={!selectedSuspect || !selectedMethod || isSubmitting}
                  className={`w-full py-4 px-6 rounded-xl font-mono text-sm font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-3 shadow-2xl ${
                    selectedSuspect && selectedMethod && !isSubmitting
                      ? 'bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 text-white hover:from-rose-500 hover:to-amber-500 shadow-[0_0_25px_rgba(239,68,68,0.4)]'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Gavel className="w-5 h-5" />
                  <span>
                    {isSubmitting ? 'Delivering Indictment...' : 'Deliver Grand Indictment'}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/40 flex justify-between items-center text-xs font-mono text-slate-400">
            <span>Careless accusations deduct 20 AP</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
