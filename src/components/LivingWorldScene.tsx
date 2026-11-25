import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Moon, Play, Sparkles, Volume2, X } from 'lucide-react';
import type { LearnerProfile, VocabItem, WorldData } from '../types';
import {
  cardKey,
  computeItemMasteryPct,
  isItemAwakeInLivingWorld,
} from '../engine/fsrs5';
import { audioEngine } from '../engine/audioEngine';
import { TR_VOICE } from '../data/voiceScripts';

export interface LivingWorldSceneProps {
  worlds: WorldData[];
  profile: LearnerProfile;
  onSelectWorldToPlay: (worldId: string) => void;
}

function clampPercent(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}

function SceneBackdropSvg({
  theme,
  gradient,
}: {
  theme: WorldData['sceneTheme'];
  gradient: [string, string];
}) {
  const uid = useId().replace(/:/g, '');
  const skyId = `${uid}-sky`;
  const hillBackId = `${uid}-hill-back`;
  const hillFrontId = `${uid}-hill-front`;

  return (
    <svg
      className="ln-living-svg"
      viewBox="0 0 960 540"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={skyId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={gradient[0]} stopOpacity="0.92" />
          <stop offset="65%" stopColor={gradient[1]} stopOpacity="0.48" />
          <stop offset="100%" stopColor="#fef9c3" stopOpacity="0.88" />
        </linearGradient>
        <linearGradient id={hillBackId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={theme === 'castle' ? '#6366f1' : '#86efac'} />
          <stop offset="100%" stopColor={theme === 'castle' ? '#312e81' : '#22c55e'} />
        </linearGradient>
        <linearGradient id={hillFrontId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={theme === 'kitchen' ? '#fde68a' : '#4ade80'} />
          <stop offset="100%" stopColor={theme === 'kitchen' ? '#f59e0b' : '#16a34a'} />
        </linearGradient>
      </defs>

      {/* Luminous Sky */}
      <rect width="960" height="540" fill={`url(#${skyId})`} />

      {/* Warm Glowing Sun / Moon */}
      <circle
        cx={theme === 'castle' ? 800 : 140}
        cy="98"
        r="54"
        fill={theme === 'castle' ? '#fef08a' : '#fde047'}
        opacity="0.92"
      />
      <circle
        cx={theme === 'castle' ? 800 : 140}
        cy="98"
        r="82"
        fill={theme === 'castle' ? '#fef9c3' : '#fef08a'}
        opacity="0.28"
      />

      {/* Drifting Clouds */}
      <g className="ln-living-cloud" opacity="0.86">
        <ellipse cx="320" cy="96" rx="54" ry="22" fill="#ffffff" />
        <circle cx="298" cy="86" r="24" fill="#ffffff" />
        <circle cx="334" cy="82" r="28" fill="#ffffff" />
      </g>
      <g className="ln-living-cloud" style={{ animationDelay: '3.2s' }} opacity="0.78">
        <ellipse cx="670" cy="118" rx="48" ry="18" fill="#ffffff" />
        <circle cx="652" cy="108" r="20" fill="#ffffff" />
        <circle cx="684" cy="106" r="23" fill="#ffffff" />
      </g>

      {/* Theme-Specific Story Landmarks */}
      {theme === 'rainbow' && (
        <g opacity="0.82" fill="none" strokeWidth="14" strokeLinecap="round">
          <path d="M 150 380 A 330 290 0 0 1 810 380" stroke="#fb7185" />
          <path d="M 164 380 A 316 276 0 0 1 796 380" stroke="#fb923c" />
          <path d="M 178 380 A 302 262 0 0 1 782 380" stroke="#facc15" />
          <path d="M 192 380 A 288 248 0 0 1 768 380" stroke="#4ade80" />
          <path d="M 206 380 A 274 234 0 0 1 754 380" stroke="#38bdf8" />
          <path d="M 220 380 A 260 220 0 0 1 740 380" stroke="#a78bfa" />
        </g>
      )}

      {theme === 'castle' && (
        <g transform="translate(365, 130)">
          <rect x="42" y="88" width="146" height="162" rx="10" fill="#cbd5e1" />
          <rect x="18" y="64" width="44" height="186" rx="6" fill="#94a3b8" />
          <rect x="168" y="64" width="44" height="186" rx="6" fill="#94a3b8" />
          <rect x="92" y="32" width="46" height="90" rx="6" fill="#e2e8f0" />
          <polygon points="14,66 40,24 66,66" fill="#fb7185" />
          <polygon points="164,66 190,24 216,66" fill="#fb7185" />
          <polygon points="86,34 115,0 144,34" fill="#fbbf24" />
          <path d="M 94 250 L 94 186 A 21 21 0 0 1 136 186 L 136 250 Z" fill="#78350f" />
        </g>
      )}

      {theme === 'kitchen' && (
        <g>
          {/* Sunny Cottage Window & Cozy Countertop */}
          <rect x="330" y="92" width="300" height="175" rx="22" fill="#e0f2fe" stroke="#ffffff" strokeWidth="10" />
          <line x1="480" y1="92" x2="480" y2="267" stroke="#ffffff" strokeWidth="8" />
          <line x1="330" y1="180" x2="630" y2="180" stroke="#ffffff" strokeWidth="8" />
          <rect x="0" y="348" width="960" height="192" fill="#fed7aa" />
          <rect x="0" y="340" width="960" height="18" fill="#fb923c" />
        </g>
      )}

      {theme === 'family' && (
        <g>
          {/* Cozy Oak Treehouse & Lanterns */}
          <rect x="448" y="185" width="64" height="185" rx="18" fill="#92400e" />
          <circle cx="480" cy="148" r="105" fill="#22c55e" />
          <circle cx="408" cy="176" r="72" fill="#4ade80" />
          <circle cx="554" cy="176" r="72" fill="#4ade80" />
          <rect x="438" y="138" width="84" height="62" rx="12" fill="#fef3c7" stroke="#b45309" strokeWidth="5" />
          <polygon points="426,142 480,104 534,142" fill="#f97316" />
        </g>
      )}

      {theme === 'playroom' && (
        <g>
          {/* Playful Bunting Flags & Cozy Floor */}
          <path d="M 0 58 Q 240 120 480 62 Q 720 120 960 58" fill="none" stroke="#ffffff" strokeWidth="4" />
          <polygon points="110,76 138,118 162,82" fill="#fb7185" />
          <polygon points="240,92 265,134 292,94" fill="#fbbf24" />
          <polygon points="650,90 676,134 704,92" fill="#34d399" />
          <polygon points="790,78 818,120 842,74" fill="#a78bfa" />
          <ellipse cx="480" cy="435" rx="340" ry="74" fill="#fef08a" opacity="0.72" />
        </g>
      )}

      {/* Rolling Foreground Landscape Hills (shared warm Pixar depth) */}
      {theme !== 'kitchen' && (
        <>
          <path
            d="M 0 375 Q 240 295 480 355 Q 720 410 960 330 L 960 540 L 0 540 Z"
            fill={`url(#${hillBackId})`}
          />
          <path
            d="M 0 420 Q 280 375 560 425 Q 780 462 960 400 L 960 540 L 0 540 Z"
            fill={`url(#${hillFrontId})`}
          />
        </>
      )}

      {theme === 'meadow' && (
        <g>
          <path
            d="M 380 540 C 420 460, 560 430, 620 355"
            fill="none"
            stroke="#7dd3fc"
            strokeWidth="36"
            strokeLinecap="round"
            opacity="0.75"
          />
          <circle cx="170" cy="445" r="7" fill="#fef08a" />
          <circle cx="290" cy="472" r="8" fill="#fbcfe8" />
          <circle cx="765" cy="458" r="7" fill="#fef08a" />
          <circle cx="840" cy="430" r="8" fill="#ffffff" />
        </g>
      )}
    </svg>
  );
}

export function LivingWorldScene({
  worlds,
  profile,
  onSelectWorldToPlay,
}: LivingWorldSceneProps) {
  const sortedWorlds = useMemo(
    () => [...worlds].sort((a, b) => a.order - b.order),
    [worlds],
  );

  const [selectedWorldId, setSelectedWorldId] = useState<string>(
    () => sortedWorlds[0]?.id ?? '',
  );
  const [activeBubbleItemId, setActiveBubbleItemId] = useState<string | null>(null);
  const [bouncingItemId, setBouncingItemId] = useState<string | null>(null);
  const bounceTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!sortedWorlds.some((w) => w.id === selectedWorldId) && sortedWorlds[0]) {
      setSelectedWorldId(sortedWorlds[0].id);
      setActiveBubbleItemId(null);
    }
  }, [sortedWorlds, selectedWorldId]);

  useEffect(() => {
    return () => {
      if (bounceTimerRef.current !== null) {
        window.clearTimeout(bounceTimerRef.current);
      }
      audioEngine.stopSpeaking();
    };
  }, []);

  const activeWorld =
    sortedWorlds.find((w) => w.id === selectedWorldId) ?? sortedWorlds[0];

  if (!activeWorld) {
    return (
      <div className="ln-card">
        <h3>Yaşayan Dünya hazırlanıyor...</h3>
      </div>
    );
  }

  const awakeCount = activeWorld.items.filter((item) =>
    isItemAwakeInLivingWorld(profile.cards[cardKey(profile.targetLang, item.id)]),
  ).length;

  const activeBubbleItem = activeBubbleItemId
    ? activeWorld.items.find((it) => it.id === activeBubbleItemId) ?? null
    : null;

  const handleTapAwakeFriend = (item: VocabItem) => {
    const phrase = item.langs[profile.targetLang];
    setActiveBubbleItemId(item.id);
    setBouncingItemId(item.id);

    if (bounceTimerRef.current !== null) {
      window.clearTimeout(bounceTimerRef.current);
    }
    bounceTimerRef.current = window.setTimeout(() => {
      setBouncingItemId((prev) => (prev === item.id ? null : prev));
    }, 760);

    audioEngine.playChime('success', profile.soundFxEnabled);
    audioEngine.speakSequence([
      {
        text: phrase.microSentence,
        lang: profile.targetLang,
        slow: profile.speechSlowMode,
        role: 'warm',
      },
      { text: item.turkishMeaning, lang: 'tr' },
    ]);
  };

  const handleTapSleepingFirefly = (worldId: string) => {
    audioEngine.playChime('tap', profile.soundFxEnabled);
    onSelectWorldToPlay(worldId);
  };

  return (
    <section className="ln-living-world" aria-label="Yaşayan Dil Dünyası">
      <div className="ln-living-topbar">
        <div>
          <h2 style={{ fontSize: '1.65rem' }}>🌿 Yaşayan Dünyam</h2>
          <p style={{ margin: '4px 0 0', color: 'var(--ln-ink-soft)', fontWeight: 700 }}>
            Öğrendiğin her kelime adanda uyanır! Arkadaşına dokun, seninle konuşsun.
          </p>
        </div>

        <div className="ln-chip-group" style={{ alignItems: 'center' }}>
          <button
            type="button"
            className="ln-clay-btn ln-clay-btn--soft"
            onClick={() => {
              audioEngine.playChime('tap', profile.soundFxEnabled);
              audioEngine.speakTurkish(TR_VOICE.livingWorldIntro);
            }}
            aria-label="Yaşayan bahçe sesli rehberini dinle"
          >
            <Volume2 size={20} />
            <span>Sesli Rehber</span>
          </button>

          <button
            type="button"
            className="ln-clay-btn ln-clay-btn--gold ln-touch-xl"
            onClick={() => onSelectWorldToPlay(activeWorld.id)}
          >
            <Play size={22} />
            <span>{activeWorld.titleTr} Oyna</span>
          </button>
        </div>
      </div>

      {/* 6 World Islands Selector */}
      <div className="ln-island-tabs" role="tablist" aria-label="Dünya Adaları">
        {sortedWorlds.map((world) => {
          const isSelected = world.id === activeWorld.id;
          const worldAwake = world.items.filter((it) =>
            isItemAwakeInLivingWorld(profile.cards[cardKey(profile.targetLang, it.id)]),
          ).length;

          return (
            <button
              key={world.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              className={`ln-island-tab ${isSelected ? 'is-active' : ''}`}
              style={
                isSelected
                  ? {
                      background: `linear-gradient(135deg, ${world.gradient[0]}, ${world.gradient[1]})`,
                    }
                  : undefined
              }
              onClick={() => {
                setSelectedWorldId(world.id);
                setActiveBubbleItemId(null);
                audioEngine.playChime('tap', profile.soundFxEnabled);
              }}
            >
              <span className="ln-island-tab-emoji">{world.emoji}</span>
              <span>
                <div className="ln-island-tab-title">{world.titleTr}</div>
                <div className="ln-island-tab-count">
                  ✨ {worldAwake} / {world.items.length} Uyandı
                </div>
              </span>
            </button>
          );
        })}
      </div>

      {/* Interactive Lush SVG Scene */}
      <div className="ln-living-stage">
        <SceneBackdropSvg theme={activeWorld.sceneTheme} gradient={activeWorld.gradient} />

        {activeWorld.items.map((item) => {
          const card = profile.cards[cardKey(profile.targetLang, item.id)];
          const isAwake = isItemAwakeInLivingWorld(card);
          const masteryPct = computeItemMasteryPct(card);
          const phrase = item.langs[profile.targetLang];
          const isBubbleOpen = activeBubbleItemId === item.id;
          const isBouncing = bouncingItemId === item.id;

          const leftPct = clampPercent(item.livingPos.x, 10, 90);
          const topPct = clampPercent(item.livingPos.y, 18, 84);

          if (isAwake) {
            return (
              <div
                key={item.id}
                className={`ln-living-node ${isBouncing ? 'is-bouncing' : ''}`}
                style={{ left: `${leftPct}%`, top: `${topPct}%` }}
              >
                {isBubbleOpen && (
                  <div className="ln-living-bubble" role="status">
                    <div
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: 900,
                        color: '#d97706',
                        marginBottom: 4,
                      }}
                    >
                      ✨ {item.soundOnomatopoeia}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--ln-font-display)',
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        color: 'var(--ln-ink)',
                        marginBottom: 4,
                      }}
                    >
                      {phrase.microSentence}
                    </div>
                    <div style={{ fontSize: '0.86rem', color: '#0369a1', fontWeight: 800 }}>
                      🇹🇷 {item.turkishMeaning}
                      {profile.ageMode !== 'mini' ? ` • ${phrase.ipa}` : ''}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  className="ln-living-friend"
                  style={{
                    backgroundColor: item.bgColor,
                    borderColor: item.accentColor,
                  }}
                  onClick={() => handleTapAwakeFriend(item)}
                  aria-label={`${phrase.bareWord}: dinlemek için dokun`}
                >
                  <span className="ln-living-friend-emoji">{item.emoji}</span>
                  <span className="ln-living-friend-label">
                    <Volume2 size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                    {profile.ageMode === 'mini' ? item.soundOnomatopoeia : phrase.bareWord}
                  </span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: '#047857',
                    }}
                  >
                    ⭐ %{masteryPct}
                  </span>
                </button>
              </div>
            );
          }

          return (
            <div
              key={item.id}
              className="ln-living-node is-sleeping"
              style={{ left: `${leftPct}%`, top: `${topPct}%` }}
            >
              <button
                type="button"
                className="ln-living-sleeping"
                onClick={() => handleTapSleepingFirefly(activeWorld.id)}
                title={`${activeWorld.titleTr} oynayarak uyandır!`}
                aria-label="Uyuyan arkadaş — uyandırmak için bu dünyayı oyna"
              >
                <span className="ln-living-sleeping-emoji">{item.emoji}</span>
                <span className="ln-living-firefly-tag">
                  <Moon size={11} style={{ verticalAlign: 'middle', marginRight: 3 }} />
                  Uyandır
                </span>
              </button>
            </div>
          );
        })}

        {activeBubbleItem && (
          <div className="ln-living-mobile-dock" role="status" aria-live="polite">
            <span className="ln-living-dock-emoji" aria-hidden="true">
              {activeBubbleItem.emoji}
            </span>
            <div className="ln-living-dock-content">
              <div className="ln-living-dock-sound">✨ {activeBubbleItem.soundOnomatopoeia}</div>
              <div className="ln-living-dock-sentence">
                {activeBubbleItem.langs[profile.targetLang].microSentence}
              </div>
              <div className="ln-living-dock-meaning">
                🇹🇷 {activeBubbleItem.turkishMeaning}
                {profile.ageMode !== 'mini'
                  ? ` • ${activeBubbleItem.langs[profile.targetLang].ipa}`
                  : ''}
              </div>
            </div>
            <div className="ln-living-dock-actions">
              <button
                type="button"
                className="ln-living-dock-replay"
                onClick={() => handleTapAwakeFriend(activeBubbleItem)}
                aria-label={`${activeBubbleItem.langs[profile.targetLang].bareWord}: tekrar dinle`}
                title="Tekrar dinle"
              >
                <Volume2 size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="ln-living-dock-close"
                onClick={() => setActiveBubbleItemId(null)}
                aria-label="Konuşma kartını kapat"
                title="Kapat"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Scene Footer Status */}
      <div className="ln-card ln-living-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Sparkles size={24} color="#f59e0b" />
          <div>
            <div style={{ fontFamily: 'var(--ln-font-display)', fontSize: '1.1rem', fontWeight: 700 }}>
              {activeWorld.emoji} {activeWorld.titleTr}: {awakeCount} / {activeWorld.items.length} Uyanık Arkadaş
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--ln-ink-muted)', fontWeight: 700 }}>
              Parlayan ateşböceklerine dokunarak yeni kelimeleri adana davet edebilirsin!
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
