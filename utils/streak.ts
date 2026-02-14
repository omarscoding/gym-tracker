import AsyncStorage from '@react-native-async-storage/async-storage';

const STREAK_KEY = 'gym_streak_count';
const LAST_CHECKIN_KEY = 'gym_last_checkin';
const REFERENCE_PHOTO_KEY = 'gym_reference_photo';

// Dev mode: set to true to allow multiple streak increments per day
const DEV_MODE = true;

export interface StreakData {
  count: number;
  lastCheckin: string | null;
}

/**
 * Get the current streak data from storage.
 */
export async function getStreak(): Promise<StreakData> {
  try {
    const [countStr, lastCheckin] = await Promise.all([
      AsyncStorage.getItem(STREAK_KEY),
      AsyncStorage.getItem(LAST_CHECKIN_KEY),
    ]);
    return {
      count: countStr ? Number.parseInt(countStr, 10) : 0,
      lastCheckin: lastCheckin ?? null,
    };
  } catch {
    return { count: 0, lastCheckin: null };
  }
}

/**
 * Increment the streak by 1.
 * In production mode, only allows one increment per calendar day.
 * In dev mode (DEV_MODE = true), increments on every call.
 */
export async function incrementStreak(): Promise<StreakData> {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0]; // e.g. "2026-02-14"

  const current = await getStreak();

  if (!DEV_MODE && current.lastCheckin === todayStr) {
    // Already checked in today — no change
    return current;
  }

  const newCount = current.count + 1;
  await Promise.all([
    AsyncStorage.setItem(STREAK_KEY, newCount.toString()),
    AsyncStorage.setItem(LAST_CHECKIN_KEY, todayStr),
  ]);

  return { count: newCount, lastCheckin: todayStr };
}

/**
 * Save a reference photo URI.
 */
export async function saveReferencePhoto(uri: string): Promise<void> {
  await AsyncStorage.setItem(REFERENCE_PHOTO_KEY, uri);
}

/**
 * Get the saved reference photo URI.
 */
export async function getReferencePhoto(): Promise<string | null> {
  return AsyncStorage.getItem(REFERENCE_PHOTO_KEY);
}
