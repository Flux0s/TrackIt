"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { Button } from "@ui/button";
import { Ban, Pencil } from "lucide-react";
import { useState } from "react";
import { HabitForm } from "./HabitForm";
import { cn } from "@lib/utils";
import { Checkbox } from "@ui/checkbox";

interface Step {
  name: string;
  completed: boolean;
}

interface HabitCardProps {
  habit: {
    name: string;
    steps: Step[];
  };
  onEdit: (name: string, steps: string[]) => void;
  onToggleStep: (stepIndex: number) => void;
}

export function HabitCard({ habit, onEdit, onToggleStep }: HabitCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (name: string, steps: string[]) => {
    if (name !== habit.name || !steps.every((step, i) => step === habit.steps[i]?.name)) {
      onEdit(name, steps);
    }
    setIsEditing(false);
  };

  return (
    <Card className="h-fit">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>{isEditing ? "Edit" : habit.name}</CardTitle>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsEditing((prev) => !prev)}
          className={cn(
            "transition-transform duration-200",
            isEditing && "rotate-90"
          )}
        >
          {isEditing ? <Ban className="text-destructive" /> : <Pencil />}
        </Button>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <HabitForm
            initialHabit={{
              name: habit.name,
              steps: habit.steps.map(step => step.name),
            }}
            onSubmit={handleSubmit}
          />
        ) : (
          <div className="space-y-2">
            {habit.steps.map((step, index) => (
              <div key={index} className="flex items-center gap-2">
                <Checkbox
                  id={`step-${index}`}
                  checked={step.completed}
                  onCheckedChange={() => onToggleStep(index)}
                />
                <label
                  htmlFor={`step-${index}`}
                  className={cn(
                    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                    step.completed && "line-through opacity-70"
                  )}
                >
                  {step.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
