import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const habitRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        steps: z.array(z.string()).min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.habit.create({
        data: {
          name: input.name,
          steps: input.steps,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.habit.findMany({
      where: { createdBy: { id: ctx.session.user.id } },
      orderBy: { createdAt: "desc" },
    });
  }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.habit.delete({
        where: {
          id: input.id,
          createdById: ctx.session.user.id, // Ensure user can only delete their own habits
        },
      });
    }),
});
