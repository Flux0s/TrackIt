import { HabitCard } from "@components/habits/HabitCard";
import { NewHabitSheet } from "@components/habits/NewHabitSheet";
import { api } from "~/trpc/server";
import { HydrateClient } from "~/trpc/server";
import { Suspense } from "react";

function HabitListSkeleton() {
  return (
    <div className="grid items-start gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-48 animate-pulse rounded-lg bg-muted" />
      ))}
    </div>
  );
}

export default async function HabitsPage() {
  const habits = await api.habit.getAll();
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <Suspense fallback={<HabitListSkeleton />}>
          <div className="grid items-start gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
            {habits.map((habit) => (
              <HydrateClient key={habit.id}>
                <HabitCard habit={habit} />
              </HydrateClient>
            ))}
          </div>
        </Suspense>
        <HydrateClient>
          <NewHabitSheet />
        </HydrateClient>
      </div>
    </div>
  );
}
