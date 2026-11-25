import { useId } from 'react';
import type { PhoneticTrap } from '../types';

export interface MouthPhoneticGuideProps {
  viseme: PhoneticTrap['visemeType'];
  symbol: string;
  mouthCueTr: string;
  animating?: boolean;
}

interface VisemeProfile {
  voiced: boolean;
  nasal: boolean;
  tonguePath: string;
  jawOffsetY: number;
  upperLipPath: string;
  lowerLipPath: string;
  frontMouthLabel: string;
  airStreams: Array<{ d: string; color: string }>;
}

const VISEME_CONFIG: Record<PhoneticTrap['visemeType'], VisemeProfile> = {
  dental_voiceless: {
    voiced: false,
    nasal: false,
    tonguePath:
      'M 72 152 Q 112 126 154 128 Q 186 130 202 124 Q 207 127 198 134 Q 162 143 116 156 Z',
    jawOffsetY: 3,
    upperLipPath: 'M 176 92 Q 198 96 202 108',
    lowerLipPath: 'M 176 152 Q 196 146 200 135',
    frontMouthLabel: 'Dil ucu dişler arasında',
    airStreams: [
      { d: 'M 192 121 C 214 114, 228 112, 248 114', color: '#0ea5e9' },
      { d: 'M 194 127 C 216 126, 232 128, 252 132', color: '#38bdf8' },
    ],
  },
  dental_voiced: {
    voiced: true,
    nasal: false,
    tonguePath:
      'M 72 152 Q 112 126 154 128 Q 186 130 202 124 Q 207 127 198 134 Q 162 143 116 156 Z',
    jawOffsetY: 3,
    upperLipPath: 'M 176 92 Q 198 96 202 108',
    lowerLipPath: 'M 176 152 Q 196 146 200 135',
    frontMouthLabel: 'Dil diş arasında + Ses teli titreşir',
    airStreams: [
      { d: 'M 192 121 C 214 114, 228 112, 248 114', color: '#f59e0b' },
      { d: 'M 194 127 C 216 126, 232 128, 252 132', color: '#fb7185' },
    ],
  },
  open_front: {
    voiced: true,
    nasal: false,
    tonguePath:
      'M 72 158 Q 114 150 152 153 Q 178 154 188 148 Q 190 156 176 162 Q 124 166 76 165 Z',
    jawOffsetY: 16,
    upperLipPath: 'M 176 90 Q 198 94 202 105',
    lowerLipPath: 'M 172 164 Q 196 160 201 146',
    frontMouthLabel: 'Çene aşağı & geniş gülümseme',
    airStreams: [
      { d: 'M 186 124 C 210 116, 230 116, 248 122', color: '#f59e0b' },
      { d: 'M 186 136 C 210 140, 230 142, 248 138', color: '#fbbf24' },
    ],
  },
  rounded_glide: {
    voiced: true,
    nasal: false,
    tonguePath:
      'M 70 148 Q 108 112 138 120 Q 162 128 176 136 Q 170 148 136 152 Q 96 156 74 158 Z',
    jawOffsetY: 2,
    upperLipPath: 'M 176 92 Q 204 94 212 110',
    lowerLipPath: 'M 176 146 Q 204 144 212 128',
    frontMouthLabel: 'Dudaklar sıkı öpücük yuvarlağı',
    airStreams: [
      { d: 'M 206 119 C 224 112, 236 125, 254 119', color: '#8b5cf6' },
      { d: 'M 206 124 C 224 132, 236 118, 254 125', color: '#38bdf8' },
    ],
  },
  velar_nasal: {
    voiced: true,
    nasal: true,
    tonguePath:
      'M 72 154 Q 98 94 128 95 Q 152 102 174 134 Q 168 148 138 152 Q 102 158 76 160 Z',
    jawOffsetY: 5,
    upperLipPath: 'M 176 92 Q 196 97 200 110',
    lowerLipPath: 'M 176 148 Q 195 144 198 132',
    frontMouthLabel: 'Arka dil damağa değer, ses burundan akar',
    airStreams: [
      { d: 'M 118 82 C 138 66, 174 62, 212 64', color: '#10b981' },
      { d: 'M 204 64 C 224 62, 240 58, 252 52', color: '#34d399' },
    ],
  },
  schwa_relaxed: {
    voiced: true,
    nasal: false,
    tonguePath:
      'M 72 150 Q 112 132 150 134 Q 172 135 182 137 Q 178 148 144 152 Q 104 156 76 158 Z',
    jawOffsetY: 6,
    upperLipPath: 'M 176 92 Q 196 97 200 110',
    lowerLipPath: 'M 175 150 Q 195 146 199 133',
    frontMouthLabel: 'Tamamen gevşek & rahat ağız',
    airStreams: [
      { d: 'M 192 122 C 212 120, 224 120, 240 122', color: '#14b8a6' },
    ],
  },
};

export function MouthPhoneticGuide({
  viseme,
  symbol,
  mouthCueTr,
  animating = true,
}: MouthPhoneticGuideProps) {
  const uid = useId().replace(/:/g, '');
  const cavityGradId = `${uid}-cavity`;
  const tongueGradId = `${uid}-tongue`;
  const cfg = VISEME_CONFIG[viseme];

  const renderFrontLipInset = () => {
    switch (viseme) {
      case 'rounded_glide':
        return (
          <g>
            <circle cx="272" cy="184" r="14" fill="#fb7185" />
            <circle cx="272" cy="184" r="7" fill="#7f1d1d" />
          </g>
        );
      case 'open_front':
        return (
          <g>
            <ellipse cx="272" cy="184" rx="22" ry="15" fill="#fb7185" />
            <ellipse cx="272" cy="185" rx="16" ry="11" fill="#7f1d1d" />
            <path d="M 260 191 Q 272 186 284 191" fill="#fda4af" />
          </g>
        );
      case 'dental_voiceless':
      case 'dental_voiced':
        return (
          <g>
            <ellipse cx="272" cy="184" rx="21" ry="10" fill="#fb7185" />
            <rect x="261" y="178" width="22" height="5" rx="2" fill="#ffffff" />
            <ellipse cx="272" cy="185" rx="11" ry="4.2" fill="#f43f5e" />
          </g>
        );
      case 'velar_nasal':
      case 'schwa_relaxed':
        return (
          <g>
            <ellipse cx="272" cy="184" rx="19" ry="9" fill="#fb7185" />
            <ellipse cx="272" cy="184" rx="13" ry="5" fill="#881337" />
          </g>
        );
    }
  };

  return (
    <div className="ln-mouth-guide-card">
      <div className="ln-mouth-header">
        <span className="ln-phoneme-badge">{symbol}</span>
        <div className="ln-chip-group">
          <span className="ln-mouth-meta-pill">
            {cfg.voiced ? '🔊 Ses Teli Titreşir' : '💨 Sadece Nefes'}
          </span>
          <span className="ln-mouth-meta-pill">
            {cfg.nasal ? '👃 Burun Yolu' : '👄 Ağız Yolu'}
          </span>
        </div>
      </div>

      <div className={`ln-mouth-svg-frame ${animating ? 'ln-viseme-animating' : ''}`}>
        <svg
          viewBox="0 0 320 220"
          width="100%"
          height="auto"
          role="img"
          aria-label={`${symbol} telaffuz ağız ve dil rehberi`}
        >
          <defs>
            <linearGradient id={cavityGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9f1239" />
              <stop offset="100%" stopColor="#4c0519" />
            </linearGradient>
            <linearGradient id={tongueGradId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
          </defs>

          {/* Soft Head Cutaway Silhouette */}
          <path
            d="M 44 28 C 122 18, 178 24, 198 58 L 222 76 C 228 82, 224 89, 212 91 L 198 93 L 198 112 L 198 134 C 204 150, 196 174, 170 182 L 122 190 L 122 212 L 44 212 Z"
            fill="#fde68a"
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Nasal Cavity & Airway */}
          <path
            d="M 68 84 C 82 56, 152 50, 196 69 C 194 82, 162 84, 128 84 C 102 84, 84 96, 74 114 Z"
            fill={cfg.nasal ? '#ccfbf1' : '#ffe4e6'}
            stroke={cfg.nasal ? '#14b8a6' : '#fda4af'}
            strokeWidth="2"
          />

          {/* Oral & Pharynx Cavity */}
          <path
            d="M 62 198 L 62 114 C 78 90, 128 86, 178 92 L 196 112 L 196 144 C 176 164, 128 166, 98 166 L 98 198 Z"
            fill={`url(#${cavityGradId})`}
          />

          {/* Hard Palate & Velum (Soft Palate) */}
          <path
            d={
              cfg.nasal
                ? 'M 106 89 Q 144 82 178 94 L 176 101 Q 140 92 116 105 Z'
                : 'M 106 89 Q 144 82 178 94 L 176 101 Q 140 92 104 97 Z'
            }
            fill="#fecdd3"
          />

          {/* Upper Teeth */}
          <path
            d="M 176 96 L 188 97 L 187 114 Q 181 116 175 113 Z"
            fill="#ffffff"
            stroke="#e2e8f0"
            strokeWidth="1.5"
          />

          {/* Lower Jaw, Teeth & Lip Group */}
          <g className="ln-viseme-jaw">
            <g transform={`translate(0, ${cfg.jawOffsetY})`}>
              <path
                d="M 175 129 L 186 130 L 185 144 L 174 143 Z"
                fill="#ffffff"
                stroke="#e2e8f0"
                strokeWidth="1.5"
              />
              <path
                d={cfg.lowerLipPath}
                fill="none"
                stroke="#f43f5e"
                strokeWidth="8"
                strokeLinecap="round"
              />
            </g>
          </g>

          {/* Upper Lip */}
          <path
            d={cfg.upperLipPath}
            fill="none"
            stroke="#f43f5e"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Animated Tongue Body & Tip */}
          <path
            d={cfg.tonguePath}
            fill={`url(#${tongueGradId})`}
            stroke="#ffe4e6"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Throat / Vocal Cords Vibration Indicator */}
          {cfg.voiced ? (
            <g className="ln-viseme-buzz">
              <circle cx="80" cy="182" r="14" fill="rgba(251, 191, 36, 0.25)" />
              <path
                d="M 68 178 Q 74 172 80 178 T 92 178"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              <path
                d="M 68 186 Q 74 180 80 186 T 92 186"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
            </g>
          ) : (
            <text
              x="80"
              y="186"
              textAnchor="middle"
              fontSize="10"
              fontWeight="800"
              fill="#94a3b8"
            >
              sessiz
            </text>
          )}

          {/* Animated Airflow Puffs */}
          {cfg.airStreams.map((stream, i) => (
            <path
              key={stream.d}
              className="ln-viseme-air"
              style={{ animationDelay: `${i * 0.28}s` }}
              d={stream.d}
              fill="none"
              stroke={stream.color}
              strokeWidth="4"
              strokeDasharray="6 6"
              strokeLinecap="round"
            />
          ))}

          {/* Front-Mouth Shape Inset Card */}
          <rect
            x="234"
            y="146"
            width="76"
            height="64"
            rx="14"
            fill="#f8fafc"
            stroke="#cbd5e1"
            strokeWidth="2"
          />
          <text
            x="272"
            y="162"
            textAnchor="middle"
            fontSize="9.5"
            fontWeight="800"
            fill="#475569"
          >
            Önden Dudak
          </text>
          {renderFrontLipInset()}
        </svg>
      </div>

      <div className="ln-mouth-cue-box">
        <div style={{ color: '#0284c7', marginBottom: 4, fontSize: '0.88rem' }}>
          {cfg.frontMouthLabel}
        </div>
        <div>{mouthCueTr}</div>
      </div>
    </div>
  );
}
