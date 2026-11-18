import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  Heart,
  Home,
  Palette,
  Plus,
  Shirt,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  User,
  Users,
  X,
} from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext';
import { FAMILY_OPTIONS, PREFERENCE_ITEMS } from '../data/basqueContent';
import {
  AccessoryId,
  AvatarConfig,
  ClothingId,
  EyeColorId,
  FamilyMember,
  HairStyleId,
  Mission1Phase,
  PreferenceItem,
  SkinToneId,
} from '../types';
import { sound, triggerSparkles } from '../utils/sound';
import { AvatarSvg } from './AvatarSvg';
import { VoiceRecorder } from './VoiceRecorder';

interface Mission1IdentityProps {
  phase: Mission1Phase;
  onChangePhase: (phase: Mission1Phase) => void;
  avatar: AvatarConfig;
  onChangeAvatar: (avatar: AvatarConfig) => void;
  familyMembers: FamilyMember[];
  onChangeFamily: (members: FamilyMember[]) => void;
  likes: PreferenceItem[];
  dislikes: PreferenceItem[];
  onChangePreferences: (likes: PreferenceItem[], dislikes: PreferenceItem[]) => void;
  audioNotes: { identity?: string; environment?: string; preferences?: string };
  onRecordNote: (key: 'identity' | 'environment' | 'preferences', url: string) => void;
  onCompleteMission1: () => void;
}

const SKIN_TONES: { id: SkinToneId; label: string; bg: string }[] = [
  { id: 'tone-1', label: 'Argia 1', bg: '#fde4cf' },
  { id: 'tone-2', label: 'Argia 2', bg: '#f5cda5' },
  { id: 'tone-3', label: 'Kanela', bg: '#d49868' },
  { id: 'tone-4', label: 'Beltzarana', bg: '#965a38' },
  { id: 'tone-5', label: 'Iluna', bg: '#59341f' },
];

const HAIR_STYLES: { id: HairStyleId; label: string; preview: string }[] = [
  { id: 'short-brown', label: 'Motza gaztaina', preview: '👦' },
  { id: 'long-brown', label: 'Luzea gaztaina', preview: '👧' },
  { id: 'curly-black', label: 'Kizkurra beltza', preview: '🧒' },
  { id: 'afro-black', label: 'Kizkur handia', preview: '🧑🏾' },
  { id: 'ponytail-blonde', label: 'Motots horia', preview: '👱‍♀️' },
  { id: 'spiky-red', label: 'Puntaduna gorria', preview: '🧑‍🦰' },
  { id: 'bald', label: 'Ilerik gabe', preview: '🧑‍🦲' },
];

const EYE_COLORS: { id: EyeColorId; label: string; bg: string }[] = [
  { id: 'brown', label: 'Marroiak', bg: '#6b3e1b' },
  { id: 'blue', label: 'Urdinak', bg: '#0284c7' },
  { id: 'green', label: 'Berdeak', bg: '#15803d' },
  { id: 'hazel', label: 'Eztikoloreak', bg: '#a16207' },
];

const CLOTHINGS: { id: ClothingId; label: string; bg: string }[] = [
  { id: 'cyber-blue', label: 'Ziber Urdina', bg: '#0284c7' },
  { id: 'cyber-cyan', label: 'Ziber Turkesa', bg: '#0d9488' },
  { id: 'cyber-red', label: 'Ziber Gorria', bg: '#e11d48' },
  { id: 'cyber-purple', label: 'Ziber Morea', bg: '#9333ea' },
  { id: 'cyber-green', label: 'Ziber Berdea', bg: '#16a34a' },
];

const ACCESSORIES: { id: AccessoryId; label: string; icon: string }[] = [
  { id: 'none', label: 'Osagarririk gabe', icon: '✨' },
  { id: 'headphones', label: 'Entzungailuak', icon: '🎧' },
  { id: 'cyber-visor', label: 'Bisore holografikoa', icon: '🥽' },
  { id: 'glasses', label: 'Betaurrekoak', icon: '👓' },
  { id: 'cyber-cap', label: 'Ziber txapela', icon: '🧢' },
];

export const Mission1Identity: React.FC<Mission1IdentityProps> = ({
  phase,
  onChangePhase,
  avatar,
  onChangeAvatar,
  familyMembers,
  onChangeFamily,
  likes,
  dislikes,
  onChangePreferences,
  audioNotes,
  onRecordNote,
  onCompleteMission1,
}) => {
  const { formatCase } = usePreferences();
  const [avatarTab, setAvatarTab] = useState<'skin' | 'hair' | 'eyes' | 'clothes' | 'accessories'>('skin');
  const [dragRole, setDragRole] = useState<string | null>(null);
  const [prefCategory, setPrefCategory] = useState<'all' | 'sport' | 'food' | 'animal' | 'hobby'>('all');
  const [dragPref, setDragPref] = useState<PreferenceItem | null>(null);

  const updateAvatarField = <K extends keyof AvatarConfig>(
    key: K,
    value: AvatarConfig[K],
    target?: EventTarget | null
  ) => {
    sound.playDrop();
    triggerSparkles(target);
    onChangeAvatar({ ...avatar, [key]: value });
  };

  const addFamilyMember = (option: (typeof FAMILY_OPTIONS)[number], target?: EventTarget | null) => {
    sound.playDrop();
    triggerSparkles(target);
    const newMember: FamilyMember = {
      id: `${option.role}-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      role: option.role,
      label: option.label,
      iconType: option.avatarChar,
    };
    onChangeFamily([...familyMembers, newMember]);
  };

  const removeFamilyMember = (id: string) => {
    sound.playPop();
    onChangeFamily(familyMembers.filter((m) => m.id !== id));
  };

  const addLike = (item: PreferenceItem, target?: EventTarget | null) => {
    sound.playDrop();
    triggerSparkles(target);
    const nextDislikes = dislikes.filter((d) => d.id !== item.id);
    const nextLikes = likes.some((l) => l.id === item.id) ? likes : [...likes, item];
    onChangePreferences(nextLikes, nextDislikes);
  };

  const addDislike = (item: PreferenceItem, target?: EventTarget | null) => {
    sound.playDrop();
    triggerSparkles(target);
    const nextLikes = likes.filter((l) => l.id !== item.id);
    const nextDislikes = dislikes.some((d) => d.id === item.id) ? dislikes : [...dislikes, item];
    onChangePreferences(nextLikes, nextDislikes);
  };

  const removeLike = (id: string) => {
    sound.playPop();
    onChangePreferences(
      likes.filter((l) => l.id !== id),
      dislikes
    );
  };

  const removeDislike = (id: string) => {
    sound.playPop();
    onChangePreferences(
      likes,
      dislikes.filter((d) => d.id !== id)
    );
  };

  const filteredPrefs =
    prefCategory === 'all' ? PREFERENCE_ITEMS : PREFERENCE_ITEMS.filter((p) => p.category === prefCategory);

  return (
    <div className="space-y-6">
      {/* Phase Segmented Bar */}
      <div className="surface-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold text-sm tabular-nums">
            1.{phase}
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
              {formatCase('1. misioa: Nor naiz ni?')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {formatCase('Egin zure avatar segurua benetako argazkirik gabe')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto max-w-full w-full sm:w-auto">
          {[
            { id: 1 as Mission1Phase, label: '1. Honelakoa naiz', icon: <User className="w-3.5 h-3.5" /> },
            { id: 2 as Mission1Phase, label: '2. Nire ingurunea', icon: <Users className="w-3.5 h-3.5" /> },
            { id: 3 as Mission1Phase, label: '3. Gustuak', icon: <Heart className="w-3.5 h-3.5" /> },
          ].map((step) => (
            <button
              key={step.id}
              type="button"
              onClick={() => {
                sound.playPop();
                onChangePhase(step.id);
              }}
              className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                phase === step.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {step.icon}
              <span>{formatCase(step.label)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* PHASE 1: AVATAR BUILDER */}
      {phase === 1 && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Avatar Preview Stage */}
            <div className="surface-card lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-between gap-4">
              <div className="text-center">
                <span className="text-xs font-semibold text-sky-700 dark:text-sky-400">
                  {formatCase('Nire avatar segurua')}
                </span>
              </div>

              <div className="my-auto py-2">
                <AvatarSvg avatar={avatar} size="lg" />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full justify-center">
                <button
                  type="button"
                  onClick={(e) => updateAvatarField('expression', 'happy', e.currentTarget)}
                  className={`btn-tactile flex-1 sm:flex-initial min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
                    avatar.expression === 'happy'
                      ? 'bg-sky-600 border-sky-800 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <span>😊</span>
                  <span>{formatCase('Irribarretsu')}</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => updateAvatarField('expression', 'super', e.currentTarget)}
                  className={`btn-tactile flex-1 sm:flex-initial min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
                    avatar.expression === 'super'
                      ? 'bg-sky-600 border-sky-800 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <span>😄</span>
                  <span>{formatCase('Oso pozik')}</span>
                </button>
              </div>
            </div>

            {/* Avatar Controls */}
            <div className="surface-card lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col justify-between gap-5 min-w-0">
              <div className="space-y-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                    {formatCase('Egin zure avatarra nahi duzun bezala')}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                    {formatCase('Sakatu aukera bat itxura aldatzeko')}
                  </p>
                </div>

                {/* Category Tabs */}
                <div className="flex overflow-x-auto sm:grid sm:grid-cols-5 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  {[
                    { id: 'skin' as const, label: 'Azala', icon: <Palette className="w-4 h-4" /> },
                    { id: 'hair' as const, label: 'Ilea', icon: <span className="text-sm">💇</span> },
                    { id: 'eyes' as const, label: 'Begiak', icon: <Eye className="w-4 h-4" /> },
                    { id: 'clothes' as const, label: 'Jantzia', icon: <Shirt className="w-4 h-4" /> },
                    { id: 'accessories' as const, label: 'Osagarriak', icon: <Sparkles className="w-4 h-4" /> },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        sound.playPop();
                        setAvatarTab(tab.id);
                      }}
                      className={`min-w-[72px] shrink-0 sm:min-w-0 py-2.5 px-2 sm:px-1.5 rounded-lg flex flex-col items-center justify-center gap-1 text-xs font-semibold transition-colors cursor-pointer ${
                        avatarTab === tab.id
                          ? 'bg-white dark:bg-slate-700 text-sky-700 dark:text-sky-300 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      {tab.icon}
                      <span className="whitespace-nowrap sm:truncate max-w-full">{formatCase(tab.label)}</span>
                    </button>
                  ))}
                </div>

                {/* Tab Options */}
                <div className="min-h-[170px] pt-1">
                  {avatarTab === 'skin' && (
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      {SKIN_TONES.map((tone) => (
                        <button
                          key={tone.id}
                          type="button"
                          onClick={(e) => updateAvatarField('skinTone', tone.id, e.currentTarget)}
                          className={`p-3 rounded-xl border flex flex-col items-center gap-2 cursor-pointer transition-colors ${
                            avatar.skinTone === tone.id
                              ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/50 ring-2 ring-sky-200 dark:ring-sky-800'
                              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-slate-300'
                          }`}
                        >
                          <span
                            className="w-10 h-10 rounded-full border-2 border-slate-900/20"
                            style={{ backgroundColor: tone.bg }}
                          />
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {formatCase(tone.label)}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {avatarTab === 'hair' && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {HAIR_STYLES.map((style) => (
                        <button
                          key={style.id}
                          type="button"
                          onClick={(e) => updateAvatarField('hairStyle', style.id, e.currentTarget)}
                          className={`p-3 rounded-xl border flex items-center gap-2.5 text-left cursor-pointer transition-colors ${
                            avatar.hairStyle === style.id
                              ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/50 ring-2 ring-sky-200 dark:ring-sky-800'
                              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-slate-300'
                          }`}
                        >
                          <span className="text-2xl shrink-0">{style.preview}</span>
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {formatCase(style.label)}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {avatarTab === 'eyes' && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {EYE_COLORS.map((eye) => (
                        <button
                          key={eye.id}
                          type="button"
                          onClick={(e) => updateAvatarField('eyeColor', eye.id, e.currentTarget)}
                          className={`p-3 rounded-xl border flex flex-col items-center gap-2 cursor-pointer transition-colors ${
                            avatar.eyeColor === eye.id
                              ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/50 ring-2 ring-sky-200 dark:ring-sky-800'
                              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-slate-300'
                          }`}
                        >
                          <span
                            className="w-9 h-9 rounded-full border-2 border-slate-900/20"
                            style={{ backgroundColor: eye.bg }}
                          />
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {formatCase(eye.label)}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {avatarTab === 'clothes' && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {CLOTHINGS.map((suit) => (
                        <button
                          key={suit.id}
                          type="button"
                          onClick={(e) => updateAvatarField('clothing', suit.id, e.currentTarget)}
                          className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-colors ${
                            avatar.clothing === suit.id
                              ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/50 ring-2 ring-sky-200 dark:ring-sky-800'
                              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-slate-300'
                          }`}
                        >
                          <span
                            className="w-7 h-7 rounded-lg shrink-0 border border-slate-900/15"
                            style={{ backgroundColor: suit.bg }}
                          />
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {formatCase(suit.label)}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {avatarTab === 'accessories' && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {ACCESSORIES.map((acc) => (
                        <button
                          key={acc.id}
                          type="button"
                          onClick={(e) => updateAvatarField('accessory', acc.id, e.currentTarget)}
                          className={`p-3 rounded-xl border flex items-center gap-2.5 text-left cursor-pointer transition-colors ${
                            avatar.accessory === acc.id
                              ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/50 ring-2 ring-sky-200 dark:ring-sky-800'
                              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-slate-300'
                          }`}
                        >
                          <span className="text-2xl shrink-0">{acc.icon}</span>
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {formatCase(acc.label)}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <VoiceRecorder
                label="Grabatu zure ahotsa: nor zara zu?"
                sublabel="Esan zure izena eta zer gustatzen zaizun"
                savedAudioUrl={audioNotes.identity}
                onAudioRecorded={(url) => onRecordNote('identity', url)}
                accent="sky"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                sound.playSuccess();
                onChangePhase(2);
              }}
              className="btn-tactile w-full sm:w-auto min-h-[48px] px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 border-sky-800 text-white text-sm font-bold flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <span>{formatCase('Hurrengoa: Nire ingurunea')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* PHASE 2: ENVIRONMENT / FAMILY */}
      {phase === 2 && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Family Options */}
            <div className="surface-card lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4 min-w-0">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  {formatCase('Zure etxekoak, lagunak eta maskotak')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                  {formatCase('Sakatu edo arrastatu zure etxe seguruan sartzeko')}
                </p>

                <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-2.5 mt-4">
                  {FAMILY_OPTIONS.map((opt, idx) => (
                    <button
                      key={`${opt.role}-${idx}`}
                      type="button"
                      draggable
                      onDragStart={() => setDragRole(opt.role)}
                      onClick={(e) => addFamilyMember(opt, e.currentTarget)}
                      className="min-h-[56px] p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:border-fuchsia-400 hover:bg-fuchsia-50/40 dark:hover:bg-fuchsia-950/30 flex items-center justify-between gap-2 text-left transition-colors cursor-pointer group min-w-0"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-2xl shrink-0">{opt.avatarChar}</span>
                        <div className="min-w-0">
                          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 block truncate">
                            {formatCase(opt.label)}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                            {formatCase(opt.roleDescription)}
                          </span>
                        </div>
                      </div>
                      <span className="w-7 h-7 rounded-lg bg-fuchsia-100 dark:bg-fuchsia-900/50 text-fuchsia-700 dark:text-fuchsia-300 flex items-center justify-center shrink-0 group-hover:bg-fuchsia-600 group-hover:text-white transition-colors">
                        <Plus className="w-4 h-4" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <VoiceRecorder
                label="Grabatu zure ahotsa: nor bizi da zurekin?"
                sublabel="Esan Nexori nortzuk diren zure etxekoak"
                savedAudioUrl={audioNotes.environment}
                onAudioRecorded={(url) => onRecordNote('environment', url)}
                accent="fuchsia"
              />
            </div>

            {/* Safe Digital Home */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (!dragRole) return;
                const found = FAMILY_OPTIONS.find((f) => f.role === dragRole);
                if (found) addFamilyMember(found, e.currentTarget);
                setDragRole(null);
              }}
              className="surface-card lg:col-span-6 bg-white dark:bg-slate-900 border border-fuchsia-200 dark:border-fuchsia-900 rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4 min-w-0"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-fuchsia-600 text-white flex items-center justify-center shrink-0">
                      <Home className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                        {formatCase('Nire etxe segurua')}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {formatCase('Konfiantzazko pertsonak eta maskotak')}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-fuchsia-700 dark:text-fuchsia-300 tabular-nums shrink-0">
                    {formatCase(`Kideak: ${familyMembers.length}`)}
                  </span>
                </div>

                {familyMembers.length === 0 ? (
                  <div className="h-44 sm:h-52 border-2 border-dashed border-fuchsia-200 dark:border-fuchsia-800 rounded-2xl flex flex-col items-center justify-center p-5 text-center bg-fuchsia-50/30 dark:bg-fuchsia-950/20">
                    <span className="text-3xl mb-2">🏡</span>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {formatCase('Oraindik ez duzu inor gehitu')}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {formatCase('Sakatu kideak etxe seguruan sartzeko.')}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 min-[380px]:grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
                    {familyMembers.map((member) => (
                      <div
                        key={member.id}
                        className="p-2.5 rounded-xl bg-fuchsia-50/60 dark:bg-fuchsia-950/40 border border-fuchsia-200 dark:border-fuchsia-800 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-2xl shrink-0">{member.iconType}</span>
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                            {formatCase(member.label)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFamilyMember(member.id)}
                          className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-400 flex items-center justify-center shrink-0 cursor-pointer transition-colors"
                          aria-label={`Kendu ${member.label}`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-2.5">
                <span className="text-lg shrink-0">💡</span>
                <span>
                  {formatCase(
                    'Gogoratu: ez partekatu inoiz zure etxeko edo familiako argazkirik interneteko ezezagunekin.'
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                onChangePhase(1);
              }}
              className="btn-tactile flex-1 sm:flex-initial min-h-[46px] px-5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{formatCase('Aurrekoa')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playSuccess();
                onChangePhase(3);
              }}
              className="btn-tactile flex-1 sm:flex-initial min-h-[48px] px-6 py-2.5 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 border-fuchsia-800 text-white text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{formatCase('Hurrengoa: Gustuak')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* PHASE 3: LIKES & DISLIKES */}
      {phase === 3 && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Items Selector */}
            <div className="surface-card lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4 min-w-0">
              <div className="space-y-3">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                    {formatCase('Aukeratu zure gustuak')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {formatCase('Sakatu 👍 gustatzen bazaizu edo 👎 ez bazaizu gustatzen')}
                  </p>
                </div>

                <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto">
                  {[
                    { id: 'all' as const, label: 'Denak' },
                    { id: 'sport' as const, label: 'Kirolak' },
                    { id: 'food' as const, label: 'Janaria' },
                    { id: 'animal' as const, label: 'Animaliak' },
                    { id: 'hobby' as const, label: 'Zaletasunak' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        sound.playPop();
                        setPrefCategory(cat.id);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        prefCategory === cat.id
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {formatCase(cat.label)}
                    </button>
                  ))}
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {filteredPrefs.map((item) => {
                    const isLiked = likes.some((l) => l.id === item.id);
                    const isDisliked = dislikes.some((d) => d.id === item.id);
                    return (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={() => setDragPref(item)}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 flex flex-wrap min-[360px]:flex-nowrap items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-2xl shrink-0">{item.emoji}</span>
                          <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                            {formatCase(item.label)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => addLike(item, e.currentTarget)}
                            className={`min-h-[36px] px-2.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                              isLiked
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-emerald-50'
                            }`}
                            aria-label={`Gustuko dut: ${item.label}`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>{formatCase('Bai')}</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => addDislike(item, e.currentTarget)}
                            className={`min-h-[36px] px-2.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                              isDisliked
                                ? 'bg-rose-600 text-white'
                                : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-rose-50'
                            }`}
                            aria-label={`Ez dut gustuko: ${item.label}`}
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                            <span>{formatCase('Ez')}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <VoiceRecorder
                label="Grabatu zure ahotsa: zer duzu gustuko?"
                sublabel="Kontatu zure zaletasun eta janari gogokoenak"
                savedAudioUrl={audioNotes.preferences}
                onAudioRecorded={(url) => onRecordNote('preferences', url)}
                accent="emerald"
              />
            </div>

            {/* Two Buckets */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Likes */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragPref) addLike(dragPref, e.currentTarget);
                  setDragPref(null);
                }}
                className="surface-card bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 rounded-2xl p-4 flex flex-col justify-between gap-3"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2.5 border-b border-emerald-100 dark:border-emerald-900">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <ThumbsUp className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {formatCase('Gustuko dut')}
                        </h4>
                        <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
                          {formatCase('Datu publiko seguruak')}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 tabular-nums">
                      {likes.length}
                    </span>
                  </div>

                  {likes.length === 0 ? (
                    <div className="h-52 border-2 border-dashed border-emerald-200 dark:border-emerald-800 rounded-xl flex flex-col items-center justify-center p-4 text-center">
                      <span className="text-2xl mb-1.5">💚</span>
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        {formatCase('Sakatu botoi berdea (Bai) gustatzen zaizun horretan.')}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                      {likes.map((item) => (
                        <div
                          key={item.id}
                          className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xl shrink-0">{item.emoji}</span>
                            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                              {formatCase(item.label)}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeLike(item.id)}
                            className="w-6 h-6 rounded-lg text-emerald-700 dark:text-emerald-300 hover:bg-rose-500 hover:text-white flex items-center justify-center cursor-pointer"
                            aria-label={`Kendu ${item.label}`}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-xs font-medium text-emerald-900 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  {formatCase('Gauza hauek ez dira sekretuak: lasai kontatu ditzakezu.')}
                </p>
              </div>

              {/* Dislikes */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragPref) addDislike(dragPref, e.currentTarget);
                  setDragPref(null);
                }}
                className="surface-card bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900 rounded-2xl p-4 flex flex-col justify-between gap-3"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2.5 border-b border-rose-100 dark:border-rose-900">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                        <ThumbsDown className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {formatCase('Ez dut gustuko')}
                        </h4>
                        <span className="text-[11px] text-rose-700 dark:text-rose-400">
                          {formatCase('Elkarrekiko errespetua')}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-rose-700 dark:text-rose-300 tabular-nums">
                      {dislikes.length}
                    </span>
                  </div>

                  {dislikes.length === 0 ? (
                    <div className="h-52 border-2 border-dashed border-rose-200 dark:border-rose-800 rounded-xl flex flex-col items-center justify-center p-4 text-center">
                      <span className="text-2xl mb-1.5">⭐</span>
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        {formatCase('Sakatu botoi gorria (Ez) gustatzen ez zaizun horretan.')}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                      {dislikes.map((item) => (
                        <div
                          key={item.id}
                          className="p-2.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xl shrink-0">{item.emoji}</span>
                            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                              {formatCase(item.label)}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeDislike(item.id)}
                            className="w-6 h-6 rounded-lg text-rose-700 dark:text-rose-300 hover:bg-rose-600 hover:text-white flex items-center justify-center cursor-pointer"
                            aria-label={`Kendu ${item.label}`}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-xs font-medium text-rose-900 dark:text-rose-200 bg-rose-50 dark:bg-rose-950/50 p-2.5 rounded-xl border border-rose-200 dark:border-rose-800">
                  {formatCase('Denok ditugu gustu desberdinak, eta elkar errespetatu behar dugu.')}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                onChangePhase(2);
              }}
              className="btn-tactile w-full sm:w-auto min-h-[46px] px-5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{formatCase('Aurrekoa')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playSuccess();
                onCompleteMission1();
              }}
              className="btn-tactile w-full sm:w-auto min-h-[48px] px-5 sm:px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 border-emerald-800 text-white text-sm font-bold flex items-center justify-center gap-2 cursor-pointer text-center"
            >
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{formatCase('1. misioa osatu eta 2. misiora pasa')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
