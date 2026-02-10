import { ActionMapping } from "@/contexts/LifeClockContext";

export interface FuzzyMatch {
  action: ActionMapping;
  score: number;
}

const STOP_WORDS = new Set([
  "i", "just", "did", "some", "a", "an", "the", "my", "had", "ate", "went",
  "for", "to", "of", "and", "in", "on", "it", "was", "do", "does", "done",
]);

export function fuzzyMatchActions(
  input: string,
  actions: ActionMapping[],
  maxResults = 5
): FuzzyMatch[] {
  if (!input.trim()) return [];

  const inputLower = input.toLowerCase();
  const tokens = inputLower
    .split(/[\s,.\-_]+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));

  if (tokens.length === 0) return [];

  const scored: FuzzyMatch[] = actions.map((action) => {
    const descLower = action.description.toLowerCase();
    const idLower = action.action_id.toLowerCase();
    const catLower = action.category.toLowerCase();
    let score = 0;

    for (const token of tokens) {
      // Substring match in description (primary)
      if (descLower.includes(token)) score += 3;
      // Substring match in action_id
      if (idLower.includes(token)) score += 2;
      // Category match
      if (catLower.includes(token)) score += 1;
    }

    // Normalize by token count so longer inputs don't auto-score higher
    if (tokens.length > 0) {
      score = score / tokens.length;
    }

    return { action, score };
  });

  return scored
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
}
