'use server';

/**
 * @fileOverview This file defines the Genkit flow for providing cost-saving suggestions based on user-entered expenses.
 *
 * - costSavingSuggestions - A function that takes expense data as input and returns cost-saving suggestions.
 */

import {ai} from '@/ai/genkit';
import { 
  CostSavingSuggestionsInputSchema, 
  CostSavingSuggestionsOutputSchema,
  type CostSavingSuggestionsInput,
  type CostSavingSuggestionsOutput
} from '@/ai/schemas';

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
- Goals: {{json goals}}

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
    -   If the user has goals, tailor some suggestions towards helping them achieve their goals faster.

5.  **Suggest New Category (Optional):**
    -   If the "Other" expense is a significant portion (e.g., >20%) of total expenses, suggest a more specific category name for it like "Shopping", "Entertainment", or "Personal Care".

6.  **Create a 12-Month Savings Projection:**
    -   Based on the current monthly savings (income - total expenses), project the user's balance over the next 12 months.
    -   To make the projection optimistic, assume the user implements one or two "High Impact" or "Quick Win" suggestions. Estimate a reasonable monthly savings increase from these changes (e.g., 5-10% of current expenses) and add it to the monthly savings for the projection.
    -   The starting point for the projection (Month 0) is the current monthly savings.
    -   For each month from 1 to 12, calculate the cumulative projected balance.

7.  **Calculate Goal Projections (if goals exist):**
    - For each goal, calculate the number of months it would take to reach the goal amount using the current monthly savings. If savings are zero or negative, return a large number like 999.
    - Return this as an array of {goalId, monthsToReach} objects.

8.  **Calculate Long-Term Projections (if savings are positive):**
    - If monthly savings are positive, calculate two scenarios:
    -   a. **Investment Growth:** Project the growth of monthly savings over 5 and 10 years, assuming a conservative 7% annual compound interest rate.
    -   b. **Debt Payoff:** Show how quickly a hypothetical $5000 debt with a 18% APR could be paid off. Assume a minimum payment of $100. Calculate the original payoff time and the new, accelerated payoff time if the user applies their entire monthly savings to the debt.
    - If savings are not positive, do not return this field.

9.  **Generate Income Suggestions:**
    -   You must always suggest 2-3 creative and realistic side hustles or freelance opportunities to help the user build wealth, regardless of their current savings rate.
    -   Ideas could include things like "Freelance Social Media Management", "Pet Sitting on Weekends", or "Selling Crafts Online".
    -   Keep the suggestions brief and encouraging.

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
