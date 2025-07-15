'use server';
/**
 * @fileOverview A flow for "what if" scenario planning with a user's budget.
 *
 * - scenarioPlanning - A function that takes a user's query and budget, and returns an updated budget.
 */

import {ai} from '@/ai/genkit';
import { 
  ScenarioPlanningInputSchema, 
  ScenarioPlanningOutputSchema,
  type ScenarioPlanningInput,
  type ScenarioPlanningOutput
} from '@/ai/schemas';

export async function scenarioPlanning(input: ScenarioPlanningInput): Promise<ScenarioPlanningOutput> {
  return scenarioPlanningFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scenarioPlanningPrompt',
  input: {schema: ScenarioPlanningInputSchema},
  output: {schema: ScenarioPlanningOutputSchema},
  prompt: `You are a budget modification assistant. Your task is to interpret a user's natural language query and modify their provided budget accordingly.

Current Budget:
- Income: {{{budget.income}}}
- Rent: {{{budget.rent}}}
- Utilities: {{{budget.utilities}}}
- Food: {{{budget.food}}}
- Transportation: {{{budget.transportation}}}
- Other: {{{budget.other}}}

User's Query: "{{query}}"

Instructions:
1.  Analyze the user's query to understand the requested change. The change can be an increase, decrease, or setting a value for one of the budget categories (income, rent, utilities, food, transportation, other).
2.  Apply the change to the corresponding budget field.
3.  Do not change any other fields. If the query is ambiguous or doesn't specify a clear action, return the original budget without modification.
4.  Construct the 'updatedBudget' object with the new values.
5.  Provide a short, clear 'explanation' of what you changed. For example: "I decreased the food budget by $50."

Return the entire response as a single JSON object matching the output schema.
`,
});

const scenarioPlanningFlow = ai.defineFlow(
  {
    name: 'scenarioPlanningFlow',
    inputSchema: ScenarioPlanningInputSchema,
    outputSchema: ScenarioPlanningOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
