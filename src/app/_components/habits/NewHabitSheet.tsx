"use client";

import { useState } from "react";
import { Button } from "@ui/button";
import { Plus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@ui/sheet";
import { HabitForm } from "@components/habits/HabitForm";

export function NewHabitSheet() {
  const [isOpen, setIsOpen] = useState(false);
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
          <HabitForm onSuccess={() => setIsOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
