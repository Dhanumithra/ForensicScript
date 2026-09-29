const PROFILE_KEY = 'forensic_user_profile';
const DETECTIVES_KEY = 'forensic_registered_detectives';

export const RANKS = [
  'Bronze 1',
  'Bronze 2',
  'Bronze 3',
  'Silver 1',
  'Silver 2',
  'Silver 3',
  'Gold 1',
  'Gold 2',
  'Gold 3',
];

const DEFAULT_PROFILE = {
  firstName: 'Catherine',
  lastName: 'Ward',
  detectiveGender: 'f', // 'f' or 'm'
  rank: 'Bronze 1',
  casesSolved: [], // e.g. ['sector-7']
  badgeNumber: 'DT-8094',
  email: 'c.ward@police.dept',
  pin: '1234',
  isSignedIn: true,
};

export const getRegisteredDetectives = () => {
  try {
    const data = localStorage.getItem(DETECTIVES_KEY);
    if (!data) {
      const initial = [DEFAULT_PROFILE];
      localStorage.setItem(DETECTIVES_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data) || [DEFAULT_PROFILE];
  } catch {
    return [DEFAULT_PROFILE];
  }
};

export const getProfile = () => {
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    if (!data) {
      saveProfile(DEFAULT_PROFILE);
      return DEFAULT_PROFILE;
    }
    const parsed = { ...DEFAULT_PROFILE, ...JSON.parse(data) };
    // Migrate legacy or invalid ranks to 9-tier system
    if (!RANKS.includes(parsed.rank)) {
      parsed.rank = 'Bronze 1';
      saveProfile(parsed);
    }
    return parsed;
  } catch {
    return DEFAULT_PROFILE;
  }
};

export const saveProfile = (profile) => {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));

    // Also sync with registered detectives list
    const detectives = getRegisteredDetectives();
    const idx = detectives.findIndex(
      (d) => d.badgeNumber?.toUpperCase() === profile.badgeNumber?.toUpperCase()
    );
    if (idx >= 0) {
      detectives[idx] = { ...detectives[idx], ...profile };
    } else {
      detectives.push(profile);
    }
    localStorage.setItem(DETECTIVES_KEY, JSON.stringify(detectives));
  } catch (err) {
    console.error('Failed to save user profile:', err);
  }
};

export const registerDetective = ({ email, badgeNumber, pin }) => {
  const detectives = getRegisteredDetectives();
  const cleanBadge = badgeNumber.trim().toUpperCase();
  const cleanEmail = email.trim().toLowerCase();
  const cleanPin = pin.trim();

  // Check if badge or email already exists
  const existingBadge = detectives.find((d) => d.badgeNumber?.toUpperCase() === cleanBadge);
  if (existingBadge) {
    return {
      success: false,
      error: `Badge ID ${cleanBadge} is already registered in the division.`,
    };
  }

  const newDetective = {
    firstName: 'Detective',
    lastName: cleanBadge,
    email: cleanEmail,
    badgeNumber: cleanBadge,
    pin: cleanPin,
    rank: 'Bronze 1',
    casesSolved: [],
    detectiveGender: 'f',
    isSignedIn: true,
  };

  detectives.push(newDetective);
  try {
    localStorage.setItem(DETECTIVES_KEY, JSON.stringify(detectives));
  } catch (e) {
    console.warn('Could not save detectives list:', e);
  }

  saveProfile(newDetective);
  return { success: true, profile: newDetective };
};

export const loginDetective = ({ badgeNumber, pin }) => {
  const detectives = getRegisteredDetectives();
  const cleanBadge = badgeNumber.trim().toUpperCase();
  const cleanPin = pin.trim();

  const found = detectives.find((d) => d.badgeNumber?.toUpperCase() === cleanBadge);

  if (!found) {
    const current = getProfile();
    if (current.badgeNumber?.toUpperCase() === cleanBadge) {
      if ((current.pin || '1234') === cleanPin) {
        const updated = { ...current, isSignedIn: true };
        saveProfile(updated);
        return { success: true, profile: updated };
      }
    }
    return {
      success: false,
      error: `Badge ID ${cleanBadge} not found in department roster. Please register first.`,
    };
  }

  if ((found.pin || '1234') !== cleanPin) {
    return {
      success: false,
      error: 'Invalid Security PIN Code. Shift authorization denied.',
    };
  }

  const activeProfile = { ...found, isSignedIn: true };
  saveProfile(activeProfile);
  return { success: true, profile: activeProfile };
};

export const markCaseSolved = (caseId) => {
  const profile = getProfile();
  const solved = new Set(profile.casesSolved || []);
  const wasAlreadySolved = solved.has(caseId);

  // CRITICAL RULE: Resolving the same case again does NOT bring a promotion!
  // Only solving a case which they didn't solve previously is rewarded with promotion.
  if (wasAlreadySolved) {
    const updatedProfile = {
      ...profile,
      promoted: false,
    };
    saveProfile(updatedProfile);
    return updatedProfile;
  }

  // First time solving this case: reward promotion!
  solved.add(caseId);
  const updatedCases = Array.from(solved);

  const currentRankIndex = RANKS.indexOf(profile.rank);
  const validIndex = currentRankIndex >= 0 ? currentRankIndex : 0;
  const nextRankIndex = Math.min(RANKS.length - 1, validIndex + 1);
  const updatedRank = RANKS[nextRankIndex];

  const updatedProfile = {
    ...profile,
    casesSolved: updatedCases,
    rank: updatedRank,
    promoted: updatedRank !== profile.rank,
    previousRank: profile.rank,
  };
  saveProfile(updatedProfile);
  return updatedProfile;
};

export const clearPromotionFlag = () => {
  const profile = getProfile();
  if (profile.promoted) {
    const updated = { ...profile, promoted: false };
    saveProfile(updated);
    return updated;
  }
  return profile;
};

