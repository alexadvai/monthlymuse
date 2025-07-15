"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Landmark } from "lucide-react";
import type { LongTermProjection } from "@/ai/schemas";

interface LongTermImpactCardProps {
  projections: LongTermProjection;
}

export function LongTermImpactCard({ projections }: LongTermImpactCardProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  return (
    <Card className="shadow-xl rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-bold">
          <TrendingUp className="text-accent" />
          <span>Long-Term Impact</span>
        </CardTitle>
        <CardDescription>
          See how your savings could grow or help pay off debt.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Investment Growth Section */}
        <div>
          <h4 className="font-semibold text-md mb-2">Investment Growth</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Your savings could grow significantly over time with compound interest.
          </p>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-secondary/50 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">In 5 Years</p>
              <p className="text-xl font-bold text-primary">{formatCurrency(projections.investment.fiveYear)}</p>
            </div>
            <div className="bg-secondary/50 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">In 10 Years</p>
              <p className="text-xl font-bold text-primary">{formatCurrency(projections.investment.tenYear)}</p>
            </div>
          </div>
        </div>

        {/* Debt Payoff Section */}
        <div>
          <h4 className="font-semibold text-md mb-2 flex items-center gap-2">
            <Landmark className="w-4 h-4" />
            <span>Debt Payoff Accelerator</span>
          </h4>
          <p className="text-sm text-muted-foreground mb-3">
            See how much faster you could pay off a hypothetical <span className="font-bold">{formatCurrency(projections.debtPayoff.amount)}</span> debt.
          </p>
          <div className="flex items-center justify-around text-center">
            <div>
              <p className="text-2xl font-bold">{projections.debtPayoff.originalMonths}</p>
              <p className="text-xs text-muted-foreground">Original Months</p>
            </div>
            <TrendingUp className="w-8 h-8 text-emerald-500" />
            <div>
              <p className="text-2xl font-bold text-emerald-500">{projections.debtPayoff.newMonths}</p>
              <p className="text-xs text-muted-foreground">New Payoff Time</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
