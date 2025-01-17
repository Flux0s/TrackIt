"use client";

import { Button } from "@ui/button";
import { Plus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@ui/sheet";
import { useState } from "react";
import { HabitForm } from "@components/habits/HabitForm";

interface NewHabitSheetProps {
  onSubmit: (habitName: string) => void;
}

export function NewHabitSheet({ onSubmit }: NewHabitSheetProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (habitName: string) => {
    onSubmit(habitName);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <Button
        size="lg"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full p-0 shadow-lg hover:shadow-xl"
        onClick={() => setIsOpen(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create New Habit</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <HabitForm
            mode="create"
            onSubmit={handleSubmit}
            onCancel={() => setIsOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
