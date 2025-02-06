// Enable client-side functionality
"use client";

// Import UI components and utilities
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import { Label } from "@components/ui/label";
import { api, RouterOutputs } from "~/trpc/react";
import { HabitForm } from "./HabitForm";
import { BanIcon, PencilIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@lib/utils";
// Props interface for the HabitCard component
interface HabitCardProps {
  habit: RouterOutputs["habit"]["getAll"][0];
  completions: RouterOutputs["habit"]["getCompletions"];
}

/**
 * HabitCard Component
 * Displays a habit with its steps and provides editing functionality
 * Features:
 * - Toggle steps completion status
 * - Edit habit name and steps
 */
export function HabitCard({ habit, completions }: HabitCardProps) {
  // State to control the edit mode of the card
  const [isEditing, setIsEditing] = useState(false);
  // Get TRPC utilities for cache invalidation
  const utils = api.useUtils();
  const date = new Date();

  // Mutation hook for toggling step completion status
  const { mutate: toggleStep } = api.habit.toggleStep.useMutation({
    onSuccess: () => {
      // Invalidate the completions cache to trigger a refresh
      void utils.habit.getCompletions.invalidate({
        date,
      });
    },
  });

  // Handler for checkbox change
  const handleStepToggle = (stepId: string) => {
    toggleStep({
      stepId,
      date,
    });
  };

  // Handler for form submission when editing habit
  const handleEditSubmit = (name: string, steps: string[]) => {
    setIsEditing(false);
    // TODO: Implement edit functionality
  };

  return (
    <Card>
      {/* Card header with habit name and edit button */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">{habit.name}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsEditing(!isEditing)}
          className={cn(
            "rounded-full",
            "transition-transform duration-200",
            isEditing && "rotate-90", // Rotate button when in edit mode
          )}
        >
          {isEditing ? (
            <BanIcon className="text-destructive" />
          ) : (
            <PencilIcon />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {
          // Render either the edit form or the list of steps
          isEditing ? (
            <HabitForm
              initialHabit={{
                name: habit.name,
                steps: habit.steps.map((step) => step.description),
              }}
              onSubmit={handleEditSubmit}
            />
          ) : (
            // Display list of steps with checkboxes
            <div className="space-y-2">
              {habit.steps.map((step) => {
                const isCompleted = completions.find(
                  (completion) => completion.stepId === step.id,
                )
                  ? true
                  : false;
                return (
                  <div key={step.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={step.id}
                      checked={isCompleted}
                      onCheckedChange={() => handleStepToggle(step.id)}
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
              })}
            </div>
          )
        }
      </CardContent>
    </Card>
  );
}
