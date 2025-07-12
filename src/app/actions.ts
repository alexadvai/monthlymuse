'use server';

import { costSavingSuggestions, type CostSavingSuggestionsInput, type CostSavingSuggestionsOutput } from '@/ai/flows/cost-saving-suggestions';

export async function getSuggestions(input: CostSavingSuggestionsInput): Promise<{ result: CostSavingSuggestionsOutput | null, error: string | null }> {
  try {
    const result = await costSavingSuggestions(input);
    return { result, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { result: null, error: `AI suggestions are currently unavailable. Please try again later.` };
  }
}
