"use client";

import { HabitCard } from "@components/habits/HabitCard";
import { useDateContext } from "@lib/DateContext";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import { Button } from "@ui/button";
import {
  ArrowDownWideNarrowIcon,
  ArrowUpNarrowWideIcon,
  ArrowUpDown,
  ALargeSmallIcon,
  CalendarPlusIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import { type z } from "zod";
import { sortSchema } from "~/server/api/routers/habit";

type SortField = z.infer<typeof sortSchema.sortBy>;
type SortDirection = z.infer<typeof sortSchema.sortDirection>;

export function HabitList() {
  const { selectedDate } = useDateContext();
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection | null>(
    null,
  );

  // Initialize sort state on client side only
  useEffect(() => {
    setSortField("createdAt");
    setSortDirection("desc");
  }, []);

  const [habits] = api.habit.getAll.useSuspenseQuery(
    sortField && sortDirection
      ? { sortBy: sortField, sortDirection }
      : undefined,
  );

  const { data: completions = [] } = api.habit.getCompletions.useQuery({
    date: selectedDate,
  });

  const toggleDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const getSortIcon = () => {
    return sortDirection === "asc" ? (
      <ArrowDownWideNarrowIcon className="h-4 w-4" />
    ) : (
      <ArrowUpNarrowWideIcon className="h-4 w-4" />
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2 px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowUpDown className="h-4 w-4" />
              Sort by: {sortField === "name" ? "Name" : "Date Created"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSortField("name")}>
              <ALargeSmallIcon className="mr-2 h-4 w-4" />
              Name
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortField("createdAt")}>
              <CalendarPlusIcon className="mr-2 h-4 w-4" />
              Date Created
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleDirection}
          className="w-10"
        >
          {getSortIcon()}
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
