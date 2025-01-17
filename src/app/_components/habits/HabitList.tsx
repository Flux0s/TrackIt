"use client";

import { HabitCard } from "./HabitCard";

interface Step {
  name: string;
  completed: boolean;
}

interface Habit {
  name: string;
  steps: Step[];
}

interface HabitListProps {
  habits: Habit[];
  onEditHabit?: (index: number, name: string, steps: string[]) => void;
  onToggleStep?: (habitIndex: number, stepIndex: number) => void;
}

export function HabitList({ habits = [], onEditHabit, onToggleStep }: HabitListProps) {
  return (
    <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3 items-start">
      {habits.map((habit, index) => (
        <HabitCard
          key={index}
          habit={habit}
          onEdit={(name, steps) => onEditHabit?.(index, name, steps)}
          onToggleStep={(stepIndex) => onToggleStep?.(index, stepIndex)}
        />
      ))}
    </div>
  );
}
