

# Brutal Assessment: BeatDeath — What's Left for Absolute Perfection

## Current State: 95% — But 4 Security Findings and a Few Feature Gaps Remain

The last round of fixes landed well. Leaderboard uses `profiles_public`, UserStories persists to DB, Death Scanner uses the AI edge function, achievements are real, ErrorBoundary wraps the app, and the LifeClock hydration race is fixed. Here's what's still not perfect:

---

## SECURITY SCAN FINDINGS (4 Active)

### 1. `life_actions` SELECT policy exposes all users' health activity logs (ERROR)
The SELECT policy `USING (true)` lets **anyone** (even unauthenticated) read every user's action descriptions, categories, and timestamps. The `get_global_feed` RPC already handles public feed display with consent filtering and anonymization — so the raw table doesn't need public reads.

**Fix**: Change the SELECT policy to `auth.uid() = user_id`. The global feed RPC uses `SECURITY DEFINER` so it bypasses RLS and continues working.

### 2. `profiles_public` view has NO RLS policies (WARN)
This is a view, not a table, so it technically inherits from the base table. But the security scanner flags it. Since it's a view created with no `security_invoker`, it runs as the creator (superuser) and is readable by anyone.

**Fix**: This is actually fine for a public leaderboard view — it only exposes non-sensitive fields. But we should add an explicit note/policy. The real fix: ensure `profiles_public` is a VIEW (not a table) so writes are impossible. Verify it's a view; if it's a table, lock it down with read-only RLS.

### 3. `community_interactions` exposes user_id and content publicly (WARN)
The SELECT policy `USING (true)` exposes `user_id`, free-text `content`, and `metadata` to everyone including unauthenticated users.

**Fix**: Change SELECT policy to `auth.uid() IS NOT NULL` (authenticated only) or restrict to `auth.uid() = user_id` and create a SECURITY DEFINER function for public story display.

### 4. Leaked Password Protection Disabled (WARN)
**Fix**: Manual — enable in Supabase Dashboard → Auth Settings.

---

## FUNCTIONAL ISSUES

### 5. `getPublicAnalyses` in `useDeathAnalysis.tsx` joins `profiles` table
Line 156 does `.select('*, profiles (display_name, username)')`. Since profiles SELECT is now restricted to own row, this join returns `null` for other users' profiles. The function works but loses display names.

**Fix**: Join `profiles_public` instead of `profiles`.

### 6. `awardXP` in `useDeathAnalysis.tsx` bypasses the `increment_xp` RPC
Lines 82-95 do a manual `select` + `update` on profiles instead of calling the `increment_xp` RPC. This is both a race condition (two concurrent scans could overwrite each other) and inconsistent with the rest of the codebase.

**Fix**: Replace with `supabase.rpc('increment_xp', { p_user_id: user.id, p_xp: xp })`.

### 7. `awardXP` creates an achievement record for every scan
Lines 103-112 insert a new `achievements` row every time XP is awarded, with type `analysis_completed`. This isn't a real achievement — it's just XP logging. The `achievements` table should only have milestone-based records (via `unlock_achievement` RPC).

**Fix**: Remove the achievement insert from `awardXP`. The real achievement system in `LifeClockContext` already handles milestones.

### 8. PremiumUpsell + InAppPurchases are non-functional (Stripe not connected)
These components show pricing and buttons but clicking does nothing useful. They call `purchaseScanPack()` and `purchaseSubscription()` which just show toast messages saying "Stripe Setup Required".

**Fix**: Either hide these components until Stripe is connected, or add a "Coming Soon" state so users don't feel tricked.

---

## POLISH ITEMS

### 9. `SurvivalGearMarketplace` has hardcoded affiliate links
All product links are `#` placeholders. Buttons say "Buy on Amazon" but go nowhere.

**Fix**: Either add real affiliate links or hide this component until monetization is ready.

### 10. No footer links to Privacy/Terms
Privacy and Terms pages exist at `/privacy` and `/terms` but there's no link to them from the main app footer or auth page.

**Fix**: Add links in the Index footer and AuthPage.

---

## SUMMARY TABLE

| # | Issue | Severity | Effort |
|---|-------|----------|--------|
| 1 | `life_actions` SELECT open to all | **Security** | 5 min |
| 2 | `profiles_public` RLS check | **Security** | 5 min |
| 3 | `community_interactions` SELECT open | **Security** | 5 min |
| 4 | Leaked password protection | **Manual** | 2 min |
| 5 | `getPublicAnalyses` joins restricted `profiles` | **Bug** | 2 min |
| 6 | `awardXP` bypasses `increment_xp` RPC | **Bug/Race** | 5 min |
| 7 | Fake achievement records on every scan | **Data quality** | 5 min |
| 8 | PremiumUpsell/InAppPurchases non-functional | **UX** | 10 min |
| 9 | SurvivalGearMarketplace dead links | **UX** | 5 min |
| 10 | No footer links to Privacy/Terms | **UX** | 5 min |

**Total to absolute perfection: ~50 minutes**

---

## WHAT'S GENUINELY PERFECT NOW
- Auth flow with email confirmation and closure-safe refreshProfile
- LifeClock with profile-first hydration and scientific/playful modes
- 120+ action mappings with daily caps, streaks, and DB persistence
- Achievement system with real DB records and milestone tracking
- CommunityLeaderboard using `profiles_public` with real-time subscriptions
- LiveGlobalFeed with consent-filtered SECURITY DEFINER RPC
- UserStories persisted to `community_interactions` table
- Death Scanner powered by Gemini AI edge function
- TrendingDeaths from real `death_analyses` data
- ErrorBoundary prevents white-screen crashes
- Leaderboard entries locked to RPC-only writes
- Scan credits protected by SECURITY DEFINER consume function

## IMPLEMENTATION PLAN

### Migration SQL
1. Drop `life_actions` public SELECT, replace with owner-only
2. Restrict `community_interactions` SELECT to authenticated users
3. Verify `profiles_public` is a view (no write concern)

### Code Changes
- `useDeathAnalysis.tsx`: Fix `getPublicAnalyses` join, replace manual XP update with RPC, remove fake achievement inserts
- `PremiumUpsell.tsx` + `InAppPurchases.tsx`: Add "Coming Soon" disabled state
- `SurvivalGearMarketplace.tsx`: Add "Coming Soon" overlay or real links
- `Index.tsx` footer: Add Privacy/Terms links
- `AuthPage.tsx`: Add Privacy/Terms links

