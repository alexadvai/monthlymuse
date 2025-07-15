"use client";

import { useState, useMemo, useTransition, type ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ExpenseInput } from "@/components/expense-input";
import { ExpenseChart, type ChartData } from "@/components/expense-chart";
import { ProjectionChart } from "@/components/projection-chart";
import { GoalTracker } from "@/components/goal-tracker";
import { ScenarioPlanner } from "@/components/scenario-planner";
import { LongTermImpactCard } from "@/components/long-term-impact-card";
import { getSuggestions, getScenario } from "./actions";
import type { Suggestion, Achievement, MonthlyPlan, Goal, GoalProjection, LongTermProjection } from "@/ai/schemas";
import { Progress } from "@/components/ui/progress";
import {
  Car,
  HomeIcon,
  UtensilsCrossed,
  Zap,
  MoreHorizontal,
  Lightbulb,
  Loader2,
  AlertCircle,
  DollarSign,
  Wallet,
  Sparkles,
  Trophy,
  Activity,
  Award,
  ShieldCheck,
  LineChart,
  Target,
} from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useToast } from "@/hooks/use-toast";


interface ExpenseCategory {
  id: "rent" | "utilities" | "food" | "transportation" | "other";
  label: string;
  icon: ReactNode;
  max: number;
  color: string;
}

const expenseCategories: ExpenseCategory[] = [
  { id: "rent", label: "Rent/Mortgage", icon: <HomeIcon className="w-6 h-6" />, max: 5000, color: "hsl(var(--chart-1))" },
  { id: "utilities", label: "Utilities", icon: <Zap className="w-6 h-6" />, max: 1000, color: "hsl(var(--chart-2))" },
  { id: "food", label: "Food & Groceries", icon: <UtensilsCrossed className="w-6 h-6" />, max: 2000, color: "hsl(var(--chart-3))" },
  { id: "transportation", label: "Transportation", icon: <Car className="w-6 h-6" />, max: 1500, color: "hsl(var(--chart-4))" },
  { id: "other", label: "Other", icon: <MoreHorizontal className="w-6 h-6" />, max: 2000, color: "hsl(var(--chart-5))" },
];

const suggestionIcons = {
  "High Impact": <Trophy className="w-4 h-4 text-amber-400" />,
  "Quick Win": <Sparkles className="w-4 h-4 text-rose-400" />,
  "Good Habit": <Activity className="w-4 h-4 text-emerald-400" />,
};

interface AiResultState {
  suggestions: Suggestion[];
  achievements: Achievement[];
  financialHealthScore: number;
  financialAnalysis: string;
  suggestedCategory?: string;
  twelveMonthPlan: MonthlyPlan[];
  goalProjections?: GoalProjection[];
  longTermProjections?: LongTermProjection;
}

export type Expenses = {
  rent: number;
  utilities: number;
  food: number;
  transportation: number;
  other: number;
};

export default function HomePage() {
  const [income, setIncome] = useState(5000);
  const [expenses, setExpenses] = useState<Expenses>({
    rent: 1500,
    utilities: 150,
    food: 400,
    transportation: 200,
    other: 300,
  });
  const [goals, setGoals] = useState<Goal[]>([]);

  const [isPending, startTransition] = useTransition();
  const [aiResult, setAiResult] = useState<AiResultState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const totalExpenses = useMemo(() => Object.values(expenses).reduce((acc, cur) => acc + cur, 0), [expenses]);
  const balance = useMemo(() => income - totalExpenses, [income, totalExpenses]);

  const chartData: ChartData[] = useMemo(() => {
    return expenseCategories.map(category => ({
      name: category.label,
      value: expenses[category.id],
      fill: category.color,
      icon: category.icon,
    })).filter(item => item.value > 0);
  }, [expenses]);

  const handleExpenseChange = (id: keyof typeof expenses, value: number) => {
    setExpenses(prev => ({ ...prev, [id]: value }));
  };
  
  const handleIncomeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setIncome(isNaN(value) ? 0 : value);
  };

  const handleGetSuggestions = () => {
    setError(null);
    setAiResult(null);
    startTransition(async () => {
      const { result, error } = await getSuggestions({ income, ...expenses, goals });
      if (error) {
        setError(error);
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        })
      } else if (result) {
        setAiResult(result);
      }
    });
  };

  const handleScenario = async (query: string) => {
    const { result, error } = await getScenario({
      query,
      budget: { income, ...expenses }
    });
    if(error) {
      toast({ title: "Scenario Error", description: error, variant: "destructive" });
    } else if(result?.updatedBudget) {
      const { updatedBudget } = result;
      setIncome(updatedBudget.income);
      setExpenses({
        rent: updatedBudget.rent,
        utilities: updatedBudget.utilities,
        food: updatedBudget.food,
        transportation: updatedBudget.transportation,
        other: updatedBudget.other,
      })
      toast({ title: "Budget Updated!", description: "Your 'What If' scenario has been applied." });
    }
  };
  
  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-500";
    if (score >= 75) return "text-lime-500";
    if (score >= 50) return "text-yellow-500";
    return "text-rose-500";
  };

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <header className="py-8 px-4 text-center relative">
        <div className="absolute top-4 right-4">
          <ThemeSwitcher />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary font-headline tracking-tight">
          Monthly Muse
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
          Your interactive guide to mastering monthly expenses.
        </p>
      </header>

      <main className="flex-grow container mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-3 space-y-8">
            <Card className="shadow-xl rounded-2xl border-transparent">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Your Finances</CardTitle>
                <CardDescription>
                  Enter your income and adjust expense sliders to see your budget breakdown.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pt-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-6 h-6 text-primary" />
                      <Label htmlFor="income" className="text-lg font-medium tracking-wide">Monthly Income</Label>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="income"
                        type="number"
                        value={income.toString()}
                        onChange={handleIncomeChange}
                        className="w-32 h-11 text-lg font-semibold pl-7 text-right"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-border" />

                {expenseCategories.map(({ id, label, icon, max }) => (
                  <ExpenseInput
                    key={id}
                    id={id}
                    label={label}
                    value={expenses[id]}
                    onValueChange={(value) => handleExpenseChange(id, value)}
                    icon={icon}
                    max={max}
                  />
                ))}
              </CardContent>
            </Card>

            <ScenarioPlanner onScenarioSubmit={handleScenario} />

            <Card className="shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-bold">
                  <Lightbulb className="text-accent" />
                  <span>Smart Savings</span>
                </CardTitle>
                <CardDescription>
                  Get AI-powered tips to reduce your spending. Your insights will appear here.
                </CardDescription>
              </CardHeader>
              <CardContent className="min-h-[250px]">
                {isPending && (
                  <div className="space-y-4 pt-2">
                    <Skeleton className="h-6 w-full rounded-md" />
                    <Skeleton className="h-6 w-4/5 rounded-md" />
                    <Skeleton className="h-6 w-full rounded-md" />
                    <Skeleton className="h-6 w-3/4 rounded-md" />
                  </div>
                )}
                {error && (
                   <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {!isPending && !error && !aiResult && (
                  <div className="text-center text-muted-foreground pt-16">
                    <p>Click the button to get personalized savings tips!</p>
                  </div>
                )}
                {aiResult && aiResult.suggestions.length > 0 && (
                  <ul className="space-y-4 text-sm">
                    {aiResult.suggestions.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="mt-0.5">{suggestionIcons[item.impact]}</div>
                        <div className="flex-1">
                           <p className="font-semibold text-foreground">{item.suggestion}</p>
                           <div className="flex items-center gap-2 mt-1">
                             <Badge variant="secondary">{item.category}</Badge>
                             <Badge variant="outline">{item.impact}</Badge>
                           </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleGetSuggestions}
                  disabled={isPending}
                  className="w-full font-semibold text-base py-6 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg"
                >
                  {isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Generate Insights & Goals Analysis"
                  )}
                </Button>
              </CardFooter>
            </Card>

          </div>

          <div className="lg:col-span-2 space-y-8 lg:sticky lg:top-8">
            <Card className="shadow-xl rounded-2xl bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-center">
                  Your Budget Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <ExpenseChart data={chartData} />
                 <div className="w-full text-center mt-4">
                  <p className="text-sm text-muted-foreground">Remaining Balance</p>
                  <p className="text-4xl font-extrabold text-primary tracking-tighter">
                    {balance.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    out of {income.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0})}
                  </p>
                </div>
              </CardContent>
            </Card>

            <GoalTracker goals={goals} setGoals={setGoals} projections={aiResult?.goalProjections} savings={balance} />

            {aiResult && (
              <>
                <Card className="shadow-xl rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-bold">
                      <ShieldCheck className="text-accent" />
                      <span>Financial Health</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex justify-between items-end mb-1">
                        <Label>Health Score</Label>
                        <span className={`text-2xl font-bold ${getHealthScoreColor(aiResult.financialHealthScore)}`}>{aiResult.financialHealthScore} <span className="text-sm font-normal text-muted-foreground">/ 100</span></span>
                      </div>
                      <Progress value={aiResult.financialHealthScore} className="h-3" indicatorClassName={getHealthScoreColor(aiResult.financialHealthScore).replace('text-','bg-')} />
                      <p className="text-sm text-muted-foreground mt-2">{aiResult.financialAnalysis}</p>
                    </div>

                    {aiResult.achievements.length > 0 && (
                      <div>
                        <Label className="flex items-center gap-2 mb-3">
                          <Award className="w-4 h-4"/>
                          Achievements Unlocked
                        </Label>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          {aiResult.achievements.map((ach, i) => (
                             <div key={i} className="bg-secondary/50 p-3 rounded-lg border border-border">
                                <p className="font-semibold text-secondary-foreground">{ach.name}</p>
                                <p className="text-muted-foreground text-xs">{ach.description}</p>
                             </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {aiResult.suggestedCategory && (
                       <Alert>
                          <Target className="h-4 w-4" />
                          <AlertTitle>Suggestion for 'Other'</AlertTitle>
                          <AlertDescription>
                            Consider creating a new category named <span className="font-semibold text-primary">"{aiResult.suggestedCategory}"</span> to better track your spending.
                          </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                {aiResult.longTermProjections && (
                  <LongTermImpactCard projections={aiResult.longTermProjections} />
                )}

                {aiResult.twelveMonthPlan && aiResult.twelveMonthPlan.length > 0 && (
                  <Card className="shadow-xl rounded-2xl">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-bold">
                           <LineChart className="text-accent" />
                           <span>12-Month Projection</span>
                        </CardTitle>
                        <CardDescription>
                           Your potential savings growth over the next year.
                        </CardDescription>
                     </CardHeader>
                     <CardContent>
                        <ProjectionChart data={aiResult.twelveMonthPlan} />
                     </CardContent>
                  </Card>
                )}
              </>
            )}

          </div>
        </div>
      </main>

      <footer className="text-center p-4 text-sm text-muted-foreground">
        <p>Powered by Monthly Muse</p>
      </footer>
    </div>
  );
}
