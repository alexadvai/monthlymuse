"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Wand2, Loader2 } from "lucide-react";

interface ScenarioPlannerProps {
  onScenarioSubmit: (query: string) => Promise<void>;
}

export function ScenarioPlanner({ onScenarioSubmit }: ScenarioPlannerProps) {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (!query.trim()) return;
    startTransition(async () => {
      await onScenarioSubmit(query);
      setQuery("");
    });
  };

  return (
    <Card className="shadow-xl rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-bold">
          <Wand2 className="text-accent" />
          <span>"What If?" Scenarios</span>
        </CardTitle>
        <CardDescription>
          Ask the AI to adjust your budget. Try: "Lower my food spending by $50"
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Type your scenario here..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isPending}
        />
        <Button onClick={handleSubmit} disabled={isPending || !query} className="w-full">
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Apply Scenario"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
