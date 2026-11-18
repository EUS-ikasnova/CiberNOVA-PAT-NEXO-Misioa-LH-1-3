export type SkinToneId = 'tone-1' | 'tone-2' | 'tone-3' | 'tone-4' | 'tone-5';
export type HairStyleId =
  | 'short-brown'
  | 'long-brown'
  | 'curly-black'
  | 'afro-black'
  | 'ponytail-blonde'
  | 'spiky-red'
  | 'bald';
export type EyeColorId = 'brown' | 'blue' | 'green' | 'hazel';
export type ClothingId = 'cyber-blue' | 'cyber-cyan' | 'cyber-red' | 'cyber-purple' | 'cyber-green';
export type AccessoryId = 'none' | 'headphones' | 'cyber-visor' | 'glasses' | 'cyber-cap';
export type ExpressionId = 'happy' | 'super';

export interface AvatarConfig {
  skinTone: SkinToneId;
  hairStyle: HairStyleId;
  eyeColor: EyeColorId;
  clothing: ClothingId;
  accessory: AccessoryId;
  expression: ExpressionId;
}

export interface FamilyMember {
  id: string;
  role: string;
  label: string;
  iconType: string;
}

export interface PreferenceItem {
  id: string;
  label: string;
  category: 'sport' | 'food' | 'animal' | 'hobby';
  emoji: string;
  iconBg: string;
}

export interface AudioNotes {
  identity?: string;
  environment?: string;
  preferences?: string;
}

export interface StudentProfile {
  studentName: string;
  classroom: string;
  avatar: AvatarConfig;
  familyMembers: FamilyMember[];
  likes: PreferenceItem[];
  dislikes: PreferenceItem[];
  audioNotes: AudioNotes;
  nodeId: string;
}

export type ThemeMode = 'clean' | 'warm' | 'dark' | 'contrast';
export type TextSizeMode = 'normal' | 'large' | 'xl';
export type FontMode = 'standard' | 'lexend';
export type SpeechRateMode = 'slow' | 'normal' | 'fast';
export type UnlockMode = 'guided' | 'free';

export interface UserPreferences {
  theme: ThemeMode;
  textSize: TextSizeMode;
  fontMode: FontMode;
  uppercaseMode: boolean;
  soundEnabled: boolean;
  autoRead: boolean;
  speechRate: SpeechRateMode;
  calmMode: boolean;
  unlockMode: UnlockMode;
  moodleUrl: string;
}

export type MissionId = 1 | 2 | 3 | 4 | 5;
export type Mission1Phase = 1 | 2 | 3;

export interface BadgeDef {
  id: MissionId;
  missionNumber: number;
  title: string;
  name: string;
  description: string;
  icon: string;
  gradient: string;
}
