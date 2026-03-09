

# BeatDeath — Everything Left (Excluding Stripe)

## Current State: Solid Foundation, Needs Cleanup + Growth Features

Security is locked down. Core loops work. What remains is **dashboard UX cleanup**, **referral system**, **enhanced sharing**, and **polish**.

---

## What's Done and Working

- Auth, onboarding, profile sync
- LifeClock with scientific/playful modes (properly differentiated)
- Death Scanner with AI edge function + deduct-before-analyze
- Scan credits system (free scans + purchased credits RPCs)
- All RLS locked down with SECURITY DEFINER triggers/RPCs
- CommunityLeaderboard using `profiles_public` view with `user_id` comparison (fixed)
- SurvivalStreakTracker syncing back to profiles (fixed)
- XP increment → refreshProfile after action (fixed)
- TrendingDeaths querying real `death_analyses` (fixed)
- LiveGlobalFeed using `get_global_feed` RPC (fixed)
- ViralChallengeHub wired to DB with RPCs (fixed)
- DeathDuel labeled "Demo Mode" (honest)
- Counter manipulation trigger on viral_challenges (fixed)

## What Needs to Be Done (Non-Stripe)

### 1. Curate Community Section (16 → 8 cards)

The community section dumps 16 components in a grid — overwhelming. Plan:

**Keep in community toggle (8 cards):**
- CommunityLeaderboard, LiveGlobalFeed, ViralChallengeHub, EnhancedAchievements
- UserStories, DeathDuel, DeathTrendsDashboard, SurvivalStreakTracker (move from featured section C)

**Remove from dashboard entirely** (these are either placeholder, redundant, or belong on sub-pages):
- SurvivalistModeToggle (already on scanner page)
- FieldManual (already on scanner page)  
- WildernessScanner (hardcoded mock data, no real scanner)
- CollaborativeDeathMap (placeholder, no real data flow)
- ImmortalModeCopilot (fake AI with canned responses)
- ViralSharingHub (redundant — ShareDeathReport already exists)
- PremiumUpsell (disabled buttons — move to paywall modal only)
- InAppPurchases (disabled buttons — move to paywall modal only)
- SurvivalGearMarketplace (affiliate placeholder, no real links)

**Update Section C** (Featured Content): Replace SurvivalStreakTracker with a new **ReferralCard** component.

### 2. Build Referral System

**Database migration:**
- Add `referral_code` (unique text, auto-generated) and `referred_by` (uuid, nullable) to `profiles`
- Create `generate_referral_code()` function
- Update `handle_new_user()` trigger to auto-assign codes
- Create `process_referral(p_referral_code)` SECURITY DEFINER RPC that grants 5 credits to referrer via `grant_scan_credits`

**Frontend:**
- New `ReferralCard.tsx` component showing the user's referral code with copy/share buttons
- Place it in Section C (Featured Content) grid
- Add referral code input to onboarding flow (optional field)

### 3. Enhanced Social Sharing

Update `ShareDeathReport.tsx`:
- Generate a richer share text with emojis and formatting
- Include a call-to-action with referral code if available
- Use `navigator.share` with proper title/text/url
- Fallback: copy formatted text + toast notification instead of `alert()`

### 4. Footer Enhancement

Replace the minimal 1-line footer with a proper footer:
- App version, social links placeholders, support email
- Privacy/Terms links (existing)
- "Made with 💀 by BeatDeath" branding

### 5. Empty State Improvements

Add proper empty states with skull illustrations and CTAs for:
- TrendingDeaths (already has basic empty state — enhance with CTA)
- CommunityLeaderboard (already has basic — enhance)
- LiveGlobalFeed (already has basic — enhance)

---

## Files Changed

| File | Change |
|------|--------|
| `supabase/migrations/new.sql` | Add referral_code, referred_by to profiles; generate_referral_code(); update handle_new_user(); process_referral() RPC |
| `src/pages/Index.tsx` | Curate community section from 16→8 cards; add ReferralCard to Section C; enhance footer |
| `src/components/ReferralCard.tsx` | New component — show referral code, copy/share, stats |
| `src/components/ShareDeathReport.tsx` | Better share formatting, toast instead of alert, referral code integration |
| `src/pages/OnboardingPage.tsx` | Add optional referral code input field |

---

## What's NOT Game-Changing Yet (But Can't Be Fixed Without Stripe)

- **Monetization**: All purchase buttons disabled. Needs Stripe.
- **Image scanning**: Camera UI exists but routes to text-only edge function. Would need vision AI integration.
- **Push notifications**: PWA manifest exists but no push subscription logic.

## What IS Game-Changing

- The core "scan anything, see how it kills you" concept — genuinely novel
- Personalized life clock with real-time countdown — addictive
- Gamification loop (XP, streaks, achievements, leaderboard) — well-designed
- The referral system (once built) provides organic growth
- Scientific vs playful mode toggle — educational AND entertaining

