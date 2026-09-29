import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCharacterSprite } from '../../utils/assetHelper';
import { RANKS } from '../../utils/profileStorage';
import {
  X,
  User,
  Shield,
  Award,
  CheckCircle2,
  Save,
  Sparkles,
} from 'lucide-react';

export const ProfileModal = ({ isOpen, onClose, profile, onSaveProfile }) => {
  const [firstName, setFirstName] = useState(profile?.firstName || 'Catherine');
  const [lastName, setLastName] = useState(profile?.lastName || 'Ward');
  const [gender, setGender] = useState(profile?.detectiveGender || 'f');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && profile) {
      setFirstName(profile.firstName || 'Catherine');
      setLastName(profile.lastName || 'Ward');
      setGender(profile.detectiveGender || 'f');
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const spriteF = getCharacterSprite('detective_f_neutral');
  const spriteM = getCharacterSprite('detective_m_neutral');

  const handleSave = (e) => {
    e.preventDefault();
    const updated = {
      ...profile,
      firstName: firstName.trim() || 'Detective',
      lastName: lastName.trim() || 'Investigator',
      detectiveGender: gender,
    };
    onSaveProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass-panel w-full max-w-2xl rounded-2xl border border-cyan-500/40 shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-cyan-400" />
              <div>
                <h2 className="text-base font-mono font-bold tracking-wider text-slate-100 uppercase">
                  Detective Personnel Profile
                </h2>
                <p className="text-xs text-cyan-400 font-mono">
                  Agency Credentials & Avatar Customization
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

          {/* Form */}
          <form onSubmit={handleSave} className="p-6 overflow-y-auto flex flex-col gap-6">
            {/* Career Rank & Status with 9-Tier Progression */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
                      Assigned Detective Rank (9 Tiers)
                    </span>
                    <span className="text-sm font-bold text-cyan-300 font-mono flex items-center gap-2">
                      <span>{profile?.rank || 'Bronze 1'}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                        Tier {RANKS.indexOf(profile?.rank || 'Bronze 1') + 1} / 9
                      </span>
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
                    Cases Solved
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {profile?.casesSolved?.length || 0} File(s) Cleared
                  </span>
                </div>
              </div>

              {/* 9-Tier Rank Ladder */}
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[10px] font-mono text-slate-400 block mb-1.5 uppercase">
                  Rank Promotion Ladder:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {RANKS.map((r, idx) => {
                    const isCurrent = (profile?.rank || 'Bronze 1') === r;
                    const isPast = idx < RANKS.indexOf(profile?.rank || 'Bronze 1');
                    const isGold = r.startsWith('Gold');
                    const isSilver = r.startsWith('Silver');
                    return (
                      <span
                        key={r}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                          isCurrent
                            ? isGold
                              ? 'bg-amber-400 text-slate-950 shadow-[0_0_12px_rgba(251,191,36,0.6)]'
                              : isSilver
                              ? 'bg-slate-200 text-slate-950 shadow-[0_0_12px_rgba(226,232,240,0.5)]'
                              : 'bg-amber-600 text-slate-950 shadow-[0_0_12px_rgba(217,119,6,0.5)]'
                            : isPast
                            ? 'bg-slate-800 text-slate-300 border border-slate-700'
                            : 'bg-slate-900/60 text-slate-600 border border-slate-800/80 opacity-50'
                        }`}
                      >
                        {r}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Detective Name Customization */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold block mb-2">
                Personal Identification (First & Last Name):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] font-mono text-slate-400 block mb-1">First Name:</span>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name (e.g. Catherine)"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-100 font-sans text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-slate-400 block mb-1">Last Name:</span>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name (e.g. Ward)"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-100 font-sans text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 italic font-sans">
                * Your name will appear on official police reports, in-game badges, and dialogue responses.
              </p>
            </div>

            {/* Detective Sprite Customization (Girl / Boy) */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold block mb-3">
                Select Detective Sprite Avatar (Girl or Boy):
              </label>
              <div className="grid grid-cols-2 gap-4">
                {/* Female Detective */}
                <div
                  onClick={() => setGender('f')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col items-center ${
                    gender === 'f'
                      ? 'bg-cyan-950/70 border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.3)]'
                      : 'bg-slate-900/60 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="w-24 h-32 flex items-center justify-center overflow-hidden rounded-lg bg-slate-950/80 mb-2 border border-slate-700/60">
                    {spriteF && (
                      <img
                        src={spriteF}
                        alt="Female Detective Sprite"
                        className="max-h-full max-w-full object-contain filter drop-shadow"
                      />
                    )}
                  </div>
                  <span className="font-bold text-xs text-slate-100 font-sans">Female Detective</span>
                  <span className="text-[10px] font-mono text-cyan-400">Inspector Sprite (F)</span>
                  {gender === 'f' && (
                    <span className="mt-2 text-[10px] bg-cyan-500/20 text-cyan-300 font-mono px-2 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Selected
                    </span>
                  )}
                </div>

                {/* Male Detective */}
                <div
                  onClick={() => setGender('m')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col items-center ${
                    gender === 'm'
                      ? 'bg-cyan-950/70 border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.3)]'
                      : 'bg-slate-900/60 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="w-24 h-32 flex items-center justify-center overflow-hidden rounded-lg bg-slate-950/80 mb-2 border border-slate-700/60">
                    {spriteM && (
                      <img
                        src={spriteM}
                        alt="Male Detective Sprite"
                        className="max-h-full max-w-full object-contain filter drop-shadow"
                      />
                    )}
                  </div>
                  <span className="font-bold text-xs text-slate-100 font-sans">Male Detective</span>
                  <span className="text-[10px] font-mono text-cyan-400">Inspector Sprite (M)</span>
                  {gender === 'm' && (
                    <span className="mt-2 text-[10px] bg-cyan-500/20 text-cyan-300 font-mono px-2 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Selected
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-slate-950 font-mono text-xs md:text-sm font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)] flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{savedSuccess ? 'Profile Updated!' : 'Save Personnel Changes'}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs uppercase transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
