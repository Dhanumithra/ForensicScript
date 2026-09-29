import React from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Award,
  User,
  Lock,
  Unlock,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Zap,
  LogIn,
  AlertTriangle,
  Fingerprint,
} from 'lucide-react';
import { getCharacterSprite } from '../../utils/assetHelper';
import {
  CrimeSceneTicker,
  CornerCrimeTape,
  CrossedTapeOverlay,
  EvidenceMarker,
} from './CrimeSceneTape';


export const HomePage = ({
  profile,
  hasActiveSession,
  activeSessionEnergy,
  activeSessionCluesCount,
  isCase1Solved,
  onStartCase,
  onRestartCase,
  onResumeCase,
  onOpenProfile,
  onOpenSignIn,
  onClearPromotion,
}) => {
  const isCase2Unlocked = isCase1Solved;
  const detectiveSprite = getCharacterSprite(
    profile?.detectiveGender === 'm' ? 'detective_m_neutral' : 'detective_f_neutral'
  );

  return (
    <div className="relative min-h-full w-full bg-slate-950 text-slate-100 font-sans flex flex-col justify-between">
      {/* Ambient Crime Scene Corner Warning Tapes */}
      <CornerCrimeTape position="top-right" text="CRIME SCENE // DO NOT CROSS" variant="yellow" />
      <CornerCrimeTape position="bottom-left" text="POLICE LINE // FORENSIC AREA" variant="yellow" />

      {/* Background Ambience & Crime Scene Grid */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,116,144,0.25),rgba(2,6,23,0.95))] pointer-events-none" />
      <div className="fixed inset-0 opacity-[0.04] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[length:100%_4px] pointer-events-none" />
      {/* Ambient background hazard tape shadows */}
      <div className="fixed top-1/3 -left-32 w-[140%] h-8 hazard-stripes opacity-[0.03] rotate-[-8deg] pointer-events-none" />
      <div className="fixed top-2/3 -right-32 w-[140%] h-8 hazard-stripes-cyan opacity-[0.03] rotate-[6deg] pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-20 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="font-mono text-xs text-cyan-400 font-bold tracking-widest uppercase block">
              FORENSIC SCRIPT
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Homicide Investigation Division
            </span>
          </div>
        </div>

        {/* Center: AP Focus Display */}
        <div className="flex items-center gap-3 px-4 py-1.5 rounded-xl bg-slate-900/90 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
          <Zap className={`w-4 h-4 ${activeSessionEnergy > 0 ? 'text-amber-400 fill-amber-400 animate-pulse' : 'text-rose-500'}`} />
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-100">
                {activeSessionEnergy} / 50 AP
              </span>
              {activeSessionEnergy < 50 ? (
                <span className="text-[10px] font-mono text-amber-400">
                  +1/min
                </span>
              ) : (
                <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                  FULL
                </span>
              )}
            </div>
            {/* Progress Bar (Max 50) */}
            <div className="w-24 sm:w-28 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-0.5 border border-slate-700/60">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  activeSessionEnergy >= 50
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    : activeSessionEnergy > 20
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                    : 'bg-gradient-to-r from-rose-600 to-amber-500'
                }`}
                style={{ width: `${Math.max(0, Math.min(100, (activeSessionEnergy / 50) * 100))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Profile & Auth Bar */}
        <div className="flex items-center gap-3">
          {/* User Profile Pill */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 transition-all shadow-md group cursor-pointer"
            title="Edit Detective Profile [P]"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-800 border border-cyan-500/40 flex items-center justify-center">
              {detectiveSprite ? (
                <img
                  src={detectiveSprite}
                  alt="Detective Avatar"
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <User className="w-4 h-4 text-cyan-400" />
              )}
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-xs font-bold text-slate-200 block group-hover:text-cyan-300">
                Det. {profile?.lastName || 'Ward'}
              </span>
              <span className="text-[10px] font-mono text-cyan-400 block leading-tight">
                {profile?.rank || 'Bronze 1'}
              </span>
            </div>
          </button>

          {/* Sign In / ID Badge */}
          <button
            onClick={onOpenSignIn}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title="Agency Authorization"
          >
            <LogIn className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Glowing Neon Crime Scene Warning Tape Marquee */}
      <CrimeSceneTicker
        text="CRIME SCENE DO NOT CROSS • FORENSIC EVIDENCE PRESERVATION ZONE • AUTHORIZED DETECTIVES ONLY • DO NOT TAMPER • POLICE LINE DO NOT CROSS"
        variant="yellow"
        className="z-20 border-b border-amber-500/40"
      />

      {/* Main Content Area */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8 w-full flex-1 flex flex-col gap-8">
        {/* Promotion Celebratory Banner */}
        {profile?.promoted && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-gradient-to-r from-amber-950/90 via-slate-900 to-emerald-950/90 border border-amber-500/50 shadow-2xl flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400 animate-bounce">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 block">
                  COMMISSIONER'S COMMENDATION: PROMOTION SECURED
                </span>
                <span className="text-sm font-semibold text-slate-100">
                  Congratulations, Detective {profile?.lastName}! You have been promoted to{' '}
                  <strong className="text-amber-300">{profile?.rank}</strong>. Case 2 is now unlocked!
                </span>
              </div>
            </div>
            <button
              onClick={onClearPromotion}
              className="text-xs font-mono text-slate-400 hover:text-slate-200 px-3 py-1 rounded bg-slate-800/80 border border-slate-700 cursor-pointer"
            >
              Dismiss
            </button>
          </motion.div>
        )}

        {/* Hero Section with Crime Scene Accents */}
        <div className="text-center max-w-3xl mx-auto relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs mb-3 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Active Criminal Investigation Docket</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
            SELECT A FORENSIC CASE FILE
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            Review case files, manage Detective Action Points (AP), collect verified forensic clues,
            and break locked-room illusions through rigorous forensic deduction.
          </p>

          {/* Crime Scene Hazard Tape Divider */}
          <div className="flex items-center justify-center gap-3 mt-4 max-w-lg mx-auto">
            <div className="h-1 flex-1 hazard-stripes rounded shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
            <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest px-2.5 py-0.5 rounded bg-amber-950/70 border border-amber-500/40 flex items-center gap-1.5 shadow-sm">
              <AlertTriangle className="w-3 h-3 text-amber-400 fill-amber-400" />
              CRIME SCENE RESTRICTED ZONES
            </span>
            <div className="h-1 flex-1 hazard-stripes rounded shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
          </div>
        </div>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CASE 1: The Vanishing at Sector 7 (Active / Available) */}
          <div className="glass-panel rounded-2xl p-6 border border-cyan-500/40 shadow-xl flex flex-col justify-between hover:border-cyan-400/80 transition-all duration-300 relative overflow-hidden group">
            {/* Neon Warning Tape Corner Strip */}
            <div className="absolute -top-1 -left-3 px-5 py-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-slate-950 font-mono font-black text-[10px] tracking-widest uppercase rotate-[-7deg] shadow-[0_0_15px_rgba(250,204,21,0.65)] border-y border-amber-100 z-10 flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3 fill-slate-950" />
              CRIME SCENE ACTIVE
            </div>

            {/* Corner Badge */}
            <div className="absolute top-4 right-4 z-10">
              {isCase1Solved ? (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500 text-emerald-300 font-mono text-xs font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> SOLVED
                </span>
              ) : hasActiveSession ? (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400 text-cyan-300 font-mono text-xs font-bold animate-pulse">
                  <Zap className="w-3.5 h-3.5 fill-cyan-300" /> IN PROGRESS ({activeSessionEnergy} / 50 AP)
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-mono text-xs font-semibold">
                  ACTIVE CASE ({activeSessionEnergy} / 50 AP)
                </span>
              )}
            </div>

            <div className="pt-4">
              <div className="flex items-start justify-between gap-3 mb-1">
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold block">
                  CASE NO. 07-VX
                </span>
                <EvidenceMarker number="01" label="SCENE" />
              </div>

              <h2 className="text-xl font-bold text-white font-sans mb-2 group-hover:text-cyan-200 transition-colors">
                The Vanishing at Sector 7
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Dr. Aris Thorne is found dead inside an airtight, locked Class-1 cleanroom.
                Magnetic door seals never tripped, but cameras blacked out for 90 seconds. Uncover how the killer placed the body inside without opening the doors.
              </p>

              <div className="flex flex-wrap gap-2 text-[11px] font-mono text-slate-400 mb-6">
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  Location: Sector 7 Cleanroom
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                  6 Forensic Clues
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                  50% Evidence Gate
                </span>
              </div>
            </div>

            {/* Case Action Buttons */}
            <div className="pt-4 border-t border-slate-800/80">
              {activeSessionEnergy <= 0 && (
                <div className="mb-3 p-2.5 rounded-lg bg-rose-950/80 border border-rose-500/60 text-rose-300 font-mono text-[11px] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>Focus Depleted (0/50 AP). Internal Affairs lockout: Recharging +1 AP/min before you can investigate.</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                {hasActiveSession && !isCase1Solved ? (
                  <>
                    <button
                      onClick={onResumeCase}
                      className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-slate-950" />
                      <span>Resume Investigation ({activeSessionCluesCount}/6 Clues)</span>
                    </button>
                    <button
                      onClick={() => (onRestartCase ? onRestartCase() : onStartCase('sector-7'))}
                      className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                      title="Re-investigate from Start (Maintains AP)"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => onStartCase('sector-7')}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>{isCase1Solved ? 'Replay Sector 7 Case' : `Start Investigation (${activeSessionEnergy}/50 AP)`}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* CASE 2: The Silicon Protocol (Unlocked only after solving Case 1!) */}
          <div
            className={`glass-panel rounded-2xl p-6 border shadow-xl flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
              isCase2Unlocked
                ? 'border-amber-500/50 hover:border-amber-400'
                : 'border-slate-800'
            }`}
          >
            {/* If locked, criss-cross neon crime scene tape! */}
            {!isCase2Unlocked && (
              <CrossedTapeOverlay
                primaryText="RESTRICTED CASE // CLEARANCE REQ"
                secondaryText="POLICE LINE // DO NOT CROSS"
                badgeText="CASE FILE SEALED"
              />
            )}

            {/* Neon Tape Corner Ribbon if unlocked */}
            {isCase2Unlocked && (
              <div className="absolute -top-1 -left-3 px-5 py-1 bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 text-slate-950 font-mono font-black text-[10px] tracking-widest uppercase rotate-[-7deg] shadow-[0_0_15px_rgba(34,211,238,0.65)] border-y border-cyan-100 z-10 flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3 fill-slate-950" />
                CLEARED DOSSIER
              </div>
            )}

            {/* Status Badge */}
            <div className="absolute top-4 right-4 z-10">
              {isCase2Unlocked ? (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500 text-amber-300 font-mono text-xs font-bold">
                  <Unlock className="w-3.5 h-3.5" /> UNLOCKED: CASE OPEN
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-400 font-mono text-xs">
                  <Lock className="w-3.5 h-3.5" /> LOCKED
                </span>
              )}
            </div>

            <div className={!isCase2Unlocked ? 'opacity-40 pt-4' : 'pt-4'}>
              <div className="flex items-start justify-between gap-3 mb-1">
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold block">
                  CASE NO. 08-SP
                </span>
                <EvidenceMarker number="02" label="DIGITAL" />
              </div>

              <h2 className="text-xl font-bold text-white font-sans mb-2">
                The Silicon Protocol: Breach at Sub-Level 3
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                A high-frequency cyber breach compromised Aether Biometrix's automated wafer production grid.
                The security architect was found asphyxiated beside the fiber router racks.
              </p>

              <div className="flex flex-wrap gap-2 text-[11px] font-mono text-slate-400 mb-6">
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                  Location: Server Catacombs
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                  Digital & Cyber Forensics
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                  {isCase2Unlocked ? 'Inspector Clearance Verified' : 'Requires Case 1 Resolution'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 relative z-10">
              {isCase2Unlocked ? (
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-center text-xs font-mono text-amber-300">
                  ★ Case Unlocked: Official FBI Liaison Briefing Scheduled for Next Expansion!
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center text-xs font-mono text-slate-400">
                  Solve Case 1 ("The Vanishing at Sector 7") to earn promotion and unlock this docket.
                </div>
              )}
            </div>
          </div>

          {/* CASE 3: Project Chimera (Locked Dossier with Crossed Crime Scene Tape) */}
          <div className="rounded-2xl p-6 border border-slate-800/80 bg-slate-900/30 flex flex-col justify-between min-h-[220px] relative overflow-hidden group">
            {/* Neon Warning Tape Overlay */}
            <CrossedTapeOverlay
              primaryText="BIOHAZARD LEVEL 4 // DO NOT CROSS"
              secondaryText="FEDERAL CRIME SCENE // BIO-SEALED"
              badgeText="BIO-SEAL ACTIVE"
            />

            <div className="opacity-30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-slate-500">CASE NO. 09-CH</span>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
                  COMING SOON
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-400">Project Chimera: The Genetic Leak</h3>
              <p className="text-xs text-slate-500 mt-2">
                Classified federal dossier. Bio-containment failure at the subterranean gene sequencing facility.
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-600 uppercase opacity-30">
              [Under Active Federal Seal]
            </span>
          </div>

          {/* CASE 4: Operation Blackout (Locked Dossier with Crossed Crime Scene Tape) */}
          <div className="rounded-2xl p-6 border border-slate-800/80 bg-slate-900/30 flex flex-col justify-between min-h-[220px] relative overflow-hidden group">
            {/* Neon Warning Tape Overlay */}
            <CrossedTapeOverlay
              primaryText="GRID BREACH // POLICE LINE DO NOT CROSS"
              secondaryText="RESTRICTED EVIDENCE DOSSIER"
              badgeText="EVIDENCE UNDER ACTIVE SEAL"
            />

            <div className="opacity-30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-slate-500">CASE NO. 10-OB</span>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
                  COMING SOON
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-400">Operation Blackout: Grid Sabotage</h3>
              <p className="text-xs text-slate-500 mt-2">
                Classified federal dossier. Coordinated regional power grid sabotage covering an executive kidnapping.
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-600 uppercase opacity-30">
              [Under Active Federal Seal]
            </span>
          </div>
        </div>
      </main>

      {/* Reverse Neon Crime Scene Ticker before Footer */}
      <CrimeSceneTicker
        reverse
        text="RESTRICTED FORENSIC ARCHIVE • UNAUTHORIZED ACCESS IS A FEDERAL CRIME • PRESERVE CHAIN OF CUSTODY • ALL FORENSIC DEDUCTIONS ARE LOGGED • DIVISION 07"
        variant="cyan"
        className="z-20 border-t border-cyan-500/40"
      />

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-slate-900 bg-slate-950/90 px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <Fingerprint className="w-4 h-4 text-cyan-500" />
          <span>ForensicScript Detective Systems Terminal • v2.4</span>
        </div>
        <span className="text-cyan-500/80">Encrypted Agency Channel: DT-8094</span>
      </footer>
    </div>
  );
};

