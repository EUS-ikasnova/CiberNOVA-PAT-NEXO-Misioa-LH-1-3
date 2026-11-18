/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Check,
  Contrast,
  Lock,
  LogOut,
  Shield,
  SlidersHorizontal,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { MissionCompleteModal, ExitModal, TeacherGuideModal } from './components/Modals';
import { Mission1Identity } from './components/Mission1Identity';
import { Mission2Quiz } from './components/Mission2Quiz';
import { Mission3Privacy } from './components/Mission3Privacy';
import { Mission4Secrets } from './components/Mission4Secrets';
import { NexoCompanion } from './components/NexoCompanion';
import { NexoMascot } from './components/NexoMascot';
import { OfficialCard } from './components/OfficialCard';
import { PreferencesDrawer } from './components/PreferencesDrawer';
import { PreferencesProvider, usePreferences } from './context/PreferencesContext';
import { PREFERENCE_ITEMS } from './data/basqueContent';
import { AvatarConfig, Mission1Phase, MissionId, StudentProfile } from './types';
import { sound, speakBasque } from './utils/sound';

const PROFILE_STORAGE_KEY = 'cibernova_eu_profile_v1';
const MISSIONS_STORAGE_KEY = 'cibernova_eu_completed_missions_v1';
const CARNET_BADGES_STORAGE_KEY = 'cibernova_eu_carnet_badges_v1';

const DEFAULT_AVATAR: AvatarConfig = {
  skinTone: 'tone-2',
  hairStyle: 'short-brown',
  eyeColor: 'brown',
  clothing: 'cyber-blue',
  accessory: 'none',
  expression: 'happy',
};

const createInitialProfile = (): StudentProfile => ({
  studentName: '',
  classroom: 'LH 1',
  avatar: DEFAULT_AVATAR,
  familyMembers: [
    { id: 'ama-init', role: 'ama', label: 'Ama', iconType: '👩' },
    { id: 'aita-init', role: 'aita', label: 'Aita', iconType: '👨' },
  ],
  likes: [PREFERENCE_ITEMS[0]],
  dislikes: [],
  audioNotes: {},
  nodeId: `CN-NEXO-${Math.floor(1000 + Math.random() * 9000)}`,
});

const CiberNovaApp: React.FC = () => {
  const { prefs, updatePrefs, formatCase } = usePreferences();

  const [activeMission, setActiveMission] = useState<MissionId>(1);
  const [mission1Phase, setMission1Phase] = useState<Mission1Phase>(1);
  const [completedMissions, setCompletedMissions] = useState<MissionId[]>(() => {
    try {
      const saved = localStorage.getItem(MISSIONS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [carnetBadges, setCarnetBadges] = useState<MissionId[]>(() => {
    try {
      const saved = localStorage.getItem(CARNET_BADGES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (saved) return { ...createInitialProfile(), ...JSON.parse(saved) };
    } catch {
      // ignore
    }
    return createInitialProfile();
  });

  const [prefsOpen, setPrefsOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [newlyCompletedMission, setNewlyCompletedMission] = useState<MissionId | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [nexoSpeaking, setNexoSpeaking] = useState(false);
  const [nexoWaving, setNexoWaving] = useState(false);
  const [prevThemeBeforeContrast, setPrevThemeBeforeContrast] = useState<'clean' | 'warm' | 'dark'>('clean');

  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(MISSIONS_STORAGE_KEY, JSON.stringify(completedMissions));
    } catch {
      // ignore
    }
  }, [completedMissions]);

  useEffect(() => {
    try {
      localStorage.setItem(CARNET_BADGES_STORAGE_KEY, JSON.stringify(carnetBadges));
    } catch {
      // ignore
    }
  }, [carnetBadges]);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const canAccessMission = (id: MissionId): boolean => {
    if (prefs.unlockMode === 'free' || id === 1 || id === 5) return true;
    return completedMissions.includes((id - 1) as MissionId) || completedMissions.includes(id);
  };

  const completeMission = (id: MissionId) => {
    setCompletedMissions((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setNewlyCompletedMission(id);
  };

  const addBadgeToCarnet = (id: MissionId) => {
    setCarnetBadges((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const getNexoPrompt = (): string => {
    if (activeMission === 1) {
      if (mission1Phase === 1) {
        return 'Kaixo! Nexo naiz, zure zibersegurtasun-gida. Goazen zure avatar digitala egitera! Aukeratu nolakoa zaren: zure ilea, begiak, jantzia eta osagarriak.';
      }
      if (mission1Phase === 2) {
        return 'Oso ongi! Orain sartu etxe seguruan zure familia, lagunak eta maskotak.';
      }
      return 'Bikain! Aukeratu zer gustatzen zaizun eta zer ez. Denok gara bereziak!';
    }
    if (activeMission === 2) {
      return '2. misioa: entzun esaldia eta esan egia ala gezurra den.';
    }
    if (activeMission === 3) {
      return '3. misioa: lagundu Pixiri jakiten zer konta daitekeen eta zer gorde behar den.';
    }
    if (activeMission === 4) {
      return '4. misioa: bereizi sorpresa politak eta heldu bati kontatu beharreko gauzak.';
    }
    return 'Zorionak! Hemen daukazu zure Karnet Ofiziala.';
  };

  const handleResetAll = () => {
    sound.playPop();
    sound.stopAll();
    const fresh = createInitialProfile();
    setProfile(fresh);
    setCompletedMissions([]);
    setCarnetBadges([]);
    try {
      localStorage.removeItem('cibernova_eu_m3_answered_v1');
      localStorage.removeItem('cibernova_eu_m4_completed_v1');
      localStorage.removeItem(CARNET_BADGES_STORAGE_KEY);
    } catch {
      // ignore
    }
    setMission1Phase(1);
    setActiveMission(1);
  };

  const wrapperThemeClass =
    prefs.theme === 'warm'
      ? 'theme-warm'
      : prefs.theme === 'contrast'
      ? 'theme-contrast'
      : 'bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100';

  const textSizeClass =
    prefs.textSize === 'xl'
      ? 'text-lg sm:text-xl'
      : prefs.textSize === 'large'
      ? 'text-base sm:text-lg'
      : 'text-sm sm:text-base';

  const navItems: { id: MissionId; label: string }[] = [
    { id: 1, label: '1. Nortasuna' },
    { id: 2, label: '2. Elkarbizitza' },
    { id: 3, label: '3. Pribatutasuna' },
    { id: 4, label: '4. Sekretuak' },
    { id: 5, label: 'Karneta' },
  ];

  const completedCount = [1, 2, 3, 4].filter((id) => completedMissions.includes(id as MissionId)).length;
  const progressPercent = Math.round((completedCount / 4) * 100);
  const ringRadius = 15;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringDashOffset = ringCircumference * (1 - completedCount / 4);

  const toggleHighContrast = () => {
    sound.playPop();
    if (prefs.theme === 'contrast') {
      updatePrefs({ theme: prevThemeBeforeContrast });
    } else {
      if (prefs.theme === 'clean' || prefs.theme === 'warm' || prefs.theme === 'dark') {
        setPrevThemeBeforeContrast(prefs.theme);
      }
      updatePrefs({ theme: 'contrast' });
    }
  };

  return (
    <div className={`min-h-dvh w-full overflow-x-hidden flex flex-col transition-colors ${wrapperThemeClass} ${textSizeClass}`}>
      {/* Clean 3-Zone Top Bar */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 no-print">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-6">
          {/* Zone 1: Single-element Wordmark */}
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              setActiveMission(1);
            }}
            className="flex items-center gap-1.5 sm:gap-2 text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 cursor-pointer font-display min-w-0"
          >
            <Shield className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />
            <span>CiberNOVA-PAT</span>
          </button>

          {/* Zone 2: Concise single-line mission links */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Misioak">
            {navItems.map((item) => {
              const accessible = canAccessMission(item.id);
              const isActive = activeMission === item.id;
              const isDone = completedMissions.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={!accessible}
                  onClick={() => {
                    if (!accessible) return;
                    sound.playPop();
                    setActiveMission(item.id);
                  }}
                  className={`py-2 text-sm font-semibold whitespace-nowrap shrink-0 flex items-center gap-1.5 border-b-2 transition-colors ${
                    isActive
                      ? 'border-sky-600 text-sky-700 dark:text-sky-400 cursor-pointer'
                      : accessible
                      ? 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer'
                      : 'border-transparent text-slate-400 dark:text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <span>{formatCase(item.label)}</span>
                  {isDone && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                  {!accessible && <Lock className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                setPrefsOpen(true);
              }}
              className="btn-primary-contrast btn-tactile min-h-[38px] sm:min-h-[40px] px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-sky-600 hover:bg-sky-500 border-sky-800 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4 shrink-0" />
              <span>{formatCase('Pertsonalizatu')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5">
        {/* Separate Section 1: NEXO // GIDA-SISTEMA */}
        <section className="surface-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-4 no-print">
          <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 w-full">
            <NexoMascot
              size="sm"
              speaking={nexoSpeaking}
              waving={nexoWaving}
              expression={nexoWaving ? 'greeting' : nexoSpeaking ? 'speaking' : 'neutral'}
              interactive
              onClick={() => {
                sound.playRobotBeep();
                setNexoWaving(true);
                window.setTimeout(() => setNexoWaving(false), 3000);
                speakBasque(getNexoPrompt(), {
                  onStart: () => setNexoSpeaking(true),
                  onEnd: () => setNexoSpeaking(false),
                });
              }}
              title="Sakatu Nexoren gainean agurtzeko"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="contrast-box px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800 font-extrabold text-sky-800 dark:text-sky-300 tracking-wide">
                  {formatCase('NEXO // GIDA-SISTEMA')}
                </span>
                <span>{formatCase('LH 1 · DigComp 4.2')}</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug mt-1">
                {formatCase(getNexoPrompt())}
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                speakBasque(getNexoPrompt(), {
                  playChime: true,
                  onStart: () => setNexoSpeaking(true),
                  onEnd: () => setNexoSpeaking(false),
                })
              }
              className="min-h-[38px] px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap"
              title="Entzun Nexoren azalpena"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">{formatCase('Entzun')}</span>
            </button>
          </div>
        </section>

        {/* Separate Section 2: Cadet Name + Progress, Contrast, Sound, Guide & Exit */}
        <section className="surface-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-3.5 flex flex-col gap-3 no-print">
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-2.5">
            <div className="contrast-box w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2.5 px-3 sm:px-3.5 py-1.5 rounded-2xl sm:rounded-full bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs min-w-0">
              <label className="flex items-center gap-1.5 text-xs min-w-0 flex-1 sm:flex-initial">
                <span className="text-slate-500 dark:text-slate-400 font-extrabold tracking-wide uppercase shrink-0">
                  {formatCase('Izena:')}
                </span>
                <input
                  type="text"
                  value={profile.studentName}
                  onChange={(e) => setProfile((prev) => ({ ...prev, studentName: e.target.value }))}
                  placeholder={formatCase('KADETEA')}
                  aria-label="Ikaslearen izena"
                  className="bg-transparent font-extrabold text-slate-900 dark:text-slate-100 placeholder:text-slate-700 dark:placeholder:text-slate-200 focus:outline-none w-full min-w-[70px] sm:w-28"
                />
              </label>

              <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 shrink-0" aria-hidden="true" />

              {/* Circular SVG Progress Ring + Percentage */}
              <div
                className="flex items-center gap-2 shrink-0"
                title={`${completedCount}/4 misio osatuta (${progressPercent}%)`}
                aria-label={`Aurrerapena: ${completedCount}etik 4 misio, ehuneko ${progressPercent}`}
              >
                <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
                  <svg className="w-9 h-9 -rotate-90" viewBox="0 0 38 38" aria-hidden="true">
                    <circle
                      cx="19"
                      cy="19"
                      r={ringRadius}
                      fill="none"
                      strokeWidth="3.5"
                      className="contrast-ring-track stroke-slate-200 dark:stroke-slate-700"
                    />
                    <circle
                      cx="19"
                      cy="19"
                      r={ringRadius}
                      fill="none"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeDasharray={ringCircumference}
                      strokeDashoffset={ringDashOffset}
                      className="contrast-ring-fill stroke-sky-600 dark:stroke-sky-400 transition-[stroke-dashoffset] duration-300"
                    />
                  </svg>
                  <span className="absolute text-[10px] font-extrabold text-slate-900 dark:text-white tabular-nums">
                    {completedCount}/4
                  </span>
                </div>

                <span className="contrast-box px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-200 text-xs font-extrabold tabular-nums whitespace-nowrap">
                  {progressPercent}%
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2">
              <button
                type="button"
                onClick={toggleHighContrast}
                aria-pressed={prefs.theme === 'contrast'}
                className={`min-h-[38px] px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
                  prefs.theme === 'contrast'
                    ? 'btn-primary-contrast bg-slate-950 border-slate-950 text-yellow-300'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100'
                }`}
                title={
                  prefs.theme === 'contrast'
                    ? 'Desaktibatu kontraste handia'
                    : 'Aktibatu kontraste handia (irisgarritasuna)'
                }
              >
                <Contrast className="w-4 h-4" />
                <span>{formatCase('Kontrastea')}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  updatePrefs({ soundEnabled: !prefs.soundEnabled });
                }}
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center cursor-pointer"
                title={prefs.soundEnabled ? 'Isildu soinua' : 'Aktibatu soinua'}
                aria-label={prefs.soundEnabled ? 'Isildu soinua' : 'Aktibatu soinua'}
              >
                {prefs.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  setGuideOpen(true);
                }}
                className="min-h-[38px] px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{formatCase('Gida')}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  setExitOpen(true);
                }}
                className="min-h-[38px] px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{formatCase('Irten')}</span>
              </button>
            </div>
          </div>

          {/* Mobile/Tablet Mission Switcher */}
          <div className="flex lg:hidden items-center gap-1.5 overflow-x-auto pb-0.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            {navItems.map((item) => {
              const accessible = canAccessMission(item.id);
              const isActive = activeMission === item.id;
              const isDone = completedMissions.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={!accessible}
                  onClick={() => {
                    if (!accessible) return;
                    sound.playPop();
                    setActiveMission(item.id);
                  }}
                  className={`min-h-[40px] px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-colors ${
                    isActive
                      ? 'bg-sky-600 text-white'
                      : accessible
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                      : 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>{formatCase(item.label)}</span>
                  {isDone && <Check className="w-3.5 h-3.5" />}
                  {!accessible && <Lock className="w-3 h-3" />}
                </button>
              );
            })}
          </div>
        </section>

        {/* Active Mission View */}
        {activeMission === 1 && (
          <Mission1Identity
            phase={mission1Phase}
            onChangePhase={setMission1Phase}
            avatar={profile.avatar}
            onChangeAvatar={(avatar) => setProfile((prev) => ({ ...prev, avatar }))}
            familyMembers={profile.familyMembers}
            onChangeFamily={(familyMembers) => setProfile((prev) => ({ ...prev, familyMembers }))}
            likes={profile.likes}
            dislikes={profile.dislikes}
            onChangePreferences={(likes, dislikes) => setProfile((prev) => ({ ...prev, likes, dislikes }))}
            audioNotes={profile.audioNotes}
            onRecordNote={(key, url) =>
              setProfile((prev) => ({
                ...prev,
                audioNotes: { ...prev.audioNotes, [key]: url || undefined },
              }))
            }
            onCompleteMission1={() => completeMission(1)}
          />
        )}

        {activeMission === 2 && (
          <Mission2Quiz
            onComplete={() => completeMission(2)}
            onGoToMission3={() => {
              sound.playPop();
              setActiveMission(3);
            }}
          />
        )}

        {activeMission === 3 && (
          <Mission3Privacy
            onComplete={() => completeMission(3)}
            onGoToMission4={() => {
              sound.playPop();
              setActiveMission(4);
            }}
          />
        )}

        {activeMission === 4 && (
          <Mission4Secrets
            onComplete={() => completeMission(4)}
            onGoToCarnet={() => {
              sound.playPop();
              setActiveMission(5);
            }}
          />
        )}

        {activeMission === 5 && (
          <OfficialCard
            profile={profile}
            completedMissions={completedMissions}
            carnetBadges={carnetBadges}
            onAddBadgeToCarnet={addBadgeToCarnet}
            onEditPhase={(phase) => {
              sound.playPop();
              setMission1Phase(phase);
              setActiveMission(1);
            }}
            onGoToMission={(mission) => {
              sound.playPop();
              setActiveMission(mission);
            }}
            onResetAll={handleResetAll}
          />
        )}
      </main>

      {/* Clean Minimal Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-4 px-6 text-center text-xs text-slate-500 dark:text-slate-400 no-print">
        <span>{formatCase('CiberNOVA-PAT · NEXO Misioa (LH 1) · DigComp 4.2')}</span>
      </footer>

      {/* Modals & Customizer Drawer */}
      <PreferencesDrawer
        open={prefsOpen}
        onClose={() => setPrefsOpen(false)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onOpenTeacherGuide={() => setGuideOpen(true)}
      />

      <TeacherGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />

      <MissionCompleteModal
        missionId={newlyCompletedMission}
        isAddedToCarnet={newlyCompletedMission ? carnetBadges.includes(newlyCompletedMission) : false}
        onAddToCarnet={() => {
          if (newlyCompletedMission) {
            addBadgeToCarnet(newlyCompletedMission);
          }
        }}
        onClose={() => setNewlyCompletedMission(null)}
        onGoToNextMission={() => {
          const next = newlyCompletedMission ? ((newlyCompletedMission + 1) as MissionId) : 2;
          setNewlyCompletedMission(null);
          setActiveMission(next <= 4 ? next : 5);
        }}
        onGoToCarnet={() => {
          setNewlyCompletedMission(null);
          setActiveMission(5);
        }}
      />

      <ExitModal
        open={exitOpen}
        onClose={() => setExitOpen(false)}
        onGoHome={() => {
          setActiveMission(1);
          setMission1Phase(1);
        }}
        onGoCarnet={() => setActiveMission(5)}
      />

      <NexoCompanion
        studentName={profile.studentName}
        activeMission={activeMission}
        mission1Phase={mission1Phase}
        completedCount={completedCount}
      />
    </div>
  );
};

export default function App() {
  return (
    <PreferencesProvider>
      <CiberNovaApp />
    </PreferencesProvider>
  );
}
