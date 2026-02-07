

# Fix Scan Credits Badge Visibility

## The Problem

The ScanCreditsBadge exists in the code but is practically invisible:

1. **Navbar**: The badge is crammed inside a tiny nested `<div>` underneath the username text, inside a `hidden sm:flex` container. It blends in and is way too small to notice.
2. **Scanner Page**: The badge sits between the page title and description paragraph -- easy to scroll past without seeing it.

## The Fix

### 1. MainNavBar -- Make the badge its own standalone element

Move the `ScanCreditsBadge` OUT of the nested user info div and place it as its own top-level element in the navbar's right-side controls, right next to the user info pill. This makes it immediately visible as a separate, clickable element.

**Desktop**: Badge appears as its own pill between the nav links and user info, always visible.
**Mobile menu**: Badge appears prominently at the top of the mobile menu overlay, not buried inside the user card.

### 2. Scanner Page -- Make the badge bigger and more prominent

On the Death Scanner page, increase the badge size and add surrounding context so users know exactly what it means. Add a label like "Scans remaining" next to it or increase the badge styling to make it stand out against the page header.

### 3. Show free scan count clearly

Update the `ScanCreditsBadge` to differentiate between free scans and purchased credits when displaying the count (e.g., "3 free scans" vs "40 scans"), so new users clearly understand they get 3 free scans.

## Technical Details

### Files to modify:

| File | Change |
|------|--------|
| `src/components/MainNavBar.tsx` | Move ScanCreditsBadge out of nested user div, make it a standalone element in the navbar controls area |
| `src/components/ScanCreditsBadge.tsx` | Add "free" label when showing free scans, slightly increase default size |
| `src/pages/DeathScannerPage.tsx` | Add more prominent badge display with label text below the page title |

