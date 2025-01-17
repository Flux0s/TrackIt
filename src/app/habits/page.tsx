"use client";

import { useState } from "react";
import { HabitList } from "@components/habits/HabitList";
import { NewHabitSheet } from "@components/habits/NewHabitSheet";

export default function HabitsPage() {
  const [habits, setHabits] = useState([
    { name: "Read 30 minutes" },
    { name: "Exercise" },
    { name: "Meditate" },
  ]);

  const handleNewHabit = (habitName: string) => {
    setHabits([...habits, { name: habitName }]);
  };

  const handleEditHabit = (index: number, newName: string) => {
    const newHabits = [...habits];
    newHabits[index] = { name: newName };
    setHabits(newHabits);
  };

  return (
    <div className="container mx-auto">
      <HabitList habits={habits} onEditHabit={handleEditHabit} />
      <NewHabitSheet onSubmit={handleNewHabit} />
    </div>
  );
}
