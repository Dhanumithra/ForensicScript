import narrativeData from './localNarrativeData.json';

const SESSION_STORAGE_PREFIX = 'fs_local_session_';

const generateUuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const getStoredSession = (sessionId) => {
  try {
    const raw = localStorage.getItem(`${SESSION_STORAGE_PREFIX}${sessionId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveStoredSession = (session) => {
  try {
    session.updated_at = new Date().toISOString();
    localStorage.setItem(`${SESSION_STORAGE_PREFIX}${session.session_id}`, JSON.stringify(session));
  } catch (err) {
    console.warn('Local session save error:', err);
  }
};

export const localEngine = {
  getCase: async (caseId = 'sector-7') => {
    const c = narrativeData.cases[caseId] || narrativeData.cases['sector-7'];
    return c;
  },

  startSession: async (detectiveGender = 'f', caseId = 'sector-7', energy = null) => {
    const targetCase = narrativeData.cases[caseId] || narrativeData.cases['sector-7'];
    const sessionId = generateUuid();
    const initialNodeId = targetCase.initial_node_id;
    const initialNode = narrativeData.nodes[initialNodeId];

    const initialAp = energy !== null && energy !== undefined ? Math.min(50, Math.max(0, energy)) : 50;

    const session = {
      session_id: sessionId,
      case: targetCase.id,
      energy: initialAp,
      unlocked_clues: [],
      visited_nodes: [initialNodeId],
      current_node_id: initialNodeId,
      detective_gender: detectiveGender,
      status: initialAp <= 0 ? 'game_over' : 'active',
      grade: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    saveStoredSession(session);

    return {
      session,
      initial_node: initialNode,
      message: 'Standalone Session Active',
    };
  },

  getSession: async (sessionId) => {
    let session = getStoredSession(sessionId);
    if (!session) {
      // Auto-create if lost
      const start = await localEngine.startSession('f', 'sector-7');
      session = start.session;
    }

    const caseData = narrativeData.cases[session.case] || narrativeData.cases['sector-7'];
    const currentNode = narrativeData.nodes[session.current_node_id] || narrativeData.nodes[caseData.initial_node_id];

    return {
      session,
      current_node: currentNode,
      case: caseData,
    };
  },

  takeAction: async (sessionId, nextNodeId, energyDelta = 0, clueUnlock = null) => {
    const session = getStoredSession(sessionId);
    if (!session) {
      throw { status: 400, data: { error: 'Session not found' } };
    }

    if (session.status === 'game_over' || session.energy <= 0) {
      throw {
        status: 400,
        data: {
          error: 'Detective focus depleted (0 AP). Please wait for AP recharge.',
          status: 'game_over',
          energy: session.energy,
        },
      };
    }

    const node = narrativeData.nodes[nextNodeId];
    if (!node) {
      throw { status: 404, data: { error: 'Node not found' } };
    }

    const visited = session.visited_nodes || [];
    const isVisited = visited.includes(nextNodeId);

    let delta = 0;
    if (!isVisited) {
      delta = energyDelta !== 0 ? energyDelta : node.energy_delta || 0;
    }

    let newEnergy = Math.min(50, Math.max(0, session.energy + delta));
    session.energy = newEnergy;
    if (newEnergy <= 0) {
      session.status = 'game_over';
    }

    const unlocked = new Set(session.unlocked_clues || []);
    const cluesToAdd = [];

    const rawClue = clueUnlock || node.clue_unlock;
    if (rawClue) {
      const tokens = rawClue.split(',').map((c) => c.trim()).filter(Boolean);
      tokens.forEach((c) => {
        if (!unlocked.has(c)) {
          unlocked.add(c);
          cluesToAdd.push(c);
        }
      });
    }

    session.unlocked_clues = Array.from(unlocked);
    if (!isVisited) {
      visited.push(nextNodeId);
      session.visited_nodes = visited;
    }
    session.current_node_id = nextNodeId;

    saveStoredSession(session);

    return {
      session,
      dialogue_node: node,
      energy_delta: delta,
      unlocked_new_clues: cluesToAdd,
      status: session.status,
    };
  },

  interrogateSuspect: async (sessionId, suspect, clueId) => {
    const s = (suspect || '').toLowerCase().trim();
    const c = (clueId || '').toUpperCase().trim();

    // Elena Cruz (Case 1)
    if (s.includes('elena')) {
      if (c === 'E3') {
        return {
          success: true,
          suspect: 'Dr. Elena Cruz',
          sprite: 'elena_shocked',
          headline: 'Alibi Crushed: Fluorinert Coolant Confirmed',
          dialogue: "Where did you... how did you spot that?! Fine! I didn't leave! I used the basement maintenance hatch to sneak back upstairs at 2:50 AM to steal the patent drive. But he was already dead, lying flat in the corridor! I took the drive and fled!",
          testimony: 'Elena confirms Aris Thorne was already dead in the outer corridor before 2:50 AM.',
          audio_cue: 'contradiction',
        };
      }
      return {
        success: false,
        suspect: 'Dr. Elena Cruz',
        sprite: 'elena_defensive',
        headline: 'Objection Rejected',
        dialogue: 'That proves nothing about my whereabouts, Detective. I have work to finish.',
        audio_cue: 'penalty',
      };
    }

    // Kevin Lin (Case 1)
    if (s.includes('kevin')) {
      if (c === 'E4') {
        return {
          success: true,
          suspect: 'Kevin Lin',
          sprite: 'kevin_panicked',
          headline: 'Audit Log Match: Bluetooth Handshake Exposed',
          dialogue: 'Oh god... the Bluetooth handshake logged?! Please, I didn\'t hurt him! An encrypted contact paid me $5,000 in crypto to execute a 90-second camera blackout test script at 03:14 AM! When the feed cut, I peeked out: I saw someone in a tailored dark gray suit dragging a body toward the materials conveyor hatch!',
          testimony: 'Kevin confesses to disabling cameras for a $5,000 bribe. Saw a man in a tailored gray suit push Thorne into the conveyor.',
          audio_cue: 'contradiction',
        };
      }
      return {
        success: false,
        suspect: 'Kevin Lin',
        sprite: 'kevin_nervous',
        headline: 'Objection Rejected',
        dialogue: "I... I don't know what that has to do with the network servers, Detective.",
        audio_cue: 'penalty',
      };
    }

    // Marcus Vance (Case 1)
    if (s.includes('vance')) {
      if (c === 'E5') {
        return {
          success: true,
          suspect: 'Marcus Vance',
          sprite: 'vance_angry',
          headline: 'Motive Unmasked: Falsified Yield Whistleblower Ultimatum',
          dialogue: 'You accessed my private company files. Aris was an unstable perfectionist. Disclosing minor calibration variances would have wiped out our stock price and destroyed decades of my work! But having a disagreement does not prove murder. Sector 7 was sealed from the inside. Explain how I put him in that room!',
          testimony: "Vance confirms Thorne threatened to report him to regulators by 8:00 AM, establishing Vance's murder motive.",
          audio_cue: 'contradiction',
        };
      }
      return {
        success: false,
        suspect: 'Marcus Vance',
        sprite: 'vance_neutral',
        headline: 'Objection Rejected',
        dialogue: 'Circumstantial, Detective. Come back when you have something that can stand up in a courtroom.',
        audio_cue: 'penalty',
      };
    }

    // Vivienne Sterling (Case 2)
    if (s.includes('vivienne')) {
      if (c === 'E1') {
        return {
          success: true,
          suspect: 'Vivienne Sterling',
          sprite: 'vivienne_shocked',
          headline: 'Alibi Demolished: Vitreous Potassium Contradiction',
          dialogue: "No... no, wait! I didn't touch him! I drove here to get the bearer bonds from his safe before he signed them away to his foundation! But when I arrived at 10:38 PM, the study was already locked. I knocked, shouted his name... he never answered. He was already dead inside!",
          testimony: 'Vivienne confirms arriving at 10:38 PM to steal bearer bonds; found the study locked and silent. Julian was already dead inside.',
          audio_cue: 'contradiction',
        };
      }
      return {
        success: false,
        suspect: 'Vivienne Sterling',
        sprite: 'vivienne_defensive',
        headline: 'Objection Rejected',
        dialogue: 'I was on camera at the charity gala at 02:00 AM with three city councilors. You have no legal standing to hold me, Detective.',
        audio_cue: 'penalty',
      };
    }

    // Rowan Brooks (Case 2)
    if (s.includes('rowan') || s.includes('brooks')) {
      if (c === 'E2') {
        return {
          success: true,
          suspect: 'Rowan Brooks',
          sprite: 'rowan_tense',
          headline: 'Security Log Compromise: HVAC Supercooling Exposed',
          dialogue: 'Because I silenced the alert feed for the north wing! Vivienne transferred $250,000 to my Cayman account to mute the exterior gate cameras for forty-five minutes so she could grab her inheritance papers. I thought it was family squabbling! I didn\'t know someone was using that blind spot to freeze a corpse!',
          testimony: 'Rowan confesses to accepting a $250k bribe from Vivienne to blind the north wing cameras and silence HVAC environmental alerts.',
          audio_cue: 'contradiction',
        };
      }
      return {
        success: false,
        suspect: 'Rowan Brooks',
        sprite: 'rowan_neutral',
        headline: 'Objection Rejected',
        dialogue: 'My perimeter was secure. The environmental and door telemetry was monitored from my desk all night.',
        audio_cue: 'penalty',
      };
    }

    // Dr. Cedric Laurent (Case 2)
    if (s.includes('cedric') || s.includes('laurent')) {
      if (c === 'E4') {
        return {
          success: true,
          suspect: 'Dr. Cedric Laurent',
          sprite: 'cedric_neutral',
          headline: 'Neural Loop Unmasked: Replayed EEG Glitch',
          dialogue: "A telemetry transmission buffer error, Detective. In experimental bio-interfaces, packet repeating is common. It doesn't prove malicious intent.",
          testimony: 'Cedric is rattled that his 11:00 PM - 02:00 AM EEG vitals loop was detected.',
          audio_cue: 'contradiction',
        };
      }
      if (c === 'E6') {
        return {
          success: true,
          suspect: 'Dr. Cedric Laurent',
          sprite: 'cedric_cold',
          headline: 'Intercom Voice Deepfake: 19.2 kHz Artifact',
          dialogue: "...Go on, Detective. Let's see what else you think you've pieced together.",
          testimony: "Spectral filtering matches the 01:30 AM intercom call to Cedric's VocalSynth-Pro voice synthesis workstation.",
          audio_cue: 'contradiction',
        };
      }
      if (c === 'E3') {
        return {
          success: true,
          suspect: 'Dr. Cedric Laurent',
          sprite: 'cedric_cold',
          headline: 'Murder Weapon Identified: Transdermal DMSO Neurotoxin',
          dialogue: "DMSO and batrachotoxin... a lethal cocktail that penetrates skin without leaving a puncture wound. But you still haven't proven motive, Detective.",
          testimony: 'Cedric acknowledges the neurotoxic mechanism used on the biometric thumb scanner.',
          audio_cue: 'contradiction',
        };
      }
      if (c === 'E5') {
        return {
          success: true,
          suspect: 'Dr. Cedric Laurent',
          sprite: 'cedric_defeated',
          headline: 'The Phantom Heir Unmasked: Full Confession',
          dialogue: "He was going to give forty years of groundbreaking neural patents to an offshore charity trust! A man who never acknowledged my mother, never gave me his name, and treated me like a hired technician. I built his empire's neural algorithms with my own mind! Everything in that estate belonged to me!",
          testimony: "Cedric breaks completely, confessing to Julian's premeditated murder after being disinherited.",
          audio_cue: 'contradiction',
        };
      }
      return {
        success: false,
        suspect: 'Dr. Cedric Laurent',
        sprite: 'cedric_neutral',
        headline: 'Objection Rejected',
        dialogue: "I monitored Julian's telemetry from the clinic, Detective. Everything was stable until 02:00 AM.",
        audio_cue: 'penalty',
      };
    }

    return {
      success: false,
      headline: 'Unknown Suspect',
      dialogue: 'Invalid interrogation target.',
    };
  },

  accuse: async (sessionId, culprit, method) => {
    const session = getStoredSession(sessionId);
    if (!session) {
      throw { status: 400, data: { error: 'Session not found' } };
    }

    const caseData = narrativeData.cases[session.case] || narrativeData.cases['sector-7'];
    const clueCount = (session.unlocked_clues || []).length;
    const minRequired = caseData.min_evidence_required || 3;

    if (clueCount < minRequired) {
      throw {
        status: 400,
        data: {
          error: 'INSUFFICIENT_EVIDENCE',
          message: `Insufficient Evidence! The prosecutor rejects your indictment. You hold ${clueCount}/${caseData.total_evidence} clues. At least ${minRequired} confirmed clues are required to secure an arrest warrant.`,
          clues_held: clueCount,
          min_required: minRequired,
        },
      };
    }

    const c = (culprit || '').toLowerCase().trim();
    const m = (method || '').toLowerCase().trim();

    const isCase2 = session.case === 'phantom-heir' || c.includes('cedric') || c.includes('laurent');

    if (isCase2) {
      const isCulpritCorrect = c.includes('cedric') || c.includes('laurent');
      const isMethodCorrect = ['dmso', 'scanner', 'hvac', 'temperature', 'toxin', 'batrachotoxin'].some((k) => m.includes(k));

      if (isCulpritCorrect && isMethodCorrect) {
        session.status = 'solved';
        session.is_completed = true;
        const grade = session.energy >= 40 ? 'Master Forensic Detective' : 'Senior Homicide Inspector';
        session.grade = grade;
        saveStoredSession(session);

        return {
          success: true,
          verdict: 'GUILTY - FIRST-DEGREE PREMEDITATED MURDER',
          culprit: 'Dr. Cedric Laurent (Personal Neurologist & Illegitimate Son)',
          grade,
          final_energy: session.energy,
          sprite: 'cedric_defeated',
          confession: "He was going to give forty years of groundbreaking neural patents to an offshore charity trust! A man who never acknowledged my mother, never gave me his name, and treated me like a hired technician. I built his empire's neural algorithms with my own mind! Everything in that estate belonged to me!",
          case_summary: [
            'At 09:00 PM: Julian discovered Cedric was secretly trafficking neural implant patents on the black market and executed a holographic codicil disinheriting him (E5: Disinheritance Codicil).',
            'At 10:15 PM: Cedric coated the Obsidian Study\'s outer biometric thumb-reader with transdermal DMSO and batrachotoxin (E3: Chemical swab).',
            'At 10:40 PM: Julian pressed his thumb to the scanner to seal the vault for the night, immediately absorbing a lethal neurotoxic dose.',
            'At 10:45 PM: Cedric overrode the study HVAC to supercool the room to 6°C, artificially accelerating body cooling to corrupt algor mortis calculations (E2: HVAC log).',
            'At 11:00 PM to 02:00 AM: Cedric looped Julian\'s EEG telemetry on the medical clinic server to simulate active brainwaves (E4: Cloned neural glitch).',
            'At 01:30 AM: Cedric broadcast a neural AI voice clone of Julian over the security intercom to deceive the night guard (E6: Synthesized intercom artifact).',
            'Fatal Flaw: Julian\'s ocular vitreous potassium levels ([K+] = 14.8 mmol/L) proved death occurred before 10:50 PM, completely shattering Cedric\'s alibi (E1).'
          ],
          audio_cue: 'victory',
        };
      }

      session.energy = Math.max(0, session.energy - 20);
      if (session.energy <= 0) session.status = 'game_over';
      saveStoredSession(session);

      const feedback = [];
      if (!isCulpritCorrect) feedback.push('Incorrect culprit named. Review the medical motive and disinheritance codicil.');
      if (!isMethodCorrect) feedback.push('Incorrect murder method. Remember the transdermal poison on the scanner and environmental HVAC tampering.');

      throw {
        status: 400,
        data: {
          error: 'WRONG_INDICTMENT',
          message: 'Indictment Rejected! ' + feedback.join(' '),
          current_energy: session.energy,
          status: session.status,
          audio_cue: 'penalty',
        },
      };
    } else {
      // Case 1
      const isCulpritCorrect = c.includes('vance');
      const isMethodCorrect = m.includes('conveyor') || m.includes('heat') || m.includes('purge');

      if (isCulpritCorrect && isMethodCorrect) {
        session.status = 'solved';
        session.is_completed = true;
        const grade = session.energy >= 40 ? 'Master Forensic Detective' : 'Senior Homicide Inspector';
        session.grade = grade;
        saveStoredSession(session);

        return {
          success: true,
          verdict: 'GUILTY - FIRST-DEGREE PREMEDITATED MURDER',
          culprit: 'Marcus Vance (CEO & Founder, Aether Biometrix)',
          grade,
          final_energy: session.energy,
          sprite: 'vance_defeated',
          confession: "You think you understand the pressure of keeping a billion-dollar venture solvent?! Thorne wouldn't listen to reason! He was going to file that whistleblower report at 8:00 AM sharp and trigger an SEC freeze. I offered him shares, board seats, patent equity... he threw it back in my face! I had to protect this company!",
          case_summary: [
            'At 03:00 AM: Vance met Thorne in the cleanroom approach corridor. Following a heated argument over the whistleblower report, Vance struck Thorne, fracturing his temporal bone (E1: Autopsy).',
            'At 03:14 AM: Vance paid firmware engineer Kevin Lin $5,000 in cryptocurrency to disable the CCTV corridor cameras for 90 seconds (E4: Audit log).',
            'At 03:15 AM: Vance pushed Thorne\'s body onto the motorized intake wafer conveyor through the pass-through airlock, depositing him inside the sealed cleanroom (E2: Conveyor motor log).',
            'At 03:20 AM: Vance scheduled an emergency thermal nitrogen clean cycle to wipe DNA traces from the floor, accidentally leaving micro-trace Fluorinert coolant (E3: Coolant residue).',
            'Fatal Flaw: Thorne\'s encrypted flash drive containing Vance\'s corporate fraud emails was found secured on the victim\'s lanyard (E5: Flash drive).'
          ],
          audio_cue: 'victory',
        };
      }

      session.energy = Math.max(0, session.energy - 20);
      if (session.energy <= 0) session.status = 'game_over';
      saveStoredSession(session);

      const feedback = [];
      if (!isCulpritCorrect) feedback.push('Incorrect culprit named. Review the suspects who had executive motive.');
      if (!isMethodCorrect) feedback.push('Incorrect murder method. Remember the conveyor pass-through hatch and nitrogen heat cycle.');

      throw {
        status: 400,
        data: {
          error: 'WRONG_INDICTMENT',
          message: 'Indictment Rejected! ' + feedback.join(' '),
          current_energy: session.energy,
          status: session.status,
          audio_cue: 'penalty',
        },
      };
    }
  },

  reinvestigateSession: async (sessionId, energy = null) => {
    const session = getStoredSession(sessionId);
    if (!session) {
      return localEngine.startSession('f', 'sector-7', energy);
    }

    const caseData = narrativeData.cases[session.case] || narrativeData.cases['sector-7'];
    const initialNodeId = caseData.initial_node_id;

    session.current_node_id = initialNodeId;
    session.unlocked_clues = [];
    session.visited_nodes = [initialNodeId];
    session.status = session.energy <= 0 ? 'game_over' : 'active';
    session.grade = null;
    session.is_completed = false;

    if (energy !== null && energy !== undefined) {
      session.energy = Math.min(50, Math.max(0, energy));
    }

    saveStoredSession(session);

    return {
      session,
      initial_node: narrativeData.nodes[initialNodeId],
      message: 'Re-investigation initialized',
    };
  },

  syncEnergy: async (sessionId, energy) => {
    const session = getStoredSession(sessionId);
    if (session) {
      session.energy = Math.min(50, Math.max(0, energy));
      if (session.energy >= 50 && session.status === 'game_over') {
        session.status = 'active';
      }
      saveStoredSession(session);
      return { energy: session.energy, status: session.status };
    }
    return { energy, status: 'active' };
  },
};
