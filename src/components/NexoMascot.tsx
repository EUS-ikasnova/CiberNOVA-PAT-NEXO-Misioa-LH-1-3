import React, { useId, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { usePreferences } from '../context/PreferencesContext';

export type NexoExpression = 'neutral' | 'greeting' | 'speaking' | 'celebrating';

interface NexoMascotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  speaking?: boolean;
  waving?: boolean;
  expression?: NexoExpression;
  facing?: 'left' | 'right';
  interactive?: boolean;
  animateOnHoverOnly?: boolean;
  onClick?: () => void;
  title?: string;
}

export const NexoMascot: React.FC<NexoMascotProps> = ({
  size = 'md',
  speaking = false,
  waving = false,
  expression = 'neutral',
  facing = 'right',
  interactive = false,
  animateOnHoverOnly = true,
  onClick,
  title,
}) => {
  const uid = useId().replace(/:/g, '');
  const { prefs } = usePreferences();
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = prefs.calmMode || Boolean(prefersReducedMotion);
  const [isHovered, setIsHovered] = useState(false);

  const isGreeting = waving || expression === 'greeting' || isHovered;
  const isCelebrating = expression === 'celebrating';
  const isSpeaking = speaking || expression === 'speaking';
  const shouldAnimate = !reduceMotion && (!animateOnHoverOnly || isHovered || isSpeaking || waving || expression === 'greeting' || isCelebrating);

  const sizeClass = {
    sm: 'w-14 h-14',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
    xl: 'w-32 h-32',
  }[size];

  const shellGradId = `nexoShell-${uid}`;
  const visorGradId = `nexoVisor-${uid}`;
  const glowGradId = `nexoGlow-${uid}`;

  const content = (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative flex items-center justify-center shrink-0 select-none ${sizeClass} ${
        interactive || onClick ? 'cursor-pointer' : ''
      }`}
      animate={
        !shouldAnimate
          ? { y: 0, rotate: 0 }
          : {
              y: [0, -5, 0],
              rotate: facing === 'left' ? [-1.5, 0.5, -1.5] : [-0.5, 1.5, -0.5],
            }
      }
      transition={
        !shouldAnimate
          ? { duration: 0.25 }
          : {
              duration: 2.6,
              repeat: Infinity,
              ease: 'easeInOut',
            }
      }
      whileHover={interactive || onClick ? { scale: reduceMotion ? 1.02 : 1.07 } : undefined}
      whileTap={interactive || onClick ? { scale: 0.94 } : undefined}
      aria-hidden={!onClick}
    >
      <svg viewBox="0 0 220 210" className="w-full h-full drop-shadow-md overflow-visible">
        <defs>
          <linearGradient id={shellGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="45%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id={visorGradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#090d16" />
          </linearGradient>
          <radialGradient id={glowGradId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Digital levitation shadow / thruster glow */}
        <motion.ellipse
          cx="110"
          cy="192"
          rx="42"
          ry="9"
          fill={`url(#${glowGradId})`}
          animate={
            !shouldAnimate
              ? { scaleX: 1, opacity: 0.65 }
              : {
                  scaleX: [0.92, 1.08, 0.92],
                  opacity: [0.55, 0.85, 0.55],
                }
          }
          transition={{ duration: 2.6, repeat: shouldAnimate ? Infinity : 0, ease: 'easeInOut' }}
          style={{ transformOrigin: '110px 192px' }}
        />

        {/* Lower digital thruster nozzle */}
        <path
          d="M 88 158 L 132 158 L 122 171 Q 110 175 98 171 Z"
          fill="#0369a1"
          stroke="#0c4a6e"
          strokeWidth="3"
        />
        <motion.ellipse
          cx="110"
          cy="173"
          rx="12"
          ry="4"
          fill="#67e8f9"
          animate={
            !shouldAnimate
              ? { opacity: 0.75, scaleX: 1 }
              : {
                  opacity: [0.55, 1, 0.55],
                  scaleX: [0.85, 1.15, 0.85],
                }
          }
          transition={{ duration: 1.4, repeat: shouldAnimate ? Infinity : 0, ease: 'easeInOut' }}
          style={{ transformOrigin: '110px 173px' }}
        />

        {/* Left articulated digital arm */}
        <motion.g
          animate={
            !shouldAnimate
              ? { rotate: 0 }
              : isCelebrating
              ? { rotate: [0, 28, -10, 24, 0] }
              : { rotate: [0, 6, 0, -4, 0] }
          }
          transition={{
            duration: isCelebrating ? 0.9 : 2.8,
            repeat: shouldAnimate ? Infinity : 0,
            ease: 'easeInOut',
          }}
          style={{ transformOrigin: '48px 104px' }}
        >
          <rect x="22" y="96" width="22" height="14" rx="7" fill="#0ea5e9" stroke="#0c4a6e" strokeWidth="3" />
          <circle cx="22" cy="108" r="10" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="3" />
          <circle cx="22" cy="108" r="4" fill="#38bdf8" />
        </motion.g>

        {/* Right articulated waving arm */}
        <motion.g
          animate={
            reduceMotion
              ? isGreeting || isCelebrating
                ? { rotate: -26 }
                : { rotate: 0 }
              : !shouldAnimate
              ? { rotate: 0 }
              : isGreeting || isCelebrating
              ? { rotate: [-14, -46, -10, -44, -14] }
              : { rotate: [0, -7, 0, 4, 0] }
          }
          transition={
            !shouldAnimate
              ? { duration: 0.25 }
              : {
                  duration: isGreeting || isCelebrating ? 0.85 : 2.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
          }
          style={{ transformOrigin: '172px 104px' }}
        >
          <rect x="176" y="96" width="22" height="14" rx="7" fill="#0ea5e9" stroke="#0c4a6e" strokeWidth="3" />
          <circle cx="198" cy="103" r="10" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="3" />
          {/* Friendly little digital fingers when waving */}
          <path
            d="M 195 93 L 194 86 M 201 93 L 204 87"
            stroke="#0c4a6e"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="198" cy="103" r="4" fill={isGreeting || isCelebrating ? '#fbbf24' : '#38bdf8'} />
        </motion.g>

        {/* Springy digital antenna */}
        <motion.g
          animate={
            !shouldAnimate
              ? { rotate: 0 }
              : isGreeting || isSpeaking
              ? { rotate: [-8, 8, -8] }
              : { rotate: [-2.5, 2.5, -2.5] }
          }
          transition={{
            duration: isGreeting || isSpeaking ? 0.9 : 2.5,
            repeat: shouldAnimate ? Infinity : 0,
            ease: 'easeInOut',
          }}
          style={{ transformOrigin: '110px 44px' }}
        >
          <line x1="110" y1="22" x2="110" y2="46" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" />
          {(isGreeting || isSpeaking || isCelebrating) && !reduceMotion && (
            <motion.circle
              cx="110"
              cy="16"
              r="14"
              fill="none"
              stroke={isSpeaking ? '#34d399' : '#fbbf24'}
              strokeWidth="2.5"
              animate={{ scale: [0.8, 1.45], opacity: [0.85, 0] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'easeOut' }}
              style={{ transformOrigin: '110px 16px' }}
            />
          )}
          <circle
            cx="110"
            cy="16"
            r="8.5"
            fill={isSpeaking ? '#34d399' : isGreeting || isCelebrating ? '#fbbf24' : '#38bdf8'}
            stroke="#0c4a6e"
            strokeWidth="2.5"
          />
          <circle cx="107" cy="13" r="2.5" fill="#ffffff" />
        </motion.g>

        {/* Side audio ear pods */}
        <rect x="36" y="76" width="16" height="36" rx="8" fill="#0369a1" stroke="#0c4a6e" strokeWidth="3" />
        <rect x="168" y="76" width="16" height="36" rx="8" fill="#0369a1" stroke="#0c4a6e" strokeWidth="3" />
        <circle cx="44" cy="94" r="3" fill="#67e8f9" />
        <circle cx="176" cy="94" r="3" fill="#67e8f9" />

        {/* Main rounded cyber body */}
        <rect
          x="50"
          y="42"
          width="120"
          height="116"
          rx="44"
          fill={`url(#${shellGradId})`}
          stroke="#0c4a6e"
          strokeWidth="4"
        />

        {/* Subtle glossy highlight on shell */}
        <path
          d="M 70 52 Q 110 46 150 52"
          stroke="#e0f2fe"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          opacity="0.65"
        />

        {/* Digital LED Visor */}
        <rect x="64" y="58" width="92" height="58" rx="24" fill={`url(#${visorGradId})`} stroke="#0284c7" strokeWidth="2.5" />
        {/* Visor glass reflection */}
        <path
          d="M 76 66 Q 110 62 142 66"
          stroke="#38bdf8"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.3"
        />

        {/* Expressive Digital Eyes */}
        {isCelebrating ? (
          <g stroke="#34d399" strokeWidth="5.5" strokeLinecap="round" fill="none">
            <path d="M 80 83 Q 90 70 100 83" />
            <path d="M 120 83 Q 130 70 140 83" />
          </g>
        ) : isGreeting ? (
          <g>
            {/* Left happy eye, right cheerful wink */}
            <ellipse cx="90" cy="80" rx="8.5" ry="10" fill="#22d3ee" />
            <circle cx="92.5" cy="76.5" r="3.2" fill="#ffffff" />
            <path d="M 120 82 Q 130 71 140 82" stroke="#22d3ee" strokeWidth="5" strokeLinecap="round" fill="none" />
          </g>
        ) : (
          <motion.g
            animate={
              reduceMotion
                ? undefined
                : {
                    scaleY: [1, 1, 1, 0.08, 1, 1],
                  }
            }
            transition={{
              duration: 4.4,
              times: [0, 0.45, 0.48, 0.51, 0.54, 1],
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: '110px 80px' }}
          >
            <ellipse cx="90" cy="80" rx="8.5" ry={isSpeaking ? 11 : 9.5} fill="#22d3ee" />
            <circle cx="92.5" cy="76.5" r="3" fill="#ffffff" />
            <ellipse cx="130" cy="80" rx="8.5" ry={isSpeaking ? 11 : 9.5} fill="#22d3ee" />
            <circle cx="132.5" cy="76.5" r="3" fill="#ffffff" />
          </motion.g>
        )}

        {/* Digital rosy pixel cheeks when greeting/celebrating */}
        {(isGreeting || isCelebrating) && (
          <g opacity="0.75">
            <ellipse cx="76" cy="94" rx="5.5" ry="3" fill="#fb7185" />
            <ellipse cx="144" cy="94" rx="5.5" ry="3" fill="#fb7185" />
          </g>
        )}

        {/* Animated Digital Mouth / Voice Equalizer */}
        {isSpeaking ? (
          <g>
            <motion.rect
              x="96"
              y="95"
              width="28"
              height="10"
              rx="5"
              fill="#34d399"
              animate={
                reduceMotion
                  ? undefined
                  : {
                      scaleY: [0.55, 1.25, 0.65, 1.15, 0.55],
                    }
              }
              transition={{ duration: 0.42, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: '110px 100px' }}
            />
          </g>
        ) : (
          <path
            d={isGreeting || isCelebrating ? 'M 96 97 Q 110 109 124 97' : 'M 100 98 Q 110 105 120 98'}
            stroke={isCelebrating ? '#34d399' : '#38bdf8'}
            strokeWidth="3.8"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* Chest core emblem */}
        <circle cx="110" cy="136" r="12" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2.5" />
        <motion.circle
          cx="110"
          cy="136"
          r="6"
          fill={isCelebrating ? '#10b981' : isGreeting ? '#f59e0b' : '#0284c7'}
          animate={
            !shouldAnimate
              ? { scale: 1, opacity: 0.95 }
              : {
                  scale: [0.92, 1.15, 0.92],
                  opacity: [0.85, 1, 0.85],
                }
          }
          transition={{ duration: 2.2, repeat: shouldAnimate ? Infinity : 0, ease: 'easeInOut' }}
          style={{ transformOrigin: '110px 136px' }}
        />
      </svg>
    </motion.div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        title={title || 'Agurtu Nexori'}
        aria-label={title || 'Agurtu Nexori'}
        className="inline-flex items-center justify-center rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
      >
        {content}
      </button>
    );
  }

  return content;
};
