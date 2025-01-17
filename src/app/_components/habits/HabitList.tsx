"use client";

import { HabitCard } from "./HabitCard";

interface Habit {
  name: string;
}

interface HabitListProps {
  habits: Habit[];
  onEditHabit?: (index: number, newName: string) => void;
}

export function HabitList({ habits = [], onEditHabit }: HabitListProps) {
  return (
    <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3 items-start">
      {habits.map((habit, index) => (
        <HabitCard
          key={index}
          habit={habit}
          onEdit={(newName) => onEditHabit?.(index, newName)}
        />
      ))}
    </div>
  );
}
