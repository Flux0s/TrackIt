import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const sortSchema = {
  sortBy: z.enum(["name", "createdAt"]),
  sortDirection: z.enum(["asc", "desc"]),
} as const;

export const habitRouter = createTRPCRouter({
  upsert: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        name: z.string().min(1),
        steps: z
          .array(
            z.object({
              description: z.string().min(1),
            }),
          )
          .min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // If id is provided, verify the habit belongs to the user
      if (input.id) {
        const existingHabit = await ctx.db.habit.findFirst({
          where: {
            id: input.id,
            createdById: ctx.session.user.id,
          },
        });

        if (!existingHabit) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Habit not found",
          });
        }

        // Update existing habit
        return ctx.db.habit.update({
          where: { id: input.id },
          data: {
            name: input.name,
            steps: {
              deleteMany: {}, // Remove all existing steps
              create: input.steps.map((step, index) => ({
                description: step.description,
                order: index,
              })),
            },
          },
          include: {
            steps: {
              orderBy: {
                order: "asc",
              },
            },
          },
        });
      }

      // Create new habit
      return ctx.db.habit.create({
        data: {
          name: input.name,
          createdBy: { connect: { id: ctx.session.user.id } },
          steps: {
            create: input.steps.map((step, index) => ({
              description: step.description,
              order: index,
            })),
          },
        },
        include: {
          steps: {
            orderBy: {
              order: "asc",
            },
          },
        },
      });
    }),

  getAll: protectedProcedure
    .input(
      z.object({
        sortBy: sortSchema.sortBy.optional().default("createdAt"),
        sortDirection: sortSchema.sortDirection.optional().default("desc"),
      }).optional(),
    )
    .query(async ({ ctx, input }) => {
      const habits = await ctx.db.habit.findMany({
        where: { createdById: ctx.session.user.id },
        orderBy: { [input?.sortBy ?? "createdAt"]: input?.sortDirection ?? "desc" },
        include: {
          steps: {
            orderBy: {
              order: "asc",
            },
          },
        },
      });

      return habits;
    }),

  getCompletions: protectedProcedure
    .input(
      z.object({
        date: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const startOfDay = new Date(input.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(input.date);
      endOfDay.setHours(23, 59, 59, 999);

      const completions = await ctx.db.habitStepCompletion.findMany({
        where: {
          habit: {
            createdById: ctx.session.user.id,
          },
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      return completions;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const habit = await ctx.db.habit.findFirst({
        where: {
          id: input.id,
          createdById: ctx.session.user.id,
        },
      });

      if (!habit) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Habit not found",
        });
      }

      return ctx.db.habit.delete({
        where: { id: input.id },
      });
    }),

  toggleStep: protectedProcedure
    .input(
      z.object({
        stepId: z.string(),
        date: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // First verify the step belongs to a habit owned by the user
      const step = await ctx.db.habitStep.findUnique({
        where: {
          id: input.stepId,
        },
        include: {
          habit: true,
        },
      });

      if (!step || step.habit.createdById !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Step not found",
        });
      }

      // Check if the step is already completed for this date
      const existing = await ctx.db.habitStepCompletion.findFirst({
        where: {
          stepId: input.stepId,
          date: {
            gte: new Date(input.date.setHours(0, 0, 0, 0)),
            lte: new Date(input.date.setHours(23, 59, 59, 999)),
          },
        },
      });

      if (existing) {
        // If it exists, delete it (toggle off)
        await ctx.db.habitStepCompletion.delete({
          where: { id: existing.id },
        });
        return false; // Return false to indicate the step is now uncompleted
      } else {
        // If it doesn't exist, create it (toggle on)
        await ctx.db.habitStepCompletion.create({
          data: {
            stepId: input.stepId,
            habitId: step.habitId,
            date: input.date,
          },
        });
        return true; // Return true to indicate the step is now completed
      }
    }),

  updateStepOrder: protectedProcedure
    .input(
      z.object({
        steps: z
          .array(
            z.object({
              id: z.string(),
              order: z.number().int().min(0),
            }),
          )
          .min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Verify all steps belong to the same habit and the user owns it
      const firstStep = await ctx.db.habitStep.findFirst({
        where: {
          id: input.steps[0]?.id as string,
        },
        include: {
          habit: true,
        },
      });

      if (!firstStep || firstStep.habit.createdById !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Step not found",
        });
      }

      // Update all steps in a transaction
      return ctx.db.$transaction(
        input.steps.map((step) =>
          ctx.db.habitStep.update({
            where: { id: step.id },
            data: { order: step.order },
          }),
        ),
      );
    }),

  getCompletionsForDateRange: protectedProcedure
    .input(
      z.object({
        habitId: z.string(),
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Verify the habit belongs to the user
      const habit = await ctx.db.habit.findUnique({
        where: {
          id: input.habitId,
          createdById: ctx.session.user.id,
        },
        include: {
          steps: {
            orderBy: {
              order: "asc",
            },
          },
        },
      });

      if (!habit) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Habit not found",
        });
      }

      return ctx.db.habitStepCompletion.findMany({
        where: {
          habitId: input.habitId,
          date: {
            gte: input.startDate,
            lte: input.endDate,
          },
        },
        include: {
          step: true,
        },
        orderBy: [{ date: "asc" }, { step: { order: "asc" } }],
      });
    }),
});
