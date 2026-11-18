import React, { useState } from 'react';
import { Award, BookOpen, CheckCircle2, ExternalLink, Home, LogOut, PlusCircle, Sparkles, X } from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext';
import { BADGES } from '../data/basqueContent';
import { MissionId } from '../types';
import { sound, triggerCelebration } from '../utils/sound';
import { NexoMascot } from './NexoMascot';

interface TeacherGuideModalProps {
  open: boolean;
  onClose: () => void;
}

export const TeacherGuideModal: React.FC<TeacherGuideModalProps> = ({ open, onClose }) => {
  const { formatCase } = usePreferences();
  const [tab, setTab] = useState<'pedagogy' | 'moodle'>('pedagogy');

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 no-print"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90dvh] overflow-y-auto shadow-2xl p-4 sm:p-6 space-y-5">
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <BookOpen className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              {formatCase('Irakasleentzako gida · CiberNOVA-PAT (LH 1)')}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 cursor-pointer shrink-0"
            aria-label="Itxi gida"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full sm:w-fit">
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              setTab('pedagogy');
            }}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              tab === 'pedagogy'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {formatCase('Helburu pedagogikoak')}
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              setTab('moodle');
            }}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              tab === 'moodle'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {formatCase('Moodle eta pertsonalizazioa')}
          </button>
        </div>

        {tab === 'pedagogy' ? (
          <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800">
              <h3 className="font-bold text-sky-950 dark:text-sky-100 mb-1">
                {formatCase('1. Helburua (LH 1 · DigComp 4.2)')}
              </h3>
              <p>
                {formatCase(
                  'Lehen Hezkuntzako 1. mailako ikasleek avatar bat egiten ikasten dute, benetako argazkirik eta datu pribaturik erakutsi gabe.'
                )}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-950/40 border border-fuchsia-200 dark:border-fuchsia-800 space-y-1.5">
              <h3 className="font-bold text-fuchsia-950 dark:text-fuchsia-100">
                {formatCase('2. Misioak')}
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>
                  <strong>1. misioa (Nor naiz ni?):</strong> Avatara, etxeko jendea eta gustuak.
                </li>
                <li>
                  <strong>2. misioa (Egia ala gezurra?):</strong> Elkarbizitza eta guztiekiko errespetua.
                </li>
                <li>
                  <strong>3. misioa (Pixi eta Nexo):</strong> Zer kontatu daitekeen eta zer gorde behar den.
                </li>
                <li>
                  <strong>4. misioa (Sekretuak):</strong> Sorpresa politak eta heldu bati kontatu beharrekoak.
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <h3 className="font-bold text-emerald-950 dark:text-emerald-100 mb-1">
                {formatCase('3. Irisgarritasuna')}
              </h3>
              <p className="text-xs">
                {formatCase(
                  '"Pertsonalizatu" eta "Kontrastea" botoiekin letra-tamaina, maiuskulak, koloreak, euskarazko ahotsa eta misio libreak jar daitezke.'
                )}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
              <h3 className="font-bold text-amber-950 dark:text-amber-100 mb-1">
                {formatCase('Arbel digitalean erabiltzeko aholkua')}
              </h3>
              <p className="text-xs">
                {formatCase(
                  'Ireki "Pertsonalizatu" menua eta hautatu "Librea (Irakaslea)" nabigazio-moduan, edozein misio edo sekuentziara zuzenean salto egiteko ikasgelako aurkezpenetan.'
                )}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1">
                {formatCase('Moodle 4.5 (Ikasaula Navarra) konexioa')}
              </h3>
              <p className="text-xs">
                {formatCase(
                  'Moodleko URL baliabide gisa "Leiho berrian" (1200 x 850) irekitzea gomendatzen da, eta "Pertsonalizatu" atalean ikastaroaren itzulera-esteka alda daiteke behar izanez gero.'
                )}
              </p>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="btn-tactile w-full min-h-[46px] py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 border-sky-800 text-white text-sm font-bold cursor-pointer"
        >
          {formatCase('Ulertuta, itzuli jarduerara')}
        </button>
      </div>
    </div>
  );
};

interface MissionCompleteModalProps {
  missionId: MissionId | null;
  isAddedToCarnet: boolean;
  onAddToCarnet: () => void;
  onClose: () => void;
  onGoToNextMission: () => void;
  onGoToCarnet: () => void;
}

export const MissionCompleteModal: React.FC<MissionCompleteModalProps> = ({
  missionId,
  isAddedToCarnet,
  onAddToCarnet,
  onClose,
  onGoToNextMission,
  onGoToCarnet,
}) => {
  const { formatCase } = usePreferences();
  if (!missionId) return null;

  const badge = BADGES.find((b) => b.id === missionId);
  if (!badge) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 no-print"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl max-w-md w-full max-h-[92dvh] overflow-y-auto p-5 sm:p-6 text-center space-y-5 shadow-2xl">
        <div
          className={`w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br ${badge.gradient} text-white flex flex-col items-center justify-center shadow-lg`}
        >
          <span className="text-4xl">{badge.icon}</span>
          <span className="text-[10px] font-bold mt-1">{formatCase(badge.title)}</span>
        </div>

        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
            <Sparkles className="w-4 h-4" />
            <span>{formatCase('Domina berria irabazi duzu!')}</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{formatCase(badge.name)}</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{formatCase(badge.description)}</p>
        </div>

        {isAddedToCarnet ? (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{formatCase('Zure Karnetean gehituta dago!')}</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              sound.playSuccess();
              triggerCelebration(70);
              onAddToCarnet();
            }}
            className="btn-tactile w-full min-h-[48px] py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 border-amber-700 text-slate-950 text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-5 h-5" />
            <span>{formatCase('Gehitu domina Karnetean')}</span>
          </button>
        )}

        <div className="flex flex-col gap-2.5">
          {isAddedToCarnet && (
            <button
              type="button"
              onClick={onGoToCarnet}
              className="btn-tactile w-full min-h-[46px] py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 border-emerald-800 text-white text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>{formatCase('Ikusi nire Karneta')}</span>
            </button>
          )}

          {missionId < 4 ? (
            <button
              type="button"
              onClick={onGoToNextMission}
              className="btn-tactile w-full min-h-[48px] py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 border-sky-800 text-white text-sm font-bold cursor-pointer"
            >
              {formatCase(`Joan ${missionId + 1}. misiora`)}
            </button>
          ) : (
            !isAddedToCarnet && (
              <button
                type="button"
                onClick={onGoToCarnet}
                className="btn-tactile w-full min-h-[46px] py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 border-emerald-800 text-white text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>{formatCase('Joan Karnetara')}</span>
              </button>
            )
          )}

          <button
            type="button"
            onClick={onClose}
            className="min-h-[42px] py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            {formatCase('Hemen geratu')}
          </button>
        </div>
      </div>
    </div>
  );
};

interface ExitModalProps {
  open: boolean;
  onClose: () => void;
  onGoHome: () => void;
  onGoCarnet: () => void;
}

export const ExitModal: React.FC<ExitModalProps> = ({ open, onClose, onGoHome, onGoCarnet }) => {
  const { prefs, formatCase } = usePreferences();
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 no-print"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl max-w-md w-full max-h-[92dvh] overflow-y-auto p-5 sm:p-6 text-center space-y-5 shadow-2xl">
        <div className="flex justify-center">
          <NexoMascot size="md" expression="neutral" />
        </div>
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
            <LogOut className="w-4 h-4" />
            <span>{formatCase('Irten')}</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {formatCase('Nora joan nahi duzu orain?')}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {formatCase('Egin duzun guztia hemen gordeta geratzen da.')}
          </p>
        </div>

        <div className="space-y-2.5">
          <a
            href={prefs.moodleUrl}
            target="_top"
            onClick={() => sound.playPop()}
            className="btn-tactile w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 border-orange-800 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>{formatCase('Itzuli Moodle ikastarora')}</span>
          </a>

          <button
            type="button"
            onClick={() => {
              sound.playPop();
              onGoCarnet();
              onClose();
            }}
            className="btn-tactile w-full min-h-[44px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 border-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>{formatCase('Ikusi nire Karnet Ofiziala')}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playPop();
              onGoHome();
              onClose();
            }}
            className="btn-tactile w-full min-h-[44px] px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 border-sky-800 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>{formatCase('Joan hasierara (1. misioa)')}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="w-full min-h-[42px] px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            {formatCase('Jarraitu jardueran')}
          </button>
        </div>
      </div>
    </div>
  );
};
