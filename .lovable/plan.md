

# Free Voice & Text Life Tracker (Zero AI Cost)

## The Approach

Instead of sending every input to an AI model, we do **client-side fuzzy string matching** against the 50+ existing action descriptions. The action list is already loaded in memory via `LifeClockContext`. Combined with the browser's **free** Web Speech API for voice, this costs exactly $0 at any scale.

```text
User says/types: "did some pushups"
          |
          v
   Client-side fuzzy match
   against all 50+ action descriptions
          |
          v
   Top matches: "20 push-ups" (92%), "50 push-ups" (85%)
          |
          v
   User confirms -> logAction("pushups_20")
          |
          v
   Life Clock shifts forward
```

### Why This Works Without AI

The action list is a closed set of ~50 items with descriptive names like "20 push-ups (one set)", "Processed fast-food meal", "Smoke 1 cigarette". A simple scoring algorithm that checks how many words from the user's input appear in each action description will match "ate a salad" to "Healthy whole-food meal (salad/veg)" and "smoked a cigarette" to "Smoke 1 cigarette" with high accuracy. No LLM needed.

### How Fuzzy Matching Works

For each action, score it by:
1. Tokenize the user input into words (e.g., "did 10 pushups" becomes ["did", "10", "pushups"])
2. For each action description, check how many input words appear as substrings (case-insensitive)
3. Bonus points for matching the action_id (e.g., "pushups" matches "pushups_20")
4. Bonus points for matching the category (e.g., "exercise", "diet")
5. Rank by score, show top 3-5 matches for the user to pick from

This handles typos and variations naturally -- "pushup", "push-up", "push ups" all match "push-ups" via substring matching.

## What Gets Built

### 1. New Component: `src/components/LifeTracker.tsx`

A combined voice + text input component:

**Text input section:**
- Search bar with placeholder "What did you just do? (e.g., 10 pushups, ate a salad)"
- As the user types, show live filtered results (like a search autocomplete) -- top 5 matches
- Each result shows: action name, category icon, time impact (e.g., "+8 hours" or "-16 hours")
- Click a result to log it immediately (or tap confirm first)

**Voice input section:**
- Microphone button using browser Web Speech API (`SpeechRecognition`) -- completely free, runs locally
- Shows pulsing animation while listening
- Transcribed text feeds into the same fuzzy matcher
- Falls back gracefully if browser doesn't support it (just hides the mic button)

**Confirmation step:**
- After selecting a match, show: "Log **20 push-ups** (+8 hours)?"
- "Yes, log it" and "Cancel" buttons
- Prevents accidental logging

### 2. New Utility: `src/utils/fuzzyActionMatcher.ts`

A small pure function that takes:
- `input: string` (user text)
- `actions: ActionMapping[]` (the full action list)

And returns the top 5 matches with confidence scores. No external dependencies -- just string operations.

### 3. Dashboard Integration: `src/pages/Index.tsx`

Add the LifeTracker component between the Life Clock and ActionLogger sections on the dashboard.

## Files to Create/Change

| File | Action | Description |
|------|--------|-------------|
| `src/utils/fuzzyActionMatcher.ts` | Create | Pure function for scoring/ranking action matches |
| `src/components/LifeTracker.tsx` | Create | Voice + text input component with live search results and confirmation |
| `src/pages/Index.tsx` | Edit | Add LifeTracker to the dashboard layout |

## Technical Details

### Fuzzy Matcher (`fuzzyActionMatcher.ts`)

- Tokenizes input, lowercases everything
- Scores each action by: word overlap with description + action_id substring match + category keyword match
- Returns top 5 sorted by score
- Entirely synchronous, runs in under 1ms for 50 items

### Voice (Web Speech API)

- Uses `window.SpeechRecognition || window.webkitSpeechRecognition`
- Free, runs entirely in the browser (Chrome, Edge, Safari support it)
- No server calls, no API keys, no usage limits
- Feature-detected: mic button only shows if the browser supports it
- Auto-stops on silence, sends transcript to fuzzy matcher

### Cost at Scale

- Voice recognition: $0 (browser-native)
- Fuzzy matching: $0 (client-side JavaScript)
- No edge functions, no AI calls, no API keys needed
- Works offline after initial page load

