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
import { getSuggestions } from "./actions";
import type { Suggestion } from "@/ai/flows/cost-saving-suggestions";
import {
  Car,
  Home as HomeIcon,
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
} from "lucide-react";

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

export default function Home() {
  const [income, setIncome] = useState(5000);
  const [expenses, setExpenses] = useState({
    rent: 1500,
    utilities: 150,
    food: 400,
    transportation: 200,
    other: 300,
  });

  const [isPending, startTransition] = useTransition();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [error, setError] = useState<string | null>(null);

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
    setSuggestions([]);
    startTransition(async () => {
      const result = await getSuggestions({ income, ...expenses });
      if (result.error) {
        setError(result.error);
      } else if (result.suggestions) {
        setSuggestions(result.suggestions);
      }
    });
  };

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <header className="py-8 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary font-headline tracking-tight">
          Monthly Muse
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
          Your interactive guide to mastering monthly expenses.
        </p>
      </header>

      <main className="flex-grow container mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-3">
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

            <Card className="shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-bold">
                  <Lightbulb className="text-accent" />
                  <span>Smart Savings</span>
                </CardTitle>
                <CardDescription>
                  Get AI-powered tips to reduce your spending.
                </CardDescription>
              </CardHeader>
              <CardContent className="min-h-[200px]">
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
                {!isPending && !error && suggestions.length === 0 && (
                  <div className="text-center text-muted-foreground pt-10">
                    <p>Click the button to get personalized savings tips!</p>
                  </div>
                )}
                {!isPending && suggestions.length > 0 && (
                  <ul className="space-y-4 text-sm">
                    {suggestions.map((item, index) => (
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
                    "Generate Suggestions"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      <footer className="text-center p-4 text-sm text-muted-foreground">
        <p>Powered by Monthly Muse</p>
      </footer>
    </div>
  );
}
