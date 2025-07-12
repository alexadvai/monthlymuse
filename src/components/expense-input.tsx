"use client";

import React from 'react';
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { cn } from '@/lib/utils';

interface ExpenseInputProps {
  id: string;
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  icon: React.ReactNode;
  max?: number;
}

export function ExpenseInput({ id, label, value, onValueChange, icon, max = 5000 }: ExpenseInputProps) {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = event.target.value === '' ? 0 : Number(event.target.value);
    if (!isNaN(numValue)) {
      onValueChange(Math.min(numValue, max)); // Cap value at max
    }
  };

  const handleSliderChange = (values: number[]) => {
    onValueChange(values[0]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon}
          <Label htmlFor={id} className="text-lg font-medium tracking-wide">{label}</Label>
        </div>
        <div className="relative">
           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
           <Input
            id={id}
            type="number"
            value={value.toString()} // Control as string to allow empty input
            onChange={handleInputChange}
            className="w-32 h-11 text-lg font-semibold pl-7 text-right"
            min="0"
            max={max}
          />
        </div>
      </div>
      <Slider
        value={[value]}
        onValueChange={handleSliderChange}
        max={max}
        step={10}
        aria-label={label}
        className="[&>span:first-child]:bg-primary"
      />
    </div>
  );
}
