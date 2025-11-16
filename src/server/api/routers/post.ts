import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input }) => {
      // Stub implementation: return the provided name without touching the database.
      return {
        name: input.name,
      };
    }),

  getLatest: publicProcedure.query(async () => {
    // Static placeholder result so the component using this
    // procedure has a simple shape to work with.
    return { name: "Latest post placeholder" };
  }),

  getSecretMessage: publicProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
