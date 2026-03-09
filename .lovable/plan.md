

# Brutal Honest Assessment: BeatDeath Current State

## Verdict: 92% There — But You Have a BROKEN Feature Live Right Now

---

## BROKEN RIGHT NOW (Users Will See Errors)

### 1. CommunityLeaderboard Is Completely Broken
`CommunityLeaderboard.tsx` line 53 queries `profiles` table directly:
```typescript
.from('profiles')
.select('id, user_id, display_name, username, total_xp, survival_streak')
```
But the last migration restricted `profiles` SELECT to `auth.uid() = user_id`. **Result: The leaderboard only shows YOU.** Everyone else is invisible. This is the `profiles_public` view's entire purpose — the leaderboard was never updated to use it.

**Fix**: Change `.from('profiles')` to `.from('profiles_public')` in `CommunityLeaderboard.tsx`.

### 2. UserStories Is Fake
`UserStories.tsx` has hardcoded stories ("DeathFan99", "ToxinTester") and stores new stories in local React state only. Submit a story → refresh → gone. Not persisted anywhere.

**Fix**: Either connect to `community_interactions` table or remove the component entirely.

---

## SECURITY ISSUES REMAINING

### 3. `leaderboard_entries` Has Contradicting Policies
There's an `ALL` policy with `auth.uid() = user_id` that lets users directly INSERT/UPDATE/DELETE their own leaderboard entries. This bypasses the secure `upsert_leaderboard_entry` RPC you created. A user can set their score to 999999 with a simple Supabase client call.

**Fix**: Drop the "Users can upsert their own leaderboard entries" ALL policy. Keep only the SELECT policy. Force all writes through the RPC.

---

## DATA INTEGRITY ISSUES

### 4. Life Clock Baseline Not Initializing From Profile on First Load
`LifeClockContext` initializes from localStorage first (line 334). If localStorage has stale data from before onboarding was completed, the user sees the wrong baseline forever until they clear storage. The profile sync (line 290-330) only updates if the profile values *differ* from current state, but on first load the localStorage values might match old defaults.

This is subtle but means: **Onboarding calculates a personalized baseline → user refreshes → localStorage loads the old 80-year default → profile sync sees "80 === 80" and does nothing.**

**Fix**: On hydration, always prefer profile `calculated_baseline_years` over localStorage if user is authenticated.

### 5. `refreshProfile` Has a Closure Bug
In `useAuth.tsx`, `refreshProfile` captures `user` from the initial render. When called from `onAuthStateChange`, `user` may still be null because state hasn't updated yet. The `setTimeout(() => refreshProfile(), 0)` helps but is fragile.

**Fix**: Pass userId directly to refreshProfile, or use a ref.

---

## UX/QUALITY ISSUES

### 6. Death Scanner Is 80% Hardcoded Scenarios
`DeathScannerPage.tsx` has ~200 lines of hardcoded if/else matching ("tylenol", "energy drink", etc.). The `analyze-death-risk` edge function exists and could provide AI-powered analysis, but it's only used as a fallback. Most users will type something that doesn't match any hardcoded scenario and get a generic response.

**Fix**: Make the edge function the primary analysis path. Use hardcoded scenarios as offline fallback only.

### 7. No Loading State on Index Page Initial Data Fetch
When the dashboard loads, `TodaySummary`, `WeeklyProgressChart`, `SurvivalStreakTracker`, and `TrendingDeaths` all fire independent Supabase queries simultaneously. There's no coordinated loading state — components pop in one by one with skeleton flicker.

### 8. No Error Boundaries
If any component throws (network error, bad data), the entire app crashes to a white screen. No error boundaries anywhere.

---

## WHAT'S ACTUALLY GREAT

- Life Clock with real-time countdown and scientific/playful modes — genuinely unique
- 120+ action mappings with daily caps and verification bonuses — solid gamification
- Achievement system now writes real DB records with XP rewards
- Streak tracking with profile sync works correctly
- RLS on profiles, scan_credits, and achievements is now properly locked down
- Auth flow with email confirmation is solid
- Privacy/Terms pages exist
- TrendingDeaths pulls real community data
- LiveGlobalFeed respects consent levels via server-side RPC

---

## Priority Fix List

| # | Issue | Severity | Effort |
|---|-------|----------|--------|
| 1 | CommunityLeaderboard queries `profiles` instead of `profiles_public` | **BROKEN** | 5 min |
| 2 | Drop permissive ALL policy on `leaderboard_entries` | **Security** | 5 min |
| 3 | UserStories is fake — connect to DB or remove | **Fake feature** | 15 min |
| 4 | Death Scanner should use edge function as primary | **Core feature** | 20 min |
| 5 | `refreshProfile` closure bug in useAuth | **Bug** | 10 min |
| 6 | Life Clock localStorage vs profile race condition | **Data bug** | 10 min |
| 7 | Add React Error Boundary wrapper | **Stability** | 10 min |

**Total to truly perfect: ~75 minutes of focused work.**

Items 1-2 are the most urgent — they're actively broken or exploitable right now. Items 3-4 affect perceived quality. Items 5-7 are robustness improvements.

