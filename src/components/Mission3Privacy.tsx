import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Lock,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Volume2,
  XCircle,
} from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext';
import { MISSION3_RULES, MISSION3_SEQUENCES } from '../data/basqueContent';
import { sound, speakBasque, triggerCelebration } from '../utils/sound';
import { SceneImage } from './SceneImage';

interface Mission3PrivacyProps {
  onComplete: () => void;
  onGoToMission4: () => void;
}

const STORAGE_KEY = 'cibernova_eu_m3_answered_v1';

export const Mission3Privacy: React.FC<Mission3PrivacyProps> = ({ onComplete, onGoToMission4 }) => {
  const { prefs, formatCase } = usePreferences();
  const [seqIndex, setSeqIndex] = useState(0);
  const [selectedOptId, setSelectedOptId] = useState<string | null>(null);
  const [answeredMap, setAnsweredMap] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [showSummary, setShowSummary] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const seq = MISSION3_SEQUENCES[seqIndex];
  const selectedOption = seq.question.options.find((o) => o.id === selectedOptId) || null;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answeredMap));
    } catch {
      // ignore
    }
  }, [answeredMap]);

  useEffect(() => {
    setSelectedOptId(null);
    if (prefs.autoRead && !showSummary) {
      speakBasque(seq.voiceScript, {
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
      });
    }
    return () => {
      sound.stopAll();
      setIsSpeaking(false);
    };
  }, [seqIndex, showSummary, prefs.autoRead, seq.voiceScript]);

  const canAccessSequence = (idx: number) => {
    if (prefs.unlockMode === 'free' || idx === 0) return true;
    for (let i = 0; i < idx; i++) {
      if (!answeredMap[i]) return false;
    }
    return true;
  };

  const readText = (text: string) => {
    speakBasque(text, {
      playChime: true,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
    });
  };

  const stopReading = () => {
    sound.playPop();
    sound.stopAll();
    setIsSpeaking(false);
  };

  const handleChooseOption = (optionId: string) => {
    const opt = seq.question.options.find((o) => o.id === optionId);
    if (!opt) return;
    setSelectedOptId(optionId);
    if (opt.isCorrect) {
      sound.playSuccess();
      setAnsweredMap((prev) => ({ ...prev, [seqIndex]: true }));
      if (prefs.autoRead) {
        speakBasque(`Oso ondo! ${opt.feedback}`);
      }
    } else {
      sound.playPop();
      if (prefs.autoRead) {
        speakBasque(`Pentsatu berriro! ${opt.feedback}`);
      }
    }
  };

  const handleNextSequence = () => {
    sound.playPop();
    if (seqIndex < MISSION3_SEQUENCES.length - 1) {
      setSeqIndex((prev) => prev + 1);
    } else {
      setShowSummary(true);
      onComplete();
      sound.playLevelUp();
      triggerCelebration(120);
    }
  };

  const handleRestart = () => {
    sound.playPop();
    setSeqIndex(0);
    setSelectedOptId(null);
    setAnsweredMap({});
    setShowSummary(false);
  };

  const contextLabel = {
    public: 'Eremu publikoa',
    private: 'Eremu pribatua',
    intimate: 'Eremu intimoa',
  }[seq.sceneContext];

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="surface-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xl shrink-0">
            🔐
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-indigo-700 dark:text-indigo-400">
                {formatCase('3. misioa')}
              </span>
              <span aria-hidden="true">·</span>
              <span>{formatCase('Pribatutasuna · Pixi eta Nexo')}</span>
            </div>
            <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-slate-100">
              {formatCase('Zer konta daiteke eta zer gorde behar da?')}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {MISSION3_SEQUENCES.map((item, idx) => {
            const unlocked = canAccessSequence(idx);
            const done = !!answeredMap[idx];
            const active = !showSummary && seqIndex === idx;
            return (
              <button
                key={item.id}
                type="button"
                disabled={!unlocked}
                onClick={() => {
                  if (!unlocked) return;
                  sound.playPop();
                  setShowSummary(false);
                  setSeqIndex(idx);
                }}
                className={`w-9 h-9 rounded-xl text-xs font-bold flex items-center justify-center tabular-nums transition-colors ${
                  active
                    ? 'bg-indigo-600 text-white cursor-pointer'
                    : done
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 cursor-pointer'
                    : unlocked
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer'
                    : 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                }`}
                title={item.sceneTitle}
              >
                {unlocked ? (done && !active ? '✓' : item.id) : <Lock className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {showSummary ? (
        <div className="surface-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-600 text-white flex items-center justify-center">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
              {formatCase('4 urrezko arauak')}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              {formatCase(
                'Pixirekin eta Nexorekin ikasi duzu zer konta daitekeen eta zer gorde behar den.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {MISSION3_RULES.map((rule) => (
              <div
                key={rule.number}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {formatCase(`${rule.number}. ${rule.title}`)}
                  </h4>
                  <button
                    type="button"
                    onClick={() => readText(`${rule.title}. ${rule.description}`)}
                    className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-700 dark:text-slate-200 cursor-pointer shrink-0"
                    title="Entzun araua"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {formatCase(rule.description)}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleRestart}
              className="btn-tactile w-full sm:w-auto min-h-[46px] px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{formatCase('Ikusi berriro historia')}</span>
            </button>

            <button
              type="button"
              onClick={onGoToMission4}
              className="btn-tactile w-full sm:w-auto min-h-[48px] px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 border-purple-800 text-white text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{formatCase('4. misiora pasa (Sekretuak)')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Interactive Scene Card */}
          <div className="surface-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
            {/* Visual Stage */}
            <div className="relative bg-slate-950 overflow-hidden">
              <div className="aspect-video w-full overflow-hidden">
                <SceneImage
                  src={seq.imagePath}
                  alt={seq.sceneTitle}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-slate-900 sm:bg-transparent sm:bg-gradient-to-t sm:from-slate-950/90 sm:via-slate-950/65 sm:to-transparent sm:absolute sm:inset-x-0 sm:bottom-0 p-3.5 sm:p-5 text-white">
                <div className="flex flex-wrap items-center gap-2 text-xs text-sky-300 font-semibold mb-1">
                  <span>{formatCase(seq.sceneTitle)}</span>
                  <span aria-hidden="true">·</span>
                  <span>{formatCase(contextLabel)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => readText(seq.storyScript)}
                  className="w-full text-left flex items-start gap-2.5 cursor-pointer group"
                  title="Sakatu istorioa entzuteko"
                >
                  <Volume2 className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-slate-100 leading-relaxed group-hover:text-white">
                    {formatCase(seq.storyScript)}
                  </p>
                </button>
              </div>
            </div>

            {/* Audio Controls Bar */}
            <div className="px-4 sm:px-5 py-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {isSpeaking ? (
                  <button
                    type="button"
                    onClick={stopReading}
                    className="btn-tactile min-h-[42px] px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 border-slate-400 text-slate-900 dark:text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
                  >
                    <Pause className="w-4 h-4" />
                    <span>{formatCase('Pausatu ahotsa')}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => readText(seq.voiceScript)}
                    className="btn-tactile min-h-[42px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 border-emerald-800 text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>{formatCase('Entzun istorio osoa')}</span>
                  </button>
                )}
              </div>

              <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                {formatCase(`Sekuentzia ${seq.timePosition}`)}
              </span>
            </div>
          </div>

          {/* Question Card */}
          <div className="surface-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>{formatCase(`Galdera (${seqIndex + 1}/${MISSION3_SEQUENCES.length})`)}</span>
              </span>
              <button
                type="button"
                onClick={() => readText(seq.question.voicePrompt)}
                className="min-h-[38px] px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>{formatCase('Entzun galdera')}</span>
              </button>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              {formatCase(seq.question.prompt)}
            </h3>

            <div className="space-y-2.5">
              {seq.question.options.map((opt, idx) => {
                const isSelected = selectedOptId === opt.id;
                return (
                  <div key={opt.id} className="flex items-stretch gap-2">
                    <button
                      type="button"
                      onClick={() => readText(`${idx + 1}. aukera: ${opt.text}`)}
                      className="min-h-[52px] px-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 flex flex-col items-center justify-center gap-0.5 cursor-pointer shrink-0"
                      title={`Entzun aukera: ${opt.text}`}
                    >
                      <Volume2 className="w-4 h-4" />
                      <span className="text-[10px] font-bold">{formatCase('Entzun')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleChooseOption(opt.id)}
                      className={`btn-tactile flex-1 min-h-[52px] px-4 py-3 rounded-xl text-left font-semibold text-xs sm:text-sm flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                        isSelected
                          ? opt.isCorrect
                            ? 'bg-emerald-600 border-emerald-800 text-white'
                            : 'bg-rose-600 border-rose-800 text-white'
                          : 'bg-slate-50 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      <span>{formatCase(opt.text)}</span>
                      {isSelected &&
                        (opt.isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 shrink-0" />
                        ))}
                    </button>
                  </div>
                );
              })}
            </div>

            {selectedOption && (
              <div
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
                  selectedOption.isCorrect
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
                    : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => readText(selectedOption.feedback)}
                    className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 cursor-pointer"
                    title="Entzun azalpena"
                  >
                    <Volume2 className="w-4 h-4 text-slate-700 dark:text-slate-200" />
                  </button>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm flex items-center gap-1.5">
                      {selectedOption.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>{formatCase('Oso ongi!')}</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          <span>{formatCase('Pentsatu pixka bat!')}</span>
                        </>
                      )}
                    </h4>
                    <p className="text-xs sm:text-sm mt-1">{formatCase(selectedOption.feedback)}</p>
                  </div>
                </div>

                {selectedOption.isCorrect ? (
                  <button
                    type="button"
                    onClick={handleNextSequence}
                    className="btn-tactile w-full sm:w-auto min-h-[44px] px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 border-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shrink-0 whitespace-nowrap"
                  >
                    <span>
                      {formatCase(
                        seqIndex < MISSION3_SEQUENCES.length - 1 ? 'Hurrengo eszena' : 'Ikusi urrezko arauak'
                      )}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      setSelectedOptId(null);
                    }}
                    className="btn-tactile w-full sm:w-auto min-h-[44px] px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 border-amber-700 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shrink-0 whitespace-nowrap"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{formatCase('Saiatu berriro')}</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
