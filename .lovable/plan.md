

# Fix the 7 Remaining BeatDeath Issues

Addresses every critical, high, and medium priority issue found in the audit.

---

## 1. Fix LiveGlobalFeed (RLS blocks cross-user reads)

The `life_actions` table has RLS: `auth.uid() = user_id` for SELECT. The LiveGlobalFeed tries to read ALL users' actions but only gets the current user's.

**Fix:** Add a new RLS policy that allows reading all rows but only exposes non-sensitive columns. Create a database view or simply add a permissive SELECT policy:

```sql
CREATE POLICY "Anyone can view recent actions for feed"
  ON public.life_actions FOR SELECT
  USING (true);
```

Then drop the old restrictive SELECT policy and replace it with a policy that allows public reads (the table only has category/description/minutes -- no PII). Alternatively, keep the restrictive policy and add this as a permissive one (but since existing is RESTRICTIVE, we need to change approach).

Since the existing policy is RESTRICTIVE (not permissive), we need to either:
- Drop it and create two PERMISSIVE policies (own rows full access + all rows read), OR
- Create a database view that uses SECURITY DEFINER

**Recommended approach:** Drop the existing restrictive SELECT policy and create a permissive one that allows anyone to read all actions. Users still can only INSERT their own.

**Migration:**
```sql
DROP POLICY "Users can view their own actions" ON public.life_actions;
CREATE POLICY "Users can view all actions"
  ON public.life_actions FOR SELECT
  USING (true);
```

---

## 2. Fix CommunityLeaderboard user highlight

Line 156 compares `entry.id` (profiles table PK) with `user?.id` (auth user ID). These are different UUIDs.

**Fix in CommunityLeaderboard.tsx:**
- Change the SELECT to also include `user_id` from profiles
- Compare `entry.user_id === user?.id` instead of `entry.id === user?.id`

---

## 3. Sync survival_streak back to profiles

When `SurvivalStreakTracker` calculates the real streak, it should also update `profiles.survival_streak` so the `CommunityLeaderboard` streak tab shows real data.

**Fix in SurvivalStreakTracker.tsx:**
- After calculating `currentStreak`, fire an update:
```typescript
supabase.from('profiles')
  .update({ survival_streak: currentStreak })
  .eq('user_id', user.id);
```

---

## 4. Re-fetch profile after XP increment

After logging an action, the navbar XP badge stays stale.

**Fix:** In `useAuth.tsx`, expose a `refreshProfile` function. In `LifeClockContext.tsx`, after the XP RPC call succeeds, call `refreshProfile()`. This will make the navbar XP update immediately.

---

## 5. Remove dead stub page routes

Remove imports and routes for `ApiPlatformPage`, `WellnessPage`, and `SciencePage` from `App.tsx`. The nav already doesn't link to them.

---

## 6. Make Scientific Mode visually different

In `LifeClock.tsx`, the `formatTime()` function returns identical output for both modes. 

**Fix:** In scientific mode, show the time as total remaining hours or a decimal-year format (e.g., "42.37 years remaining") instead of the same y/m/d/h/m/s breakdown. This makes the toggle actually do something visible.

---

## 7. Replace hardcoded TrendingDeaths with real data

Query `death_analyses` table (which has `is_public = true` data) to show actual recent scans from the community, instead of the static mock array.

---

## Files Changed

| File | Change |
|------|--------|
| `supabase/migrations/new.sql` | Drop restrictive SELECT on life_actions, add permissive public read |
| `src/components/LiveGlobalFeed.tsx` | No code changes needed (RLS fix handles it) |
| `src/components/CommunityLeaderboard.tsx` | Add user_id to select, fix comparison |
| `src/components/SurvivalStreakTracker.tsx` | Sync streak to profiles table |
| `src/hooks/useAuth.tsx` | Expose refreshProfile function |
| `src/contexts/LifeClockContext.tsx` | Call refreshProfile after XP increment |
| `src/App.tsx` | Remove 3 stub page imports and routes |
| `src/components/LifeClock.tsx` | Differentiate scientific vs playful display |
| `src/components/TrendingDeaths.tsx` | Replace mock data with death_analyses query |

