import { Card, CardContent, CardHeader, CardTitle } from "@ui/card"
import { Button } from "@ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { HabitForm } from "./HabitForm";

interface Habit {
  name: string;
}

interface HabitListProps {
  habits: Habit[];
  onEditHabit?: (index: number, newName: string) => void;
}

export function HabitList({ habits = [], onEditHabit }: HabitListProps) {
  const [editingHabitIndex, setEditingHabitIndex] = useState<number | null>(null);

  return (
    <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3 items-start">
      {habits.map((habit, index) => (
        <Card key={index} className="h-fit">
          {editingHabitIndex === index ? (
            <CardContent className="pt-6">
              <HabitForm
                mode="edit"
                initialHabit={habit}
                onCancel={() => setEditingHabitIndex(null)}
                onSubmit={(newName) => {
                  onEditHabit?.(index, newName);
                  setEditingHabitIndex(null);
                }}
              />
            </CardContent>
          ) : (
            <>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>{habit.name}</CardTitle>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setEditingHabitIndex(index)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {/* We'll add more content here later */}
              </CardContent>
            </>
          )}
        </Card>
      ))}
    </div>
  );
}
