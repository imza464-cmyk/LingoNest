-- ============================================================================
-- LingoNest — Neon Lakebase Postgres 18 Kanonik Bulut Şeması (v3.0)
-- Proje: square-credit-05168902 | Dal: br-icy-grass-bhsdqu67 (eu-central-1)
-- ============================================================================

CREATE TABLE IF NOT EXISTS lingonest_plan_catalog (
  plan_code TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'TRY',
  billing_interval TEXT NOT NULL DEFAULT 'month',
  max_profiles INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS lingonest_user_subscriptions (
  user_id TEXT PRIMARY KEY,
  plan_code TEXT NOT NULL REFERENCES lingonest_plan_catalog(plan_code),
  status TEXT NOT NULL DEFAULT 'active',
  current_period_end TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lingonest_user_vaults (
  user_id TEXT PRIMARY KEY,
  email TEXT,
  vault_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  revision BIGINT NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lingonest_webhook_events (
  event_id TEXT PRIMARY KEY,
  provider TEXT NOT NULL DEFAULT 'citadel_pay',
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- v3.0 Kurumsal Zırh: Çift Pencereli (Dakikalık + Günlük) Hız Sınırlayıcı ve Denetim İzi
CREATE TABLE IF NOT EXISTS lingonest_api_quotas (
  principal_key TEXT NOT NULL,
  route_bucket TEXT NOT NULL,
  window_epoch BIGINT NOT NULL,
  hit_count INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (principal_key, route_bucket, window_epoch)
);

CREATE TABLE IF NOT EXISTS lingonest_audit_events (
  id BIGSERIAL PRIMARY KEY,
  request_id TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
