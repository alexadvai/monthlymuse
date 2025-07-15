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

const AchievementSchema = z.object({
    name: z.string().describe("The name of the achievement, e.g., 'Super Saver'."),
    description: z.string().describe("A brief description of how the achievement was earned."),
});
export type Achievement = z.infer<typeof AchievementSchema>;

const MonthlyPlanSchema = z.object({
  month: z.number().describe("The month number (1-12)."),
  projectedBalance: z.number().describe("The projected balance at the end of this month."),
});
export type MonthlyPlan = z.infer<typeof MonthlyPlanSchema>;


const CostSavingSuggestionsOutputSchema = z.object({
  financialHealthScore: z.number().min(0).max(100).describe("A score from 0 to 100 representing the user's financial health."),
  financialAnalysis: z.string().describe("A brief, one or two sentence analysis of the user's financial situation based on their budget."),
  achievements: z.array(AchievementSchema).describe("A list of achievements the user has unlocked based on their current budget."),
  suggestions: z.array(SuggestionSchema).describe('A list of structured cost-saving suggestions.'),
  suggestedCategory: z.string().optional().describe("If the 'Other' expense category is high, suggest a new, more specific category name for it (e.g., 'Shopping', 'Entertainment')."),
  twelveMonthPlan: z.array(MonthlyPlanSchema).describe("A 12-month savings projection based on current numbers and incorporating some of the suggestions."),
});
export type CostSavingSuggestionsOutput = z.infer<typeof CostSavingSuggestionsOutputSchema>;

export async function costSavingSuggestions(input: CostSavingSuggestionsInput): Promise<CostSavingSuggestionsOutput> {
  return costSavingSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'costSavingSuggestionsPrompt',
  input: {schema: CostSavingSuggestionsInputSchema},
  output: {schema: CostSavingSuggestionsOutputSchema},
  prompt: `You are a friendly and encouraging financial advisor. Your goal is to help users find practical ways to save money and improve their financial health.

Analyze the following monthly financial data:
- Income: {{{income}}}
- Rent/Mortgage: {{{rent}}}
- Utilities: {{{utilities}}}
- Food: {{{food}}}
- Transportation: {{{transportation}}}
- Other: {{{other}}}

Based on this data, you must perform the following tasks:

1.  **Calculate a Financial Health Score:**
    -   Create a score from 0 to 100.
    -   Base the score on the savings rate (income minus total expenses). A higher savings rate should result in a higher score. For example, a savings rate over 20% is excellent (90+ score), 10-20% is good (75-89), 0-10% is average (50-74), and a negative rate is poor (<50).
    -   Also consider the rent-to-income ratio. If rent is over 40% of income, the score should be penalized.

2.  **Provide a Brief Financial Analysis:**
    -   Write a one or two-sentence summary of the user's financial situation that is encouraging and actionable.

3.  **Identify Achievements:**
    -   Based on the user's budget, award them achievements. Examples include:
        -   'Super Saver': Savings rate is 20% or more.
        -   'Budget Boss': Total expenses are less than 90% of income.
        -   'Frugal Foodie': Food expenses are less than 15% of income.
        -   'Housing Hero': Rent is less than 30% of income.
    -   If no achievements are unlocked, return an empty array.

4.  **Generate Cost-Saving Suggestions:**
    -   Provide a list of specific, actionable cost-saving suggestions.
    -   For each suggestion, determine the expense category and its potential impact ("High Impact", "Quick Win", "Good Habit").

5.  **Suggest New Category (Optional):**
    -   If the "Other" expense is a significant portion (e.g., >20%) of total expenses, suggest a more specific category name for it like "Shopping", "Entertainment", or "Personal Care".

6.  **Create a 12-Month Savings Projection:**
    -   Based on the current monthly savings (income - total expenses), project the user's balance over the next 12 months.
    -   To make the projection optimistic, assume the user implements one or two "High Impact" or "Quick Win" suggestions. Estimate a reasonable monthly savings increase from these changes (e.g., 5-10% of current expenses) and add it to the monthly savings for the projection.
    -   The starting point for the projection (Month 0) is the current monthly savings.
    -   For each month from 1 to 12, calculate the cumulative projected balance. For example, Month 1's balance is Month 0 balance + new monthly savings. Month 2 is Month 1 balance + new monthly savings, and so on.
    -   Return this as an array of {month, projectedBalance} objects.

Present your complete response as a single JSON object that adheres to the output schema.
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
