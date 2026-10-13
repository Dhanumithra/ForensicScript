import { localEngine } from './localEngine';

const BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://127.0.0.1:8000/api');

// If backend returns 500/offline, flip to local engine automatically to guarantee zero downtime
let isFallbackActive = false;

const executeWithFallback = async (networkFn, fallbackFn) => {
  if (isFallbackActive) {
    return fallbackFn();
  }

  try {
    const res = await networkFn();
    return res;
  } catch (err) {
    // If it's a 400 business logic response (penalty, incorrect accusation, etc.), bubble it up
    if (err && err.status === 400 && err.data) {
      throw err;
    }

    console.warn('Backend API request failed or returned 500. Seamlessly engaging client-side forensic engine.', err);
    isFallbackActive = true;
    return fallbackFn();
  }
};

export const api = {
  startSession: async (detectiveGender = 'f', caseId = 'sector-7', energy = null) => {
    return executeWithFallback(
      async () => {
        const payload = { case_id: caseId, detective_gender: detectiveGender };
        if (energy !== null && energy !== undefined) {
          payload.energy = energy;
        }
        const res = await fetch(`${BASE_URL}/sessions/start/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          if (res.status === 400) {
            const data = await res.json();
            throw { status: 400, data };
          }
          throw new Error(`Server status ${res.status}`);
        }
        return res.json();
      },
      () => localEngine.startSession(detectiveGender, caseId, energy)
    );
  },

  getSession: async (sessionId) => {
    return executeWithFallback(
      async () => {
        const res = await fetch(`${BASE_URL}/sessions/${sessionId}/`);
        if (!res.ok) {
          if (res.status === 400) {
            const data = await res.json();
            throw { status: 400, data };
          }
          throw new Error(`Server status ${res.status}`);
        }
        return res.json();
      },
      () => localEngine.getSession(sessionId)
    );
  },

  getCase: async (caseId = 'sector-7') => {
    return executeWithFallback(
      async () => {
        const res = await fetch(`${BASE_URL}/cases/${caseId}/`);
        if (!res.ok) {
          if (res.status === 400) {
            const data = await res.json();
            throw { status: 400, data };
          }
          throw new Error(`Server status ${res.status}`);
        }
        return res.json();
      },
      () => localEngine.getCase(caseId)
    );
  },

  takeAction: async (sessionId, nextNodeId, energyDelta = 0, clueUnlock = null) => {
    return executeWithFallback(
      async () => {
        const res = await fetch(`${BASE_URL}/sessions/action/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionId,
            next_node_id: nextNodeId,
            energy_delta: energyDelta,
            clue_unlock: clueUnlock,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw { status: res.status, data };
        }
        return data;
      },
      () => localEngine.takeAction(sessionId, nextNodeId, energyDelta, clueUnlock)
    );
  },

  interrogateSuspect: async (sessionId, suspect, clueId) => {
    return executeWithFallback(
      async () => {
        const res = await fetch(`${BASE_URL}/sessions/interrogate/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionId,
            suspect,
            clue_id: clueId,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw { status: res.status, data };
        }
        return data;
      },
      () => localEngine.interrogateSuspect(sessionId, suspect, clueId)
    );
  },

  accuse: async (sessionId, culprit, method) => {
    return executeWithFallback(
      async () => {
        const res = await fetch(`${BASE_URL}/sessions/accuse/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionId,
            culprit,
            method,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw { status: res.status, data };
        }
        return data;
      },
      () => localEngine.accuse(sessionId, culprit, method)
    );
  },

  reinvestigateSession: async (sessionId, energy = null) => {
    return executeWithFallback(
      async () => {
        const res = await fetch(`${BASE_URL}/sessions/reinvestigate/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionId,
            energy: energy !== null ? energy : undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw { status: res.status, data };
        }
        return data;
      },
      () => localEngine.reinvestigateSession(sessionId, energy)
    );
  },

  syncEnergy: async (sessionId, energy) => {
    return executeWithFallback(
      async () => {
        const res = await fetch(`${BASE_URL}/sessions/sync-energy/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionId,
            energy,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw { status: res.status, data };
        }
        return data;
      },
      () => localEngine.syncEnergy(sessionId, energy)
    );
  },
};
