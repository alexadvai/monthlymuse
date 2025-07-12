'use server';

import { costSavingSuggestions, type CostSavingSuggestionsInput } from '@/ai/flows/cost-saving-suggestions';

export async function getSuggestions(input: CostSavingSuggestionsInput) {
  try {
    const result = await costSavingSuggestions(input);
    return { suggestions: result.suggestions, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { suggestions: null, error: `AI suggestions are currently unavailable. Please try again later.` };
  }
}
