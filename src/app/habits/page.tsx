"use client";

import { useState } from "react";
import { Separator } from "@ui/separator";
import { HabitList } from "@components/HabitList";
import { NewHabitForm } from "@components/NewHabitForm";

export default function HabitsPage() {
  const [habits, setHabits] = useState([
    { name: "Read 30 minutes" },
    { name: "Exercise" },
    { name: "Meditate" },
  ]);

  const handleNewHabit = (habitName: string) => {
    setHabits([...habits, { name: habitName }]);
  };

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between px-4 py-2">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Habits
        </h1>
        <NewHabitForm onSubmit={handleNewHabit} />
      </div>
      <Separator />
      <HabitList habits={habits} />
    </div>
  );
}
