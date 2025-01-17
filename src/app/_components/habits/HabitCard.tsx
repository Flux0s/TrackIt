"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { Button } from "@ui/button";
import { Ban, Pencil } from "lucide-react";
import { useState } from "react";
import { HabitForm } from "./HabitForm";
import { cn } from "@lib/utils";

interface HabitCardProps {
  habit: {
    name: string;
  };
  onEdit: (newName: string) => void;
}

export function HabitCard({ habit, onEdit }: HabitCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (newName: string) => {
    if (newName !== habit.name) {
      onEdit(newName);
    }
    setIsEditing(false);
  };

  return (
    <Card className="h-fit">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>{isEditing ? "Edit" : habit.name}</CardTitle>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsEditing((prev) => !prev)}
          className={cn(
            "transition-transform duration-200",
            isEditing && "rotate-90"
          )}
        >
          {isEditing ? <Ban className="text-destructive" /> : <Pencil />}
        </Button>
      </CardHeader>
      <CardContent>
        {isEditing && (
          <HabitForm initialHabit={habit} onSubmit={handleSubmit} />
        )}
      </CardContent>
    </Card>
  );
}
