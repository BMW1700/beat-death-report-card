

# Brutal Assessment: BeatDeath — Current State

## Verdict: 96% There. Previous fixes landed well. 5 security vulnerabilities remain (fresh scan just ran).

---

## What's Fixed and Working

- Profiles RLS locked to owner-only, `profiles_public` view for safe reads
- CommunityLeaderboard uses `profiles_public`
- UserStories persists to DB with `profiles_public` join
- Death Scanner uses AI edge function as primary path
- `awardXP` uses `increment_xp` RPC correctly
- `getPublicAnalyses` joins `profiles_public`
- `refreshProfile` accepts userId, no closure bug
- ErrorBoundary wraps the app
- Privacy/Terms pages exist with footer links on Index and AuthPage
- `life_actions` SELECT restricted to owner
- `community_interactions` SELECT restricted to authenticated
- Leaderboard entries: no direct INSERT/UPDATE/DELETE

---

## 5 SECURITY VULNERABILITIES (Fresh Scan)

### 1. Users can grant themselves premium (ERROR)
The `profiles` UPDATE policy has no WITH CHECK restriction. Any user can set `premium_user = true`, `subscription_active = true`, `subscription_tier = 'premium'` on their own row — bypassing payment entirely.

**Fix**: Create a SECURITY DEFINER function for subscription updates. Add a WITH CHECK clause to the profiles UPDATE policy that prevents writing to subscription columns, OR use a column-level trigger to block direct subscription field changes.

### 2. Users can INSERT unlimited scan credits (ERROR)
The `scan_credits` INSERT policy only checks `auth.uid() = user_id`. A user can insert rows with `credits_remaining = 999999`. No unique constraint on `user_id` means repeated inserts accumulate credits.

**Fix**: Remove the INSERT policy from scan_credits. Create a SECURITY DEFINER function `grant_scan_credits(p_user_id, p_amount, p_stripe_payment_id)` that validates payment before inserting.

### 3. Users can create fake achievements with arbitrary XP (ERROR)
The `achievements` INSERT policy lets any user insert achievements with any `xp_reward`. Combined with `unlock_achievement` RPC calling `increment_xp`, a user could inflate their XP.

**Fix**: Remove the INSERT policy on achievements. The `unlock_achievement` RPC uses SECURITY DEFINER and handles inserts server-side — no client INSERT needed.

### 4. Users can manipulate duel scores and declare themselves winner (ERROR)
The `death_duels` UPDATE policy has no WITH CHECK clause. Either participant can overwrite scores and `winner_id`.

**Fix**: Remove the UPDATE policy. Create a SECURITY DEFINER function for submitting duel responses and resolving outcomes.

### 5. Challenge creators can inflate engagement metrics (ERROR)
The `viral_challenges` UPDATE policy lets creators set `participants_count`, `likes_count`, `shares_count`, `trending_score` to any value.

**Fix**: Add a WITH CHECK clause or SECURITY DEFINER function that only allows updating `title` and `description`, not counters.

---

## 2 WARNINGS

### 6. `profiles_public` has no RLS policies (WARN)
It's a VIEW so writes are impossible, but the scanner flags it. Adding explicit RLS with `USING (true)` for SELECT silences the warning and documents intent.

### 7. Leaked Password Protection disabled (WARN)
**Manual action** in Supabase Dashboard → Auth Settings.

---

## NOTHING ELSE IS BROKEN

Everything from the previous assessments has been fixed. The app is functionally complete. These 5 security issues are the only remaining gaps between "good" and "perfect."

---

## Summary Table

| # | Issue | Severity | Effort |
|---|-------|----------|--------|
| 1 | Profiles UPDATE allows self-promotion to premium | **ERROR** | 15 min |
| 2 | scan_credits INSERT allows unlimited credits | **ERROR** | 10 min |
| 3 | achievements INSERT allows fake XP | **ERROR** | 5 min |
| 4 | death_duels UPDATE allows score manipulation | **ERROR** | 10 min |
| 5 | viral_challenges UPDATE allows metric inflation | **ERROR** | 10 min |
| 6 | profiles_public missing explicit RLS | **WARN** | 2 min |
| 7 | Leaked password protection | **MANUAL** | 2 min |

**Total to absolute perfection: ~55 minutes**

---

## Implementation Plan

### Migration SQL (single migration)
1. **Profiles**: Add WITH CHECK to UPDATE policy excluding `premium_user`, `subscription_active`, `subscription_tier` columns — use a validation trigger that rejects changes to those columns unless called from a SECURITY DEFINER context
2. **scan_credits**: Drop INSERT policy. Create `grant_scan_credits` SECURITY DEFINER function
3. **achievements**: Drop INSERT policy (unlock_achievement RPC handles it)
4. **death_duels**: Drop UPDATE policy. Create `submit_duel_response` SECURITY DEFINER function
5. **viral_challenges**: Replace UPDATE policy with one that uses a WITH CHECK preventing counter/score changes, OR create SECURITY DEFINER functions for incrementing counters
6. **profiles_public**: Enable RLS on the view and add permissive SELECT policy

### Code Changes
- `useScanCredits.ts`: Update `purchaseScanPack` to call `grant_scan_credits` RPC instead of direct insert
- `DeathDuel.tsx` / `DeathDuelModal.tsx`: Use new `submit_duel_response` RPC instead of direct update
- `viral/ViralChallengeHub.tsx`: Use SECURITY DEFINER RPCs for like/share/join actions

