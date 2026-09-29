const BASE_URL = 'http://127.0.0.1:8000/api';

export const api = {
  startSession: async (detectiveGender = 'f', caseId = 'sector-7', energy = null) => {
    const payload = { case_id: caseId, detective_gender: detectiveGender };
    if (energy !== null && energy !== undefined) {
      payload.energy = energy;
    }
    const res = await fetch(`${BASE_URL}/sessions/start/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Failed to start session: ${res.statusText}`);
    return res.json();
  },

  getSession: async (sessionId) => {
    const res = await fetch(`${BASE_URL}/sessions/${sessionId}/`);
    if (!res.ok) throw new Error(`Failed to restore session: ${res.statusText}`);
    return res.json();
  },

  getCase: async (caseId = 'sector-7') => {
    const res = await fetch(`${BASE_URL}/cases/${caseId}/`);
    if (!res.ok) throw new Error(`Failed to load case: ${res.statusText}`);
    return res.json();
  },

  takeAction: async (sessionId, nextNodeId, energyDelta = 0, clueUnlock = null) => {
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

  interrogateSuspect: async (sessionId, suspect, clueId) => {
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

  accuse: async (sessionId, culprit, method) => {
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

  reinvestigateSession: async (sessionId, energy = null) => {
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

  syncEnergy: async (sessionId, energy) => {
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
};
