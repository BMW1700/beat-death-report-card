

# Add "Projected Death Date" to Life Clock

## The Idea

Add a dynamic **projected death date** (e.g., "March 15, 2081") to the Life Clock that shifts forward or backward in real-time as the user's lifestyle actions add or subtract time. This makes the abstract countdown feel tangible and personal.

## Why It Won't Confuse Users

The countdown ("55y 0m 6d") tells you *how much time is left*. The projected date tells you *when*. They're complementary, not competing. The trick is visual hierarchy:

- The countdown stays **big and primary** (as it is now)
- The projected date sits **directly below it** as a smaller, secondary line
- A subtle label like "Projected to" makes the meaning immediately clear
- When actions shift it (e.g., logging 20 push-ups moves the date forward), the change is visceral -- seeing "March 15, 2081" jump to "March 16, 2081" is more emotionally impactful than seeing "55y 0m 6d" change by a few hours

## What Changes

### File: `src/components/LifeClock.tsx`

Add a computed projected death date below the main countdown display:

1. **Calculate the projected date**: `new Date(Date.now() + state.totalLifeMinutes * 60 * 1000)` -- this uses the existing real-time `totalLifeMinutes` value that already ticks down every second and adjusts with lifestyle actions.

2. **Display it** as a new line between the countdown and the "Time remaining based on current lifestyle" label:
   - Format: "Projected to: March 15, 2081" using `date-fns` `format()` (already installed)
   - Style: `text-lg` with `text-muted-foreground` -- visible but clearly secondary to the `text-5xl` countdown above it
   - Add a subtle calendar icon (`CalendarClock` from lucide) for visual clarity

3. **Add a color indicator**: When actions shift the date forward (positive impact), briefly flash the date green. When negative, flash red. This reinforces the cause-and-effect of lifestyle choices.

### Visual Layout (inside the Life Clock card)

```text
        54y  12m  4d           <-- primary countdown (unchanged, text-5xl)
       23h  34m  1s            <-- secondary time (unchanged, text-2xl)
   Projected to: March 15, 2081   <-- NEW LINE (text-lg, muted)
  Time remaining based on current lifestyle   <-- existing label
```

## Technical Details

- No new state or context changes needed -- `state.totalLifeMinutes` already has all the data
- The date recalculates every render (which happens every second due to the countdown interval), so it stays perfectly in sync
- Uses `date-fns` `format(date, 'MMMM d, yyyy')` for clean date formatting (library already installed)
- Only one file needs to change: `src/components/LifeClock.tsx`

## Summary

| File | Change |
|------|--------|
| `src/components/LifeClock.tsx` | Add projected death date display below the countdown, with color feedback on changes |
