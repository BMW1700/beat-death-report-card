

# Fix: Camera Disappears When Toggling Fullscreen

## Root Cause

The component has **two completely separate return blocks** -- one for fullscreen (line 365) and one for inline (line 383). Both render `{cameraFeed}` which contains the `<video ref={videoRef}>` element.

When you click "Full Screen", React sees two entirely different DOM trees and **destroys the old video element and creates a new one**. The new video element has no stream attached to it (`srcObject` is lost), so the camera feed vanishes. This is a React unmount/remount problem.

## The Fix

**Merge into a single return** that conditionally applies fullscreen styling. The `<video>` element stays mounted the entire time -- only the wrapper's CSS classes change.

### How it works

Instead of:
```text
if (isFullscreen) {
  return <div fixed>...<video/>...</div>    // video element A
}
return <Card>...<video/>...</Card>           // video element B (different!)
```

It becomes:
```text
return (
  <div className={isFullscreen ? "fixed inset-0 z-50..." : ""}>
    <Card className={isFullscreen ? "h-full rounded-none..." : "glass-card..."}>
      ...<video/>...                          // SAME video element always
    </Card>
  </div>
)
```

The video element never gets destroyed, so the camera stream stays connected.

## Technical Details

### File: `src/components/CameraScanner.tsx`

| Change | Details |
|--------|---------|
| Remove dual returns | Delete the `if (isFullscreen)` early return block (lines 365-381) |
| Single wrapper div | Wrap the existing Card return in a `div` that toggles between `fixed inset-0 z-50 bg-background flex flex-col` (fullscreen) and empty string (inline) |
| Conditional Card styling | Toggle Card classes: fullscreen uses `h-full rounded-none border-none shadow-none flex flex-col`, inline keeps existing `glass-card purple-glow overflow-hidden` |
| Conditional CardContent styling | Fullscreen adds `flex-1 flex flex-col` so the video container can stretch |
| Conditional video container | Fullscreen: `relative flex-1 min-h-0 overflow-hidden` (fills space). Inline: `relative bg-card/50 aspect-video border border-border rounded-lg overflow-hidden` (fixed aspect ratio) |
| Canvas stays once | Single `<canvas>` at the end, never duplicated |

This is a CSS-only toggle -- no DOM destruction, no stream loss, no glitch.
