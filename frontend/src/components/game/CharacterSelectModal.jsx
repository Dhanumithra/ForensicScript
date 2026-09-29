import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, UserCheck, Play } from 'lucide-react';
import { getCharacterSprite } from '../../utils/assetHelper';

export const CharacterSelectModal = ({ onSelectDetective }) => {
  const [selectedGender, setSelectedGender] = useState('f');

  const spriteF = getCharacterSprite('detective_f_neutral');
  const spriteM = getCharacterSprite('detective_m_neutral');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel w-full max-w-3xl rounded-2xl border border-cyan-500/40 p-8 shadow-2xl flex flex-col items-center text-center"
      >
        {/* Title & Tagline */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-4 uppercase tracking-widest">
          <Shield className="w-3.5 h-3.5" />
          <span>Interactive Crime Story Engine</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold font-sans tracking-tight text-white mb-2">
          FORENSIC SCRIPT
        </h1>
        <p className="text-sm font-mono text-cyan-400 mb-6 uppercase tracking-widest">
          Case 07-VX: The Vanishing at Sector 7
        </p>

        <p className="text-xs md:text-sm text-slate-300 max-w-xl mb-8 leading-relaxed">
          Dr. Aris Thorne is found dead inside the airtight, locked Sector 7 cleanroom.
          Surveillance glitched for 90 seconds. Manage your Action Points (AP), collect verified forensic
          clues, expose false alibis, and break the locked-room illusion.
        </p>

        {/* Detective Character Selection */}
        <div className="w-full max-w-lg mb-8">
          <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-4 font-bold">
            Select Lead Homicide Investigator:
          </label>

          <div className="grid grid-cols-2 gap-4">
            {/* Female Detective */}
            <div
              onClick={() => setSelectedGender('f')}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col items-center ${
                selectedGender === 'f'
                  ? 'bg-cyan-950/70 border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.3)]'
                  : 'bg-slate-900/60 border-slate-700 hover:border-slate-500'
              }`}
            >
              <div className="w-28 h-36 flex items-center justify-center overflow-hidden rounded-lg bg-slate-950/80 mb-3 border border-slate-700/60">
                {spriteF ? (
                  <img
                    src={spriteF}
                    alt="Detective Catherine Ward"
                    className="max-h-full max-w-full object-contain filter drop-shadow"
                  />
                ) : (
                  <UserCheck className="w-10 h-10 text-slate-500" />
                )}
              </div>
              <span className="font-bold text-sm text-slate-100">Det. Catherine Ward</span>
              <span className="text-[11px] font-mono text-cyan-400">Forensics Specialist</span>
            </div>

            {/* Male Detective */}
            <div
              onClick={() => setSelectedGender('m')}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col items-center ${
                selectedGender === 'm'
                  ? 'bg-cyan-950/70 border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.3)]'
                  : 'bg-slate-900/60 border-slate-700 hover:border-slate-500'
              }`}
            >
              <div className="w-28 h-36 flex items-center justify-center overflow-hidden rounded-lg bg-slate-950/80 mb-3 border border-slate-700/60">
                {spriteM ? (
                  <img
                    src={spriteM}
                    alt="Detective James Vance"
                    className="max-h-full max-w-full object-contain filter drop-shadow"
                  />
                ) : (
                  <UserCheck className="w-10 h-10 text-slate-500" />
                )}
              </div>
              <span className="font-bold text-sm text-slate-100">Det. James Thorne</span>
              <span className="text-[11px] font-mono text-cyan-400">Senior Interrogator</span>
            </div>
          </div>
        </div>

        {/* Start Game Button (Click unlocks Web Audio context cleanly!) */}
        <button
          onClick={() => onSelectDetective(selectedGender)}
          className="w-full max-w-md py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-mono text-sm font-bold uppercase tracking-widest transition-all shadow-[0_0_25px_rgba(56,189,248,0.4)] flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>Commence Investigation (100 AP)</span>
        </button>
      </motion.div>
    </div>
  );
};
