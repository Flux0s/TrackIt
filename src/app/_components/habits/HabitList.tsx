"use client";
import { HabitCard } from "./HabitCard";
import { api } from "~/trpc/react";

export function HabitList() {
  const [habits] = api.habit.getAll.useSuspenseQuery();
  return (
    <div className="grid items-start gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
      {habits.map((habit) => (
        <HabitCard key={habit.id} habit={habit} />
      ))}
    </div>
  );
}
