"use client";

import { HabitCard } from "@components/habits/HabitCard";
import { useDateContext } from "@lib/DateContext";
import { api } from "~/trpc/react";
import { useState } from "react";
import { Button } from "@ui/button";
import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";

export function HabitList() {
  const { selectedDate } = useDateContext();
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [habits] = api.habit.getAll.useSuspenseQuery(
    sortDirection ? { sortBy: "name", sortDirection } : undefined,
  );

  const { data: completions = [] } = api.habit.getCompletions.useQuery({
    date: selectedDate,
  });

  const toggleSort = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end px-4">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleSort}
          className="gap-2"
        >
          {sortDirection === "asc" ? (
            <>
              <ArrowDownAZ className="h-4 w-4" />
              Sort A to Z
            </>
          ) : (
            <>
              <ArrowUpAZ className="h-4 w-4" />
              Sort Z to A
            </>
          )}
        </Button>
      </div>
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
    </div>
  );
}
