import { Button } from "@ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@ui/separator";
import { HabitList } from "@components/HabitList";

export default function HabitsPage() {
  const sampleHabits = [
    { name: "Read 30 minutes" },
    { name: "Exercise" },
    { name: "Meditate" },
  ];

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between px-4 py-2">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Habits
        </h1>
        <Button className="rounded-full">
          New Habit
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <HabitList habits={sampleHabits} />
    </div>
  );
}
