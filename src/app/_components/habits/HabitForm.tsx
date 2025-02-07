"use client";

// UI Components
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/form";

// Icons
import { Check, Plus, X } from "lucide-react";

// Form Validation
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, Control } from "react-hook-form";
import * as z from "zod";
import { api, type RouterOutputs } from "~/trpc/react";

// Types
interface HabitFormProps {
  habit?: RouterOutputs["habit"]["getAll"][0] | undefined;
  onSuccess: () => void;
}

// Form Schema
const formSchema = z.object({
  habitName: z.string().min(1, "Habit name is required"),
  steps: z
    .array(
      z.object({
        description: z.string().min(1, "Step description is required"),
      }),
    )
    .min(1, "At least one step is required")
    .max(4, "Maximum 4 steps allowed"),
});

type FormValues = z.infer<typeof formSchema>;

// Step Field Component
function StepField({
  index,
  control,
  onRemove,
}: {
  index: number;
  control: Control<FormValues>;
  onRemove: () => void;
}) {
  return (
    <div className="flex gap-2">
      <FormField
        control={control}
        name={`steps.${index}.description`}
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
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

/**
 * HabitForm Component
 * A form for creating or editing habits with steps
 * Features:
 * - Add/edit habit name
 * - Add/remove/edit steps (max 4)
 * - Form validation
 */
export function HabitForm({ habit, onSuccess }: HabitFormProps) {
  const utils = api.useUtils();
  // Mutations
  const { mutate: upsertHabit } = api.habit.upsert.useMutation({
    onSuccess: () => {
      void utils.habit.getAll.invalidate();
      onSuccess();
    },
  });

  // Form Setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      habitName: habit?.name ?? "",
      steps: habit?.steps.map((step) => ({
        description: step.description,
      })) ?? [{ description: "" }],
    },
  });

  // Field Array for Dynamic Steps
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "steps",
    rules: { maxLength: 4 },
  });

  // Event Handlers
  const handleStepRemove = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    } else {
      form.setValue(`steps.${index}.description`, "");
    }
  };

  const handleSubmit = (values: FormValues) => {
    const nonEmptySteps = values.steps.filter(
      (step) => step.description.trim() !== "",
    );

    upsertHabit({
      id: habit?.id,
      name: values.habitName,
      steps: nonEmptySteps,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Habit Name Field */}
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

        {/* Steps Section */}
        <div className="space-y-2">
          <FormLabel>Steps</FormLabel>
          {fields.map((field, index) => (
            <StepField
              key={field.id}
              index={index}
              control={form.control}
              onRemove={() => handleStepRemove(index)}
            />
          ))}

          {/* Add Step Button */}
          {fields.length < 4 && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => append({ description: "" })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Step
            </Button>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          <Check className="mr-2 h-4 w-4" />
          {habit ? "Save Changes" : "Create Habit"}
        </Button>
      </form>
    </Form>
  );
}
