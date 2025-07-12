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
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExpenseInput } from "@/components/expense-input";
import { getSuggestions } from "./actions";
import {
  Car,
  Home as HomeIcon,
  UtensilsCrossed,
  Zap,
  MoreHorizontal,
  Lightbulb,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface ExpenseCategory {
  id: "rent" | "utilities" | "food" | "transportation" | "other";
  label: string;
  icon: ReactNode;
  max: number;
}

const expenseCategories: ExpenseCategory[] = [
  { id: "rent", label: "Rent/Mortgage", icon: <HomeIcon className="w-6 h-6 text-primary" />, max: 5000 },
  { id: "utilities", label: "Utilities", icon: <Zap className="w-6 h-6 text-primary" />, max: 1000 },
  { id: "food", label: "Food & Groceries", icon: <UtensilsCrossed className="w-6 h-6 text-primary" />, max: 2000 },
  { id: "transportation", label: "Transportation", icon: <Car className="w-6 h-6 text-primary" />, max: 1500 },
  { id: "other", label: "Other", icon: <MoreHorizontal className="w-6 h-6 text-primary" />, max: 2000 },
];

export default function Home() {
  const [expenses, setExpenses] = useState({
    rent: 1500,
    utilities: 150,
    food: 400,
    transportation: 200,
    other: 300,
  });

  const [isPending, startTransition] = useTransition();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const total = useMemo(() => Object.values(expenses).reduce((acc, cur) => acc + cur, 0), [expenses]);

  const handleExpenseChange = (id: keyof typeof expenses, value: number) => {
    setExpenses(prev => ({ ...prev, [id]: value }));
  };

  const handleGetSuggestions = () => {
    setError(null);
    setSuggestions([]);
    startTransition(async () => {
      const result = await getSuggestions(expenses);
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
                <CardTitle className="text-2xl font-bold">Expense Calculator</CardTitle>
                <CardDescription>
                  Adjust sliders or enter amounts to see your total.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pt-2">
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
            <Card className="shadow-xl rounded-2xl text-center bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Total Monthly Cost
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-5xl font-extrabold text-primary tracking-tighter">
                  {total.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </p>
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
              <CardContent className="min-h-[160px]">
                {isPending && (
                  <div className="space-y-3 pt-2">
                    <Skeleton className="h-5 w-full rounded-md" />
                    <Skeleton className="h-5 w-4/5 rounded-md" />
                    <Skeleton className="h-5 w-full rounded-md" />
                    <Skeleton className="h-5 w-3/4 rounded-md" />
                  </div>
                )}
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {!isPending && !error && suggestions.length === 0 && (
                  <div className="text-center text-muted-foreground pt-10">
                    <p>Click the button to get personalized savings tips!</p>
                  </div>
                )}
                {!isPending && suggestions.length > 0 && (
                  <ul className="space-y-3 text-sm">
                    {suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-accent mt-1">&#8226;</span>
                        <span>{suggestion}</span>
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
