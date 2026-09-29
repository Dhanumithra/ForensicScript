import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getBackground, getCharacterSprite } from '../../utils/assetHelper';
import { HUD } from './HUD';
import { DialogueBox } from './DialogueBox';
import { EvidenceModal } from './EvidenceModal';
import { InterrogationSelector } from './InterrogationSelector';
import { AccusationBoard } from './AccusationBoard';
import { GameOverModal } from './GameOverModal';
import { VictoryModal } from './VictoryModal';
import { DialogueHistoryDrawer } from './DialogueHistoryDrawer';
import { AlertCircle, CheckCircle2, Zap, MessageSquare } from 'lucide-react';

export const VisualNovelScreen = ({ engine }) => {
  const {
    caseData,
    currentNode,
    energy,
    unlockedClues,
    detectiveGender,
    spriteOverride,
    isDossierOpen,
    isInterrogationOpen,
    isAccusationOpen,
    isHistoryOpen,
    setIsHistoryOpen,
    dialogueHistory,
    fastRecoverAp,
    resumeWithRecoveredAp,
    isGameOver,
    isVictorious,
    victoryData,
    notification,
    floatingAp,
    isAudioMuted,
    setIsDossierOpen,
    setIsInterrogationOpen,
    setIsAccusationOpen,
    startNewGame,
    reinvestigateCase,
    returnToHome,
    takeAction,
    presentEvidence,
    submitAccusation,
    handleToggleAudio,
  } = engine;

  const bgUrl = getBackground(currentNode?.background || 'bg_cleanroom_int');

  // Detective speaking sprite resolution (Show Detective sprite whenever Detective speaks!)
  const isDetectiveSpeaking =
    currentNode?.speaker?.toUpperCase()?.includes('DETECTIVE') ||
    currentNode?.speaker?.toUpperCase()?.includes(engine.profile?.lastName?.toUpperCase() || 'WARD');

  const detectiveSpriteName =
    detectiveGender === 'm' || engine.profile?.detectiveGender === 'm'
      ? 'detective_m_neutral'
      : 'detective_f_neutral';

  const activeSpriteName = spriteOverride
    ? spriteOverride
    : isDetectiveSpeaking
    ? detectiveSpriteName
    : currentNode?.sprite;

  const spriteUrl = getCharacterSprite(activeSpriteName);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black select-none font-sans">
      {/* 1. Dynamic Background Image with subtle zoom */}
      <motion.div
        key={currentNode?.background}
        initial={{ scale: 1.04, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 filter brightness-[0.85] contrast-[1.05]"
        style={{
          backgroundImage: bgUrl ? `url("${bgUrl}")` : 'none',
        }}
      />

      {/* Subtle Dark Neo-Noir Vignette & Scanline */}
      <div className="absolute inset-0 vignette-overlay z-10 pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none z-10" />

      {/* 2. HUD (AP Energy, Case Info, Clue Count, Controls) */}
      <HUD
        caseData={caseData}
        energy={energy}
        unlockedClues={unlockedClues}
        isAudioMuted={isAudioMuted}
        onOpenDossier={() => setIsDossierOpen(true)}
        onOpenInterrogation={() => setIsInterrogationOpen(true)}
        onOpenAccusation={() => setIsAccusationOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onToggleAudio={handleToggleAudio}
        onRestart={reinvestigateCase}
        onGoHome={returnToHome}
      />

      {/* Floating Side Toggle for Dialogue History Transcript */}
      <button
        onClick={() => setIsHistoryOpen(true)}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-25 py-3 px-1.5 rounded-l-xl bg-slate-900/90 hover:bg-slate-800 border-l border-y border-cyan-500/40 hover:border-cyan-400 text-cyan-400 shadow-2xl flex flex-col items-center gap-1.5 transition-all group cursor-pointer"
        title="Toggle Dialogue History Transcript [L]"
      >
        <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform" />
        <span className="text-[9px] font-mono font-bold tracking-widest uppercase [writing-mode:vertical-rl] text-slate-300 group-hover:text-cyan-300">
          LOG
        </span>
      </button>

      {/* 3. Character Sprite Layer (Positioned center-right) */}
      <div className="absolute inset-0 flex items-end justify-center md:justify-end md:pr-36 pointer-events-none z-15 pb-24 md:pb-16 overflow-hidden">
        <AnimatePresence mode="wait">
          {spriteUrl && (
            <motion.img
              key={activeSpriteName}
              src={spriteUrl}
              alt={activeSpriteName}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.98 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="h-[65vh] md:h-[78vh] object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] max-w-none"
            />
          )}
        </AnimatePresence>
      </div>

      {/* 4. Floating AP Window (Reveals AP change after choice is clicked) */}
      <AnimatePresence>
        {floatingAp && (
          <motion.div
            initial={{ opacity: 0, y: -25, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1.1 }}
            exit={{ opacity: 0, y: -40, scale: 0.9 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
            className={`absolute top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-center gap-3 font-mono font-extrabold text-base md:text-lg tracking-wider pointer-events-none ${
              floatingAp.type === 'gain'
                ? 'bg-emerald-950/95 border-emerald-400 text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.5)]'
                : 'bg-rose-950/95 border-rose-500 text-rose-300 shadow-[0_0_30px_rgba(239,68,68,0.5)]'
            }`}
          >
            <Zap className={`w-6 h-6 ${floatingAp.type === 'gain' ? 'text-emerald-400 fill-emerald-400' : 'text-rose-400 fill-rose-400'}`} />
            <span>{floatingAp.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Notification Toast (Clue unlocks / Milestones) */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`absolute top-36 left-1/2 -translate-x-1/2 z-40 px-5 py-2.5 rounded-xl border backdrop-blur-md shadow-2xl flex items-center gap-3 text-xs md:text-sm font-mono font-bold uppercase tracking-wider pointer-events-none ${
              notification.type === 'clue'
                ? 'bg-cyan-950/90 border-cyan-400 text-cyan-200 shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                : notification.type === 'penalty'
                ? 'bg-rose-950/90 border-rose-500 text-rose-200 shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                : 'bg-slate-900/90 border-slate-700 text-slate-200'
            }`}
          >
            {notification.type === 'clue' && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
            {notification.type === 'penalty' && <AlertCircle className="w-4 h-4 text-rose-400" />}
            {notification.type === 'info' && <Zap className="w-4 h-4 text-amber-400" />}
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. Bottom Dialogue Panel with Typewriter & Choices */}
      <DialogueBox
        currentNode={currentNode}
        onSelectChoice={(choice) => {
          if (choice?.id === 'open_accusation_choice') {
            setIsAccusationOpen(true);
          } else if (choice?.id === 'back_to_interrogate_choice') {
            takeAction(choice);
            setIsInterrogationOpen(true);
          } else if (choice?.id === 'restart_investigation_choice') {
            reinvestigateCase();
          } else {
            takeAction(choice);
          }
        }}
        profile={engine.profile}
        detectiveGender={detectiveGender}
        unlockedClues={unlockedClues}
        caseData={caseData}
        onOpenAccusation={() => setIsAccusationOpen(true)}
        onOpenInterrogation={() => setIsInterrogationOpen(true)}
        onOpenDossier={() => setIsDossierOpen(true)}
        onRestartInvestigation={reinvestigateCase}
      />

      {/* 7. Modals */}
      <EvidenceModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        allClues={caseData?.clues || []}
        unlockedClueIds={unlockedClues}
      />

      <InterrogationSelector
        isOpen={isInterrogationOpen}
        onClose={() => setIsInterrogationOpen(false)}
        unlockedClueIds={unlockedClues}
        allClues={caseData?.clues || []}
        onPresentEvidence={presentEvidence}
      />

      <AccusationBoard
        isOpen={isAccusationOpen}
        onClose={() => setIsAccusationOpen(false)}
        unlockedClueIds={unlockedClues}
        onSubmitAccusation={submitAccusation}
        caseData={caseData}
        onRestartInvestigation={reinvestigateCase}
      />

      <GameOverModal
        isOpen={isGameOver}
        energy={energy}
        onRestart={reinvestigateCase}
        onResumeInvestigation={resumeWithRecoveredAp}
        onFastRecover={fastRecoverAp}
        onGoHome={returnToHome}
      />

      <DialogueHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={dialogueHistory}
        profile={engine.profile}
        detectiveGender={detectiveGender}
      />

      <VictoryModal
        isOpen={isVictorious}
        victoryData={victoryData}
        onReturnHome={returnToHome}
        onPlayAgain={() => startNewGame(detectiveGender)}
      />
    </main>
  );
};
