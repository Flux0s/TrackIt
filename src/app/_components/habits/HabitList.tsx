"use client";
import { HabitCard } from "@components/habits/HabitCard";
import { useDateContext } from "@lib/DateContext";
import { api } from "~/trpc/react";

export function HabitList() {
  const { selectedDate } = useDateContext();
  const [habits] = api.habit.getAll.useSuspenseQuery();
  const { data: completions = [] } = api.habit.getCompletions.useQuery({
    date: selectedDate,
  });

  return (
    <div className="xs:grid-cols-2 grid items-start gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
