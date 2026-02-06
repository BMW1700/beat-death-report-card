
# Fix: Connect Onboarding Health Data to Life Clock

## The Problem

You're absolutely right to be frustrated! Here's what's broken:

**Current Flow (BROKEN):**
1. User completes 12-step onboarding with all health data (exercise, diet, sleep, happiness, etc.)
2. `calculateLifeExpectancy()` computes personalized baseline (e.g., 72 years for a smoker or 88 years for someone healthy)
3. Result is saved to database in `profiles.calculated_baseline_years`
4. **BUT** the Life Clock **ignores all of this** and just shows 80 years every time

**Root Cause:**
The `LifeClockContext` (lines 159-185) initializes with hardcoded values:
```
baselineYears: 80  // Always 80, ignores your data!
```

It never reads `profile.calculated_baseline_years` from the database.

---

## The Fix

### 1. Update LifeClockContext to Load Profile Data

Modify `src/contexts/LifeClockContext.tsx` to:
- Accept the user's profile data from the AuthProvider
- Use `calculated_baseline_years` from the profile instead of hardcoded 80
- Load `age`, `gender`, `weight`, `health_score` from the profile
- Recalculate `totalLifeMinutes` based on the real baseline

### 2. Create a Profile Sync Hook

Add a new `useEffect` inside `LifeClockProvider` that:
- Fetches the user's profile from Supabase when they log in
- Updates `userData.baselineYears` to match `profile.calculated_baseline_years`
- Recalculates `totalLifeMinutes` based on the personalized baseline
- Falls back to 80 only if no calculated value exists

### 3. Ensure Data Flows Correctly

The data flow will become:

```
[Onboarding Form]
       ↓
  calculateLifeExpectancy()
       ↓
  profiles.calculated_baseline_years (database)
       ↓
  LifeClockContext loads from profile
       ↓
  Life Clock displays YOUR personalized years
```

---

## Technical Implementation Details

### File: `src/contexts/LifeClockContext.tsx`

**Changes needed:**

1. **Remove the line that clears localStorage** (line 161) - we want to persist state
2. **Add profile fetching** - Use Supabase to get the user's profile on mount
3. **Update initialization logic**:
   - Check for saved state in localStorage first
   - If user is logged in, fetch profile and sync `baselineYears`
   - Use `calculated_baseline_years` from profile instead of 80
4. **Add profile sync effect** - When profile changes, update the Life Clock state
5. **Recalculate totalLifeMinutes** when baseline changes:
   ```
   totalLifeMinutes = (baselineYears - currentAge) * 365 * 24 * 60
   ```

### Integration with Auth

Since `LifeClockProvider` is nested inside `AuthProvider`, we can create a wrapper component that:
- Uses `useAuth()` to get the profile
- Passes the profile data to the LifeClockContext initialization
- Updates the Life Clock when profile data changes (e.g., after onboarding)

---

## Expected Outcome

After this fix:
- Complete onboarding with healthy habits → Life Clock shows ~85-90 years
- Complete onboarding as a smoker with poor sleep → Life Clock shows ~65-70 years
- Healthy actions still add time to your PERSONALIZED baseline
- The grim reaper animation responds to YOUR actual life expectancy

---

## Summary

| Component | Current State | After Fix |
|-----------|---------------|-----------|
| Onboarding | Calculates personalized baseline ✅ | No changes needed |
| Database | Stores `calculated_baseline_years` ✅ | No changes needed |
| LifeClockContext | Ignores profile, uses 80 ❌ | Loads from profile ✅ |
| Life Clock UI | Shows wrong 80 years ❌ | Shows YOUR personalized years ✅ |
