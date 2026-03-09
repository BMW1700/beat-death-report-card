

# BeatDeath — Brutal Honest Audit (March 9, 2026)

## VERDICT: 85% Done. Two CRITICAL Security Holes Found.

---

## CRITICAL SECURITY ISSUES (Must Fix Before Launch)

### 1. Profiles Table Leaks ALL Health Data to the Internet
**Severity: CRITICAL**

The `profiles` table has a SELECT policy `USING (true)` — meaning **anyone on the internet** (even unauthenticated) can read every user's email, age, weight, chronic conditions, medications, smoking status, mental health scores, and subscription tier. This is a HIPAA-adjacent nightmare.

**Fix:** Replace the blanket `USING (true)` SELECT policy with `USING (auth.uid() = user_id)`. The `profiles_public` VIEW already exists for leaderboard data — that's what community features should use.

### 2. Users Can Grant Themselves Unlimited Scan Credits
**Severity: CRITICAL**

The `scan_credits` table has an UPDATE policy with only a USING clause (`auth.uid() = user_id`) and **no WITH CHECK restriction**. Any authenticated user can set `credits_remaining` to 999999 via a simple Supabase client call. Your entire monetization model is bypassable.

**Fix:** Drop the public UPDATE policy on `scan_credits`. All credit modifications must go through `SECURITY DEFINER` RPCs only (`consume_scan_credit`, `grant_scan_credits`).

### 3. Life Actions Publicly Readable (WARN)
The global feed intentionally reads all users' actions, but this is currently open to unauthenticated requests too. Should restrict to `auth.uid() IS NOT NULL` at minimum.

---

## What's Working Well

| Feature | Status | Notes |
|---------|--------|-------|
| Auth + Onboarding | Solid | 12-step onboarding with life expectancy calc |
| LifeClock | Solid | Scientific vs playful modes differentiated |
| Death Scanner | Solid | Edge function + deduct-before-analyze |
| Scan Credits System | Logic works | But UPDATE policy is exploitable (see above) |
| Community Leaderboard | Solid | Uses `profiles_public` view correctly |
| Referral System | NEW, Solid | Code generation, process_referral RPC, UI card |
| Dashboard Curation | Improved | 8 community cards instead of 16 |
| ShareDeathReport | Improved | navigator.share + referral code integration |
| XP/Streak Sync | Working | refreshProfile after XP increment |
| RLS on most tables | Working | SECURITY DEFINER RPCs for sensitive ops |

---

## What's NOT Game-Changing Yet

1. **Stripe = $0 revenue.** Every purchase button shows "Stripe Setup Required" toast. This is the #1 business blocker.
2. **DeathDuel = Demo Mode.** The most social, competitive feature is fake. Real-time duels would be a killer (pun intended) viral mechanic.
3. **No push notifications.** PWA manifest exists but no subscription logic. Users forget to come back.
4. **No image scanning.** Camera UI exists but the edge function only processes text. Vision AI would make "scan anything" literally true.
5. **Data monetization tiers are vaporware.** The onboarding promises $1-100/month for data sharing but there's no backend to deliver on that promise.

---

## What IS Game-Changing

- **"Scan anything, see how it kills you"** — genuinely novel concept, no competitors
- **Personalized life clock** — addictive real-time countdown based on YOUR health data
- **Gamification loop** (XP, streaks, achievements, leaderboard) — well-designed retention mechanics
- **Referral system** — organic growth lever built and ready
- **The paywall design** — ScanPaywall is polished, professional, and well-priced ($1.99/40 scans)

---

## Is It Visually Polished?

**Yes, 8.5/10.** The purple gradient theme is cohesive. Glass-card system, Playfair Display headings, glow effects, smooth animations all work together. The ScanPaywall modal is particularly well-designed. The dashboard hierarchy (Hero → LifeClock → Stats → Featured → Community) flows logically.

**Minor polish gaps:**
- No loading skeletons on community cards (they just pop in)
- No micro-animations on XP gain (should feel rewarding)
- Empty states in community section are functional but bland

---

## Addictiveness Rating: 7/10

**What drives retention:**
- LifeClock ticking down creates urgency
- Daily streak tracker with sync to profiles
- XP and achievements for logging actions
- "Spin the Death Wheel" for random engagement

**What's missing for 10/10:**
- Push notifications ("Your streak is about to break!")
- Daily challenges ("Scan 3 items today for bonus XP")
- Social notifications ("Your friend just beat your score!")

---

## Implementation Plan (Priority Order)

### 1. Fix 2 Critical Security Holes (Migration)
```sql
-- Fix profiles: restrict SELECT to own row only
DROP POLICY "Users can view all profiles" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Fix scan_credits: remove public UPDATE entirely
DROP POLICY IF EXISTS "Users can update own credits" ON public.scan_credits;
-- All credit ops go through RPCs only

-- Fix life_actions: require authentication for global feed
DROP POLICY "Users can view all actions" ON public.life_actions;
CREATE POLICY "Authenticated users can view all actions"
  ON public.life_actions FOR SELECT TO authenticated
  USING (true);
```

### 2. Add XP Gain Micro-Animation
When XP increments after logging an action, show a brief "+10 XP" floating animation near the navbar badge. Small but makes the reward loop feel tangible.

### 3. Add Loading Skeletons to Community Cards
Replace the instant pop-in with skeleton placeholders for CommunityLeaderboard, LiveGlobalFeed, and SurvivalStreakTracker while data loads.

---

## Files Changed

| File | Change |
|------|--------|
| `supabase/migrations/new.sql` | Fix 3 RLS policies (profiles SELECT, scan_credits UPDATE, life_actions SELECT) |
| `src/components/MainNavBar.tsx` | Add XP gain animation |
| `src/components/CommunityLeaderboard.tsx` | Add skeleton loading state |
| `src/components/LiveGlobalFeed.tsx` | Add skeleton loading state |

---

## Summary: What's Left Until "Done"

| Task | Effort | Blocker? |
|------|--------|----------|
| Fix 2 critical security holes | 1 migration | **YES — ship-blocking** |
| Connect Stripe | Need API key | YES — revenue-blocking |
| XP micro-animation | Small | No |
| Loading skeletons | Small | No |
| Push notifications | Medium | No |
| Real image scanning (Vision AI) | Large | No |
| Real Death Duels | Large | No |

**Bottom line:** Fix the two security holes, connect Stripe, and you have a shippable product. Everything else is polish and growth optimization.

