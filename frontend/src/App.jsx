import React from 'react';
import { useDetectiveEngine } from './hooks/useDetectiveEngine';
import { VisualNovelScreen } from './components/game/VisualNovelScreen';
import { HomePage } from './components/home/HomePage';
import { ProfileModal } from './components/home/ProfileModal';
import { SignInModal } from './components/home/SignInModal';

function App() {
  const engine = useDetectiveEngine();
  const {
    session,
    energy,
    unlockedClues,
    isLoading,
    currentScreen,
    profile,
    isProfileOpen,
    setIsProfileOpen,
    isSignInOpen,
    setIsSignInOpen,
    startNewGame,
    reinvestigateCase,
    resumeCase,
    updateProfile,
    handleClearPromotion,
  } = engine;

  if (isLoading) {
    return (
      <div className="w-screen h-screen bg-slate-950 flex flex-col items-center justify-center font-mono">
        <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin mb-4" />
        <span className="text-cyan-400 text-xs tracking-widest uppercase animate-pulse">
          Decrypting Forensic Terminal...
        </span>
      </div>
    );
  }

  const isCase1Solved = profile?.casesSolved?.includes('sector-7');

  return (
    <div className={`w-screen h-screen bg-slate-950 ${currentScreen === 'home' ? 'overflow-y-auto overflow-x-hidden' : 'overflow-hidden'}`}>
      {/* Route: Home Screen vs Case Screen */}
      {currentScreen === 'home' ? (
        <HomePage
          profile={profile}
          hasActiveSession={!!session}
          activeSessionEnergy={energy}
          activeSessionCluesCount={unlockedClues.length}
          isCase1Solved={isCase1Solved}
          onStartCase={() => startNewGame()}
          onRestartCase={reinvestigateCase}
          onResumeCase={resumeCase}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenSignIn={() => setIsSignInOpen(true)}
          onClearPromotion={handleClearPromotion}
        />
      ) : (
        <VisualNovelScreen engine={engine} />
      )}

      {/* Global Profile Management Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSaveProfile={updateProfile}
      />

      {/* Global Agency Sign-In Modal */}
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        profile={profile}
        onSignIn={(newProfile) => updateProfile(newProfile)}
      />
    </div>
  );
}

export default App;
