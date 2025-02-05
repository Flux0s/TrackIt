"use client";

import { useState } from "react";
import { Button } from "@ui/button";
import { Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@ui/sheet";
import { HabitForm } from "./HabitForm";
import { api } from "~/trpc/react";

export function NewHabitSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const utils = api.useUtils();
  const { mutate: createHabit } = api.habit.create.useMutation({
    onSuccess: () => {
      utils.habit.getAll.invalidate();
      setIsOpen(false);
    },
  });

  const handleSubmit = (name: string, steps: string[]) => {
    createHabit({
      name,
      steps: steps.map(description => ({ description })),
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full p-0 shadow-lg hover:shadow-xl"
        onClick={() => setIsOpen(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New Habit</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <HabitForm onSubmit={handleSubmit} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
