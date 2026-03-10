

# Rename "Dashboard" to "Life Clock" + Add Explainer Header

## Changes

### 1. Rename nav item (MainNavBar.tsx)
Change the first nav item label from `"Dashboard"` to `"Life Clock"` and swap the `Home` icon for `Clock` (already imported in other files).

### 2. Add Life Clock explainer to top of Index page (Index.tsx)
Between the Hero section and the LifeClock component, add a brief intro block explaining what the Life Clock is:

> **Your Life Clock** — A real-time countdown of your remaining life, personalized to your age, health, and daily habits. Every action you log shifts your projected death date. Watch it tick. Beat it.

Short, punchy, on-brand. Styled as a subtle text block (not a card) so it doesn't add clutter.

## Files Changed

| File | Change |
|------|--------|
| `src/components/MainNavBar.tsx` | Rename "Dashboard" → "Life Clock", swap `Home` → `Clock` icon |
| `src/pages/Index.tsx` | Add 3-line explainer text block above the `<LifeClock />` component |

