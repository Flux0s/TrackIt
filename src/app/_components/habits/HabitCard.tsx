"use client";

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import { Label } from "@components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

// Icons
import { BanIcon, PencilIcon, Trash2Icon } from "lucide-react";

// Utilities and Hooks
import { cn } from "@lib/utils";
import { api, RouterOutputs } from "~/trpc/react";
import { useDateContext } from "./DateContext";
import { useState } from "react";

// Related Components
import { HabitForm } from "./HabitForm";
import { Separator } from "../ui/separator";

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
    deleteHabit({ id: habit.id });
    setShowDeleteDialog(false);
  };

  // Render
  return (
    <>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the habit "{habit.name}" and all its
              steps and completions. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card>
        <CardHeader>
          <CardTitle className="flex flex-row items-center justify-between">
            {isEditing ? "Edit Habit" : habit.name}
            <div className="flex gap-1">
              {isEditing && (
                <Button
                  id={`delete-${habit.id}`}
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDeleteDialog(true)}
                  className="m-0 rounded-full text-destructive hover:text-destructive"
                >
                  <Trash2Icon />
                </Button>
              )}
              <Button
                id={`edit-toggle-${habit.id}`}
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(!isEditing)}
                className={cn(
                  "rounded-full transition-transform duration-200",
                  isEditing && "rotate-90",
                )}
              >
                {isEditing ? (
                  <BanIcon className="m-0 text-destructive" />
                ) : (
                  <PencilIcon className="m-0" />
                )}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <Separator className="my-2" />
        <CardContent className="flex flex-col py-2">
          {isEditing ? (
            <HabitForm habit={habit} onSuccess={() => setIsEditing(false)} />
          ) : (
            <div className="flex flex-col gap-2">
              {habit.steps.map((step) => (
                <StepItem
                  key={step.id}
                  step={step}
                  isCompleted={completions.some((c) => c.stepId === step.id)}
                  onToggle={handleStepToggle}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
