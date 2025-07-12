'use server';

/**
 * @fileOverview This file defines the Genkit flow for providing cost-saving suggestions based on user-entered expenses.
 *
 * - costSavingSuggestions - A function that takes expense data as input and returns cost-saving suggestions.
 * - CostSavingSuggestionsInput - The input type for the costSavingSuggestions function.
 * - CostSavingSuggestionsOutput - The return type for the costSavingSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CostSavingSuggestionsInputSchema = z.object({
  rent: z.number().describe('Monthly rent expense.'),
  utilities: z.number().describe('Monthly utilities expense (electricity, gas, water).'),
  food: z.number().describe('Monthly food expense (groceries, dining out).'),
  transportation: z.number().describe('Monthly transportation expense (car, public transit).'),
  other: z.number().describe('Other monthly expenses.'),
});
export type CostSavingSuggestionsInput = z.infer<typeof CostSavingSuggestionsInputSchema>;

const CostSavingSuggestionsOutputSchema = z.object({
  suggestions: z.array(
    z.string().describe('A cost saving suggestion.')
  ).describe('A list of cost saving suggestions based on the provided expenses.'),
});
export type CostSavingSuggestionsOutput = z.infer<typeof CostSavingSuggestionsOutputSchema>;

export async function costSavingSuggestions(input: CostSavingSuggestionsInput): Promise<CostSavingSuggestionsOutput> {
  return costSavingSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'costSavingSuggestionsPrompt',
  input: {schema: CostSavingSuggestionsInputSchema},
  output: {schema: CostSavingSuggestionsOutputSchema},
  prompt: `Analyze the following monthly expenses and provide a list of cost-saving suggestions.

Rent: {{{rent}}}
Utilities: {{{utilities}}}
Food: {{{food}}}
Transportation: {{{transportation}}}
Other: {{{other}}}

Consider each category and suggest practical ways to reduce spending.  Be specific, and provide multiple suggestions.
Format your response as a JSON array of strings.  Each string should be a suggestion.
`,
});

const costSavingSuggestionsFlow = ai.defineFlow(
  {
    name: 'costSavingSuggestionsFlow',
    inputSchema: CostSavingSuggestionsInputSchema,
    outputSchema: CostSavingSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
