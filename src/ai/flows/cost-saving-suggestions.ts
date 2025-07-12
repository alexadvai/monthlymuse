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
  income: z.number().describe('Monthly income.'),
  rent: z.number().describe('Monthly rent expense.'),
  utilities: z.number().describe('Monthly utilities expense (electricity, gas, water).'),
  food: z.number().describe('Monthly food expense (groceries, dining out).'),
  transportation: z.number().describe('Monthly transportation expense (car, public transit).'),
  other: z.number().describe('Other monthly expenses.'),
});
export type CostSavingSuggestionsInput = z.infer<typeof CostSavingSuggestionsInputSchema>;

const SuggestionSchema = z.object({
  category: z.enum(["Rent/Mortgage", "Utilities", "Food", "Transportation", "Other", "General"]).describe("The expense category this suggestion applies to."),
  impact: z.enum(["High Impact", "Quick Win", "Good Habit"]).describe("The potential impact of the suggestion."),
  suggestion: z.string().describe("The specific, actionable cost-saving suggestion.")
});
export type Suggestion = z.infer<typeof SuggestionSchema>;

const CostSavingSuggestionsOutputSchema = z.object({
  suggestions: z.array(SuggestionSchema).describe('A list of structured cost-saving suggestions.'),
});
export type CostSavingSuggestionsOutput = z.infer<typeof CostSavingSuggestionsOutputSchema>;

export async function costSavingSuggestions(input: CostSavingSuggestionsInput): Promise<CostSavingSuggestionsOutput> {
  return costSavingSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'costSavingSuggestionsPrompt',
  input: {schema: CostSavingSuggestionsInputSchema},
  output: {schema: CostSavingSuggestionsOutputSchema},
  prompt: `You are a friendly and encouraging financial advisor. Your goal is to help users find practical ways to save money based on their income and expenses.

Analyze the following monthly financial data:
- Income: {{{income}}}
- Rent/Mortgage: {{{rent}}}
- Utilities: {{{utilities}}}
- Food: {{{food}}}
- Transportation: {{{transportation}}}
- Other: {{{other}}}

Based on this data, provide a list of specific, actionable cost-saving suggestions. For each suggestion, determine which expense category it relates to, and assess its potential impact using one of the following levels: "High Impact", "Quick Win", or "Good Habit".

- "High Impact": A suggestion that could lead to significant savings but might require more effort.
- "Quick Win": An easy-to-implement suggestion for immediate savings.
- "Good Habit": A long-term behavioral change that adds up over time.

Present your response as a JSON object that adheres to the output schema. Ensure each suggestion is clear, positive, and empowering.
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
