"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import type { IncomeSuggestion } from "@/ai/schemas";

interface IncomeSuggestionsCardProps {
  suggestions: IncomeSuggestion[];
}

export function IncomeSuggestionsCard({ suggestions }: IncomeSuggestionsCardProps) {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-xl rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-bold">
          <Briefcase className="text-accent" />
          <span>Income Growth Ideas</span>
        </CardTitle>
        <CardDescription>
          A few ideas to potentially boost your monthly income.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((item, index) => (
          <div key={index} className="bg-secondary/50 p-3 rounded-lg border border-border">
            <h4 className="font-semibold text-md text-secondary-foreground">{item.title}</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {item.description}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
