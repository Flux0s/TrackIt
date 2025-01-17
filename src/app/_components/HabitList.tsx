import { Card, CardContent, CardHeader, CardTitle } from "@ui/card"

interface Habit {
  name: string;
}

interface HabitListProps {
  habits: Habit[];
}

export function HabitList({ habits = [] }: HabitListProps) {
  return (
    <div className="grid gap-4 p-4">
      {habits.map((habit, index) => (
        <Card key={index} className="w-full">
          <CardHeader>
            <CardTitle>{habit.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* We'll add more content here later */}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
