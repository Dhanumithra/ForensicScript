import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, ArrowDown, User, Shield, ChevronRight } from 'lucide-react';
import { getCharacterSprite } from '../../utils/assetHelper';

export const DialogueHistoryDrawer = ({
  isOpen,
  onClose,
  history = [],
  profile,
  detectiveGender = 'f',
}) => {
  const scrollRef = useRef(null);

  // Auto-scroll to latest dialogue when drawer opens or updates
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [isOpen, history]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const detectiveSprite = getCharacterSprite(
    detectiveGender === 'm' || profile?.detectiveGender === 'm'
      ? 'detective_m_neutral'
      : 'detective_f_neutral'
  );

  const getSpeakerDetails = (speakerName = '') => {
    const upper = speakerName.toUpperCase();
    if (upper.includes('DETECTIVE') || upper.includes(profile?.lastName?.toUpperCase() || 'WARD')) {
      return {
        name: `DET. ${profile?.lastName?.toUpperCase() || 'WARD'}`,
        color: 'text-cyan-300 bg-cyan-950/80 border-cyan-500/40',
        badge: 'bg-cyan-500/20 text-cyan-300',
        sprite: detectiveSprite,
      };
    }
    if (upper.includes('MILLER')) {
      return {
        name: 'OFFICER MILLER',
        color: 'text-amber-300 bg-amber-950/80 border-amber-500/40',
        badge: 'bg-amber-500/20 text-amber-300',
        sprite: getCharacterSprite('officer_miller_neutral'),
      };
    }
    if (upper.includes('ELENA')) {
      return {
        name: 'DR. ELENA CRUZ',
        color: 'text-purple-300 bg-purple-950/80 border-purple-500/40',
        badge: 'bg-purple-500/20 text-purple-300',
        sprite: getCharacterSprite('elena_neutral'),
      };
    }
    if (upper.includes('KEVIN')) {
      return {
        name: 'KEVIN LIN',
        color: 'text-blue-300 bg-blue-950/80 border-blue-500/40',
        badge: 'bg-blue-500/20 text-blue-300',
        sprite: getCharacterSprite('kevin_neutral'),
      };
    }
    if (upper.includes('VANCE')) {
      return {
        name: 'MARCUS VANCE',
        color: 'text-rose-300 bg-rose-950/80 border-rose-500/40',
        badge: 'bg-rose-500/20 text-rose-300',
        sprite: getCharacterSprite('vance_neutral'),
      };
    }
    return {
      name: speakerName || 'SYSTEM',
      color: 'text-slate-300 bg-slate-900 border-slate-700',
      badge: 'bg-slate-800 text-slate-300',
      sprite: null,
    };
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
        {/* Backdrop click to close */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Sliding Drawer Container */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 240 }}
          className="relative z-10 w-full max-w-xl h-full bg-slate-950/95 border-l border-cyan-500/30 shadow-2xl flex flex-col backdrop-blur-xl"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-mono font-bold tracking-wider text-slate-100 uppercase">
                  Dialogue Transcript Log
                </h2>
                <p className="text-[11px] font-mono text-cyan-400">
                  {history.length} Spoken Statements Recorded
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={scrollToBottom}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Scroll to Latest"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Close Transcript [Esc]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Dialogue Log Scroll Body */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-4"
          >
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center text-slate-500 font-mono text-xs">
                <MessageSquare className="w-10 h-10 mb-2 opacity-30" />
                <span>No conversation dialogue logged yet.</span>
              </div>
            ) : (
              history.map((entry, idx) => {
                const details = getSpeakerDetails(entry.speaker);
                return (
                  <motion.div
                    key={`${entry.node_id || idx}-${idx}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl border transition-all ${details.color}`}
                  >
                    {/* Speaker Bar */}
                    <div className="flex items-center justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2.5">
                        {/* Avatar */}
                        <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-950/80 border border-slate-700 flex items-center justify-center flex-shrink-0">
                          {details.sprite ? (
                            <img
                              src={details.sprite}
                              alt={details.name}
                              className="w-full h-full object-cover object-top"
                            />
                          ) : (
                            <User className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </div>
                        <span className="font-mono text-xs font-bold tracking-wider">
                          {details.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {entry.timestamp && (
                          <span className="text-[10px] font-mono opacity-50">
                            {entry.timestamp}
                          </span>
                        )}
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 opacity-70">
                          #{String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>
                    </div>

                    {/* Dialogue Text */}
                    <p className="text-xs sm:text-sm text-slate-100 font-sans leading-relaxed tracking-wide select-text">
                      {entry.text}
                    </p>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="px-6 py-3 border-t border-slate-900 bg-slate-950 text-xs font-mono text-slate-500 flex justify-between items-center">
            <span>Press [L] or [Esc] to toggle log</span>
            <span className="text-cyan-500/70">Forensic Chronology Archive</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
