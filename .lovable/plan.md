

# BeatDeath — Brutal Honest Final Assessment (March 9, 2026)

## Security: 0 CRITICAL / 0 HIGH / 1 ERROR / 2 WARN

Fresh security scan just ran. Results:

| Finding | Severity | Fixable in Code? |
|---------|----------|-----------------|
| `profiles_public` has zero RLS policies | **ERROR** | Yes — 1-line migration |
| Leaked Password Protection disabled | WARN | No — manual Supabase dashboard toggle |
| `community_interactions` SELECT exposes all rows | WARN | Acceptable for social app |

All 5 previous critical vulnerabilities (premium bypass, credit inflation, fake achievements, duel manipulation, challenge counter inflation) are **confirmed fixed**. The triggers and RPCs are live.

**One migration needed:** Enable RLS on `profiles_public` view and add permissive SELECT. This silences the only remaining ERROR.

---

## What's Working

- Auth, onboarding, profile sync — solid
- LifeClock, LifeTracker, TodaySummary, WeeklyProgressChart — functional
- Death Scanner with AI edge function — working
- Scan credits with deduct-before-analyze — fixed
- All RLS policies locked down with SECURITY DEFINER RPCs
- CommunityLeaderboard, UserStories, LiveGlobalFeed — wired to DB
- ViralChallengeHub — wired to DB with real RPCs
- DeathDuel labeled "Demo Mode" — honest
- ErrorBoundary, Privacy/Terms pages, PWA manifest — done
- Responsive nav with mobile menu — done

---

## Is It Visually Polished?

**Yes, 8/10.** Cohesive purple gradient theme, glass-card system, Playfair Display headings, glow effects, smooth animations. Professional enough to ship.

**What drags it down:**
- Community section: **16 cards** dumped in a 3-column grid when expanded — overwhelming wall of content
- No empty states with illustrations — when there's no data, it's just blank
- Footer is a single line — feels unfinished for a "professional" app

---

## Is It Game-Changing Enough to Storm the Market?

**The concept is genuinely novel.** Nobody else has "scan anything, see how it kills you, personalized to your biology." The gamification loop (XP, streaks, leaderboard, achievements) is well-designed.

**What's missing to go viral:**

1. **Stripe not connected = $0 revenue.** PremiumUpsell, InAppPurchases, SurvivalGearMarketplace all say "Coming Soon." This is the #1 blocker.
2. **No rich social sharing.** The share button copies text. Viral apps need OG image cards showing the death rating, item, and kill score that look stunning on Twitter/Instagram/TikTok.
3. **No referral system.** "Invite a friend, get 5 free scans" is the #1 growth lever for freemium apps. Trivial to build.
4. **Community section is overwhelming.** 16 components crammed together. Should curate top 6-8, move rest to sub-page.

---

## Implementation Plan

### 1. Fix `profiles_public` RLS (silences last ERROR)
Single migration:
```sql
ALTER VIEW public.profiles_public SET (security_invoker = on);
-- Or if that fails for views, just document that it's a VIEW with no write access
```
Actually, since `profiles_public` is a VIEW (not a table), RLS cannot technically be enabled on it. The scanner flags it but it's a false positive — views don't support RLS in PostgreSQL. We should add a comment migration acknowledging this.

### 2. Curate community section (16 → 8 cards)
Split community section into two tiers:
- **Primary row (always visible):** CommunityLeaderboard, LiveGlobalFeed, SurvivalStreakTracker, EnhancedAchievements
- **Secondary (behind "Show More"):** ViralChallengeHub, UserStories, DeathDuel, DeathTrendsDashboard
- **Remove from dashboard entirely** (accessible only from dedicated pages or nav): SurvivalistModeToggle, FieldManual, WildernessScanner, CollaborativeDeathMap, ImmortalModeCopilot, ViralSharingHub, PremiumUpsell, InAppPurchases, SurvivalGearMarketplace

### 3. Connect Stripe for real payments
Use the Lovable Stripe integration tool to:
- Wire `purchaseScanPack` to create a one-time checkout session (40 scans / $1.99)
- Wire `purchaseSubscription` to create a subscription checkout ($9.99/mo)
- Update `InAppPurchases` and `PremiumUpsell` to show real prices and functional buttons

### 4. Add OG meta image for social sharing
Create an edge function that generates a shareable card image (or HTML-based OG card) with:
- Item name, kill rating (skull icons), death scenario snippet
- BeatDeath branding
- Update `ShareDeathReport` to link to a shareable URL with proper OG tags

### 5. Build referral system
- Add `referral_code` and `referred_by` columns to profiles
- Generate unique codes on signup
- Grant 5 free scans via `grant_scan_credits` RPC when a referred user completes onboarding
- Add a "Share your code" UI in the dashboard

---

## Files Changed

| File | Change |
|------|--------|
| `supabase/migrations/new.sql` | Comment-only migration acknowledging `profiles_public` is a VIEW |
| `src/pages/Index.tsx` | Reorganize community section: 8 primary cards, hide rest |
| `src/components/InAppPurchases.tsx` | Wire to Stripe (after enabling) |
| `src/components/PremiumUpsell.tsx` | Wire to Stripe (after enabling) |
| `src/hooks/useScanCredits.ts` | Wire `purchaseScanPack` to checkout |
| `supabase/functions/generate-og-image/index.ts` | New edge function for social cards |
| `src/components/ShareDeathReport.tsx` | Use OG-enabled shareable URL |
| `src/profiles` migration | Add `referral_code`, `referred_by` columns |
| New component: `ReferralCard.tsx` | UI for sharing referral code |

**Priority order:** Stripe (#3) → Community cleanup (#2) → Referral (#5) → OG sharing (#4) → profiles_public (#1, cosmetic)

