"use client";
import { HabitCard } from "./HabitCard";
import { api } from "~/trpc/react";
import { useDateContext } from "./DateContext";

export function HabitList() {
  const { selectedDate } = useDateContext();
  const [habits] = api.habit.getAll.useSuspenseQuery();
  const { data: completions = [] } = api.habit.getCompletions.useQuery({
    date: selectedDate,
  });

  return (
    <div className="grid items-start gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
      {habits.map((habit) => {
        const habitCompletions = completions.filter(
          (completion) => completion.habitId === habit.id,
        );
        return (
          <HabitCard
            key={habit.id}
            habit={habit}
            completions={habitCompletions}
          />
        );
      })}
    </div>
  );
}
