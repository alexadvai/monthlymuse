'use server';

import { costSavingSuggestions } from '@/ai/flows/cost-saving-suggestions';
import { scenarioPlanning } from '@/ai/flows/scenario-planning';
import type { CostSavingSuggestionsInput, CostSavingSuggestionsOutput, ScenarioPlanningInput, ScenarioPlanningOutput } from '@/ai/schemas';

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

export async function getScenario(input: ScenarioPlanningInput): Promise<{ result: ScenarioPlanningOutput | null, error: string | null }> {
  try {
    const result = await scenarioPlanning(input);
    return { result, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { result: null, error: `AI scenario planning is currently unavailable. Please try again later.` };
  }
}
