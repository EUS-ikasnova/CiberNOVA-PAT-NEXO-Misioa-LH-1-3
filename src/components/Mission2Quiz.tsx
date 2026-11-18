import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  RotateCcw,
  ShieldCheck,
  Star,
  Trophy,
  Volume2,
} from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext';
import { MISSION2_CELEBRATION_IMAGE, MISSION2_QUESTIONS } from '../data/basqueContent';
import { sound, speakBasque, triggerCelebration } from '../utils/sound';
import { SceneImage } from './SceneImage';

interface Mission2QuizProps {
  onComplete: () => void;
  onGoToMission3: () => void;
}

export const Mission2Quiz: React.FC<Mission2QuizProps> = ({ onComplete, onGoToMission3 }) => {
  const { prefs, formatCase } = usePreferences();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<boolean | null>(null);
  const [solvedMap, setSolvedMap] = useState<Record<number, boolean>>({});
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const current = MISSION2_QUESTIONS[index];

  useEffect(() => {
    if (prefs.autoRead && !finished) {
      speakBasque(current.voiceText, {
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
      });
    }
    return () => {
      sound.stopAll();
    };
  }, [index, finished, prefs.autoRead, current.voiceText]);

  const readText = (text: string) => {
    speakBasque(text, {
      playChime: true,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
    });
  };

  const handleAnswer = (answer: boolean) => {
    if (selected !== null) return;
    setSelected(answer);
    if (answer === current.isTrue) {
      sound.playSuccess();
      setScore((prev) => prev + 1);
      setSolvedMap((prev) => ({ ...prev, [index]: true }));
      if (prefs.autoRead) {
        speakBasque(`Zuzen! ${current.explanation}`);
      }
    } else {
      sound.playPop();
      if (prefs.autoRead) {
        speakBasque(`Ia-ia! Hona hemen pista bat: ${current.hint}`);
      }
    }
  };

  const handleNext = () => {
    sound.playPop();
    setSelected(null);
    if (index < MISSION2_QUESTIONS.length - 1) {
      setIndex((prev) => prev + 1);
    } else {
      setFinished(true);
      onComplete();
      sound.playLevelUp();
      triggerCelebration(100);
    }
  };

  const handleRestart = () => {
    sound.playPop();
    setIndex(0);
    setSelected(null);
    setSolvedMap({});
    setScore(0);
    setFinished(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header card */}
      <div className="surface-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xl shrink-0">
            ⚖️
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-amber-700 dark:text-amber-400">
                {formatCase('2. misioa')}
              </span>
              <span aria-hidden="true">·</span>
              <span>{formatCase('Elkarbizitza')}</span>
            </div>
            <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-slate-100">
              {formatCase('Egia ala gezurra?')}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm font-bold text-amber-800 dark:text-amber-300 tabular-nums">
          <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span>{formatCase(`${score} / ${MISSION2_QUESTIONS.length} ongi`)}</span>
        </div>
      </div>

      {finished ? (
        <div className="surface-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 text-center space-y-5">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500 text-white flex items-center justify-center text-3xl">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
              {formatCase('Oso ongi!')}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
              {formatCase('Zorionak! 2. misioa bukatu duzu')}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
              {formatCase(
                'Ikasi duzu denok desberdinak eta bereziak garela, eta errespetua merezi dugula.'
              )}
            </p>
          </div>

          <div className="text-base font-bold text-amber-800 dark:text-amber-300 tabular-nums">
            {formatCase(`Azken puntuazioa: ${score} / ${MISSION2_QUESTIONS.length} puntu`)}
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 max-w-lg mx-auto aspect-video">
            <SceneImage
              src={MISSION2_CELEBRATION_IMAGE}
              alt="Ikasleak eta Nexo robota elkarbizitza ospatzen"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleRestart}
              className="btn-tactile w-full sm:w-auto min-h-[46px] px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{formatCase('Errepikatu 2. misioa')}</span>
            </button>
            <button
              type="button"
              onClick={onGoToMission3}
              className="btn-tactile w-full sm:w-auto min-h-[48px] px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 border-emerald-800 text-white text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{formatCase('3. misiora pasa (Pribatutasuna)')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Progress stepper */}
          <div className="surface-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-2.5">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 tabular-nums">
              {formatCase(`${index + 1}. esaldia (${MISSION2_QUESTIONS.length}tik)`)}
            </span>
            <div className="flex items-center gap-1.5">
              {MISSION2_QUESTIONS.map((q, i) => (
                <div
                  key={q.id}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold tabular-nums transition-colors ${
                    i === index
                      ? 'bg-amber-500 text-white'
                      : solvedMap[i]
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {solvedMap[i] ? '✓' : i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Statement card */}
          <div className="surface-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-7 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-4xl" aria-hidden="true">
                {current.emoji}
              </span>
              <button
                type="button"
                onClick={() => readText(current.voiceText)}
                className="btn-tactile min-h-[44px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 border-emerald-800 text-white text-xs font-bold flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Volume2 className="w-4 h-4" />
                <span>{formatCase(isSpeaking ? 'Irakurtzen...' : 'Entzun esaldia')}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => readText(current.voiceText)}
              className="w-full p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/70 hover:bg-amber-50/50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center cursor-pointer transition-colors"
            >
              <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
                «{formatCase(current.statement)}»
              </p>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-stretch gap-2">
                <button
                  type="button"
                  onClick={() => readText('Egia. Bai.')}
                  className="px-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex flex-col items-center justify-center gap-0.5 cursor-pointer shrink-0"
                  title="Entzun aukera: Egia"
                >
                  <Volume2 className="w-4 h-4" />
                  <span className="text-[10px] font-bold">{formatCase('Entzun')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAnswer(true)}
                  disabled={selected !== null}
                  className={`btn-tactile flex-1 min-h-[64px] rounded-xl font-bold text-base flex items-center justify-center gap-3 cursor-pointer transition-all ${
                    selected === true
                      ? current.isTrue
                        ? 'bg-emerald-600 border-emerald-800 text-white ring-2 ring-emerald-300'
                        : 'bg-rose-600 border-rose-800 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-500 border-emerald-800 text-white'
                  } ${selected !== null && selected !== true ? 'opacity-45 cursor-not-allowed' : ''}`}
                >
                  <span className="text-2xl">👍</span>
                  <span>{formatCase('Egia (Bai)')}</span>
                </button>
              </div>

              <div className="flex items-stretch gap-2">
                <button
                  type="button"
                  onClick={() => readText('Gezurra. Ez.')}
                  className="px-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 flex flex-col items-center justify-center gap-0.5 cursor-pointer shrink-0"
                  title="Entzun aukera: Gezurra"
                >
                  <Volume2 className="w-4 h-4" />
                  <span className="text-[10px] font-bold">{formatCase('Entzun')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAnswer(false)}
                  disabled={selected !== null}
                  className={`btn-tactile flex-1 min-h-[64px] rounded-xl font-bold text-base flex items-center justify-center gap-3 cursor-pointer transition-all ${
                    selected === false
                      ? !current.isTrue
                        ? 'bg-emerald-600 border-emerald-800 text-white ring-2 ring-emerald-300'
                        : 'bg-rose-600 border-rose-800 text-white'
                      : 'bg-rose-600 hover:bg-rose-500 border-rose-800 text-white'
                  } ${selected !== null && selected !== false ? 'opacity-45 cursor-not-allowed' : ''}`}
                >
                  <span className="text-2xl">👎</span>
                  <span>{formatCase('Gezurra (Ez)')}</span>
                </button>
              </div>
            </div>

            {selected !== null && (
              <div
                className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
                  selected === current.isTrue
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
                    : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-100'
                }`}
              >
                {selected === current.isTrue ? (
                  <>
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => readText(`Zuzen! ${current.explanation}`)}
                        className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 cursor-pointer"
                        title="Entzun azalpena"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                      <div>
                        <h4 className="font-bold text-sm flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>{formatCase('Oso ongi!')}</span>
                        </h4>
                        <p className="text-xs sm:text-sm mt-1">{formatCase(current.explanation)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="btn-tactile w-full sm:w-auto min-h-[46px] px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 border-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shrink-0 whitespace-nowrap"
                    >
                      <span>
                        {formatCase(
                          index < MISSION2_QUESTIONS.length - 1 ? 'Hurrengo esaldia' : 'Ikusi emaitzak'
                        )}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => readText(`Hona hemen pista bat: ${current.hint}`)}
                        className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 cursor-pointer"
                        title="Entzun pista"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                      <div>
                        <h4 className="font-bold text-sm flex items-center gap-1.5">
                          <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          <span>{formatCase('Ia-ia! Hona hemen pista bat:')}</span>
                        </h4>
                        <p className="text-xs sm:text-sm mt-1">{formatCase(current.hint)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        sound.playPop();
                        setSelected(null);
                      }}
                      className="btn-tactile w-full sm:w-auto min-h-[46px] px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 border-amber-700 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shrink-0 whitespace-nowrap"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>{formatCase('Saiatu berriro')}</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
