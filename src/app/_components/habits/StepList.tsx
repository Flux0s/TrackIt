"use client";

// UI Components
import { Checkbox } from "@components/ui/checkbox";
import { Label } from "@components/ui/label";
import { Skeleton } from "@components/ui/skeleton";

// Utilities and Hooks
import { cn } from "@lib/utils";
import { useEffect, useState } from "react";
import { api, RouterOutputs } from "~/trpc/react";
import { useDateContext } from "~/app/_components/lib/DateContext";

// Types
interface StepItemProps {
  step: RouterOutputs["habit"]["getAll"][0]["steps"][0];
  isCompleted: boolean;
  onToggle: (stepId: string) => void;
}

interface StepListProps {
  habit: RouterOutputs["habit"]["getAll"][0];
  completions: RouterOutputs["habit"]["getCompletions"];
}

/**
 * StepItem Component
 * Renders a single step with a checkbox and label
 */
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
 * Loading skeleton for a single step item
 */
function StepItemSkeleton() {
  return (
    <div className="flex items-center space-x-2">
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
}

/**
 * StepList Component
 * Displays a list of steps for a habit with completion status
 * Handles optimistic updates when toggling step completion
 */
export function StepList({ habit, completions }: StepListProps) {
  // State
  const [optimisticCompletions, setOptimisticCompletions] =
    useState(completions);

  // Hooks
  const { selectedDate } = useDateContext();
  const utils = api.useUtils();

  // Update optimistic completions when actual completions change
  useEffect(() => {
    setOptimisticCompletions(completions);
  }, [completions]);

  // Mutations
  const { mutate: toggleStep } = api.habit.toggleStep.useMutation({
    onSuccess: () => {
      void utils.habit.getCompletions.invalidate({
        date: selectedDate,
      });
    },
    onMutate: async ({ stepId }) => {
      // Cancel any outgoing refetches
      await utils.habit.getCompletions.cancel({ date: selectedDate });

      // Optimistically update the local state
      setOptimisticCompletions((old) => {
        const isCompleted = old.some((c) => c.stepId === stepId);
        if (isCompleted) {
          // Remove completion if step was completed
          return old.filter((c) => c.stepId !== stepId);
        } else {
          // Add completion if step was not completed
          return [
            ...old,
            {
              stepId,
              date: selectedDate,
              habitId: habit.id,
              id: `${stepId + habit.id}`,
              createdAt: new Date(),
            },
          ];
        }
      });

      // Return context for rollback on error
      return { prevCompletions: completions };
    },
    onError: (_err, _vars, context) => {
      // Restore the completions if the mutation fails
      if (context?.prevCompletions) {
        setOptimisticCompletions(context.prevCompletions);
      }
    },
  });

  // Event Handlers
  const handleStepToggle = (stepId: string) => {
    toggleStep({
      stepId,
      date: selectedDate,
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {habit.steps.map((step) => (
        <StepItem
          key={step.id}
          step={step}
          isCompleted={optimisticCompletions.some((c) => c.stepId === step.id)}
          onToggle={handleStepToggle}
        />
      ))}
    </div>
  );
}

/**
 * Loading state for the entire steps list
 */
export function StepListSkeleton({ habit }: { habit: StepListProps["habit"] }) {
  return (
    <div className="flex flex-col gap-2">
      {habit.steps.map((step) => (
        <StepItemSkeleton key={step.id} />
      ))}
    </div>
  );
}
