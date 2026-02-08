

# Add Projected Age to Life Clock Death Date

## What Changes

A single small update to the projected death date line in the Life Clock.

### File: `src/components/LifeClock.tsx`

**Current display:**
```
Projected to: January 27, 2081
```

**New display:**
```
Projected to: January 27, 2081 (age 80)
```

The projected age is calculated as `state.userData.age + timeRemaining.years`. This uses data already available in the component -- no new state, no new imports, no new context needed.

The age text will be styled slightly lighter than the date (using `text-muted-foreground` opacity) so it reads as supplementary info rather than competing with the date. It will also inherit the same green/red color flash when actions shift the date.

## Technical Details

- One line change in the JSX inside the projected date `<span>` on line 159
- Add `(age X)` after the formatted date string
- Calculate: `state.userData.age + timeRemaining.years`
- No new dependencies, no new files

| File | Change |
|------|--------|
| `src/components/LifeClock.tsx` | Add projected age display next to the death date |

