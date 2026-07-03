/**
 * supabasePartner.js — Lazy Supabase client for the partner-linking feature.
 *
 * Keys are set in index.html as:
 *   window.PACED_SUPABASE_URL      = 'https://xxxx.supabase.co';
 *   window.PACED_SUPABASE_ANON_KEY = 'eyJ...';
 *
 * If not set, all async functions return { data: null, error: 'not_configured' }
 * and the app continues working without any partner features.
 *
 * Implementation note: @supabase/supabase-js is loaded via a dynamic
 * `import()` that esbuild code-splits into a same-origin lazy chunk
 * (CSP-safe, unlike the old esm.sh runtime import). The ~175KB SDK is
 * only fetched when a partner/checkout feature actually runs, keeping
 * the main bundle — and first paint — lean for everyone else.
 */
let _supabase = null;
let _loading = null;

// Exported so sibling modules (e.g. supabaseSubscription.js) share one
// client instance + auth session rather than spinning up their own.
//
// ASYNC + dynamic import: @supabase/supabase-js is ~175KB of the bundle but
// only partner-linking and checkout need it — most sessions never touch
// either. `import()` splits it into a lazy chunk (esbuild `splitting`), so
// the main bundle shrinks and first paint isn't taxed for a feature behind a
// login. detectSessionInUrl still works: supabase reads location.hash at
// client creation, and the magic-link hash is untouched by the time a
// partner view triggers this. All callers were already async.
export function getSupabase() {
  if (_supabase) return Promise.resolve(_supabase);
  const url = window.PACED_SUPABASE_URL;
  const key = window.PACED_SUPABASE_ANON_KEY;
  if (!url || !key) return Promise.resolve(null);
  _loading ||= import('@supabase/supabase-js')
    .then(({ createClient }) => {
      // Auth options are made explicit rather than left to the SDK defaults.
      // autoRefreshToken + persistSession ARE on by default in supabase-js v2,
      // but a magic-link partner who hasn't opened the app in >1h would
      // silently hit an expired access token if a future SDK bump ever flipped
      // the default — pinning them here makes the refresh contract part of our
      // code, not the dependency's. detectSessionInUrl lets the magic-link
      // redirect (…/#access_token=…) establish the session on load; a
      // namespaced storageKey keeps the partner session from colliding with
      // anything else on the same origin.
      _supabase = createClient(url, key, {
        auth: {
          autoRefreshToken:  true,
          persistSession:    true,
          detectSessionInUrl: true,
          storageKey:        'paced.supabase.auth',
        },
      });
      return _supabase;
    })
    .catch(() => {
      // Chunk failed to load (offline, dev mode without bundling): behave as
      // "not configured" so partner/checkout features degrade gracefully.
      _loading = null;
      return null;
    });
  return _loading;
}

// Resolve the authenticated user, tolerant of network failure. sb.auth.getUser()
// REJECTS (it doesn't return {error}) when offline or the token endpoint is
// unreachable — every caller below used to destructure `{ data: { user } }`
// straight off the await, so a flaky connection surfaced as an unhandled
// promise rejection and a stuck spinner instead of a clean error path. This
// funnels all of them through one try/catch and a stable sentinel.
async function requireUser(sb) {
  try {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return { user: null, error: 'not_authenticated' };
    return { user, error: null };
  } catch {
    return { user: null, error: 'not_authenticated' };
  }
}

export function isConfigured() {
  return !!(window.PACED_SUPABASE_URL && window.PACED_SUPABASE_ANON_KEY);
}

export async function getCurrentUser() {
  const sb = await getSupabase();
  if (!sb) return null;
  try {
    const { data: { user } } = await sb.auth.getUser();
    return user;
  } catch { return null; }
}

export async function signInWithMagicLink(email, redirectTo) {
  const sb = await getSupabase();
  if (!sb) return { data: null, error: 'not_configured' };
  try {
    return await sb.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo || window.location.origin },
    });
  } catch (err) {
    // Network failure reaching the auth endpoint rejects here rather than
    // returning {error}; normalise so the caller's `{ error }` branch fires
    // instead of leaving the "Bezig…" status hanging forever.
    return { data: null, error: err?.message || 'network_error' };
  }
}

/**
 * Subscribe to auth state changes. Returns an unsubscribe function.
 * Safe to call when Supabase is not configured (returns no-op).
 */
export async function onAuthChange(callback) {
  const sb = await getSupabase();
  if (!sb) return () => {};
  const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return () => subscription.unsubscribe();
}

export async function signOut() {
  const sb = await getSupabase();
  if (!sb) return;
  try { await sb.auth.signOut(); } catch { /* best-effort — clear locally regardless */ }
  // Reset béíde caches: _loading bleef anders de oude (uitgelogde) client
  // uitdelen en de _supabase-reset was dan dood gewicht.
  _supabase = null;
  _loading = null;
}

// Invite codes use cryptographically-strong randomness — Math.random()
// is predictable (V8's xorshift128+ state is recoverable from a few
// observed outputs) which matters even with our SECURITY DEFINER RPC
// because the entropy is the only secret protecting the invite.
// Entropy: 8 random bytes, each encoded as exactly 2 base-36 chars;
// slice(0,12) keeps 6 of those bytes = 48 bits. Ample for short-lived,
// single-use invite codes (brute force ≈ 2^47 guesses gemiddeld), maar
// server-side attempt-throttling op accept_partner_invite blijft de
// aangewezen tweede laag.
// Uppercase to match the migration 0002 invite_code expectations.
function randomCode() {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  let code = '';
  for (const b of bytes) code += b.toString(36).padStart(2, '0');
  return code.slice(0, 12).toUpperCase();
}

export async function createInvite(shareLevel = 'phase') {
  const sb = await getSupabase();
  if (!sb) return { data: null, error: 'not_configured' };
  const { user, error } = await requireUser(sb);
  if (error) return { data: null, error };
  const code = randomCode();
  return sb.from('partner_links').insert({
    owner_user_id: user.id,
    invite_code: code,
    share_level: shareLevel,
    active: true,
  }).select().single();
}

export async function getMyLink() {
  const sb = await getSupabase();
  if (!sb) return { data: null, error: 'not_configured' };
  const { user, error } = await requireUser(sb);
  if (error) return { data: null, error };
  return sb.from('partner_links')
    .select('*')
    .eq('owner_user_id', user.id)
    .eq('active', true)
    .maybeSingle();
}

export async function deleteMyLink() {
  const sb = await getSupabase();
  if (!sb) return { data: null, error: 'not_configured' };
  const { user, error } = await requireUser(sb);
  if (error) return { data: null, error };
  return sb.from('partner_links')
    .update({ active: false })
    .eq('owner_user_id', user.id);
}

// Invite acceptance goes through the accept_partner_invite SECURITY DEFINER
// RPC (see migration 0002). The RPC performs the lookup + bind atomically
// server-side so the client never needs SELECT access to other users' rows.
// Returns one of: 'invite_invalid' | 'invite_already_used' | 'self_invite' |
// 'not_authenticated' | 'not_configured' | null (success).
export async function acceptInvite(code) {
  const sb = await getSupabase();
  if (!sb) return { data: null, error: 'not_configured' };
  const { error: authErr } = await requireUser(sb);
  if (authErr) return { data: null, error: authErr };

  // Normalize: invite codes are uppercase base36 server-side. Trim handles
  // trailing whitespace from copy-paste; case-insensitive entry handles
  // users who type the code by hand.
  const normalized = (code || '').trim().toUpperCase();
  if (!normalized) return { data: null, error: 'invite_invalid' };

  const { data, error } = await sb.rpc('accept_partner_invite', { code: normalized });

  if (error) {
    // Map Postgres exception messages to stable client codes the UI can
    // branch on. The RPC raises with the literal strings below.
    const msg = error.message || '';
    if (msg.includes('invite_not_found'))       return { data: null, error: 'invite_invalid' };
    if (msg.includes('invite_already_accepted')) return { data: null, error: 'invite_already_used' };
    if (msg.includes('self_invite'))             return { data: null, error: 'self_invite' };
    if (msg.includes('not_authenticated'))       return { data: null, error: 'not_authenticated' };
    return { data: null, error: 'unknown' };
  }

  // RPC returns an array (return type is "table") — take the first row.
  return { data: data?.[0] ?? null, error: null };
}

export async function getPartnerSnapshot() {
  const sb = await getSupabase();
  if (!sb) return { data: null, error: 'not_configured' };
  const { user, error } = await requireUser(sb);
  if (error) return { data: null, error };
  const { data: link } = await sb.from('partner_links')
    .select('owner_user_id')
    .eq('partner_user_id', user.id)
    .eq('active', true)
    .maybeSingle();
  if (!link) return { data: null, error: 'no_link' };
  return sb.from('partner_snapshots')
    .select('*')
    .eq('owner_user_id', link.owner_user_id)
    .maybeSingle();
}

export async function pushSnapshot(phase, cycleDay, shareLevel = 'phase', note = null) {
  const sb = await getSupabase();
  if (!sb) return { data: null, error: 'not_configured' };
  const { user, error } = await requireUser(sb);
  if (error) return { data: null, error };
  // Dataminimalisatie ÁÁN de bron: bij share_level 'phase' verlaten cycle_day
  // en note het toestel simpelweg niet. UI-filtering aan de partnerkant is
  // geen privacygrens — de partner heeft RLS-SELECT op de hele rij, dus wat
  // niet gedeeld mag worden hoort niet geüpload te worden.
  const full = shareLevel === 'full';
  return sb.from('partner_snapshots').upsert({
    owner_user_id: user.id,
    phase,
    cycle_day: full ? cycleDay : null,
    share_level: shareLevel,
    owner_note: full ? note : null,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'owner_user_id' });
}
