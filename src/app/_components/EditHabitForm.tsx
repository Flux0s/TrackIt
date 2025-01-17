"use client";

import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { X, Check } from "lucide-react";

const formSchema = z.object({
  habitName: z.string().min(1, "Habit name is required"),
});

interface EditHabitFormProps {
  habit: { name: string };
  onCancel: () => void;
  onSubmit?: (habitName: string) => void;
}

export function EditHabitForm({ habit, onCancel, onSubmit }: EditHabitFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      habitName: habit.name,
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit?.(values.habitName);
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
              <FormLabel>Habit Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter habit name..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onCancel}
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            type="submit"
            variant="ghost"
            size="icon"
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
