import React, { useState } from 'react';
import { ShieldAlert } from 'lucide-react';

interface SceneImageProps {
  src?: string;
  alt: string;
  fallbackType?: 'park-puppies';
  className?: string;
}

const ParkPuppiesFallbackIllustration: React.FC = () => (
  <svg
    viewBox="0 0 640 360"
    className="w-full h-full object-cover bg-gradient-to-b from-sky-100 via-emerald-50 to-emerald-100"
    role="img"
    aria-label="Parkean ezezagun batekin kontuz ibiltzeko irudia"
  >
    <defs>
      <linearGradient id="skyPark" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#bae6fd" />
        <stop offset="100%" stopColor="#e0f2fe" />
      </linearGradient>
      <linearGradient id="grassPark" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#86efac" />
        <stop offset="100%" stopColor="#4ade80" />
      </linearGradient>
    </defs>
    <rect width="640" height="220" fill="url(#skyPark)" />
    <circle cx="540" cy="70" r="34" fill="#fde047" />
    <path d="M 0 215 Q 200 185 420 210 T 640 200 L 640 360 L 0 360 Z" fill="url(#grassPark)" />
    {/* Path */}
    <path d="M 350 360 Q 380 280 430 210 L 500 210 Q 470 290 460 360 Z" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />
    {/* Tree */}
    <rect x="92" y="130" width="26" height="95" rx="6" fill="#78350f" />
    <circle cx="105" cy="110" r="54" fill="#16a34a" />
    <circle cx="75" cy="128" r="36" fill="#22c55e" />
    <circle cx="135" cy="126" r="36" fill="#15803d" />
    {/* Park bench */}
    <rect x="165" y="195" width="100" height="10" rx="3" fill="#b45309" />
    <rect x="175" y="205" width="8" height="26" fill="#78350f" />
    <rect x="247" y="205" width="8" height="26" fill="#78350f" />
    {/* Puppies */}
    <g transform="translate(135, 250)">
      <ellipse cx="22" cy="22" rx="18" ry="12" fill="#f59e0b" />
      <circle cx="38" cy="14" r="10" fill="#fbbf24" />
      <ellipse cx="42" cy="12" rx="4" ry="7" fill="#92400e" />
      <circle cx="40" cy="12" r="2" fill="#0f172a" />
    </g>
    <g transform="translate(195, 265)">
      <ellipse cx="20" cy="20" rx="16" ry="11" fill="#d97706" />
      <circle cx="34" cy="13" r="9" fill="#f59e0b" />
      <ellipse cx="38" cy="11" rx="3.5" ry="6" fill="#78350f" />
      <circle cx="36" cy="11" r="2" fill="#0f172a" />
    </g>
    {/* Distant stranger silhouette */}
    <g transform="translate(260, 145)">
      <circle cx="24" cy="18" r="14" fill="#64748b" />
      <path d="M 8 36 C 8 30, 40 30, 40 36 L 44 82 L 4 82 Z" fill="#475569" />
    </g>
    {/* Safe child stepping away toward trusted parent */}
    <g transform="translate(420, 185)">
      <circle cx="22" cy="18" r="15" fill="#f5cda5" stroke="#0f172a" strokeWidth="2" />
      <path d="M 8 15 C 10 2, 34 2, 36 15 Z" fill="#5c3818" />
      <circle cx="17" cy="18" r="2" fill="#0f172a" />
      <circle cx="27" cy="18" r="2" fill="#0f172a" />
      <path d="M 18 25 Q 22 22 26 25" stroke="#0f172a" strokeWidth="2" fill="none" />
      <rect x="9" y="34" width="26" height="36" rx="8" fill="#0284c7" />
      <rect x="11" y="70" width="9" height="22" rx="4" fill="#1e293b" />
      <rect x="24" y="70" width="9" height="22" rx="4" fill="#1e293b" />
    </g>
    {/* Trusted parent */}
    <g transform="translate(485, 130)">
      <circle cx="26" cy="20" r="18" fill="#f5cda5" stroke="#0f172a" strokeWidth="2" />
      <path d="M 8 18 C 8 0, 44 0, 44 18 Z" fill="#78350f" />
      <rect x="8" y="40" width="36" height="58" rx="10" fill="#059669" />
      <rect x="12" y="98" width="11" height="44" rx="4" fill="#334155" />
      <rect x="29" y="98" width="11" height="44" rx="4" fill="#334155" />
    </g>
    {/* Shield reminder badge */}
    <g transform="translate(24, 22)">
      <rect width="46" height="46" rx="14" fill="#ffffff" fillOpacity="0.9" stroke="#f43f5e" strokeWidth="2.5" />
      <path d="M 23 11 L 34 16 V 24 C 34 30 29 35 23 37 C 17 35 12 30 12 24 V 16 Z" fill="#ffe4e6" stroke="#e11d48" strokeWidth="2" />
    </g>
  </svg>
);

export const SceneImage: React.FC<SceneImageProps> = ({ src, alt, fallbackType, className = '' }) => {
  const [hasError, setHasError] = useState(false);

  if (fallbackType === 'park-puppies' && (!src || hasError)) {
    return <ParkPuppiesFallbackIllustration />;
  }

  if (!src || hasError) {
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 via-slate-100 to-indigo-100 dark:from-slate-800 dark:to-slate-900 p-6 text-center ${className}`}
      >
        <ShieldAlert className="w-10 h-10 text-sky-600 dark:text-sky-400 mb-2" />
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
