import React from 'react';
import {
  Award,
  Download,
  ExternalLink,
  Lock,
  PlusCircle,
  Printer,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext';
import { BADGES } from '../data/basqueContent';
import { Mission1Phase, MissionId, StudentProfile } from '../types';
import { sound, triggerCelebration } from '../utils/sound';
import { AvatarSvg } from './AvatarSvg';
import { NexoMascot } from './NexoMascot';

interface OfficialCardProps {
  profile: StudentProfile;
  completedMissions: MissionId[];
  carnetBadges: MissionId[];
  onAddBadgeToCarnet: (id: MissionId) => void;
  onEditPhase: (phase: Mission1Phase) => void;
  onGoToMission: (mission: MissionId) => void;
  onResetAll: () => void;
}

export const OfficialCard: React.FC<OfficialCardProps> = ({
  profile,
  completedMissions,
  carnetBadges,
  onAddBadgeToCarnet,
  onEditPhase,
  onGoToMission,
  onResetAll,
}) => {
  const { prefs, formatCase } = usePreferences();
  const allFourDone = [1, 2, 3, 4].every((id) => completedMissions.includes(id as MissionId));
  const pendingBadges = BADGES.filter((b) => completedMissions.includes(b.id) && !carnetBadges.includes(b.id));
  const addedCount = BADGES.filter((b) => carnetBadges.includes(b.id)).length;

  const handleDownloadJson = () => {
    sound.playPop();
    const blob = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CiberNOVA_Nodoa_${profile.studentName || 'Ikaslea'}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* Main Printable Official Card */}
      <div className="lg:col-span-8 surface-card print-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 space-y-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {formatCase('Nire Karnet Ofiziala')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                {profile.nodeId} · LH 1
              </p>
            </div>
          </div>

          <span
            className={`text-xs font-bold px-3 py-1 rounded-lg ${
              allFourDone
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
            }`}
          >
            {formatCase(allFourDone ? 'Karneta prest!' : `${completedMissions.length}/4 misio eginda`)}
          </span>
        </div>

        {/* Profile & Avatar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
          <div className="sm:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <AvatarSvg avatar={profile.avatar} size="md" />
            <span className="text-xs font-semibold text-sky-700 dark:text-sky-400 mt-2">
              {formatCase(`${profile.studentName || 'Kadetea'}ren avatara`)}
            </span>
          </div>

          <div className="sm:col-span-7 space-y-2.5">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                {formatCase('Ikaslearen izena')}
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {formatCase(profile.studentName || 'Kadete ofiziala')}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                {formatCase('Ikasgela / Ikastetxea')}
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {formatCase(profile.classroom || 'Lehen Hezkuntzako 1. maila')}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                {formatCase('Etxe seguruko pertsonak eta maskotak')}
              </span>
              <div className="flex flex-wrap gap-1.5 text-xs text-slate-800 dark:text-slate-200">
                {profile.familyMembers.length > 0 ? (
                  profile.familyMembers.map((m) => (
                    <span
                      key={m.id}
                      className="px-2 py-0.5 rounded-lg bg-fuchsia-50 dark:bg-fuchsia-950/60 border border-fuchsia-200 dark:border-fuchsia-800 font-semibold"
                    >
                      {m.iconType} {formatCase(m.label)}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400">{formatCase('Erregistratu gabe')}</span>
                )}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                {formatCase('Datu publiko seguruak (Gustukoak)')}
              </span>
              <div className="flex flex-wrap gap-1.5 text-xs text-slate-800 dark:text-slate-200">
                {profile.likes.length > 0 ? (
                  profile.likes.slice(0, 5).map((l) => (
                    <span
                      key={l.id}
                      className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 font-semibold"
                    >
                      {l.emoji} {formatCase(l.label)}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400">{formatCase('Bat ere ez')}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 4 Honor Badges */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs sm:text-sm font-bold text-amber-300">
                {formatCase('Kadetearen domina eta intsigniak')}
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-300 tabular-nums">
              {formatCase(`${addedCount}/4 Karnetean`)}
            </span>
          </div>

          {pendingBadges.length > 0 && (
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/60 flex flex-wrap items-center justify-between gap-2 no-print">
              <span className="text-xs font-bold text-amber-200">
                {formatCase('Irabazitako domina berria daukazu! Sakatu Karnetean jartzeko.')}
              </span>
              {pendingBadges.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playSuccess();
                    triggerCelebration(80);
                    pendingBadges.forEach((b) => onAddBadgeToCarnet(b.id));
                  }}
                  className="px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold cursor-pointer whitespace-nowrap"
                >
                  {formatCase('Gehitu denak')}
                </button>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {BADGES.map((badge) => {
              const earned = completedMissions.includes(badge.id);
              const added = carnetBadges.includes(badge.id);

              if (earned && !added) {
                return (
                  <button
                    key={badge.id}
                    type="button"
                    onClick={() => {
                      sound.playSuccess();
                      triggerCelebration(70);
                      onAddBadgeToCarnet(badge.id);
                    }}
                    className="p-3 rounded-xl border-2 border-dashed border-amber-400 bg-amber-500/15 hover:bg-amber-500/25 text-center flex flex-col items-center gap-1.5 cursor-pointer transition-colors"
                    title="Sakatu domina Karnetean gehitzeko"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br ${badge.gradient} opacity-90`}
                    >
                      {badge.icon}
                    </div>
                    <span className="text-[11px] font-bold text-amber-300">{formatCase(badge.title)}</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950 text-[11px] font-extrabold whitespace-nowrap">
                      <PlusCircle className="w-3 h-3" />
                      <span>{formatCase('Gehitu')}</span>
                    </span>
                  </button>
                );
              }

              return (
                <div
                  key={badge.id}
                  className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1 ${
                    added
                      ? 'bg-slate-800 border-amber-400/70'
                      : 'bg-slate-900/50 border-slate-800 opacity-55'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
                      added ? `bg-gradient-to-br ${badge.gradient}` : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {added ? badge.icon : <Lock className="w-4 h-4" />}
                  </div>
                  <span className="text-[11px] font-bold text-amber-300">{formatCase(badge.title)}</span>
                  <span className="text-xs font-semibold text-white leading-tight">{formatCase(badge.name)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Verdict Footer */}
        <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-center gap-3">
          <Trophy className="w-6 h-6 text-amber-500 shrink-0" />
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-sky-950 dark:text-sky-100">
              {formatCase('NEXOren mezua: karnet segurua prest!')}
            </h4>
            <p className="text-xs text-sky-800 dark:text-sky-300 mt-0.5">
              {formatCase(
                'Zure avatarra bakarra da eta besteak errespetatzen dituzu.'
              )}
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{formatCase('CiberNOVA-PAT · LH 1')}</span>
          <span className="tabular-nums">{new Date().toLocaleDateString('eu-ES')}</span>
        </div>
      </div>

      {/* Right Actions Column */}
      <div className="lg:col-span-4 space-y-4 no-print">
        <div className="surface-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-center space-y-3">
          <div className="flex justify-center">
            <NexoMascot size="md" expression={allFourDone ? 'celebrating' : 'neutral'} />
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {formatCase(allFourDone ? 'Zorionak, Kadetea!' : 'Karneta prestatzen')}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {formatCase(
              allFourDone
                ? '4 misioak bukatu dituzu! Zure karnet ofiziala prest dago.'
                : `${completedMissions.length} / 4 misio eginda. 4. misioa bukatzean karnet osoa prest egongo da.`
            )}
          </p>

          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                window.print();
              }}
              className="btn-tactile w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 border-sky-800 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{formatCase('Inprimatu diploma paperean')}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadJson}
              className="btn-tactile w-full min-h-[44px] px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{formatCase('Gorde ordenagailuan (.JSON)')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playLevelUp();
                triggerCelebration(120);
              }}
              className="btn-tactile w-full min-h-[44px] px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 border-amber-700 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{formatCase('Bota konfeti gehiago!')}</span>
            </button>

            <a
              href={prefs.moodleUrl}
              target="_top"
              onClick={() => sound.playPop()}
              className="btn-tactile w-full min-h-[46px] px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 border-orange-800 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{formatCase('Itzuli Moodle ikastarora')}</span>
            </a>
          </div>
        </div>

        {/* Quick Phase Editors */}
        <div className="surface-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block text-center">
            {formatCase('Editatu 1. misioaren faseak')}
          </span>
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => onEditPhase(1)}
              className="min-h-[40px] px-1.5 sm:px-2 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              {formatCase('1. Avatara')}
            </button>
            <button
              type="button"
              onClick={() => onEditPhase(2)}
              className="min-h-[40px] px-1.5 sm:px-2 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              {formatCase('2. Etxea')}
            </button>
            <button
              type="button"
              onClick={() => onEditPhase(3)}
              className="min-h-[40px] px-1.5 sm:px-2 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              {formatCase('3. Gustuak')}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => onGoToMission(2)}
              className="min-h-[38px] px-2 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-semibold cursor-pointer"
            >
              {formatCase('2. misioa')}
            </button>
            <button
              type="button"
              onClick={() => onGoToMission(3)}
              className="min-h-[38px] px-2 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold cursor-pointer"
            >
              {formatCase('3. misioa')}
            </button>
            <button
              type="button"
              onClick={() => onGoToMission(4)}
              className="min-h-[38px] px-2 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold cursor-pointer"
            >
              {formatCase('4. misioa')}
            </button>
          </div>

          <button
            type="button"
            onClick={onResetAll}
            className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-100 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{formatCase('Hasi berriz')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
