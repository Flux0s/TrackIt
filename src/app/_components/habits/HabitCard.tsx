"use client";

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import { Label } from "@components/ui/label";

// Icons
import { BanIcon, PencilIcon, Trash2Icon } from "lucide-react";

// Utilities and Hooks
import { cn } from "@lib/utils";
import { api, RouterOutputs } from "~/trpc/react";
import { useDateContext } from "./DateContext";
import { useState } from "react";

// Related Components
import { HabitForm } from "./HabitForm";

// Types
interface HabitCardProps {
  habit: RouterOutputs["habit"]["getAll"][0];
  completions: RouterOutputs["habit"]["getCompletions"];
}

interface StepItemProps {
  step: RouterOutputs["habit"]["getAll"][0]["steps"][0];
  isCompleted: boolean;
  onToggle: (stepId: string) => void;
}

// Step Item Component
function StepItem({ step, isCompleted, onToggle }: StepItemProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={step.id}
        checked={isCompleted}
        onCheckedChange={() => onToggle(step.id)}
      />
      <Label
        htmlFor={step.id}
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          isCompleted && "line-through opacity-70",
        )}
      >
        {step.description}
      </Label>
    </div>
  );
}

/**
 * HabitCard Component
 * Displays a habit with its steps and provides editing functionality
 * Features:
 * - Toggle steps completion status
 * - Edit habit name and steps
 */
export function HabitCard({ habit, completions }: HabitCardProps) {
  // State
  const [isEditing, setIsEditing] = useState(false);

  // Hooks
  const utils = api.useUtils();
  const { selectedDate } = useDateContext();

  // Mutations
  const { mutate: toggleStep } = api.habit.toggleStep.useMutation({
    onSuccess: () => {
      void utils.habit.getCompletions.invalidate({
        date: selectedDate,
      });
    },
  });

  const { mutate: deleteHabit } = api.habit.delete.useMutation({
    onSuccess: () => {
      void utils.habit.getAll.invalidate();
    },
  });

  // Event Handlers
  const handleStepToggle = (stepId: string) => {
    toggleStep({
      stepId,
      date: selectedDate,
    });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this habit?")) {
      deleteHabit({ id: habit.id });
    }
  };

  // Render edit form if in edit mode
  if (isEditing) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Edit Habit</CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="rounded-full text-destructive hover:text-destructive"
            >
              <Trash2Icon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(false)}
              className={cn(
                "rounded-full",
                "transition-transform duration-200",
                isEditing && "rotate-90",
              )}
            >
              <BanIcon className="text-destructive" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <HabitForm habit={habit} onSuccess={() => setIsEditing(false)} />
        </CardContent>
      </Card>
    );
  }

  // Render normal view
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{habit.name}</CardTitle>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
            className="rounded-full"
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {habit.steps.map((step) => (
            <StepItem
              key={step.id}
              step={step}
              isCompleted={completions.some(
                (completion) => completion.stepId === step.id,
              )}
              onToggle={handleStepToggle}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
