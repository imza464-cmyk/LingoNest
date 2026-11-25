import { useId } from 'react';
import type { MascotMood } from '../types';

export interface MascotPikoProps {
  mood: MascotMood;
  size?: number;
  bubbleText?: string;
  onTap?: () => void;
  speakingWave?: boolean;
}

export function MascotPiko({
  mood,
  size = 132,
  bubbleText,
  onTap,
  speakingWave = false,
}: MascotPikoProps) {
  const uid = useId().replace(/:/g, '');
  const bodyGradId = `${uid}-piko-body`;
  const bellyGradId = `${uid}-piko-belly`;
  const wingGradId = `${uid}-piko-wing`;
  const crownGradId = `${uid}-piko-crown`;

  const showWaves = speakingWave || mood === 'speaking' || mood === 'listening';
  const isCelebrating = mood === 'celebrating';
  const isThinking = mood === 'thinking';
  const isEncouraging = mood === 'encouraging';
  const isSpeaking = speakingWave || mood === 'speaking';

  const svgContent = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 180 180"
      className={`ln-piko-svg ln-piko-mood-${mood}`}
      role="img"
      aria-label={`Piko maskot (${mood})`}
    >
      <defs>
        <linearGradient id={bodyGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2dd4bf" />
          <stop offset="55%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id={bellyGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="100%" stopColor="#fde68a" />
        </linearGradient>
        <linearGradient id={wingGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
        <linearGradient id={crownGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      {/* Soft Ground Shadow */}
      <ellipse cx="90" cy="162" rx="42" ry="8" fill="rgba(15, 23, 42, 0.12)" />

      {/* Speaking / Listening Wave Rings */}
      {showWaves && (
        <g className="ln-piko-wave">
          <path
            d="M 28 74 Q 14 94 28 114"
            fill="none"
            stroke={mood === 'listening' ? '#10b981' : '#38bdf8'}
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <path
            d="M 18 64 Q 0 94 18 124"
            fill="none"
            stroke={mood === 'listening' ? '#34d399' : '#fbbf24'}
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.78"
          />
          <path
            d="M 152 74 Q 166 94 152 114"
            fill="none"
            stroke={mood === 'listening' ? '#10b981' : '#38bdf8'}
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <path
            d="M 162 64 Q 180 94 162 124"
            fill="none"
            stroke={mood === 'listening' ? '#34d399' : '#fbbf24'}
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.78"
          />
        </g>
      )}

      {/* Celebratory Rising Sparkles */}
      {isCelebrating && (
        <g>
          <path
            className="ln-piko-sparkle"
            d="M 32 48 L 35 39 L 38 48 L 47 51 L 38 54 L 35 63 L 32 54 L 23 51 Z"
            fill="#fbbf24"
          />
          <path
            className="ln-piko-sparkle ln-piko-sparkle-2"
            d="M 146 42 L 149 34 L 152 42 L 160 45 L 152 48 L 149 56 L 146 48 L 138 45 Z"
            fill="#f472b6"
          />
          <circle className="ln-piko-sparkle ln-piko-sparkle-3" cx="90" cy="20" r="4.5" fill="#34d399" />
        </g>
      )}

      {/* Thinking Dots */}
      {isThinking && (
        <g>
          <circle cx="136" cy="50" r="4" fill="#94a3b8" />
          <circle cx="148" cy="39" r="5.5" fill="#64748b" />
          <circle cx="162" cy="28" r="7" fill="#38bdf8" opacity="0.85" />
        </g>
      )}

      <g className="ln-piko-body">
        {/* Cute Feet */}
        <path
          d="M 70 151 L 63 159 M 70 151 L 70 160 M 70 151 L 77 159"
          stroke="#f59e0b"
          strokeWidth="5.5"
          strokeLinecap="round"
        />
        <path
          d="M 110 151 L 103 159 M 110 151 L 110 160 M 110 151 L 117 159"
          stroke="#f59e0b"
          strokeWidth="5.5"
          strokeLinecap="round"
        />

        {/* Animated Wings */}
        <path
          className="ln-piko-wing-l"
          d="M 48 92 C 26 98 22 126 44 136 C 53 139 58 122 54 102 Z"
          fill={`url(#${wingGradId})`}
          stroke="#ffffff"
          strokeWidth="2.5"
        />
        <path
          className="ln-piko-wing-r"
          d={
            isThinking
              ? 'M 130 92 C 152 84 156 106 138 118 C 128 124 124 108 126 98 Z'
              : 'M 132 92 C 154 98 158 126 136 136 C 127 139 122 122 126 102 Z'
          }
          fill={`url(#${wingGradId})`}
          stroke="#ffffff"
          strokeWidth="2.5"
        />

        {/* Golden Ear Tufts */}
        <path
          d="M 52 54 L 40 31 L 67 45 Z"
          fill={`url(#${crownGradId})`}
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M 128 54 L 140 31 L 113 45 Z"
          fill={`url(#${crownGradId})`}
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Main Chubby Owl Body */}
        <ellipse
          cx="90"
          cy="102"
          rx="47"
          ry="52"
          fill={`url(#${bodyGradId})`}
          stroke="#ffffff"
          strokeWidth="3.5"
        />

        {/* Top Golden Feather Crest / Celebration Crown */}
        {isCelebrating ? (
          <path
            d="M 67 46 L 73 25 L 90 38 L 107 25 L 113 46 Z"
            fill={`url(#${crownGradId})`}
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M 80 51 Q 90 36 100 51 Q 90 47 80 51 Z"
            fill={`url(#${crownGradId})`}
          />
        )}

        {/* Warm Cream Belly */}
        <ellipse cx="90" cy="122" rx="31" ry="27" fill={`url(#${bellyGradId})`} />
        <path
          d="M 76 116 Q 82 122 88 116 M 92 116 Q 98 122 104 116 M 83 128 Q 90 134 97 128"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2.8"
          strokeLinecap="round"
          opacity="0.65"
        />

        {/* Expressive Owl Face Mask */}
        <circle cx="71" cy="82" r="20" fill="#ffffff" opacity="0.96" />
        <circle cx="109" cy="82" r="20" fill="#ffffff" opacity="0.96" />

        {/* Rosy Cheeks */}
        <ellipse
          cx="54"
          cy="95"
          rx="7.5"
          ry="4.8"
          fill="#fda4af"
          opacity={isEncouraging || isCelebrating ? 0.95 : 0.72}
        />
        <ellipse
          cx="126"
          cy="95"
          rx="7.5"
          ry="4.8"
          fill="#fda4af"
          opacity={isEncouraging || isCelebrating ? 0.95 : 0.72}
        />

        {/* Eyes */}
        {isCelebrating ? (
          <g>
            <path
              d="M 61 84 Q 71 72 81 84"
              fill="none"
              stroke="#1e293b"
              strokeWidth="4.8"
              strokeLinecap="round"
            />
            <path
              d="M 99 84 Q 109 72 119 84"
              fill="none"
              stroke="#1e293b"
              strokeWidth="4.8"
              strokeLinecap="round"
            />
          </g>
        ) : (
          <g className="ln-piko-eye-blink">
            <circle
              cx={isThinking ? 73 : 71}
              cy={isThinking ? 79 : 82}
              r={mood === 'listening' ? 11.5 : 10.5}
              fill="#172554"
            />
            <circle
              cx={isThinking ? 111 : 109}
              cy={isThinking ? 79 : 82}
              r={mood === 'listening' ? 11.5 : 10.5}
              fill="#172554"
            />
            {/* Glossy Pixar Catchlights */}
            <circle cx={isThinking ? 76 : 74.5} cy={isThinking ? 75 : 78} r="3.8" fill="#ffffff" />
            <circle cx={isThinking ? 114 : 112.5} cy={isThinking ? 75 : 78} r="3.8" fill="#ffffff" />
            <circle cx="67.5" cy="85.5" r="1.8" fill="#ffffff" opacity="0.85" />
            <circle cx="105.5" cy="85.5" r="1.8" fill="#ffffff" opacity="0.85" />
          </g>
        )}

        {/* Cute Orange-Gold Beak */}
        {isSpeaking ? (
          <g>
            <path d="M 82 91 L 98 91 L 90 100 Z" fill="#f97316" stroke="#ea580c" strokeWidth="1.5" />
            <ellipse cx="90" cy="100" rx="5.5" ry="4.5" fill="#9a3412" />
            <ellipse cx="90" cy="102" rx="3.5" ry="2.2" fill="#fb7185" />
          </g>
        ) : (
          <path
            d="M 82 91 L 98 91 L 90 103 Z"
            fill="#fb923c"
            stroke="#ea580c"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        )}
      </g>
    </svg>
  );

  return (
    <div className="ln-piko-wrap">
      {bubbleText && <div className="ln-piko-bubble">{bubbleText}</div>}
      {onTap ? (
        <button
          type="button"
          className="ln-piko-trigger"
          onClick={onTap}
          aria-label={bubbleText ?? 'Piko maskotunu dinle'}
        >
          {svgContent}
        </button>
      ) : (
        <div className="ln-piko-trigger">{svgContent}</div>
      )}
    </div>
  );
}
