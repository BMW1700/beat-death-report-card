

# Scan Pack Monetization - UI & Frontend Implementation

Build all the UI components, hooks, and database infrastructure for the scan credit system. Stripe checkout will be wired up later -- for now, buttons will show placeholder behavior with toast messages.

## What Gets Built

### 1. Database Migration: `scan_credits` table + profile columns

Add a new `scan_credits` table to track purchased scan packs, and add columns to `profiles` for tracking free scan usage and subscription tier.

```sql
CREATE TABLE public.scan_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  credits_remaining INTEGER NOT NULL DEFAULT 0,
  credits_purchased INTEGER NOT NULL DEFAULT 0,
  source TEXT NOT NULL DEFAULT 'free',
  stripe_payment_id TEXT,
  purchased_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS subscription_active BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS free_scans_used INTEGER DEFAULT 0;
```

RLS policies:
- Users can view their own credits
- Users can update their own credits (for decrementing)
- System/service role can manage all

### 2. New Hook: `useScanCredits.ts`

Central hook managing all scan credit logic:

- **State**: `creditsRemaining`, `freeScansLeft` (out of 3), `isSubscriber`, `subscriptionTier`
- **Computed**: `canScan` (true if any credits available OR subscriber OR free scans left)
- **Methods**:
  - `deductScan()` -- decrements appropriate counter after a successful scan
  - `purchaseScanPack()` -- placeholder that shows toast "Stripe coming soon", will later trigger Stripe checkout
  - `purchaseSubscription(tier)` -- same placeholder pattern
  - `refreshCredits()` -- re-fetches from Supabase
- Loads data from `profiles` (free_scans_used, subscription_tier, subscription_active) and `scan_credits` table on mount

### 3. New Component: `ScanPaywall.tsx`

A modal/overlay that appears when the user runs out of scans. Dark-themed, on-brand with BeatDeath's aesthetic:

- Animated skull icon at top
- "You've used all your free scans!" message
- Scan count display showing "0 scans remaining"
- Two purchase options:
  - **"40 Scans - $1.99"** card with "Best Value" badge (one-time purchase button)
  - **"Unlimited Scans - $9.99/mo"** card with "Most Popular" badge (subscription button)
- Both buttons show "Coming Soon - Stripe Setup Required" toast for now
- "Watch an ad for 1 free scan" teaser (greyed out, future feature)
- Close button to dismiss

### 4. New Component: `ScanCreditsBadge.tsx`

A small badge/pill component showing remaining scans, used in the navbar and scanner page:

- Shows skull icon + "X scans" or "Unlimited" for subscribers
- Color-coded: green (5+), yellow (2-4), red (0-1), purple gradient (unlimited)
- Clicking it opens the `ScanPaywall` modal
- Compact enough to fit in the navbar next to XP display

### 5. Update: `DeathAnalyzer.tsx`

Before running analysis, check if the user can scan:
- Import and use `useScanCredits` hook
- Before `handleAnalyze()`, check `canScan`
- If `canScan` is false, show the `ScanPaywall` modal instead of running analysis
- After successful analysis, call `deductScan()`
- Show `ScanCreditsBadge` in the card header next to "Death Scanner & Analysis"

### 6. Update: `DeathScannerPage.tsx`

- Integrate `useScanCredits` hook
- Pass `canScan` and scan deduction logic down to `DeathAnalyzer`
- Show `ScanCreditsBadge` prominently near the page header
- After analysis completes, trigger credit deduction

### 7. Update: `PremiumUpsell.tsx`

Replace the current simulated subscription flow:
- Remove the fake Supabase URL/key constants
- Add the "$1.99 Scan Pack" as a new card at the top (positioned as the impulse buy)
- Keep the 3 subscription tiers but mark buttons as "Coming Soon" until Stripe is set up
- Show current scan balance at the top
- Use `useScanCredits` hook for purchase actions

### 8. Update: `InAppPurchases.tsx`

Replace the "COMING SOON" placeholder:
- Show the scan pack purchase option ($1.99 for 40 scans)
- Show current balance
- Quick-buy button that triggers `purchaseScanPack()`

### 9. Update: `MainNavBar.tsx`

- Add `ScanCreditsBadge` next to the XP display in both desktop and mobile views
- Shows at-a-glance how many scans remain

### 10. Update: `analyze-death-risk` Edge Function

Add scan credit verification before running AI:
- Accept an optional `isPremium` flag in the request body
- Switch between `google/gemini-2.5-pro` (for subscribers) and `google/gemini-2.5-flash` (for free/pack users)
- This model-switching logic is the only backend change -- actual credit deduction happens client-side for now, will move to server-side when Stripe is integrated

## Technical Details

### File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `supabase/migrations/` | New | scan_credits table + profile columns |
| `src/hooks/useScanCredits.ts` | New | Scan credit management hook |
| `src/components/ScanPaywall.tsx` | New | Out-of-scans upsell modal |
| `src/components/ScanCreditsBadge.tsx` | New | Compact scan count display |
| `src/components/DeathAnalyzer.tsx` | Update | Add scan check before analysis |
| `src/pages/DeathScannerPage.tsx` | Update | Integrate scan credits |
| `src/components/PremiumUpsell.tsx` | Update | Real pricing + scan packs |
| `src/components/InAppPurchases.tsx` | Update | Scan pack quick-buy |
| `src/components/MainNavBar.tsx` | Update | Show scan badge |
| `supabase/functions/analyze-death-risk/index.ts` | Update | Model switching (Pro vs Flash) |

### What's Deferred (Until Stripe Setup)

- Actual Stripe checkout sessions for scan pack purchases
- Stripe webhook for verifying payments and crediting scans
- Subscription billing via Stripe
- The `purchase-scan-pack` and `verify-scan-purchase` edge functions
- Server-side credit enforcement (currently trust-based client-side)

### Architecture: Scan Check Flow

```text
User clicks "Scan" 
  --> useScanCredits.canScan? 
    --> YES: Run analysis, then deductScan()
    --> NO: Show ScanPaywall modal
              --> "40 Scans $1.99" (toast: Stripe coming soon)
              --> "Unlimited $9.99/mo" (toast: Stripe coming soon)
```

