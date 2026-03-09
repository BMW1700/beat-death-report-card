

# What's Left to Make BeatDeath PERFECT & GAME-CHANGING

## Current Status: 90% Launch-Ready

You've fixed the major blockers. Here's what remains:

---

## 🔴 CRITICAL SECURITY (Must Fix)

### 1. Profiles Table Exposes Sensitive Health Data
**Risk**: Anyone (even unauthenticated) can read ALL user emails, ages, chronic conditions, medications, mental health scores, substance use, etc.

**Fix**: Create a database view that only exposes public fields (username, display_name, avatar_url, total_xp, survival_streak) and restrict direct profile reads to own row only.

### 2. Users Can Give Themselves Unlimited Scan Credits  
**Risk**: The UPDATE policy on `scan_credits` lets users set `credits_remaining` to any value.

**Fix**: Remove direct UPDATE policy. Create a `SECURITY DEFINER` function that only allows credit decrements (consuming scans) or requires service-role for additions.

---

## 🟡 IMPORTANT GAPS (Should Fix)

### 3. Data Consent Not Enforced
- Onboarding collects `data_consent_level` (none/bronze/silver/gold)
- But `LiveGlobalFeed` ignores it - showing ALL users regardless of consent
- Users who chose "Private Mode" still appear in feed

**Fix**: Filter `LiveGlobalFeed` query to exclude users with `data_consent_level = 'none'`.

### 4. EnhancedAchievements Shows Hardcoded Data
- The component displays fake achievements with hardcoded progress
- Real `achievements` table exists and gets populated by `unlock_achievement` RPC
- But UI never fetches from DB

**Fix**: Update `EnhancedAchievements.tsx` to query actual `achievements` table and show real unlocked status.

### 5. Dead Page Files Still Exist
- `src/pages/ApiPlatformPage.tsx` 
- `src/pages/SciencePage.tsx`
- `src/pages/WellnessPage.tsx`

Routes were removed from App.tsx but files remain. **Delete them**.

### 6. Privacy Policy & Terms of Service Missing
- No `/privacy` or `/terms` pages
- Required for App Store submission and GDPR compliance

**Fix**: Create basic legal pages with placeholders for your lawyer to review.

---

## 🟢 NICE-TO-HAVE (Post-Launch Polish)

### 7. Enable Leaked Password Protection  
In Supabase Dashboard → Auth Settings, enable "Leaked Password Protection" to block compromised passwords.

### 8. Stripe Integration (Skipped Per Request)
When ready, wire `useScanCredits.purchaseScanPack()` to call the `/create-checkout` edge function.

### 9. Real-time Feed Updates
Add Supabase realtime subscription to `LiveGlobalFeed` so new actions appear instantly without polling.

### 10. Image-Based Death Scanner
The edge function `analyze-death-risk` supports vision analysis. Re-add camera UI when ready to enable image uploads.

---

## Summary Table

| Priority | Issue | Effort |
|----------|-------|--------|
| 🔴 Critical | Profiles table exposes PII | 30 min |
| 🔴 Critical | Scan credits self-escalation | 20 min |
| 🟡 Important | Data consent not enforced | 15 min |
| 🟡 Important | Achievements show fake data | 20 min |
| 🟡 Important | Delete dead page files | 2 min |
| 🟡 Important | Add privacy/terms pages | 15 min |
| 🟢 Optional | Leaked password protection | Manual |
| 🟢 Optional | Stripe integration | 1 hr |

**Total to "Perfect": ~2 hours of focused work**

---

## Recommendation

Fix the **2 critical security issues** first - they're exploitable vulnerabilities. Then tackle the data consent and achievements to complete the feature set. The legal pages can use boilerplate for now.

After those 6 fixes, BeatDeath is genuinely launch-ready and game-changing.

