"use client";

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@components/ui/alert-dialog";
import { StepList } from "@components/habits/StepList";

// Icons
import { BanIcon, PencilIcon, Trash2Icon } from "lucide-react";

// Utilities and Hooks
import { cn } from "@lib/utils";
import { api, RouterOutputs } from "~/trpc/react";
import { useState } from "react";

// Related Components
import { HabitForm } from "./HabitForm";
import { Separator } from "../ui/separator";

// Types
interface HabitCardProps {
  habit: RouterOutputs["habit"]["getAll"][0];
  completions: RouterOutputs["habit"]["getCompletions"];
}

/**
 * HabitCard Component
 * Displays a habit with its steps and provides editing functionality
 */
export function HabitCard({ habit, completions }: HabitCardProps) {
  // State
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  // Hooks
  const utils = api.useUtils();

  const { mutate: deleteHabit } = api.habit.delete.useMutation({
    onSuccess: () => {
      void utils.habit.getAll.invalidate();
    },
    onMutate: () => {
      setIsDeleted(true);
    },
    onError: () => {
      setIsDeleted(false);
    },
  });

  const handleDelete = () => {
    deleteHabit({ id: habit.id });
    setShowDeleteDialog(false);
  };

  if (isDeleted) return null;

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
            <StepList habit={habit} completions={completions} />
          )}
        </CardContent>
      </Card>
    </>
  );
}
