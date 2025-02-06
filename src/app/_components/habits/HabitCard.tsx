// Enable client-side functionality
"use client";

// Import UI components and utilities
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { Button } from "@ui/button";
import { Ban, Pencil } from "lucide-react";
import { useState } from "react";
import { HabitForm } from "./HabitForm";
import { cn } from "@lib/utils";
import { Checkbox } from "@ui/checkbox";
import { RouterOutputs, api } from "~/trpc/react";
import { Label } from "../ui/label";

// Define the Habit type using the API response type
type Habit = RouterOutputs["habit"]["getAll"][0];

// Props interface for the HabitCard component
interface HabitCardProps {
  habit: Habit;
}

/**
 * HabitCard Component
 * Displays a habit with its steps and provides editing functionality
 * Features:
 * - Toggle steps completion status
 * - Edit habit name and steps
 * - Responsive UI with animations
 */
export function HabitCard({ habit }: HabitCardProps) {
  // State to control the edit mode of the card
  const [isEditing, setIsEditing] = useState(false);
  // Get TRPC utilities for cache invalidation
  const utils = api.useUtils();

  // Mutation hook for toggling step completion status
  const { mutate: toggleStep } = api.habit.toggleStep.useMutation({
    onSuccess: () => {
      // Invalidate the habits cache to trigger a refresh
      utils.habit.getAll.invalidate();
    },
  });

  // Handler for form submission when editing habit
  const handleSubmit = (name: string, steps: string[]) => {
    setIsEditing(false);
    // TODO: Implement edit functionality
  };

  // Handler for toggling step completion status
  const handleToggleStep = (stepId: string) => {
    toggleStep({
      stepId,
      date: new Date(),
    });
  };

  return (
    <Card>
      {/* Card header with habit name and edit button */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 py-4">
        <CardTitle>{isEditing ? "Edit" : habit.name}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsEditing((prev) => !prev)}
          className={cn(
            "rounded-fulltransition-transform duration-200",
            isEditing && "rotate-90", // Rotate button when in edit mode
          )}
        >
          {isEditing ? <Ban className="text-destructive" /> : <Pencil />}
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
              onSubmit={handleSubmit}
            />
          ) : (
            // Display list of steps with checkboxes
            <div className="space-y-2">
              {habit.steps.map((step) => {
                const isCompleted = step.completions.length > 0;
                return (
                  <div key={step.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={step.id}
                      checked={isCompleted}
                      onCheckedChange={() => handleToggleStep(step.id)}
                    />
                    <Label
                      htmlFor={step.id}
                      className={cn(
                        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                        isCompleted && "line-through opacity-70", // Style completed steps
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
