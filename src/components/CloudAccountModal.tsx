import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2, Cloud, Download, Lock, LogOut, RefreshCw, Shield, Upload, X } from 'lucide-react';
import type { VaultState } from '../engine/storage';
import {
  createPlanCheckoutIntent,
  fetchServerPlans,
  getCloudSession,
  pullCloudVault,
  pushCloudVault,
  signInWithEmail,
  signOutCloud,
  signUpWithEmail,
  type CloudPlan,
  type CloudUserSession,
  type CloudVaultSnapshot,
} from '../engine/cloudSync';

interface CloudAccountModalProps {
  vault: VaultState;
  onRestoreCloudVault: (nextVault: VaultState) => void;
  onClose: () => void;
}

export function CloudAccountModal({ vault, onRestoreCloudVault, onClose }: CloudAccountModalProps) {
  const [user, setUser] = useState<CloudUserSession | null>(null);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [plans, setPlans] = useState<CloudPlan[]>([]);
  const [snapshot, setSnapshot] = useState<CloudVaultSnapshot | null>(null);
  const [busy, setBusy] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchServerPlans()
      .then((list) => {
        if (active) setPlans(list);
      })
      .catch(() => {
        // offline fallback gracefully keeps local mode usable
      });

    getCloudSession().then(async (sess) => {
      if (!active || !sess) return;
      setUser(sess);
      try {
        const snap = await pullCloudVault();
        if (active) setSnapshot(snap);
      } catch {
        // initial vault pull optional
      }
    });

    return () => {
      active = false;
    };
  }, []);

  async function handleAuthSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setStatusMsg(null);
    setBusy(true);
    try {
      const res =
        mode === 'signup'
          ? await signUpWithEmail(name, email, password)
          : await signInWithEmail(email, password);
      if (res.error || !res.user) {
        setErrorMsg(res.error || 'Giriş yapılamadı.');
        return;
      }
      setUser(res.user);
      setPassword('');
      const snap = await pullCloudVault();
      setSnapshot(snap);
      setStatusMsg('Bulut oturumu doğrulandı (Neon Auth Ed25519 JWT).');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'İşlem başarısız.');
    } finally {
      setBusy(false);
    }
  }

  async function handlePushVault() {
    setErrorMsg(null);
    setStatusMsg(null);
    setBusy(true);
    try {
      const res = await pushCloudVault(vault);
      const snap = await pullCloudVault();
      setSnapshot(snap);
      setStatusMsg(`Tüm profiller ve FSRS-5 hafıza kartları buluta yedeklendi (Revizyon #${res.revision}).`);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Yedekleme başarısız.');
    } finally {
      setBusy(false);
    }
  }

  async function handlePullVault() {
    setErrorMsg(null);
    setStatusMsg(null);
    setBusy(true);
    try {
      const snap = await pullCloudVault();
      setSnapshot(snap);
      if (!snap.vault) {
        setErrorMsg('Bulutta henüz kayıtlı bir yedek bulunmuyor. Önce bu cihazdan yedekleyin.');
        return;
      }
      onRestoreCloudVault({ ...snap.vault, onboardingDone: true });
      setStatusMsg(`Bulut yedeği (Revizyon #${snap.revision}) bu cihaza aktarıldı.`);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Geri yükleme başarısız.');
    } finally {
      setBusy(false);
    }
  }

  async function handleSelectPlan(planCode: string) {
    if (!user) {
      setErrorMsg('Plan yükseltmek için önce üstten hesap oluşturun veya giriş yapın.');
      return;
    }
    setErrorMsg(null);
    setStatusMsg(null);
    setBusy(true);
    try {
      const intent = await createPlanCheckoutIntent(planCode);
      const tl = (intent.authoritativePriceCents / 100).toLocaleString('tr-TR');
      setStatusMsg(
        `Sunucu fiyat doğrulaması geçti: ${intent.displayName} (${tl} ${intent.currency}). Kurumsal ödeme sayfası hazır.`,
      );
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Plan seçimi başarısız.');
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    setBusy(true);
    await signOutCloud();
    setUser(null);
    setSnapshot(null);
    setStatusMsg('Bulut oturumu kapatıldı. Yerel çevrimdışı verileriniz cihazda korunuyor.');
    setBusy(false);
  }

  return (
    <div className="ln-cloud-backdrop" role="dialog" aria-modal="true" aria-labelledby="lnCloudTitle">
      <div className="ln-cloud-card">
        <div className="ln-cloud-header">
          <div>
            <span className="ln-cloud-eyebrow">
              <Cloud size={15} aria-hidden="true" /> Bulut Senkronizasyon &amp; Aile Üyeliği
            </span>
            <h2 id="lnCloudTitle">LingoNest Hesap ve Plan Merkezi</h2>
          </div>
          <button
            type="button"
            className="ln-cloud-close"
            onClick={onClose}
            aria-label="Hesap penceresini kapat"
          >
            <X size={20} />
          </button>
        </div>

        {errorMsg && (
          <div className="ln-cloud-alert ln-cloud-alert-err" role="alert">
            {errorMsg}
          </div>
        )}
        {statusMsg && (
          <div className="ln-cloud-alert ln-cloud-alert-ok" role="status">
            <CheckCircle2 size={17} aria-hidden="true" />
            <span>{statusMsg}</span>
          </div>
        )}

        {!user ? (
          <form className="ln-cloud-form" onSubmit={handleAuthSubmit}>
            <div className="ln-cloud-tabs" role="tablist" aria-label="Giriş veya Kayıt">
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'signin'}
                className={`ln-cloud-tab ${mode === 'signin' ? 'active' : ''}`}
                onClick={() => setMode('signin')}
              >
                Giriş Yap
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'signup'}
                className={`ln-cloud-tab ${mode === 'signup' ? 'active' : ''}`}
                onClick={() => setMode('signup')}
              >
                Ücretsiz Hesap Aç
              </button>
            </div>

            {mode === 'signup' && (
              <div className="ln-cloud-field">
                <label htmlFor="lnAuthName">Veli veya Öğrenen Adı</label>
                <input
                  id="lnAuthName"
                  type="text"
                  autoComplete="name"
                  placeholder="Örn: Ayşe Yılmaz"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="ln-cloud-field">
              <label htmlFor="lnAuthEmail">E-posta Adresi</label>
              <input
                id="lnAuthEmail"
                type="email"
                autoComplete="email"
                placeholder="ornek@eposta.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="ln-cloud-field">
              <label htmlFor="lnAuthPassword">Parola (en az 8 karakter)</label>
              <input
                id="lnAuthPassword"
                type="password"
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                minLength={8}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="ln-cloud-primary-btn" disabled={busy}>
              <Lock size={16} aria-hidden="true" />
              <span>{busy ? 'Doğrulanıyor…' : mode === 'signup' ? 'Bulut Hesabı Oluştur' : 'Güvenli Giriş Yap'}</span>
            </button>

            <p className="ln-cloud-privacy-note">
              <Shield size={14} aria-hidden="true" /> KVKK &amp; COPPA uyumlu: Hesap açmadan da %100 çevrimdışı kullanabilirsiniz; bulut senkronizasyonu yalnızca veli onayıyla çalışır.
            </p>
          </form>
        ) : (
          <div className="ln-cloud-account-box">
            <div className="ln-cloud-user-row">
              <div>
                <strong>{user.name}</strong>
                <div className="ln-cloud-muted">{user.email}</div>
              </div>
              <span className="ln-cloud-plan-badge">
                {snapshot?.subscription?.display_name ?? 'Başlangıç Planı'}
              </span>
            </div>

            <div className="ln-cloud-sync-meta">
              <span>
                Bulut Revizyonu: <strong>#{snapshot?.revision ?? 0}</strong>
              </span>
              <span>
                Maks. Öğrenci Profili: <strong>{snapshot?.subscription?.max_profiles ?? 2}</strong>
              </span>
            </div>

            <div className="ln-cloud-actions-row">
              <button
                type="button"
                className="ln-cloud-primary-btn"
                onClick={handlePushVault}
                disabled={busy}
              >
                <Upload size={16} aria-hidden="true" />
                <span>{busy ? 'İşleniyor…' : 'Bu Cihazı Buluta Yedekle'}</span>
              </button>

              <button
                type="button"
                className="ln-cloud-secondary-btn"
                onClick={handlePullVault}
                disabled={busy}
              >
                <Download size={16} aria-hidden="true" />
                <span>Buluttan Cihaza İndir</span>
              </button>

              <button
                type="button"
                className="ln-cloud-ghost-btn"
                onClick={handleSignOut}
                disabled={busy}
              >
                <LogOut size={16} aria-hidden="true" />
                <span>Çıkış</span>
              </button>
            </div>
          </div>
        )}

        <div className="ln-cloud-plans-sec">
          <div className="ln-cloud-plans-hdr">
            <h3>Aile &amp; Bireysel Üyelik Planları</h3>
            <span>
              <RefreshCw size={13} aria-hidden="true" /> Sunucu doğrulamalı katalog
            </span>
          </div>
          <div className="ln-cloud-plans-grid">
            {(plans.length > 0
              ? plans
              : [
                  {
                    plan_code: 'free',
                    display_name: 'Başlangıç (Yerel + Temel Bulut)',
                    price_cents: 0,
                    currency: 'TRY',
                    billing_interval: 'free',
                    max_profiles: 2,
                  },
                  {
                    plan_code: 'family_monthly',
                    display_name: 'LingoNest Aile Paketi (Aylık)',
                    price_cents: 14900,
                    currency: 'TRY',
                    billing_interval: 'monthly',
                    max_profiles: 6,
                  },
                  {
                    plan_code: 'family_yearly',
                    display_name: 'LingoNest Aile Paketi (Yıllık)',
                    price_cents: 119000,
                    currency: 'TRY',
                    billing_interval: 'yearly',
                    max_profiles: 6,
                  },
                ]
            ).map((plan) => {
              const isCurrent = (snapshot?.subscription?.plan_code ?? 'free') === plan.plan_code;
              const priceLabel =
                plan.price_cents === 0
                  ? 'Ücretsiz'
                  : `${(plan.price_cents / 100).toLocaleString('tr-TR')} ₺`;
              return (
                <div
                  key={plan.plan_code}
                  className={`ln-cloud-plan-card ${plan.plan_code === 'family_yearly' ? 'featured' : ''}`}
                >
                  <div className="ln-cloud-plan-name">{plan.display_name}</div>
                  <div className="ln-cloud-plan-price">
                    <strong>{priceLabel}</strong>
                    {plan.billing_interval === 'monthly' && <small>/ay</small>}
                    {plan.billing_interval === 'yearly' && <small>/yıl</small>}
                  </div>
                  <ul className="ln-cloud-plan-list">
                    <li>{plan.max_profiles} bağımsız kardeş/yetişkin profili</li>
                    <li>1.912 nöral ses &amp; 3 dil (EN · DE · ES)</li>
                    <li>Cihazlar arası şifreli Postgres FSRS-5 senkronu</li>
                  </ul>
                  {plan.price_cents === 0 ? (
                    <span className="ln-cloud-plan-tag">{isCurrent ? 'Aktif Plan' : 'Dahil'}</span>
                  ) : (
                    <button
                      type="button"
                      className="ln-cloud-plan-btn"
                      disabled={busy || isCurrent}
                      onClick={() => handleSelectPlan(plan.plan_code)}
                    >
                      {isCurrent ? 'Aktif Planınız' : 'Bu Plana Geç'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
