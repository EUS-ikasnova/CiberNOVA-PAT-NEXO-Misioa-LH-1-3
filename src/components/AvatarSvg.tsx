import React from 'react';
import { AvatarConfig } from '../types';

interface AvatarSvgProps {
  avatar: AvatarConfig;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showHalo?: boolean;
}

const SKIN_MAP = {
  'tone-1': { highlight: '#fff5ec', body: '#fde3cd', shadow: '#efbe96', blush: '#fda4af' },
  'tone-2': { highlight: '#fff2df', body: '#f5cda5', shadow: '#d89e6c', blush: '#fb7185' },
  'tone-3': { highlight: '#ecc096', body: '#d49868', shadow: '#9c6231', blush: '#e11d48' },
  'tone-4': { highlight: '#c0805b', body: '#965a38', shadow: '#5d3016', blush: '#be123c' },
  'tone-5': { highlight: '#7f4d32', body: '#59341f', shadow: '#351a0b', blush: '#9f1239' },
};

const SUIT_MAP = {
  'cyber-blue': { light: '#38bdf8', main: '#0284c7', dark: '#0369a1', trim: '#7dd3fc' },
  'cyber-cyan': { light: '#2dd4bf', main: '#0d9488', dark: '#115e59', trim: '#5eead4' },
  'cyber-red': { light: '#fb7185', main: '#e11d48', dark: '#9f1239', trim: '#fda4af' },
  'cyber-purple': { light: '#c084fc', main: '#9333ea', dark: '#6b21a8', trim: '#e9d5ff' },
  'cyber-green': { light: '#4ade80', main: '#16a34a', dark: '#166534', trim: '#86efac' },
};

const EYE_MAP = {
  brown: { light: '#9a4714', main: '#6b3e1b', dark: '#3b1c05' },
  blue: { light: '#38bdf8', main: '#0284c7', dark: '#075985' },
  green: { light: '#4ade80', main: '#15803d', dark: '#14532d' },
  hazel: { light: '#facc15', main: '#b45309', dark: '#713f12' },
};

export const AvatarSvg: React.FC<AvatarSvgProps> = ({
  avatar,
  size = 'lg',
  className = '',
  showHalo = true,
}) => {
  const skin = SKIN_MAP[avatar.skinTone] || SKIN_MAP['tone-2'];
  const suit = SUIT_MAP[avatar.clothing] || SUIT_MAP['cyber-blue'];
  const eyes = EYE_MAP[avatar.eyeColor] || EYE_MAP.brown;

  const sizeClass = {
    sm: 'w-24 h-28',
    md: 'w-36 h-44',
    lg: 'w-56 h-68 sm:w-64 sm:h-76',
    xl: 'w-72 h-84',
  }[size];

  const uid = React.useId().replace(/:/g, '');

  return (
    <div className={`relative flex items-center justify-center ${sizeClass} ${className}`}>
      {showHalo && (
        <div className="absolute -bottom-2 inset-x-4 h-7 bg-gradient-to-t from-sky-400/35 via-sky-300/15 to-transparent rounded-full blur-md pointer-events-none" />
      )}
      <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-md">
        <defs>
          <radialGradient id={`halo-${uid}`} cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.55" />
            <stop offset="65%" stopColor="#38bdf8" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`head-${uid}`} cx="42%" cy="36%" r="68%">
            <stop offset="0%" stopColor={skin.highlight} />
            <stop offset="60%" stopColor={skin.body} />
            <stop offset="100%" stopColor={skin.shadow} />
          </radialGradient>
          <linearGradient id={`suit-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={suit.light} />
            <stop offset="45%" stopColor={suit.main} />
            <stop offset="100%" stopColor={suit.dark} />
          </linearGradient>
          <radialGradient id={`iris-${uid}`} cx="36%" cy="32%" r="68%">
            <stop offset="0%" stopColor={eyes.light} />
            <stop offset="65%" stopColor={eyes.main} />
            <stop offset="100%" stopColor={eyes.dark} />
          </radialGradient>
          <linearGradient id={`visor-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.88" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.72" />
            <stop offset="100%" stopColor="#0e7490" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        <circle cx="100" cy="112" r="88" fill={`url(#halo-${uid})`} />

        {/* Back hair */}
        {avatar.hairStyle === 'afro-black' && (
          <g>
            <circle cx="100" cy="80" r="62" fill="#1c1917" stroke="#0f172a" strokeWidth="3.5" />
            <circle cx="48" cy="86" r="32" fill="#292524" stroke="#0f172a" strokeWidth="3.5" />
            <circle cx="152" cy="86" r="32" fill="#292524" stroke="#0f172a" strokeWidth="3.5" />
            <circle cx="62" cy="50" r="32" fill="#292524" stroke="#0f172a" strokeWidth="3.5" />
            <circle cx="138" cy="50" r="32" fill="#292524" stroke="#0f172a" strokeWidth="3.5" />
            <circle cx="100" cy="34" r="36" fill="#292524" stroke="#0f172a" strokeWidth="3.5" />
          </g>
        )}
        {avatar.hairStyle === 'curly-black' && (
          <g>
            <circle cx="50" cy="86" r="22" fill="#18181b" stroke="#0f172a" strokeWidth="3.5" />
            <circle cx="150" cy="86" r="22" fill="#18181b" stroke="#0f172a" strokeWidth="3.5" />
            <circle cx="64" cy="50" r="24" fill="#18181b" stroke="#0f172a" strokeWidth="3.5" />
            <circle cx="136" cy="50" r="24" fill="#18181b" stroke="#0f172a" strokeWidth="3.5" />
            <circle cx="100" cy="38" r="26" fill="#18181b" stroke="#0f172a" strokeWidth="3.5" />
          </g>
        )}
        {avatar.hairStyle === 'long-brown' && (
          <path
            d="M 46 92 C 38 135, 38 188, 56 200 C 66 200, 70 166, 64 128 C 64 128, 74 44, 100 44 C 126 44, 136 128, 136 128 C 130 166, 134 200, 144 200 C 162 188, 162 135, 154 92 Z"
            fill="#5c2e0b"
            stroke="#0f172a"
            strokeWidth="3.5"
          />
        )}

        {/* Suit & torso */}
        <g>
          <path
            d="M 32 235 C 32 182, 58 170, 100 170 C 142 170, 168 182, 168 235 Z"
            fill={`url(#suit-${uid})`}
            stroke="#0f172a"
            strokeWidth="3.5"
          />
          <path d="M 74 172 L 82 235 M 126 172 L 118 235" stroke={suit.trim} strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="100" cy="172" rx="26" ry="11" fill={suit.trim} stroke="#0f172a" strokeWidth="2.5" />
          <ellipse cx="100" cy="171" rx="22" ry="8" fill="#0f172a" />
          <ellipse cx="100" cy="198" rx="14" ry="10" fill="#0f172a" stroke={suit.trim} strokeWidth="2.5" />
          <circle cx="100" cy="198" r="5" fill="#38bdf8" />
        </g>

        {/* Neck */}
        <path
          d="M 86 146 L 86 173 C 93 178, 107 178, 114 173 L 114 146 Z"
          fill={skin.shadow}
          stroke="#0f172a"
          strokeWidth="3"
        />

        {/* Ears & Head */}
        <ellipse cx="50" cy="112" rx="10" ry="14" fill={skin.body} stroke="#0f172a" strokeWidth="2.5" />
        <ellipse cx="150" cy="112" rx="10" ry="14" fill={skin.body} stroke="#0f172a" strokeWidth="2.5" />
        <path
          d="M 54 98 C 50 54, 150 54, 146 98 C 146 126, 142 148, 124 158 C 112 165, 88 165, 76 158 C 58 148, 54 126, 54 98 Z"
          fill={`url(#head-${uid})`}
          stroke="#0f172a"
          strokeWidth="3.5"
        />

        {/* Blush */}
        <circle cx="70" cy="122" r="11" fill={skin.blush} fillOpacity="0.32" />
        <circle cx="130" cy="122" r="11" fill={skin.blush} fillOpacity="0.32" />

        {/* Eyebrows & Eyes */}
        <path d="M 66 90 Q 77 84 89 89" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <path d="M 111 89 Q 123 84 134 90" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <ellipse cx="78" cy="106" rx="13" ry="14" fill="#ffffff" stroke="#0f172a" strokeWidth="2.8" />
        <ellipse cx="122" cy="106" rx="13" ry="14" fill="#ffffff" stroke="#0f172a" strokeWidth="2.8" />
        <circle cx="78" cy="106" r="9.2" fill={`url(#iris-${uid})`} />
        <circle cx="122" cy="106" r="9.2" fill={`url(#iris-${uid})`} />
        <circle cx="78" cy="106" r="4.8" fill="#0f172a" />
        <circle cx="122" cy="106" r="4.8" fill="#0f172a" />
        <circle cx="75" cy="102" r="3" fill="#ffffff" />
        <circle cx="119" cy="102" r="3" fill="#ffffff" />

        {/* Nose */}
        <path d="M 97 114 Q 100 119 103 114" stroke={skin.shadow} strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* Mouth */}
        {avatar.expression === 'super' ? (
          <g>
            <path d="M 83 131 Q 100 154 117 131 Z" fill="#e11d48" stroke="#0f172a" strokeWidth="3" />
            <path d="M 87 133 Q 100 141 113 133" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        ) : (
          <path d="M 84 132 Q 100 146 116 132" stroke="#0f172a" strokeWidth="3.8" strokeLinecap="round" fill="none" />
        )}

        {/* Front hair */}
        {avatar.hairStyle === 'short-brown' && (
          <path
            d="M 52 92 C 48 52, 70 34, 100 34 C 130 34, 152 52, 148 92 C 142 74, 128 72, 116 75 C 105 77, 95 68, 80 73 C 66 77, 58 84, 52 92 Z"
            fill="#5c3818"
            stroke="#0f172a"
            strokeWidth="3.5"
          />
        )}
        {avatar.hairStyle === 'long-brown' && (
          <path
            d="M 54 84 C 70 72, 85 72, 100 76 C 115 72, 130 72, 146 84 C 140 73, 128 68, 118 71 C 108 68, 92 68, 82 71 C 72 68, 60 73, 54 84 Z"
            fill="#78350f"
            stroke="#0f172a"
            strokeWidth="3"
          />
        )}
        {avatar.hairStyle === 'curly-black' && (
          <path
            d="M 50 94 C 40 76, 46 54, 62 46 C 70 32, 90 30, 100 30 C 114 30, 130 32, 138 46 C 154 54, 160 76, 150 94 C 152 78, 140 65, 128 63 C 114 61, 106 66, 96 63 C 80 63, 68 67, 50 94 Z"
            fill="#18181b"
            stroke="#0f172a"
            strokeWidth="3.5"
          />
        )}
        {avatar.hairStyle === 'afro-black' && (
          <path
            d="M 54 94 C 52 74, 66 66, 76 71 C 83 65, 94 65, 100 69 C 106 65, 117 65, 124 71 C 134 66, 148 74, 146 94 C 140 78, 128 75, 117 77 C 107 73, 93 73, 83 77 C 72 75, 60 78, 54 94 Z"
            fill="#1c1917"
            stroke="#0f172a"
            strokeWidth="3.5"
          />
        )}
        {avatar.hairStyle === 'ponytail-blonde' && (
          <g>
            <ellipse
              cx="152"
              cy="58"
              rx="18"
              ry="26"
              fill="#facc15"
              stroke="#0f172a"
              strokeWidth="3"
              transform="rotate(28 152 58)"
            />
            <circle cx="138" cy="65" r="7" fill="#ec4899" stroke="#0f172a" strokeWidth="2" />
            <path
              d="M 54 92 C 50 56, 72 38, 100 38 C 128 38, 146 56, 144 92 C 136 74, 122 70, 110 73 C 98 73, 86 68, 74 72 C 62 76, 58 84, 54 92 Z"
              fill="#facc15"
              stroke="#0f172a"
              strokeWidth="3.2"
            />
          </g>
        )}
        {avatar.hairStyle === 'spiky-red' && (
          <path
            d="M 52 88 L 58 48 L 72 60 L 84 32 L 98 56 L 114 30 L 124 56 L 138 42 L 146 88 C 134 72, 118 72, 100 72 C 82 72, 66 72, 52 88 Z"
            fill="#ea580c"
            stroke="#0f172a"
            strokeWidth="3.5"
          />
        )}

        {/* Accessories */}
        {avatar.accessory === 'glasses' && (
          <g>
            <circle cx="78" cy="106" r="17" fill="rgba(56, 189, 248, 0.16)" stroke="#0f172a" strokeWidth="3.5" />
            <circle cx="122" cy="106" r="17" fill="rgba(56, 189, 248, 0.16)" stroke="#0f172a" strokeWidth="3.5" />
            <path d="M 95 106 L 105 106" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 52 104 L 61 104 M 139 104 L 148 104" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        )}
        {avatar.accessory === 'cyber-visor' && (
          <g>
            <path
              d="M 52 94 C 70 86, 130 86, 148 94 L 144 116 C 128 123, 72 123, 56 116 Z"
              fill={`url(#visor-${uid})`}
              stroke="#0891b2"
              strokeWidth="3"
            />
            <path d="M 62 100 C 82 95, 118 95, 138 100" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" opacity="0.8" />
          </g>
        )}
        {avatar.accessory === 'headphones' && (
          <g>
            <path d="M 46 105 C 44 45, 156 45, 154 105" stroke="#0f172a" strokeWidth="8" strokeLinecap="round" fill="none" />
            <path d="M 46 105 C 44 45, 156 45, 154 105" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <rect x="38" y="92" width="14" height="34" rx="7" fill="#0284c7" stroke="#0f172a" strokeWidth="2.5" />
            <rect x="148" y="92" width="14" height="34" rx="7" fill="#0284c7" stroke="#0f172a" strokeWidth="2.5" />
          </g>
        )}
        {avatar.accessory === 'cyber-cap' && (
          <g>
            <path d="M 50 74 C 54 34, 146 34, 150 74 Z" fill="#0284c7" stroke="#0f172a" strokeWidth="3.5" />
            <path d="M 46 74 Q 106 60 170 76 Q 130 84 46 74 Z" fill="#0369a1" stroke="#0f172a" strokeWidth="3" />
            <circle cx="100" cy="54" r="7" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
          </g>
        )}
      </svg>
    </div>
  );
};
