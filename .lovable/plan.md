

# Fix: Make Camera Flip Button Always Visible and Prominent

## The Problem

Two issues are hiding the flip camera button:

1. **Detection fails**: The `checkMultipleCameras()` function runs on component mount, but many mobile browsers don't report multiple cameras via `enumerateDevices()` until AFTER the user grants camera permission. Since the check runs simultaneously with (or before) the permission prompt, it finds 0-1 cameras and `hasMultipleCameras` stays `false` -- the button never renders.

2. **Poor placement**: Even when it does render, the button is a small circle overlaid on the video feed at `top-4 right-16`, easily missed or covered by the scanning overlay.

## The Fix

### 1. Always show the flip button -- remove the conditional

Remove the `hasMultipleCameras` gate entirely. The button should always be visible. If the device only has one camera, tapping flip simply does nothing (the fallback in `startCamera` handles this gracefully). This is the standard pattern used by camera apps everywhere.

### 2. Move the button to the bottom controls area

Instead of a tiny overlay circle on the video, add a proper "Flip Camera" button in the bottom control bar alongside "AI Death Scan", "Take Photo", and "Scan Barcode". This makes it impossible to miss.

### 3. Re-check cameras after permission is granted

As a bonus, re-run `checkMultipleCameras()` after the camera stream is successfully obtained (inside `startCamera`), since device info becomes accurate post-permission. This can be used to show/hide a label or indicator.

## Technical Details

### File: `src/components/CameraScanner.tsx`

| Change | Details |
|--------|---------|
| Remove conditional render | Delete the `hasMultipleCameras &&` wrapper around the flip button (line 229) |
| Move button to controls | Add a "Flip" button in the bottom control bar (inside the `div` at line 305) alongside the other action buttons |
| Re-check after permission | Call `checkMultipleCameras()` inside `startCamera` after successfully obtaining the stream |
| Add active camera label | Show "Front" or "Rear" text on the button so users know which camera is active |

