"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { X, Plus, Target, PiggyBank } from "lucide-react";
import type { Goal, GoalProjection } from "@/ai/schemas";

interface GoalTrackerProps {
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  projections: GoalProjection[] | undefined;
  savings: number;
}

export function GoalTracker({ goals, setGoals, projections, savings }: GoalTrackerProps) {
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalAmount, setNewGoalAmount] = useState("");

  const addGoal = () => {
    if (newGoalName.trim() && parseFloat(newGoalAmount) > 0) {
      const newGoal: Goal = {
        id: new Date().getTime().toString(),
        name: newGoalName,
        amount: parseFloat(newGoalAmount),
      };
      setGoals([...goals, newGoal]);
      setNewGoalName("");
      setNewGoalAmount("");
    }
  };

  const removeGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const getProjectionForGoal = (goalId: string) => {
    return projections?.find(p => p.goalId === goalId);
  }

  return (
    <Card className="shadow-xl rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-bold">
          <Target className="text-accent" />
          <span>Financial Goals</span>
        </CardTitle>
        <CardDescription>
          Add and track your financial goals. Get an analysis after generating insights.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map(goal => {
          const projection = getProjectionForGoal(goal.id);
          const progress = savings > 0 ? (savings / goal.amount) * 100 : 0; // Simplified progress
          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">{goal.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {goal.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeGoal(goal.id)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {projection && savings > 0 && (
                <p className="text-xs text-muted-foreground">
                  Est. <span className="font-semibold text-primary">{projection.monthsToReach} months</span> to reach with current savings.
                </p>
              )}
               {projection && savings <= 0 && (
                <p className="text-xs text-rose-500">
                  You need positive savings to make progress on this goal.
                </p>
              )}
            </div>
          );
        })}
        {goals.length === 0 && (
          <div className="text-center text-muted-foreground py-4">
            <PiggyBank className="mx-auto h-8 w-8 mb-2" />
            <p>You haven't added any goals yet.</p>
          </div>
        )}
        <div className="flex items-end gap-2 pt-4 border-t">
          <div className="grid gap-1.5 flex-grow">
            <Label htmlFor="goal-name" className="text-xs">Goal Name</Label>
            <Input id="goal-name" placeholder="e.g., Vacation Fund" value={newGoalName} onChange={e => setNewGoalName(e.target.value)} />
          </div>
          <div className="grid gap-1.5 w-28">
            <Label htmlFor="goal-amount" className="text-xs">Amount</Label>
            <Input id="goal-amount" type="number" placeholder="1000" value={newGoalAmount} onChange={e => setNewGoalAmount(e.target.value)} />
          </div>
          <Button onClick={addGoal} size="icon" disabled={!newGoalName || !newGoalAmount}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
