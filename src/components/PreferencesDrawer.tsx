import React from 'react';
import {
  BookOpen,
  Contrast,
  Eye,
  Maximize2,
  Minimize2,
  Moon,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Type,
  Unlock,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext';
import { FontMode, SpeechRateMode, TextSizeMode, ThemeMode, UnlockMode } from '../types';
import { sound } from '../utils/sound';

interface PreferencesDrawerProps {
  open: boolean;
  onClose: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenTeacherGuide: () => void;
}

export const PreferencesDrawer: React.FC<PreferencesDrawerProps> = ({
  open,
  onClose,
  isFullscreen,
  onToggleFullscreen,
  onOpenTeacherGuide,
}) => {
  const { prefs, updatePrefs, resetPrefs, formatCase } = usePreferences();

  if (!open) return null;

  const themes: { id: ThemeMode; label: string; desc: string; icon: React.ReactNode }[] = [
    { id: 'clean', label: 'Argi garbia', desc: 'Kolore argiak eta garbiak', icon: <Sun className="w-4 h-4" /> },
    { id: 'warm', label: 'Baretasuna', desc: 'Tonu epel leunak begientzat', icon: <Eye className="w-4 h-4" /> },
    { id: 'dark', label: 'Iluna', desc: 'Gaua eta argi gutxiko gela', icon: <Moon className="w-4 h-4" /> },
    { id: 'contrast', label: 'Kontraste handia', desc: 'Ikusmen-laguntza gorena', icon: <Contrast className="w-4 h-4" /> },
  ];

  const textSizes: { id: TextSizeMode; label: string }[] = [
    { id: 'normal', label: 'Normala' },
    { id: 'large', label: 'Handia (A+)' },
    { id: 'xl', label: 'Oso handia (A++)' },
  ];

  const fonts: { id: FontMode; label: string }[] = [
    { id: 'standard', label: 'Estandarra' },
    { id: 'lexend', label: 'Irakurketa erraza (Lexend)' },
  ];

  const rates: { id: SpeechRateMode; label: string }[] = [
    { id: 'slow', label: 'Motela' },
    { id: 'normal', label: 'Normala' },
    { id: 'fast', label: 'Azkarra' },
  ];

  const unlockModes: { id: UnlockMode; label: string; desc: string }[] = [
    { id: 'guided', label: 'Gidatua', desc: 'Misioak pausoz pauso desblokeatzen dira' },
    { id: 'free', label: 'Librea (Irakaslea)', desc: 'Misio eta eszena guztiak irekita daude' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/45 backdrop-blur-xs no-print" role="dialog" aria-modal="true" aria-label="Esperientzia pertsonalizatu">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-dvh flex flex-col shadow-2xl">
        <div className="px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {formatCase('Pantaila egokitu')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formatCase('Aldatu koloreak, letra eta soinua')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center cursor-pointer shrink-0"
            aria-label="Itxi ezarpenak"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-6">
          {/* Theme */}
          <section className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {formatCase('Itxura eta kolore-gaia')}
            </h3>
            <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-2.5">
              {themes.map((t) => {
                const active = prefs.theme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      updatePrefs({ theme: t.id });
                    }}
                    className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                      active
                        ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-500 text-sky-950 dark:text-sky-100'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs">
                      {t.icon}
                      <span>{formatCase(t.label)}</span>
                    </div>
                    <p className="text-[11px] opacity-80 mt-1 leading-snug">{formatCase(t.desc)}</p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Typography */}
          <section className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-slate-500" />
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {formatCase('Testua eta irakurgarritasuna')}
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              {textSizes.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    updatePrefs({ textSize: s.id });
                  }}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    prefs.textSize === s.id
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {formatCase(s.label)}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              {fonts.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    updatePrefs({ fontMode: f.id });
                  }}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap truncate ${
                    prefs.fontMode === f.id
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {formatCase(f.label)}
                </button>
              ))}
            </div>

            <label className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                  {formatCase('Letra larriak (MAIUSKULAK)')}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {formatCase('Lehenengo irakurleentzat lagungarria')}
                </span>
              </div>
              <input
                type="checkbox"
                checked={prefs.uppercaseMode}
                onChange={(e) => {
                  sound.playPop();
                  updatePrefs({ uppercaseMode: e.target.checked });
                }}
                className="w-5 h-5 accent-sky-600 rounded cursor-pointer"
              />
            </label>
          </section>

          {/* Audio & Motion */}
          <section className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              {prefs.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-slate-500" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {formatCase('Soinua eta mugimendua')}
              </h3>
            </div>

            <label className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                  {formatCase('Soinua eta ahotsa')}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {formatCase('Soinuak eta euskarazko irakurketa')}
                </span>
              </div>
              <input
                type="checkbox"
                checked={prefs.soundEnabled}
                onChange={(e) => updatePrefs({ soundEnabled: e.target.checked })}
                className="w-5 h-5 accent-sky-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                  {formatCase('Irakurketa automatikoa')}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {formatCase('Eszena edo galdera bakoitza bakarrik irakurri')}
                </span>
              </div>
              <input
                type="checkbox"
                checked={prefs.autoRead}
                onChange={(e) => {
                  sound.playPop();
                  updatePrefs({ autoRead: e.target.checked });
                }}
                className="w-5 h-5 accent-sky-600 rounded cursor-pointer"
              />
            </label>

            <div>
              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
                {formatCase('Ahotsaren abiadura')}
              </span>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                {rates.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      updatePrefs({ speechRate: r.id });
                    }}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      prefs.speechRate === r.id
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {formatCase(r.label)}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                    {formatCase('Modu lasaia')}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {formatCase('Mugimenduak eta konfetia gelditzen ditu')}
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={prefs.calmMode}
                onChange={(e) => {
                  sound.playPop();
                  updatePrefs({ calmMode: e.target.checked });
                }}
                className="w-5 h-5 accent-sky-600 rounded cursor-pointer"
              />
            </label>
          </section>

          {/* Learning Flow & Classroom */}
          <section className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Unlock className="w-4 h-4 text-slate-500" />
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {formatCase('Nabigazioa eta ikasgela')}
              </h3>
            </div>

            <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-2">
              {unlockModes.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    updatePrefs({ unlockMode: u.id });
                  }}
                  className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                    prefs.unlockMode === u.id
                      ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-500 text-sky-950 dark:text-sky-100'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-xs font-bold block">{formatCase(u.label)}</span>
                  <span className="text-[11px] opacity-80 mt-0.5 block leading-snug">{formatCase(u.desc)}</span>
                </button>
              ))}
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                {formatCase('Moodle ikastarora itzultzeko URLa')}
              </label>
              <input
                type="url"
                value={prefs.moodleUrl}
                onChange={(e) => updatePrefs({ moodleUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  onToggleFullscreen();
                }}
                className="min-h-[42px] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                <span>{formatCase(isFullscreen ? 'Irten pantailatik' : 'Pantaila osoa')}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  onClose();
                  onOpenTeacherGuide();
                }}
                className="min-h-[42px] px-3 py-2 rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 text-xs font-semibold text-sky-800 dark:text-sky-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>{formatCase('Irakaslearen gida')}</span>
              </button>
            </div>
          </section>
        </div>

        <div className="px-4 sm:px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              resetPrefs();
            }}
            className="min-h-[42px] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{formatCase('Leheneratu')}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="btn-tactile min-h-[42px] px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 border-sky-800 text-white text-xs font-bold cursor-pointer"
          >
            {formatCase('Gorde eta itxi')}
          </button>
        </div>
      </div>
    </div>
  );
};
