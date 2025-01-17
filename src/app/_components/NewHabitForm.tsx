"use client";

import { useState } from "react";
import { Button } from "@ui/button";
import { Plus, Minus } from "lucide-react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/form";
import { Input } from "@ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@ui/sheet";

const formSchema = z.object({
  habitName: z.string().min(1, { message: "Habit name is required" }).max(100, {
    message: "Habit name must be less than 100 characters",
  }),
});

interface NewHabitFormProps {
  onSubmit?: (habitName: string) => void;
}

export function NewHabitForm({ onSubmit }: NewHabitFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      habitName: "",
    },
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (values.habitName.trim()) {
      onSubmit?.(values.habitName.trim());
      form.reset();
      setIsOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <Button
        size="lg"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full p-0 shadow-lg hover:shadow-xl"
        onClick={() => setIsOpen(true)}
      >
        <Plus size={24} />
      </Button>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create New Habit</SheetTitle>
          <SheetDescription>
            Add a new habit to track your progress
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="habitName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Habit</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter habit name..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Add Habit
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
