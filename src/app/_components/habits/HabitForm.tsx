"use client";

import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Check, Plus, X } from "lucide-react";

const formSchema = z.object({
  habitName: z.string().min(1, "Habit name is required"),
  steps: z.array(z.string()).max(4),
});

interface HabitFormProps {
  initialHabit?: {
    name: string;
    steps: string[];
  };
  onSubmit: (name: string, steps: string[]) => void;
}

export function HabitForm({ initialHabit, onSubmit }: HabitFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      habitName: initialHabit?.name ?? "",
      steps: initialHabit?.steps ?? [""],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "steps",
    rules: { maxLength: 4 },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const nonEmptySteps = values.steps.filter((step: string) => step.trim() !== "");
    onSubmit(values.habitName, nonEmptySteps);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
        <div className="space-y-2">
          <FormLabel>Steps</FormLabel>
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <FormField
                control={form.control}
                name={`steps.${index}`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder={`Step ${index + 1}`} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={() => {
                  if (fields.length > 1) {
                    remove(index);
                  } else {
                    form.setValue(`steps.${index}`, "");
                  }
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {fields.length < 4 && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => append("")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Step
            </Button>
          )}
        </div>
        <Button type="submit" className="w-full">
          <Check className="text-primary-foreground" />
        </Button>
      </form>
    </Form>
  );
}
