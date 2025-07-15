'use server';

/**
 * @fileOverview This file defines the shared Zod schemas and TypeScript types used across the application,
 * particularly for AI flow inputs and outputs.
 */

import {z} from 'zod';

// Common Schemas
export const GoalSchema = z.object({
  id: z.string(),
  name: z.string(),
  amount: z.number(),
});
export type Goal = z.infer<typeof GoalSchema>;

export const BudgetSchema = z.object({
  income: z.number().describe('Monthly income.'),
  rent: z.number().describe('Monthly rent expense.'),
  utilities: z.number().describe('Monthly utilities expense.'),
  food: z.number().describe('Monthly food expense.'),
  transportation: z.number().describe('Monthly transportation expense.'),
  other: z.number().describe('Other monthly expenses.'),
});
export type Budget = z.infer<typeof BudgetSchema>;


// Cost Saving Suggestions Flow
export const CostSavingSuggestionsInputSchema = BudgetSchema.extend({
  goals: z.array(GoalSchema).optional().describe("A list of financial goals the user has set."),
});
export type CostSavingSuggestionsInput = z.infer<typeof CostSavingSuggestionsInputSchema>;

export const SuggestionSchema = z.object({
  category: z.enum(["Rent/Mortgage", "Utilities", "Food", "Transportation", "Other", "General"]).describe("The expense category this suggestion applies to."),
  impact: z.enum(["High Impact", "Quick Win", "Good Habit"]).describe("The potential impact of the suggestion."),
  suggestion: z.string().describe("The specific, actionable cost-saving suggestion.")
});
export type Suggestion = z.infer<typeof SuggestionSchema>;

export const AchievementSchema = z.object({
    name: z.string().describe("The name of the achievement, e.g., 'Super Saver'."),
    description: z.string().describe("A brief description of how the achievement was earned."),
});
export type Achievement = z.infer<typeof AchievementSchema>;

export const MonthlyPlanSchema = z.object({
  month: z.number().describe("The month number (1-12)."),
  projectedBalance: z.number().describe("The projected balance at the end of this month."),
});
export type MonthlyPlan = z.infer<typeof MonthlyPlanSchema>;

export const GoalProjectionSchema = z.object({
  goalId: z.string(),
  monthsToReach: z.number().describe("The estimated number of months to reach this goal based on the current savings rate."),
});
export type GoalProjection = z.infer<typeof GoalProjectionSchema>;

export const LongTermProjectionSchema = z.object({
  investment: z.object({
    fiveYear: z.number().describe("Projected investment value after 5 years, assuming a 7% annual return on monthly savings."),
    tenYear: z.number().describe("Projected investment value after 10 years, assuming a 7% annual return on monthly savings."),
  }),
  debtPayoff: z.object({
    amount: z.number().describe("A hypothetical debt amount to show off, e.g., 5000."),
    originalMonths: z.number().describe("Original months to pay off a hypothetical $5000 debt with minimum payments."),
    newMonths: z.number().describe("New, faster payoff time in months for the hypothetical debt using monthly savings."),
  }),
});
export type LongTermProjection = z.infer<typeof LongTermProjectionSchema>;


export const CostSavingSuggestionsOutputSchema = z.object({
  financialHealthScore: z.number().min(0).max(100).describe("A score from 0 to 100 representing the user's financial health."),
  financialAnalysis: z.string().describe("A brief, one or two sentence analysis of the user's financial situation based on their budget."),
  achievements: z.array(AchievementSchema).describe("A list of achievements the user has unlocked based on their current budget."),
  suggestions: z.array(SuggestionSchema).describe('A list of structured cost-saving suggestions.'),
  suggestedCategory: z.string().optional().describe("If the 'Other' expense category is high, suggest a new, more specific category name for it (e.g., 'Shopping', 'Entertainment')."),
  twelveMonthPlan: z.array(MonthlyPlanSchema).describe("A 12-month savings projection based on current numbers and incorporating some of the suggestions."),
  goalProjections: z.array(GoalProjectionSchema).optional().describe("Projections for how long it will take to reach each financial goal."),
  longTermProjections: LongTermProjectionSchema.optional().describe("Projections for long-term investment growth and debt payoff."),
});
export type CostSavingSuggestionsOutput = z.infer<typeof CostSavingSuggestionsOutputSchema>;


// Scenario Planning Flow
export const ScenarioPlanningInputSchema = z.object({
  query: z.string().describe("The user's natural language query about a budget change."),
  budget: BudgetSchema.describe("The user's current budget."),
});
export type ScenarioPlanningInput = z.infer<typeof ScenarioPlanningInputSchema>;

export const ScenarioPlanningOutputSchema = z.object({
  updatedBudget: BudgetSchema.describe("The updated budget after applying the user's query."),
  explanation: z.string().describe("A brief explanation of the changes made to the budget."),
});
export type ScenarioPlanningOutput = z.infer<typeof ScenarioPlanningOutputSchema>;
