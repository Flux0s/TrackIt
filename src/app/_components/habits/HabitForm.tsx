"use client";

import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Check } from "lucide-react";

const formSchema = z.object({
  habitName: z.string().min(1, "Habit name is required"),
});

interface HabitFormProps {
  initialHabit?: { name: string };
  onSubmit: (name: string) => void;
}

export function HabitForm({ initialHabit, onSubmit }: HabitFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      habitName: initialHabit?.name ?? "",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values.habitName);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="habitName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter habit name..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <Button type="submit" className="mt-4 w-full">
            <Check className="text-primary-foreground" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
