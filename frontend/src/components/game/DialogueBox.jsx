import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playTypewriterClick } from '../../services/audio';
import {
  ArrowRight,
  ChevronRight,
  Gavel,
  Users,
  FolderOpen,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';


export const DialogueBox = ({
  currentNode,
  onSelectChoice,
  profile,
  detectiveGender = 'f',
  unlockedClues = [],
  caseData,
  onOpenAccusation,
  onOpenInterrogation,
  onOpenDossier,
  onRestartInvestigation,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const textIndexRef = useRef(0);
  const timerRef = useRef(null);

  const fullText = currentNode?.text || '';
  const speaker = currentNode?.speaker || 'DETECTIVE';
  const choices = currentNode?.choices_json || [];

  const isConfrontationNode = currentNode?.node_id === 'scene_5_accusation';
  const isTerminalNode = choices.length === 0;
  const isConfrontationOrEnd = isConfrontationNode || isTerminalNode;

  const minEvidenceRequired = caseData?.min_evidence_required || 3;
  const isEvidenceMet = (unlockedClues?.length || 0) >= minEvidenceRequired;

  const hasMultipleChoices = !isConfrontationOrEnd && choices.length > 1;
  const singleChoice = !isConfrontationOrEnd && choices.length === 1 ? choices[0] : null;

  // Smooth cinematic typewriter effect (32ms per character)
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    textIndexRef.current = 0;

    if (timerRef.current) clearInterval(timerRef.current);

    if (!fullText) {
      setIsTyping(false);
      return;
    }

    timerRef.current = setInterval(() => {
      textIndexRef.current += 1;
      setDisplayedText(fullText.slice(0, textIndexRef.current));

      // Subtle typewriter click every 3 characters for smoothness
      if (textIndexRef.current % 3 === 0) {
        playTypewriterClick();
      }

      if (textIndexRef.current >= fullText.length) {
        clearInterval(timerRef.current);
        setIsTyping(false);
      }
    }, 30);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fullText]);

  // Advance on textbox click or keyboard
  const handleAdvance = useCallback(() => {
    if (isTyping) {
      // Instant reveal if still typing
      if (timerRef.current) clearInterval(timerRef.current);
      setDisplayedText(fullText);
      setIsTyping(false);
    } else if (singleChoice) {
      // If only 1 choice exists, automatically proceed
      onSelectChoice(singleChoice);
    } else if (isConfrontationOrEnd) {
      // If at confrontation/end, direct the player according to evidence status
      if (isEvidenceMet) {
        if (onOpenAccusation) onOpenAccusation();
      } else {
        if (onOpenInterrogation) onOpenInterrogation();
      }
    }
  }, [
    isTyping,
    fullText,
    singleChoice,
    onSelectChoice,
    isConfrontationOrEnd,
    isEvidenceMet,
    onOpenAccusation,
    onOpenInterrogation,
  ]);

  // Keyboard navigation: Space or Enter advances dialogue
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleAdvance();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAdvance]);

  // Speaker Badge Styles with Customized Detective Name
  const getSpeakerStyles = (name) => {
    const upper = name.toUpperCase();
    if (upper.includes('DETECTIVE')) {
      const nameTag = profile?.lastName
        ? `DET. ${profile.lastName.toUpperCase()}`
        : profile?.firstName
        ? `DET. ${profile.firstName.toUpperCase()}`
        : 'LEAD DETECTIVE';

      return {
        bg: 'bg-cyan-950/90 border-cyan-400 text-cyan-300',
        glow: 'shadow-[0_0_15px_rgba(56,189,248,0.3)]',
        displayName: nameTag,
      };
    }
    if (upper.includes('MILLER')) {
      return {
        bg: 'bg-amber-950/90 border-amber-400 text-amber-300',
        glow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]',
        displayName: 'OFFICER MILLER (FORENSICS)',
      };
    }
    if (upper.includes('ELENA')) {
      return {
        bg: 'bg-purple-950/90 border-purple-400 text-purple-300',
        glow: 'shadow-[0_0_15px_rgba(168,85,247,0.3)]',
        displayName: 'DR. ELENA CRUZ (SPECTROMETRY)',
      };
    }
    if (upper.includes('KEVIN')) {
      return {
        bg: 'bg-blue-950/90 border-blue-400 text-blue-300',
        glow: 'shadow-[0_0_15px_rgba(96,165,250,0.3)]',
        displayName: 'KEVIN LIN (FIRMWARE ENGR)',
      };
    }
    if (upper.includes('VANCE')) {
      return {
        bg: 'bg-rose-950/90 border-rose-500 text-rose-300',
        glow: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]',
        displayName: 'MARCUS VANCE (CEO)',
      };
    }
    return {
      bg: 'bg-slate-900/90 border-slate-400 text-slate-200',
      glow: '',
      displayName: name,
    };
  };

  const speakerStyle = getSpeakerStyles(speaker);

  return (
    <div className="absolute bottom-6 left-4 right-4 md:left-12 md:right-12 z-20 flex flex-col gap-3 pointer-events-auto">
      {/* 1. Decision Panel: Displayed at Confrontation / End-of-Scene when typing is complete */}
      <AnimatePresence>
        {!isTyping && isConfrontationOrEnd && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25 }}
            className="max-w-4xl mx-auto w-full mb-1"
          >
            {isEvidenceMet ? (
              /* Ready to Accuse: Gate Passed */
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-emerald-500/50 shadow-2xl backdrop-blur-xl flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Evidence Criteria Satisfied ({unlockedClues.length}/6 Clues Verified)</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold uppercase">
                    Ready For Indictment
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  You have uncovered enough forensic evidence to dismantle Marcus Vance's locked-room alibi.
                  Are you ready to deliver the grand indictment, or do you want to question suspects further?
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <button
                    onClick={onOpenAccusation}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all cursor-pointer"
                  >
                    <Gavel className="w-4 h-4" />
                    <span>Accuse Killer Now</span>
                  </button>

                  <button
                    onClick={onOpenInterrogation}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <Users className="w-4 h-4" />
                    <span>Question Suspects</span>
                  </button>

                  <button
                    onClick={onOpenDossier}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-300 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <FolderOpen className="w-4 h-4" />
                    <span>Review Dossier</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Evidence Insufficient: Must Return to Interrogation */
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-amber-500/50 shadow-2xl backdrop-blur-xl flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 fill-amber-400 text-slate-950" />
                    <span>Evidence Criteria Not Met ({unlockedClues.length}/{minEvidenceRequired} Required Clues)</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300 font-bold uppercase">
                    Warrant Blocked
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  "Detective, the prosecutor will dismiss our charges without solid proof! We need at least{' '}
                  <strong className="text-amber-300">{minEvidenceRequired} out of 6 confirmed clues (50%)</strong>{' '}
                  before formally indicting Marcus Vance. Return to the investigation and interrogate the suspects in holding to expose their contradictions!"
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <button
                    onClick={onRestartInvestigation}
                    className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-gradient-to-r from-rose-700 via-rose-600 to-amber-700 hover:from-rose-600 hover:to-amber-600 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(244,63,94,0.35)] transition-all cursor-pointer border border-rose-500/50"
                    title="Not enough evidence: Restart from Scene 1 to investigate crime scenes and gather clues"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Re-investigate (Find Clues)</span>
                  </button>

                  <button
                    onClick={onOpenInterrogation}
                    className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all cursor-pointer"
                  >
                    <Users className="w-4 h-4" />
                    <span>Interrogate Suspects</span>
                  </button>

                  <button
                    onClick={onOpenDossier}
                    className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-300 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <FolderOpen className="w-4 h-4" />
                    <span>Check Clues ({unlockedClues.length}/6)</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Branching Choice Options: Displayed when there are 2 or more choices and not at confrontation */}
      <AnimatePresence>
        {!isTyping && hasMultipleChoices && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-2 max-w-4xl mx-auto w-full mb-1"
          >
            {choices.map((choice, idx) => (
              <button
                key={choice.id || idx}
                onClick={() => onSelectChoice(choice)}
                className="group flex items-center justify-between px-5 py-3 rounded-lg border text-left font-medium transition-all shadow-md backdrop-blur-md bg-slate-900/85 border-cyan-500/30 hover:border-cyan-400 hover:bg-slate-800/90 text-slate-200 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-cyan-400 font-bold group-hover:text-cyan-300">
                    [{idx + 1}]
                  </span>
                  <span className="text-sm md:text-base font-sans">{choice.text}</span>
                </div>

                <div className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Main Dialogue Panel */}
      <div
        onClick={handleAdvance}
        className="glass-panel relative rounded-xl p-5 md:p-6 border border-cyan-500/30 cursor-pointer select-none max-w-5xl mx-auto w-full transition-all hover:border-cyan-500/60 shadow-2xl"
      >
        {/* Speaker Name Tag */}
        <div className="absolute -top-3.5 left-6">
          <div
            className={`px-4 py-1 rounded-md text-xs font-mono font-bold tracking-wider uppercase border ${speakerStyle.bg} ${speakerStyle.glow}`}
          >
            {speakerStyle.displayName}
          </div>
        </div>

        {/* Text Body */}
        <div className="mt-2 min-h-[68px] text-slate-100 text-base md:text-lg leading-relaxed font-sans tracking-wide">
          {displayedText}
          {isTyping && (
            <span className="inline-block w-2 h-4 ml-1 bg-cyan-400 animate-pulse align-middle" />
          )}
        </div>

        {/* Advance Indicator Prompt */}
        <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
          <span>
            {isTyping
              ? 'Click textbox to reveal'
              : isConfrontationOrEnd
              ? isEvidenceMet
                ? 'Select an action above to proceed to Indictment or Interrogation'
                : 'Not enough evidence. Re-investigate from start or interrogate suspects'
              : hasMultipleChoices
              ? 'Select a decision above'
              : 'Click textbox or press Space to proceed'}
          </span>

          <div className="flex items-center gap-1.5 text-cyan-400 font-semibold ml-auto">
            {isConfrontationOrEnd && !isTyping ? (
              isEvidenceMet ? (
                <span className="text-rose-400 flex items-center gap-1">
                  <Gavel className="w-3.5 h-3.5" /> READY
                </span>
              ) : (
                <span className="text-amber-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> GATHER EVIDENCE
                </span>
              )
            ) : hasMultipleChoices && !isTyping ? (
              <span>CHOOSE</span>
            ) : (
              <span>CONTINUE</span>
            )}
            <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

