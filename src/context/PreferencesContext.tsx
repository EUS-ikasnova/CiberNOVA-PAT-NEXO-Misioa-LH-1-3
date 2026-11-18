import React, { createContext, useContext, useEffect, useState } from 'react';
import { DEFAULT_MOODLE_URL } from '../data/basqueContent';
import { UserPreferences } from '../types';
import { sound } from '../utils/sound';

const PREFS_STORAGE_KEY = 'cibernova_eu_preferences_v1';

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'clean',
  textSize: 'normal',
  fontMode: 'standard',
  uppercaseMode: false,
  soundEnabled: true,
  autoRead: false,
  speechRate: 'normal',
  calmMode: false,
  unlockMode: 'guided',
  moodleUrl: DEFAULT_MOODLE_URL,
};

interface PreferencesContextValue {
  prefs: UserPreferences;
  updatePrefs: (patch: Partial<UserPreferences>) => void;
  resetPrefs: () => void;
  formatCase: (text: string) => string;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prefs, setPrefs] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem(PREFS_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) };
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_PREFERENCES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // ignore
    }

    sound.enabled = prefs.soundEnabled;
    sound.speechRate = prefs.speechRate;
    sound.calmMode = prefs.calmMode;
    if (!prefs.soundEnabled) {
      sound.stopAll();
    }

    const root = document.documentElement;
    root.classList.toggle('dark', prefs.theme === 'dark');
    root.classList.toggle('font-lexend', prefs.fontMode === 'lexend');
    root.classList.toggle('calm-motion', prefs.calmMode);
  }, [prefs]);

  const updatePrefs = (patch: Partial<UserPreferences>) => {
    setPrefs((prev) => ({ ...prev, ...patch }));
  };

  const resetPrefs = () => {
    setPrefs(DEFAULT_PREFERENCES);
  };

  const formatCase = (text: string) => (prefs.uppercaseMode ? text.toUpperCase() : text);

  return (
    <PreferencesContext.Provider value={{ prefs, updatePrefs, resetPrefs, formatCase }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export function usePreferences(): PreferencesContextValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error('usePreferences must be used inside PreferencesProvider');
  }
  return ctx;
}
