"use client";

import { useState } from "react";
import { HabitList } from "@components/habits/HabitList";
import { NewHabitSheet } from "@components/habits/NewHabitSheet";

interface Step {
  name: string;
  completed: boolean;
}

interface Habit {
  name: string;
  steps: Step[];
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([
    {
      name: "Read 30 minutes",
      steps: [
        { name: "Get book", completed: false },
        { name: "Find quiet spot", completed: false },
        { name: "Read", completed: false },
      ],
    },
    {
      name: "Exercise",
      steps: [
        { name: "Change clothes", completed: false },
        { name: "Warm up", completed: false },
        { name: "Work out", completed: false },
        { name: "Cool down", completed: false },
      ],
    },
    {
      name: "Meditate",
      steps: [
        { name: "Find quiet spot", completed: false },
        { name: "Set timer", completed: false },
        { name: "Focus on breath", completed: false },
      ],
    },
  ]);

  const handleNewHabit = (name: string, steps: string[]) => {
    setHabits([
      ...habits,
      {
        name,
        steps: steps.map(step => ({ name: step, completed: false })),
      },
    ]);
  };

  const handleEditHabit = (index: number, name: string, steps: string[]) => {
    const newHabits = [...habits];
    newHabits[index] = {
      name,
      steps: steps.map(step => ({ name: step, completed: false })),
    };
    setHabits(newHabits);
  };

  const handleToggleStep = (habitIndex: number, stepIndex: number) => {
    const newHabits = [...habits];
    newHabits[habitIndex] = {
      ...habits[habitIndex],
      steps: habits[habitIndex].steps.map((step, i) =>
        i === stepIndex ? { ...step, completed: !step.completed } : step
      ),
    };
    setHabits(newHabits);
  };

  return (
    <div className="container mx-auto">
      <NewHabitSheet onSubmit={handleNewHabit} />
      <HabitList
        habits={habits}
        onEditHabit={handleEditHabit}
        onToggleStep={handleToggleStep}
      />
    </div>
  );
}
