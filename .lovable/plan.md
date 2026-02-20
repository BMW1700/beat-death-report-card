
# Full Beat Death Audit Fix — Everything

This implements all five critical fixes from the audit in one pass: data persistence to Supabase, merging the duplicate trackers, replacing fake data in Streak/Leaderboard, fixing the Leaderboard component, and adding a Today's Summary card.

---

## What Gets Fixed

### 1. Data Persistence — Life Clock Actions Saved to Supabase

Right now, every action logged only lives in `localStorage`. If the user clears their browser, switches devices, or logs out, everything is gone. This is the biggest structural problem.

**Fix:** Create a new `life_actions` Supabase table. When the user logs an action, it saves to both `localStorage` (for instant offline feedback) and Supabase (for permanence). On load, if the user is authenticated, we hydrate from Supabase instead of just `localStorage`.

New table:
```text
life_actions
- id (uuid)
- user_id (uuid, FK to profiles)
- action_id (text)
- category (text)
- description (text)
- minutes_impact (integer)  -- positive or negative
- method (text)             -- 'self' | 'verified' | 'wearable'
- logged_at (timestamp)
```

RLS: users can only read/write their own rows.

The `LifeClockContext` gets a `syncToSupabase()` call inside `logAction()` — fire-and-forget, so it never slows down the UI. On mount, `loadFromSupabase()` is called once and rebuilds `recentActions` and the total minute delta from real data.

---

### 2. Merge ActionLogger + LifeTracker — One Unified Component

Both `ActionLogger` and `LifeTracker` let users log the same actions. This is confusing and wastes screen space. The `LifeTracker` (voice + text search) is strictly superior, so:

- **Remove** `<ActionLogger />` from `Index.tsx`
- **Enhance** `LifeTracker` to include a "Browse by category" tab below the search bar — this preserves the full browsable grid from ActionLogger without duplicating the entire component on the page
- The tab bar uses category icons (Exercise / Diet / Substances / Behavior / Preparedness) and shows all actions for that category, identical to what ActionLogger does today — just combined into one card

---

### 3. Replace Fake Data in SurvivalStreakTracker

`SurvivalStreakTracker` currently has hardcoded data:
```typescript
currentStreak: 7,    // FAKE
longestStreak: 23,   // FAKE
totalScans: 156,     // FAKE
```

**Fix:** Rewrite it to read real data from two sources:
- The `life_actions` Supabase table — counts real logged actions per day to calculate genuine streaks
- The `profiles` table — reads `survival_streak` and `total_xp` columns that already exist

The streak is calculated by looking at distinct days with at least one logged action, counting consecutive days backwards from today.

---

### 4. Fix Fake Leaderboard (`Leaderboard.tsx`)

The old `Leaderboard` component in the community section uses hardcoded fake names:
```typescript
{ name: "DeathLord42", xp: 999 },  // FAKE
```

This component is pointless since `CommunityLeaderboard` already pulls real data from Supabase. **Fix:** Remove `<Leaderboard />` from `Index.tsx` and remove the import — `CommunityLeaderboard` already handles this correctly with real data.

---

### 5. Add Today's Summary Card

A new `TodaySummary` component sits between the Life Clock and the LifeTracker. It shows:
- All actions logged today (from `recentActions` filtered to today's date)
- Total time gained/lost today
- A motivational one-liner based on whether the day is net positive or negative
- Count of actions logged

This closes the "habit loop" — users see a clear daily summary that rewards them for coming back.

---

## Files to Create / Change

| File | Action | What Changes |
|------|--------|--------------|
| `supabase/migrations/new.sql` | Create | New `life_actions` table + RLS policies |
| `src/contexts/LifeClockContext.tsx` | Edit | Add Supabase sync on logAction + hydrate from DB on load |
| `src/components/LifeTracker.tsx` | Edit | Add "Browse by category" tabs below the search bar, making ActionLogger redundant |
| `src/components/TodaySummary.tsx` | Create | New card showing today's logged actions and net time impact |
| `src/components/SurvivalStreakTracker.tsx` | Edit | Replace hardcoded fake data with real data from `life_actions` table |
| `src/pages/Index.tsx` | Edit | Remove ActionLogger, add TodaySummary, remove fake Leaderboard import |

---

## Technical Details

### Database Migration

```sql
CREATE TABLE public.life_actions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  action_id text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  minutes_impact integer NOT NULL,
  method text DEFAULT 'self',
  logged_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.life_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own actions"
  ON public.life_actions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own actions"
  ON public.life_actions FOR SELECT
  USING (auth.uid() = user_id);
```

### Supabase Sync in LifeClockContext

The `logAction` function gets one additional async call after the local state update:
```typescript
// Fire and forget — never blocks the UI
if (user) {
  supabase.from('life_actions').insert({
    user_id: user.id,
    action_id: actionId,
    category: mapping.category,
    description: mapping.description,
    minutes_impact: Math.round(playfulMinutes),
    method,
    logged_at: new Date().toISOString()
  });
}
```

On initial load (when user is authenticated), a one-time fetch pulls all `life_actions` for the last 30 days and reconstructs the `recentActions` array and total minute delta. This ensures the Life Clock reflects real saved data even after a browser refresh or device switch.

### Real Streak Calculation

The streak is calculated from actual `life_actions` rows:
```typescript
// Get all distinct logged dates
const dates = rows.map(r => new Date(r.logged_at).toDateString());
const uniqueDates = [...new Set(dates)];
// Count consecutive days backwards from today
let streak = 0;
let checkDate = new Date();
while (uniqueDates.includes(checkDate.toDateString())) {
  streak++;
  checkDate.setDate(checkDate.getDate() - 1);
}
```

### Today's Summary Card

Reads directly from `state.recentActions` (already in memory) — no additional DB calls needed. Filters to `timestamp.toDateString() === today`, sums minutes, lists each action with its impact color-coded green/red.
