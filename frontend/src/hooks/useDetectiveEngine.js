import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../services/api';
import {
  getProfile,
  saveProfile,
  markCaseSolved,
  clearPromotionFlag,
} from '../utils/profileStorage';
import {
  initAudio,
  playClueChime,
  playPenaltyBuzz,
  playContradictionChord,
  playVictoryFanfare,
  toggleMute,
  getMuteStatus,
} from '../services/audio';

const STORAGE_KEY = 'forensic_session_id';
const AP_STORAGE_KEY = 'forensic_player_ap';
const AP_TIMESTAMP_KEY = 'forensic_player_ap_timestamp';

// Helper: Read persistent AP and credit offline passive recharge (+1 AP / min, max 50 AP)
const getInitialAp = () => {
  try {
    const saved = localStorage.getItem(AP_STORAGE_KEY);
    const savedTime = localStorage.getItem(AP_TIMESTAMP_KEY);
    let ap = saved !== null ? parseInt(saved, 10) : 50;
    if (isNaN(ap)) ap = 50;

    if (savedTime && ap < 50) {
      const elapsedMinutes = Math.floor((Date.now() - parseInt(savedTime, 10)) / 60000);
      if (elapsedMinutes > 0) {
        ap = Math.min(50, ap + elapsedMinutes);
      }
    }
    return Math.max(0, Math.min(50, ap));
  } catch {
    return 50;
  }
};

export const useDetectiveEngine = () => {
  const [profile, setProfile] = useState(() => getProfile());
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home' by default!
  const [session, setSession] = useState(null);
  const [caseData, setCaseData] = useState(null);
  const [currentNode, setCurrentNode] = useState(null);
  const [energy, setEnergy] = useState(() => getInitialAp()); // Persistent Max 50 AP
  const [unlockedClues, setUnlockedClues] = useState([]);
  const [detectiveGender, setDetectiveGender] = useState(() => getProfile().detectiveGender || 'f');

  // Synchronize energy changes to localStorage with timestamp
  useEffect(() => {
    try {
      localStorage.setItem(AP_STORAGE_KEY, energy.toString());
      localStorage.setItem(AP_TIMESTAMP_KEY, Date.now().toString());
    } catch (e) {
      console.warn('Could not persist AP:', e);
    }
  }, [energy]);

  // Dialogue History Transcript Log
  const [dialogueHistory, setDialogueHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // UI & Modals State
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isInterrogationOpen, setIsInterrogationOpen] = useState(false);
  const [isAccusationOpen, setIsAccusationOpen] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isVictorious, setIsVictorious] = useState(false);
  const [victoryData, setVictoryData] = useState(null);
  const [notification, setNotification] = useState(null);
  const [floatingAp, setFloatingAp] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(getMuteStatus());

  // Active Sprite override (e.g. for confrontations)
  const [spriteOverride, setSpriteOverride] = useState(null);

  const notificationTimeoutRef = useRef(null);
  const apTimeoutRef = useRef(null);

  const showNotification = useCallback((message, type = 'info', duration = 3500) => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    setNotification({ message, type });
    notificationTimeoutRef.current = setTimeout(() => {
      setNotification(null);
    }, duration);
  }, []);

  const triggerFloatingAp = useCallback((delta) => {
    if (apTimeoutRef.current) clearTimeout(apTimeoutRef.current);
    if (delta > 0) {
      setFloatingAp({ text: `+${delta} AP`, type: 'gain' });
    } else if (delta < 0) {
      setFloatingAp({ text: `${delta} AP`, type: 'loss' });
    }
    apTimeoutRef.current = setTimeout(() => {
      setFloatingAp(null);
    }, 2500);
  }, []);

  // Return to Home Screen (preserves active session for resume)
  const returnToHome = useCallback(() => {
    setCurrentScreen('home');
    setIsDossierOpen(false);
    setIsInterrogationOpen(false);
    setIsAccusationOpen(false);
    setIsGameOver(false);
    setIsVictorious(false);
    setSpriteOverride(null);
    setFloatingAp(null);
  }, []);

  // Update profile from ProfileModal
  const updateProfile = useCallback((newProfile) => {
    saveProfile(newProfile);
    setProfile(newProfile);
    if (newProfile.detectiveGender) {
      setDetectiveGender(newProfile.detectiveGender);
    }
  }, []);

  const handleClearPromotion = useCallback(() => {
    const updated = clearPromotionFlag();
    setProfile(updated);
  }, []);

  // Hydrate session from localStorage on mount
  useEffect(() => {
    const hydrateSession = async () => {
      try {
        const caseRes = await api.getCase('sector-7');
        setCaseData(caseRes);

        const currentPersistentAp = getInitialAp();
        setEnergy(currentPersistentAp);

        const savedSessionId = localStorage.getItem(STORAGE_KEY);
        if (savedSessionId) {
          const res = await api.getSession(savedSessionId);
          setSession(res.session);
          // Strict max 50 AP: take session energy capped at 50
          const activeAp = Math.min(50, res.session.energy);
          setEnergy(activeAp);
          setUnlockedClues(res.session.unlocked_clues || []);
          setDetectiveGender(res.session.detective_gender || profile.detectiveGender || 'f');
          setCurrentNode(res.current_node);

          if (res.session.status === 'game_over' || activeAp <= 0) {
            setIsGameOver(true);
          } else if (res.session.status === 'solved') {
            setIsVictorious(true);
          }
        }
      } catch (err) {
        console.warn('Could not restore saved session, clearing storage:', err);
        localStorage.removeItem(STORAGE_KEY);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    hydrateSession();
  }, [profile.detectiveGender]);

  // Start New Game or Restart Case (Strictly maintains current AP - max 50 AP)
  const startNewGame = async (gender = null) => {
    setIsLoading(true);
    initAudio(); // Satisfies browser autoplay policy on click
    const activeGender = gender || profile.detectiveGender || 'f';
    try {
      localStorage.removeItem(STORAGE_KEY);
      // Strictly maintain whatever AP the player currently holds (max 50)
      const currentAp = Math.min(50, Math.max(0, energy));
      const res = await api.startSession(activeGender, 'sector-7', currentAp);
      localStorage.setItem(STORAGE_KEY, res.session.session_id);

      setSession(res.session);
      setEnergy(res.session.energy);
      setUnlockedClues(res.session.unlocked_clues || []);
      setDetectiveGender(activeGender);
      setCurrentNode(res.initial_node);
      setSpriteOverride(null);

      const isDepleted = res.session.energy <= 0;
      setIsGameOver(isDepleted);
      setIsVictorious(false);
      setVictoryData(null);
      setIsDossierOpen(false);
      setIsInterrogationOpen(false);
      setIsAccusationOpen(false);
      setIsHistoryOpen(false);
      setDialogueHistory([]);
      setCurrentScreen('case');

      if (isDepleted) {
        showNotification('Focus Depleted (0/50 AP). Lockout active: Wait for recharge (+1 AP/min).', 'penalty', 5000);
      } else {
        showNotification(`Investigation Active (${res.session.energy}/50 AP)`, 'info');
      }
    } catch (err) {
      console.error('Error starting game:', err);
      showNotification('Failed to start session. Ensure backend is running.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Re-investigate Case: Restarts narrative & clues from Scene 1 while STRICTLY PRESERVING CURRENT AP
  const reinvestigateCase = async () => {
    if (!session) return;
    setIsLoading(true);
    initAudio();
    try {
      const currentAp = Math.min(50, Math.max(0, energy));
      const res = await api.reinvestigateSession(session.session_id, currentAp);
      setSession(res.session);
      // STRICTLY PRESERVE what the player has (max 50)
      setEnergy(res.session.energy);
      setUnlockedClues([]);
      setCurrentNode(res.initial_node);
      setSpriteOverride(null);
      setDialogueHistory([]);

      setIsDossierOpen(false);
      setIsInterrogationOpen(false);
      setIsAccusationOpen(false);
      setIsVictorious(false);
      setVictoryData(null);
      setCurrentScreen('case');

      if (res.session.energy <= 0 || res.session.status === 'game_over') {
        setIsGameOver(true);
        showNotification(`Action Points Depleted (${res.session.energy}/50 AP). Internal affairs lockout: Wait for +1 AP/min recharge.`, 'penalty', 6000);
      } else {
        setIsGameOver(false);
        showNotification(`Re-investigating Case: Starting with ${res.session.energy}/50 AP`, 'info', 4000);
      }
    } catch (err) {
      console.error('Error re-investigating case:', err);
      // Fallback local reset keeping current energy intact
      setUnlockedClues([]);
      setDialogueHistory([]);
      setIsDossierOpen(false);
      setIsInterrogationOpen(false);
      setIsAccusationOpen(false);
      if (energy <= 0) {
        setIsGameOver(true);
      }
      showNotification(`Re-investigating with remaining ${energy}/50 AP`, 'info', 4000);
    } finally {
      setIsLoading(false);
    }
  };

  const resumeCase = () => {
    initAudio();
    setCurrentScreen('case');
    if (energy <= 0) {
      setIsGameOver(true);
      showNotification('Action Points Depleted (0/50 AP). Wait for recharge (+1 AP/min).', 'penalty', 4000);
    } else {
      showNotification(`Resuming Active Investigation (${energy}/50 AP)`, 'info', 2000);
    }
  };

  // Passive AP Regeneration (+1 AP per minute, up to 50 AP MAX)
  useEffect(() => {
    const regenInterval = setInterval(() => {
      setEnergy((prevEnergy) => {
        if (prevEnergy < 50) {
          const nextEnergy = Math.min(50, prevEnergy + 1);
          if (prevEnergy < 50 && nextEnergy >= 50) {
            setIsGameOver(false);
            showNotification('Detective Focus Restored: 50 AP Reached (Max)', 'success', 4000);
          }
          if (session?.session_id) {
            api.syncEnergy(session.session_id, nextEnergy).catch(() => {});
          }
          return nextEnergy;
        }
        return prevEnergy;
      });
    }, 60000);

    return () => clearInterval(regenInterval);
  }, [session?.session_id, showNotification]);

  // Append dialogue to transcript history log
  useEffect(() => {
    if (!currentNode?.text) return;
    setDialogueHistory((prev) => {
      if (prev.length > 0 && prev[prev.length - 1].node_id === currentNode.node_id) {
        return prev;
      }
      return [
        ...prev,
        {
          node_id: currentNode.node_id,
          speaker: currentNode.speaker || 'DETECTIVE',
          text: currentNode.text,
          sprite: currentNode.sprite,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ];
    });
  }, [currentNode]);

  // Instant recovery action for developer/player convenience
  const fastRecoverAp = useCallback(async () => {
    const recoveredEnergy = 50;
    setEnergy(recoveredEnergy);
    setIsGameOver(false);
    if (session?.session_id) {
      try {
        await api.syncEnergy(session.session_id, recoveredEnergy);
      } catch (e) {
        console.warn('Failed to sync fast recovery with backend:', e);
      }
    }
    showNotification('Restorative Coffee: Focus Restored to 50 AP', 'success');
  }, [session?.session_id, showNotification]);

  const resumeWithRecoveredAp = useCallback(async () => {
    if (energy >= 50) {
      setIsGameOver(false);
      if (session?.session_id) {
        try {
          await api.syncEnergy(session.session_id, energy);
        } catch (e) {
          console.warn('Failed to sync recovered energy with backend:', e);
        }
      }
      showNotification(`Investigation Resumed (${energy} AP)`, 'success');
    } else {
      showNotification(`Need at least 50 AP to resume (Currently: ${energy} AP). Recharging +1 AP/min.`, 'penalty');
    }
  }, [energy, session?.session_id, showNotification]);

  // Perform Node Choice Action
  const takeAction = async (choice) => {
    if (!session || isGameOver || energy <= 0) {
      if (energy <= 0) {
        setIsGameOver(true);
        showNotification('Focus Depleted (0 AP). Wait for recharge (+1 AP/min until 50 AP).', 'penalty');
      }
      return;
    }
    try {
      setSpriteOverride(null);
      const res = await api.takeAction(
        session.session_id,
        choice.next_node_id,
        choice.energy_delta || 0,
        choice.clue_unlock || null
      );

      setSession(res.session);
      setEnergy(Math.min(50, res.session.energy));
      setUnlockedClues(res.session.unlocked_clues || []);
      setCurrentNode(res.dialogue_node);

      // Sound & Notification & Floating AP effects
      if (res.energy_delta !== 0) {
        triggerFloatingAp(res.energy_delta);
      }

      if (res.unlocked_new_clues && res.unlocked_new_clues.length > 0) {
        playClueChime();
        showNotification(
          `Clue Unlocked: ${res.unlocked_new_clues.join(', ')}`,
          'clue'
        );
      } else if (res.energy_delta < 0) {
        playPenaltyBuzz();
        showNotification(`Reckless Action: Focus Depleted`, 'penalty');
      } else if (res.energy_delta > 0) {
        playClueChime();
        showNotification(`Forensic Progress Made`, 'success');
      }

      if (res.status === 'game_over') {
        playPenaltyBuzz();
        setIsGameOver(true);
      }
    } catch (err) {
      console.error('Action error:', err);
      if (err?.data?.status === 'game_over') {
        setIsGameOver(true);
      }
    }
  };

  // Suspect Interrogation Confrontation
  const presentEvidence = async (suspect, clueId) => {
    if (!session) return null;
    try {
      const res = await api.interrogateSuspect(session.session_id, suspect, clueId);
      if (res.success) {
        playContradictionChord();
        setSpriteOverride(res.sprite);
        showNotification(`Contradiction Exposed! ${res.headline}`, 'clue', 5000);
      } else {
        playPenaltyBuzz();
        showNotification(res.headline || 'Irrelevant Evidence Presented', 'penalty');
      }
      return res;
    } catch (err) {
      playPenaltyBuzz();
      showNotification('Confrontation Failed', 'penalty');
      return null;
    }
  };

  // Submit Final Indictment
  const submitAccusation = async (culprit, method) => {
    if (!session) return null;
    try {
      const res = await api.accuse(session.session_id, culprit, method);
      if (res.success) {
        playVictoryFanfare();
        setSpriteOverride(res.sprite);
        setIsVictorious(true);
        setVictoryData(res);
        setIsAccusationOpen(false);

        // Mark case solved and trigger promotion in profile!
        const updatedProfile = markCaseSolved('sector-7');
        setProfile(updatedProfile);

        showNotification('Case Solved! Indictment Confirmed', 'success', 6000);
      }
      return res;
    } catch (err) {
      playPenaltyBuzz();
      const errorData = err.data || {};
      if (errorData.error === 'INSUFFICIENT_EVIDENCE') {
        showNotification(errorData.message, 'penalty', 5000);
      } else {
        showNotification(errorData.message || 'Indictment Rejected (-20 AP)', 'penalty', 4000);
        if (errorData.current_energy !== undefined) {
          const nextEnergy = Math.min(50, errorData.current_energy);
          setEnergy(nextEnergy);
          if (errorData.status === 'game_over' || nextEnergy <= 0) {
            setIsGameOver(true);
          }
        }
      }
      return errorData;
    }
  };

  // Keyboard Navigation Controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if typing in an input
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key === 'Escape') {
        setIsDossierOpen(false);
        setIsInterrogationOpen(false);
        setIsAccusationOpen(false);
      } else if (e.key === 'e' || e.key === 'E') {
        setIsDossierOpen((prev) => !prev);
      } else if (e.key === 'i' || e.key === 'I') {
        setIsInterrogationOpen((prev) => !prev);
      } else if (e.key === 'a' || e.key === 'A') {
        const minRequired = caseData?.min_evidence_required || 3;
        if (unlockedClues.length >= minRequired) {
          setIsAccusationOpen((prev) => !prev);
        } else {
          showNotification(`Accusation Locked: Requires at least ${minRequired} confirmed clues (50%)`, 'penalty');
        }
      } else if (e.key === 'l' || e.key === 'L') {
        setIsHistoryOpen((prev) => !prev);
      } else if (e.key === 'm' || e.key === 'M') {
        const muted = toggleMute();
        setIsAudioMuted(muted);
        showNotification(muted ? 'Audio Muted' : 'Audio Enabled', 'info', 2000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [unlockedClues.length, showNotification, caseData?.min_evidence_required]);

  const handleToggleAudio = () => {
    const muted = toggleMute();
    setIsAudioMuted(muted);
    showNotification(muted ? 'Audio Muted' : 'Audio Unmuted', 'info', 1500);
  };

  return {
    session,
    caseData,
    currentNode,
    energy,
    unlockedClues,
    detectiveGender,
    spriteOverride,
    isLoading,
    currentScreen,
    profile,
    isProfileOpen,
    setIsProfileOpen,
    isSignInOpen,
    setIsSignInOpen,
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
    resumeCase,
    returnToHome,
    updateProfile,
    handleClearPromotion,
    takeAction,
    presentEvidence,
    submitAccusation,
    handleToggleAudio,
  };
};

