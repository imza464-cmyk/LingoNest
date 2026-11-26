import { useState, type FormEvent } from 'react';
import { Check, Rocket, Sparkles } from 'lucide-react';
import type { AgeMode, LanguageCode } from '../types';
import { LANGUAGE_META } from '../data/curriculum';
import { audioEngine } from '../engine/audioEngine';

export interface OnboardingModalProps {
  onComplete: (name: string, ageMode: AgeMode, targetLang: LanguageCode) => void;
}

interface AgeOption {
  mode: AgeMode;
  emoji: string;
  title: string;
  subtitle: string;
  defaultName: string;
  accentBg: string;
  accentBorder: string;
}

const AGE_OPTIONS: readonly AgeOption[] = [
  {
    mode: 'mini',
    emoji: '🐣',
    title: '4–7 Yaş · Mini',
    subtitle: 'Oyun, Ses, Hareket — Okuma Gerektirmez',
    defaultName: 'Minik Kaşif',
    accentBg: '#e0f2fe',
    accentBorder: '#0ea5e9',
  },
  {
    mode: 'explorer',
    emoji: '🧭',
    title: '8–14 Yaş · Kaşif',
    subtitle: 'Ses-Önce, 4 Seçenek, SVO Cümle Blokları',
    defaultName: 'Genç Kaşif',
    accentBg: '#ede9fe',
    accentBorder: '#8b5cf6',
  },
  {
    mode: 'master',
    emoji: '🎓',
    title: '15+ Yetişkin · Usta',
    subtitle: 'Koyu Stüdyo, Gerçek Hayat & FSRS-5',
    defaultName: 'Usta Öğrenen',
    accentBg: '#dcfce7',
    accentBorder: '#10b981',
  },
] as const;

const LANG_OPTIONS: readonly LanguageCode[] = ['en', 'de', 'es'] as const;

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [ageMode, setAgeMode] = useState<AgeMode>('mini');
  const [targetLang, setTargetLang] = useState<LanguageCode>('en');
  const [name, setName] = useState('');

  const activeAgeMeta =
    AGE_OPTIONS.find((opt) => opt.mode === ageMode) ?? AGE_OPTIONS[0];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    audioEngine.playChime('unlock', true);
    const trimmed = name.trim();
    onComplete(trimmed || activeAgeMeta.defaultName, ageMode, targetLang);
  };

  return (
    <div
      className="ln-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ln-onboarding-title"
    >
      <form
        className="ln-parent-modal"
        onSubmit={handleSubmit}
        style={{
          maxWidth: '680px',
          gap: '18px',
          color: '#0f172a',
        }}
      >
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              alignSelf: 'center',
              padding: '6px 14px',
              borderRadius: '999px',
              background: '#fef3c7',
              border: '2px solid #fbbf24',
              color: '#78350f',
              fontWeight: 800,
              fontSize: '0.86rem',
            }}
          >
            <Sparkles size={15} aria-hidden="true" />
            <span>LingoNest&apos;e Hoş Geldin!</span>
          </div>

          <h1
            id="ln-onboarding-title"
            style={{
              margin: 0,
              fontSize: 'clamp(1.38rem, 4.2vw, 1.85rem)',
              fontFamily: 'var(--ln-font-display)',
              color: '#0f172a',
            }}
          >
            Maceraya Hazır mısın? 🦉
          </h1>
          <p
            style={{
              margin: 0,
              color: '#475569',
              fontWeight: 700,
              fontSize: '0.94rem',
            }}
          >
            Sana en uygun öğrenme dünyasını 10 saniyede seçelim.
          </p>
        </div>

        {/* Section 1: Who is learning? */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label
            style={{
              fontFamily: 'var(--ln-font-display)',
              fontSize: '1.05rem',
              fontWeight: 700,
              color: '#0f172a',
            }}
          >
            1. Kim Öğreniyor?
          </label>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))',
              gap: '10px',
            }}
          >
            {AGE_OPTIONS.map((opt) => {
              const selected = ageMode === opt.mode;
              return (
                <button
                  key={opt.mode}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    audioEngine.playChime('tap', true);
                    setAgeMode(opt.mode);
                  }}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '6px',
                    padding: '14px',
                    borderRadius: '20px',
                    textAlign: 'left',
                    background: selected ? opt.accentBg : '#ffffff',
                    border: `3px solid ${selected ? opt.accentBorder : '#cbd5e1'}`,
                    boxShadow: selected
                      ? `0 5px 0 ${opt.accentBorder}66, 0 10px 20px -8px ${opt.accentBorder}55`
                      : '0 4px 0 #cbd5e1',
                    transform: selected ? 'translateY(-2px)' : 'none',
                    transition: 'transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease',
                    color: '#0f172a',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                    }}
                  >
                    <span style={{ fontSize: '2rem', lineHeight: 1 }} aria-hidden="true">
                      {opt.emoji}
                    </span>
                    {selected && (
                      <span
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '999px',
                          background: opt.accentBorder,
                          color: '#ffffff',
                          display: 'grid',
                          placeItems: 'center',
                        }}
                      >
                        <Check size={14} strokeWidth={3} aria-hidden="true" />
                      </span>
                    )}
                  </div>

                  <strong
                    style={{
                      fontFamily: 'var(--ln-font-display)',
                      fontSize: '0.98rem',
                      color: '#0f172a',
                    }}
                  >
                    {opt.title}
                  </strong>
                  <span
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      lineHeight: 1.32,
                      color: '#334155',
                    }}
                  >
                    {opt.subtitle}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Target Language */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label
            style={{
              fontFamily: 'var(--ln-font-display)',
              fontSize: '1.05rem',
              fontWeight: 700,
              color: '#0f172a',
            }}
          >
            2. Hangi Dili Keşfedelim?
          </label>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(112px, 1fr))',
              gap: '10px',
            }}
          >
            {LANG_OPTIONS.map((code) => {
              const meta = LANGUAGE_META[code];
              const selected = targetLang === code;
              return (
                <button
                  key={code}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    audioEngine.playChime('tap', true);
                    setTargetLang(code);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    minHeight: '52px',
                    padding: '10px 12px',
                    borderRadius: '18px',
                    background: selected ? '#ecfeff' : '#ffffff',
                    border: `3px solid ${selected ? '#0ea5e9' : '#cbd5e1'}`,
                    boxShadow: selected ? '0 4px 0 #38bdf8' : '0 4px 0 #cbd5e1',
                    fontFamily: 'var(--ln-font-display)',
                    fontSize: '0.98rem',
                    fontWeight: 700,
                    color: '#0f172a',
                  }}
                >
                  <span style={{ fontSize: '1.35rem', lineHeight: 1 }} aria-hidden="true">
                    {meta.flag}
                  </span>
                  <span>{meta.nameTr}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Optional Short Name Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label
            htmlFor="ln-onboarding-name"
            style={{
              fontFamily: 'var(--ln-font-display)',
              fontSize: '0.98rem',
              fontWeight: 700,
              color: '#0f172a',
            }}
          >
            İsmin (İsteğe bağlı)
          </label>
          <input
            id="ln-onboarding-name"
            type="text"
            className="ln-input"
            maxLength={24}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={activeAgeMeta.defaultName}
            style={{
              fontSize: '16px',
              minHeight: '50px',
              padding: '12px 16px',
              color: '#0f172a',
              background: '#ffffff',
            }}
          />
        </div>

        {/* Giant CTA */}
        <button
          type="submit"
          className="ln-clay-btn ln-clay-btn--mint"
          style={{
            width: '100%',
            minHeight: '60px',
            fontSize: '1.16rem',
          }}
        >
          <Rocket size={22} aria-hidden="true" />
          <span>Hemen Başla! 🚀</span>
        </button>
      </form>
    </div>
  );
}

export default OnboardingModal;
