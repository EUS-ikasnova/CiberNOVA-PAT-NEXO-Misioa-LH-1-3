import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Hand, Volume2, X } from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext';
import { Mission1Phase, MissionId } from '../types';
import { sound, speakBasque } from '../utils/sound';
import { NexoExpression, NexoMascot } from './NexoMascot';

interface NexoCompanionProps {
  studentName: string;
  activeMission: MissionId;
  mission1Phase: Mission1Phase;
  completedCount: number;
}

const PLAYFUL_GREETINGS = [
  'Kaixo! Prest al zaude jarraitzeko?',
  'Agur bero bat! Oso ongi ari zara!',
  'Bip-bop! Zure datuak altxorrak dira!',
  'Hemen nago zuri laguntzeko! Sakatu nire gainean agurtzeko!',
];

export const NexoCompanion: React.FC<NexoCompanionProps> = ({
  studentName,
  activeMission,
  mission1Phase,
  completedCount,
}) => {
  const { prefs, formatCase } = usePreferences();
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = prefs.calmMode || Boolean(prefersReducedMotion);

  const [minimized, setMinimized] = useState(false);
  const [bubbleOpen, setBubbleOpen] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [waving, setWaving] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [greetingIndex, setGreetingIndex] = useState(0);

  const cleanName = studentName.trim();

  const buildWelcomeMessage = (mission: MissionId, phase: Mission1Phase): string => {
    const hello = cleanName ? `Kaixo, ${cleanName}!` : 'Kaixo!';
    if (mission === 1) {
      if (phase === 1)
        return `${hello} Nexo naiz, zure zibersegurtasun-gida. Goazen zure avatar digitala egitera!`;
      if (phase === 2) return `${hello} Sartu etxe seguruan zure familia eta maskotak!`;
      return `${hello} Aukeratu zer gustatzen zaizun eta zer ez!`;
    }
    if (mission === 2) return `${hello} Egia ala gezurra? Pentsatu ongi erantzun aurretik!`;
    if (mission === 3) return `${hello} Lagundu Pixiri zer konta daitekeen erabakitzen!`;
    if (mission === 4) return `${hello} Bereizi sorpresa politak eta heldu bati esan beharrekoak!`;
    return completedCount >= 4
      ? `Zorionak${cleanName ? `, ${cleanName}` : ''}! Zure karneta prest dago!`
      : `${hello} Hemen ikus dezakezu zure karneta!`;
  };

  const [message, setMessage] = useState<string>(() => buildWelcomeMessage(activeMission, mission1Phase));
  const waveTimerRef = useRef<number | null>(null);

  const triggerWave = (durationMs = 2800) => {
    setWaving(true);
    if (waveTimerRef.current) {
      window.clearTimeout(waveTimerRef.current);
    }
    waveTimerRef.current = window.setTimeout(() => {
      setWaving(false);
    }, durationMs);
  };

  useEffect(() => {
    return () => {
      if (waveTimerRef.current) window.clearTimeout(waveTimerRef.current);
    };
  }, []);

  // Update contextual message on mission / phase / name changes without moving around
  useEffect(() => {
    setMessage(buildWelcomeMessage(activeMission, mission1Phase));
    setBubbleOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMission, mission1Phase, cleanName]);

  const handleGreet = (speakNow = false) => {
    sound.playRobotBeep();
    const nextGreeting = PLAYFUL_GREETINGS[greetingIndex % PLAYFUL_GREETINGS.length];
    const personalized =
      cleanName && greetingIndex % 2 === 0
        ? `${cleanName}, ${nextGreeting.charAt(0).toLowerCase()}${nextGreeting.slice(1)}`
        : nextGreeting;

    setGreetingIndex((prev) => prev + 1);
    setMessage(personalized);
    setBubbleOpen(true);
    triggerWave(2800);

    if (speakNow) {
      speakBasque(personalized, {
        onStart: () => setSpeaking(true),
        onEnd: () => setSpeaking(false),
      });
    }
  };

  const expression: NexoExpression =
    completedCount >= 4 && activeMission === 5
      ? 'celebrating'
      : waving || hovered
      ? 'greeting'
      : speaking
      ? 'speaking'
      : 'neutral';

  if (minimized) {
    return (
      <div className="fixed bottom-5 right-5 z-40 hidden md:block no-print">
        <button
          type="button"
          onClick={() => {
            sound.playRobotBeep();
            setMinimized(false);
            setBubbleOpen(true);
          }}
          className="btn-tactile flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-sky-600 hover:bg-sky-500 border-sky-800 text-white text-xs font-bold shadow-lg cursor-pointer whitespace-nowrap"
          title="Deitu Nexori"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-300" aria-hidden="true" />
          <span>{formatCase('NEXO // GIDA-SISTEMA')}</span>
        </button>
      </div>
    );
  }

  return (
    <motion.aside
      aria-label="NEXO // GIDA-SISTEMA"
      className="fixed bottom-4 right-5 z-40 hidden md:flex flex-col items-end gap-2 pointer-events-none no-print"
      animate={
        !reduceMotion && hovered
          ? { x: -8, y: -8 }
          : { x: 0, y: 0 }
      }
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              type: 'spring',
              stiffness: 160,
              damping: 20,
            }
      }
    >
      <AnimatePresence>
        {bubbleOpen && (
          <motion.div
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto relative max-w-[265px] rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-2 border-sky-200 dark:border-sky-800 shadow-lg p-3 text-xs text-slate-800 dark:text-slate-100"
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <span className="font-extrabold text-sky-700 dark:text-sky-400 tracking-wide">
                {formatCase('NEXO // GIDA-SISTEMA')}
              </span>
              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  setBubbleOpen(false);
                }}
                className="p-0.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                aria-label="Itxi mezua"
                title="Itxi mezua"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="leading-snug font-medium text-slate-700 dark:text-slate-200">
              {formatCase(message)}
            </p>

            <div className="mt-2.5 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleGreet(false)}
                className="flex-1 px-2.5 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/70 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-200 font-bold flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Hand className="w-3.5 h-3.5" />
                <span>{formatCase('Agurtu Nexo')}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playRobotBeep();
                  triggerWave(2800);
                  speakBasque(message, {
                    onStart: () => setSpeaking(true),
                    onEnd: () => setSpeaking(false),
                  });
                }}
                className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 cursor-pointer"
                aria-label="Entzun Nexo"
                title="Entzun Nexo"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Digital Nexo Character (calm at rest, moves & waves on hover) */}
      <div
        className="pointer-events-auto relative group flex items-end gap-1"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            setMinimized(true);
          }}
          className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-1 rounded-full bg-slate-200/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:bg-slate-300 cursor-pointer mb-2"
          aria-label="Ezkutatu Nexo"
          title="Ezkutatu Nexo"
        >
          <X className="w-3 h-3" />
        </button>

        <NexoMascot
          size="lg"
          speaking={speaking}
          waving={waving || hovered}
          expression={expression}
          facing="left"
          interactive
          animateOnHoverOnly
          onClick={() => handleGreet(true)}
          title="Sakatu Nexoren gainean agurtzeko"
        />
      </div>
    </motion.aside>
  );
};
