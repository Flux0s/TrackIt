import { NewHabitSheet } from "@components/habits/NewHabitSheet";
import { api, HydrateClient } from "~/trpc/server";
import { Suspense } from "react";
import { HabitListSkeleton } from "@components/habits/HabitListSkeleton";
import { HabitList } from "@components/habits/HabitList";

export default async function HabitsPage() {
  // Prefetch both queries
  void api.habit.getAll.prefetch();

  return (
    <div className="container mx-auto py-8">
      <HydrateClient>
        <Suspense fallback={<HabitListSkeleton />}>
          <HabitList />
        </Suspense>
        <NewHabitSheet />
      </HydrateClient>
    </div>
  );
}
