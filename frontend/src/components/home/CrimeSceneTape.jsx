import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

/**
 * Continuous marquee warning ticker tape across a section or screen width.
 */
export const CrimeSceneTicker = ({
  text = 'CRIME SCENE DO NOT CROSS • FORENSIC EVIDENCE PRESERVATION ZONE • AUTHORIZED DETECTIVES ONLY • DO NOT TAMPER • POLICE LINE DO NOT CROSS',
  variant = 'yellow', // 'yellow' | 'cyan' | 'red'
  reverse = false,
  className = '',
}) => {
  const variantClasses = {
    yellow: 'neon-tape-yellow',
    cyan: 'neon-tape-cyan',
    red: 'neon-tape-red',
  };

  const tapeClass = variantClasses[variant] || variantClasses.yellow;
  const animationClass = reverse ? 'animate-marquee-reverse' : 'animate-marquee';

  // Duplicate items to ensure seamless infinite loop
  const repeatCount = 6;
  const items = Array.from({ length: repeatCount });

  return (
    <div className={`relative overflow-hidden py-1 shadow-lg select-none ${tapeClass} ${className}`}>
      {/* Decorative hazard top & bottom fine stripes */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-black/40" />
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-black/40" />

      <div className={`${animationClass} flex items-center gap-6 whitespace-nowrap`}>
        {items.map((_, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 text-[11px] sm:text-xs font-black tracking-[0.2em] font-mono uppercase"
          >
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 fill-current" />
            <span>{text}</span>
            <span className="opacity-60 text-xs">///</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Screen corner tape banner pinned at an angle (e.g. top-right or top-left)
 */
export const CornerCrimeTape = ({
  position = 'top-right', // 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  text = 'CRIME SCENE // DO NOT CROSS',
  variant = 'yellow',
}) => {
  const positionStyles = {
    'top-right': 'top-7 -right-14 rotate-[35deg]',
    'top-left': 'top-7 -left-14 -rotate-[35deg]',
    'bottom-right': 'bottom-7 -right-14 -rotate-[35deg]',
    'bottom-left': 'bottom-7 -left-14 rotate-[35deg]',
  };

  const variantStyles = {
    yellow: 'bg-amber-400 text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.6)] border-y border-amber-200',
    cyan: 'bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.6)] border-y border-cyan-200',
    red: 'bg-rose-600 text-white shadow-[0_0_20px_rgba(244,63,94,0.6)] border-y border-rose-300',
  };

  return (
    <div
      className={`fixed z-30 pointer-events-none w-64 text-center py-1.5 font-mono font-black text-[11px] tracking-widest uppercase ${
        positionStyles[position] || positionStyles['top-right']
      } ${variantStyles[variant] || variantStyles.yellow}`}
    >
      <div className="flex items-center justify-center gap-2">
        <AlertTriangle className="w-3 h-3 fill-current flex-shrink-0" />
        <span className="truncate">{text}</span>
        <AlertTriangle className="w-3 h-3 fill-current flex-shrink-0" />
      </div>
    </div>
  );
};

/**
 * Crossed neon caution tape overlays for locked or restricted case cards.
 */
export const CrossedTapeOverlay = ({
  primaryText = 'RESTRICTED AREA // DO NOT ENTER',
  secondaryText = 'POLICE LINE // DO NOT CROSS',
  badgeText = 'CRIME SCENE SEALED',
}) => {
  return (
    <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center overflow-hidden">
      {/* Tape 1: Slanted down-right */}
      <div className="absolute w-[140%] py-1.5 px-4 bg-amber-400 text-slate-950 font-mono font-extrabold text-[11px] tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(245,158,11,0.65),0_4px_10px_rgba(0,0,0,0.8)] border-y-2 border-amber-200 rotate-[-16deg] flex items-center justify-around opacity-95">
        <span className="flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 fill-slate-950" /> {primaryText}
        </span>
        <span className="hidden sm:inline-flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 fill-slate-950" /> {primaryText}
        </span>
      </div>

      {/* Tape 2: Slanted up-right */}
      <div className="absolute w-[140%] py-1.5 px-4 bg-amber-300 text-slate-950 font-mono font-extrabold text-[11px] tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(252,211,77,0.65),0_4px_10px_rgba(0,0,0,0.8)] border-y-2 border-yellow-100 rotate-[14deg] flex items-center justify-around opacity-90">
        <span className="flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 fill-slate-950" /> {secondaryText}
        </span>
        <span className="hidden sm:inline-flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 fill-slate-950" /> {secondaryText}
        </span>
      </div>

      {/* Central Forensic Seal Badge */}
      {badgeText && (
        <div className="relative z-10 px-3.5 py-1 rounded bg-slate-950/95 border-2 border-amber-400 text-amber-300 font-mono text-[10px] font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(245,158,11,0.5)] flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>{badgeText}</span>
        </div>
      )}
    </div>
  );
};

/**
 * 3D-styled Yellow Plastic Crime Scene Evidence Marker Cone
 */
export const EvidenceMarker = ({ number = '01', label = 'EVIDENCE' }) => {
  return (
    <div
      className="inline-flex flex-col items-center select-none group cursor-default"
      title={`Forensic Evidence Marker #${number}`}
    >
      <div className="relative w-8 h-8 rounded-sm bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 border border-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.5),inset_0_2px_4px_rgba(255,255,255,0.7)] flex flex-col items-center justify-center transform group-hover:scale-110 transition-transform">
        <span className="text-[14px] font-black font-mono text-slate-950 leading-none">
          {number}
        </span>
        <span className="text-[6px] font-bold font-mono tracking-tighter text-slate-800 leading-none mt-0.5">
          {label}
        </span>
      </div>
      <div className="w-9 h-1.5 bg-black/40 rounded-full blur-[1px] -mt-0.5" />
    </div>
  );
};
