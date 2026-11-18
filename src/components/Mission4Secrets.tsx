import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Lock,
  RotateCcw,
  Trophy,
  Volume2,
  X,
} from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext';
import { MISSION4_SECRETS } from '../data/basqueContent';
import { sound, speakBasque, triggerCelebration } from '../utils/sound';
import { SceneImage } from './SceneImage';

interface Mission4SecretsProps {
  onComplete: () => void;
  onGoToCarnet: () => void;
}

const STORAGE_KEY = 'cibernova_eu_m4_completed_v1';

export const Mission4Secrets: React.FC<Mission4SecretsProps> = ({ onComplete, onGoToCarnet }) => {
  const { prefs, formatCase } = usePreferences();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<'pleasant' | 'unpleasant' | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [completedIds, setCompletedIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    return () => {
      sound.stopAll();
    };
  }, []);

  const isUnlocked = (id: number) => {
    if (prefs.unlockMode === 'free' || id === 1) return true;
    return completedIds.includes(id - 1);
  };

  const openScenario = (idx: number) => {
    const item = MISSION4_SECRETS[idx];
    if (!isUnlocked(item.id)) {
      sound.playPop();
      speakBasque(`${item.id}. egoera blokeatuta dago. Lehenik ${item.id - 1}. egoera ebatzi behar duzu.`);
      return;
    }
    sound.playPop();
    setActiveIndex(idx);
    setSelectedEmotion(null);
    setSubmitted(false);
    if (prefs.autoRead) {
      speakBasque(`${item.sceneText} ${item.promptText}`);
    }
  };

  const closeScenario = () => {
    sound.playPop();
    sound.stopAll();
    setActiveIndex(null);
    setSelectedEmotion(null);
    setSubmitted(false);
  };

  const confirmChoice = () => {
    if (activeIndex === null || selectedEmotion === null) return;
    const scenario = MISSION4_SECRETS[activeIndex];
    setSubmitted(true);

    if (prefs.autoRead) {
      speakBasque(scenario.whyExplanation);
    }

    if (selectedEmotion === scenario.type) {
      sound.playSuccess();
      triggerCelebration(55);
      if (!completedIds.includes(scenario.id)) {
        const next = [...completedIds, scenario.id];
        setCompletedIds(next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        if (next.length === MISSION4_SECRETS.length) {
          onComplete();
          triggerCelebration(140);
        }
      }
    } else {
      sound.playPop();
    }
  };

  const activeScenario = activeIndex !== null ? MISSION4_SECRETS[activeIndex] : null;
  const allCompleted = completedIds.length === MISSION4_SECRETS.length;

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="surface-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-purple-600 text-white flex items-center justify-center text-xl shrink-0">
            💓
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-purple-700 dark:text-purple-400">
                {formatCase('4. misioa')}
              </span>
              <span aria-hidden="true">·</span>
              <span>{formatCase('Sekretuak eta emozioak · Babesa')}</span>
            </div>
            <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-slate-100">
              {formatCase('Sekretu ona ala kontatu beharrekoa?')}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() =>
              speakBasque(
                'Entzun eta esan nola sentitzen zaren: poza ematen dizun ala tristura eta beldurra.',
                { playChime: true }
              )
            }
            className="btn-tactile min-h-[40px] px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 border-purple-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>{formatCase('Entzun azalpena')}</span>
          </button>

          <span className="text-xs font-bold text-purple-800 dark:text-purple-300 tabular-nums">
            {formatCase(`${completedIds.length} / ${MISSION4_SECRETS.length} ebatzita`)}
          </span>
        </div>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="surface-card bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-2xl shrink-0">
            😊
          </div>
          <div>
            <h3 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
              {formatCase('Poza ematen dit · Sorpresa polita 🤐')}
            </h3>
            <p className="text-xs text-emerald-900 dark:text-emerald-300 mt-1 leading-relaxed">
              {formatCase(
                'Opari edo festa bat bezalako sorpresa polita bada, gorde dezakegu egun handira arte.'
              )}
            </p>
          </div>
        </div>

        <div className="surface-card bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-rose-600 text-white flex items-center justify-center text-2xl shrink-0">
            😟
          </div>
          <div>
            <h3 className="text-sm font-bold text-rose-950 dark:text-rose-200">
              {formatCase('Tristura edo beldurra · Kontatu egin behar da! 🗣️')}
            </h3>
            <p className="text-xs text-rose-900 dark:text-rose-300 mt-1 leading-relaxed">
              {formatCase(
                'Triste edo beldur bagaude, EZ gara inoiz isildu behar: berehala esan ama, aita edo irakasleari.'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* 6 Scenarios Grid */}
      <div className="surface-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            {formatCase('Aukeratu eszena bat')}
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {formatCase('6 egoera')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MISSION4_SECRETS.map((item, idx) => {
            const done = completedIds.includes(item.id);
            const unlocked = isUnlocked(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => openScenario(idx)}
                className={`group text-left rounded-2xl overflow-hidden border transition-all flex flex-col justify-between cursor-pointer ${
                  done
                    ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/30 dark:bg-emerald-950/20'
                    : unlocked
                    ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 hover:border-purple-400'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/50 opacity-75'
                }`}
              >
                <div className="relative aspect-[16/10] w-full bg-slate-900 overflow-hidden">
                  <SceneImage
                    src={item.imagePath}
                    fallbackType={item.fallbackType}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                  {!unlocked && (
                    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-white p-3 text-center">
                      <Lock className="w-6 h-6 text-amber-300 mb-1.5" />
                      <span className="text-xs font-bold">{formatCase('Blokeatuta')}</span>
                      <span className="text-[11px] text-slate-300 mt-0.5">
                        {formatCase(`Osatu lehenik ${item.id - 1}. egoera`)}
                      </span>
                    </div>
                  )}
                  {done && (
                    <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="p-3.5 space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {formatCase(item.title)}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{formatCase(item.subtitle)}</p>
                </div>
              </button>
            );
          })}
        </div>

        {allCompleted && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-amber-500 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-100">
                  {formatCase('Zorionak! 6 egoerak ongi egin dituzu!')}
                </h4>
                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                  {formatCase('Orain zure Karnet Ofiziala prest daukazu.')}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                onGoToCarnet();
              }}
              className="btn-tactile w-full sm:w-auto min-h-[46px] px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 border-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shrink-0 whitespace-nowrap"
            >
              <Award className="w-4 h-4" />
              <span>{formatCase('Ikusi nire Karnet Ofiziala')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Scenario Modal */}
      {activeScenario && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl max-w-2xl w-full max-h-[92dvh] overflow-y-auto shadow-2xl">
            <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                  {formatCase(activeScenario.title)}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formatCase(activeScenario.subtitle)}
                </p>
              </div>
              <button
                type="button"
                onClick={closeScenario}
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 cursor-pointer shrink-0"
                aria-label="Itxi egoera"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-4">
              <div className="aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <SceneImage
                  src={activeScenario.imagePath}
                  fallbackType={activeScenario.fallbackType}
                  alt={activeScenario.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                  {formatCase(activeScenario.sceneText)}
                </p>
                <button
                  type="button"
                  onClick={() => speakBasque(`${activeScenario.sceneText} ${activeScenario.promptText}`, { playChime: true })}
                  className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 cursor-pointer"
                  title="Entzun egoera"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2.5">
                <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                  {formatCase(activeScenario.promptText)}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      setSelectedEmotion('pleasant');
                      setSubmitted(false);
                    }}
                    className={`p-4 rounded-xl border text-left flex items-center gap-3 cursor-pointer transition-colors ${
                      selectedEmotion === 'pleasant'
                        ? 'bg-emerald-600 border-emerald-700 text-white'
                        : 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
                    }`}
                  >
                    <span className="text-3xl">😊</span>
                    <div>
                      <span className="text-xs sm:text-sm font-bold block">
                        {formatCase('Poza ematen dit')}
                      </span>
                      <span className="text-[11px] opacity-85">{formatCase('Sorpresa polita da')}</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      setSelectedEmotion('unpleasant');
                      setSubmitted(false);
                    }}
                    className={`p-4 rounded-xl border text-left flex items-center gap-3 cursor-pointer transition-colors ${
                      selectedEmotion === 'unpleasant'
                        ? 'bg-rose-600 border-rose-700 text-white'
                        : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-100'
                    }`}
                  >
                    <span className="text-3xl">😟</span>
                    <div>
                      <span className="text-xs sm:text-sm font-bold block">
                        {formatCase('Tristura, beldurra edo deserosotasuna')}
                      </span>
                      <span className="text-[11px] opacity-85">{formatCase('Kontatu egin behar da')}</span>
                    </div>
                  </button>
                </div>
              </div>

              {!submitted ? (
                <button
                  type="button"
                  disabled={selectedEmotion === null}
                  onClick={confirmChoice}
                  className={`btn-tactile w-full min-h-[48px] py-2.5 rounded-xl font-bold text-sm cursor-pointer ${
                    selectedEmotion !== null
                      ? 'bg-purple-600 hover:bg-purple-500 border-purple-800 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {formatCase('Egiaztatu nire erantzuna')}
                </button>
              ) : (
                <div
                  className={`p-4 rounded-2xl border space-y-3 ${
                    selectedEmotion === activeScenario.type
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
                      : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => speakBasque(activeScenario.whyExplanation, { playChime: true })}
                      className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4 text-slate-700 dark:text-slate-200" />
                    </button>
                    <div>
                      <h4 className="font-bold text-sm">
                        {formatCase(
                          selectedEmotion === activeScenario.type
                            ? `Zuzen! (${activeScenario.emotionLabel})`
                            : 'Ia-ia! Irakurri azalpena eta saiatu berriro'
                        )}
                      </h4>
                      <p className="text-xs sm:text-sm mt-1">{formatCase(activeScenario.whyExplanation)}</p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    {selectedEmotion === activeScenario.type ? (
                      <button
                        type="button"
                        onClick={closeScenario}
                        className="btn-tactile min-h-[42px] px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 border-emerald-800 text-white text-xs font-bold cursor-pointer"
                      >
                        {formatCase('Jarraitu')}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          sound.playPop();
                          setSelectedEmotion(null);
                          setSubmitted(false);
                        }}
                        className="btn-tactile min-h-[42px] px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 border-amber-700 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>{formatCase('Saiatu berriro')}</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
