import {
  FolderOpen,
  Users,
  Scale,
  Volume2,
  VolumeX,
  RotateCcw,
  Zap,
  Home,
  MessageSquare,
} from 'lucide-react';

export const HUD = ({
  caseData,
  energy,
  unlockedClues,
  isAudioMuted,
  onOpenDossier,
  onOpenInterrogation,
  onOpenAccusation,
  onOpenHistory,
  onToggleAudio,
  onRestart,
  onGoHome,
}) => {
  const clueCount = unlockedClues.length;
  const totalClues = caseData?.total_evidence || 6;
  const minRequired = caseData?.min_evidence_required || 3;
  const isGateUnlocked = clueCount >= minRequired;

  // Energy color gradient calculation (Max 50 AP)
  const getEnergyColor = (val) => {
    if (val >= 35) return 'from-emerald-500 to-teal-400';
    if (val >= 15) return 'from-amber-500 to-yellow-400';
    return 'from-rose-600 to-red-500';
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-30 p-4 flex flex-col md:flex-row items-center justify-between gap-4 pointer-events-none">
      {/* Case & Location Banner */}
      <div className="flex items-center gap-3 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-lg border border-cyan-500/30 shadow-lg pointer-events-auto">
        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-cyan-400">
            {caseData?.title || 'ForensicScript'}
          </div>
          <div className="text-sm font-semibold text-slate-200">
            {caseData?.location || 'Sector 7 Cleanroom'}
          </div>
        </div>
      </div>

      {/* Center: Energy / AP Gauge (Max 50 AP) */}
      <div className="bg-slate-900/90 backdrop-blur-md px-5 py-2.5 rounded-lg border border-slate-700/60 shadow-lg flex items-center gap-4 min-w-[280px] pointer-events-auto">
        <div className="flex items-center gap-1.5 text-amber-400">
          <Zap className="w-4 h-4 fill-amber-400" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider">AP:</span>
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className={energy <= 15 ? 'text-rose-400 font-bold animate-pulse' : 'text-slate-300'}>
              {energy} / 50 AP
            </span>
            <span className="text-slate-400 text-[10px] uppercase">
              {energy >= 35 ? 'Optimal' : energy >= 15 ? 'Caution' : 'Critical'}
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${getEnergyColor(
                energy
              )}`}
              style={{ width: `${Math.max(0, Math.min(100, (energy / 50) * 100))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Right Controls & Evidence Counter */}
      <div className="flex items-center gap-2 pointer-events-auto flex-wrap justify-end">
        {/* Evidence Counter Badge */}
        <button
          onClick={onOpenDossier}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-mono text-xs font-semibold backdrop-blur-md transition-all border ${
            isGateUnlocked
              ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.4)] animate-pulse'
              : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:border-cyan-500/50'
          }`}
          title="Open Case Dossier [E]"
        >
          <FolderOpen className="w-4 h-4 text-cyan-400" />
          <span>CLUES: {clueCount}/{totalClues}</span>
          {isGateUnlocked && <span className="text-[10px] bg-cyan-500/20 px-1.5 py-0.5 rounded text-cyan-200">GATE MET</span>}
        </button>

        {/* Suspect Interrogation Button */}
        <button
          onClick={onOpenInterrogation}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-700 text-xs font-mono text-slate-300 hover:border-amber-500/60 hover:text-amber-300 transition-all backdrop-blur-md cursor-pointer"
          title="Suspect Interrogations [I]"
        >
          <Users className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">INTERROGATE</span>
        </button>

        {/* Dialogue History Transcript Log */}
        <button
          onClick={onOpenHistory}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-700 text-xs font-mono text-slate-300 hover:border-cyan-500/60 hover:text-cyan-300 transition-all backdrop-blur-md cursor-pointer"
          title="View Dialogue History Transcript [L]"
        >
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">LOG</span>
        </button>

        {/* Accusation Board Button */}
        <button
          onClick={onOpenAccusation}
          disabled={!isGateUnlocked}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all backdrop-blur-md border ${
            isGateUnlocked
              ? 'bg-rose-950/80 border-rose-500 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.4)] hover:bg-rose-900'
              : 'bg-slate-900/40 border-slate-800 text-slate-500 cursor-not-allowed'
          }`}
          title={isGateUnlocked ? "Deliver Indictment [A]" : `Requires >= ${minRequired} Clues (50%)`}
        >
          <Scale className="w-4 h-4" />
          <span>ACCUSE</span>
        </button>

        {/* Home Navigation Button */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 transition-all backdrop-blur-md text-xs font-mono"
          title="Return to Home Terminal [H]"
        >
          <Home className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">HOME</span>
        </button>

        {/* Audio Mute Toggle */}
        <button
          onClick={onToggleAudio}
          className="p-2 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 transition-all backdrop-blur-md"
          title="Toggle Audio [M]"
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>

        {/* Restart / New Game */}
        <button
          onClick={onRestart}
          className="p-2 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-400 hover:text-amber-400 hover:border-amber-500/50 transition-all backdrop-blur-md"
          title="Restart Case"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
