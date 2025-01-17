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

interface NewHabitSheetProps {
  onSubmit: (name: string, steps: string[]) => void;
}

export function NewHabitSheet({ onSubmit }: NewHabitSheetProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (name: string, steps: string[]) => {
    onSubmit(name, steps);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full p-0 shadow-lg hover:shadow-xl"
        onClick={() => setIsOpen(true)}
      >
        <Plus size={24} />
      </Button>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New Habit</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <HabitForm onSubmit={handleSubmit} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
