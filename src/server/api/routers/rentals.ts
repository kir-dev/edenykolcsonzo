import { z } from "zod";

import { isAdminRole } from "~/lib/utils";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  applyStatusChange,
  assertCanMoveToStatus,
  assertGroupMembership,
  logRentalCreated,
  notifyRentalCreated,
  notifyStatusChanged,
} from "./rentals.helpers";
import { rentalsAdminProcedures } from "./rentals-admin";

export const rentalsRouter = createTRPCRouter({
  ...rentalsAdminProcedures,

  get: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.rental.findMany({
      include: {
        user: true,
        group: true,
        ToolRental: {
          include: { tool: true },
        },
        acceptedBy: true,
        givenOutBy: true,
        returnedBy: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  getById: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const rental = await ctx.db.rental.findUnique({
        where: { id: input },
        include: {
          group: true,
          ToolRental: { include: { tool: true } },
        },
      });
      if (!rental) {
        throw new Error("Rental not found");
      }
      if (
        rental.userId !== ctx.session!.user.id &&
        !isAdminRole(ctx.session?.user.role)
      ) {
        throw new Error("Unauthorized");
      }
      return rental;
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        toolId: z.number(),
        startDate: z.string(),
        endDate: z.string(),
        startDateMessage: z.string(),
        endDateMessage: z.string(),
        quantity: z.number().min(1),
        groupId: z.number().optional(),
        contactPhone: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tool = await ctx.db.tool.findUnique({
        where: {
          id: input.toolId,
        },
      });
      if (!tool) {
        throw new Error("Tool not found");
      }
      await assertGroupMembership(ctx.db, ctx.session!.user.id, input.groupId);

      const rental = await ctx.db.$transaction(async (tx) => {
        const created = await tx.rental.create({
          data: {
            title: input.title,
            status: "REQUESTED",
            userId: ctx.session!.user.id,
            startDate: new Date(input.startDate),
            endDate: new Date(input.endDate),
            startDateMessage: input.startDateMessage,
            endDateMessage: input.endDateMessage,
            groupId: input.groupId,
            contactPhone: input.contactPhone,
            ToolRental: {
              create: {
                toolId: input.toolId,
                quantity: input.quantity,
              },
            },
          },
        });
        await logRentalCreated(tx, created, ctx.session!.user.id);
        return created;
      });

      notifyRentalCreated(ctx.session!.user.email, {
        rentalId: rental.id,
        title: rental.title,
        startDate: rental.startDate,
        endDate: rental.endDate,
        tools: [{ name: tool.name, quantity: input.quantity }],
      });

      return rental;
    }),

  createMultiple: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        startDate: z.string(),
        endDate: z.string(),
        startDateMessage: z.string(),
        endDateMessage: z.string(),
        groupId: z.number().optional(),
        contactPhone: z.string().optional(),
        tools: z.array(
          z.object({
            toolId: z.number(),
            quantity: z.number().min(1),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Validate that all tools exist
      const toolIds = input.tools.map((t) => t.toolId);
      const tools = await ctx.db.tool.findMany({
        where: {
          id: { in: toolIds },
        },
      });

      if (tools.length !== toolIds.length) {
        throw new Error("One or more tools not found");
      }

      // Check if quantities are available
      for (const toolRental of input.tools) {
        const tool = tools.find((t) => t.id === toolRental.toolId);
        if (!tool || tool.quantity < toolRental.quantity) {
          throw new Error(
            `Insufficient quantity for tool ${tool?.name || toolRental.toolId}`,
          );
        }
      }

      await assertGroupMembership(ctx.db, ctx.session!.user.id, input.groupId);

      const rental = await ctx.db.$transaction(async (tx) => {
        const created = await tx.rental.create({
          data: {
            title: input.title,
            status: "REQUESTED",
            userId: ctx.session!.user.id,
            startDate: new Date(input.startDate),
            endDate: new Date(input.endDate),
            startDateMessage: input.startDateMessage,
            endDateMessage: input.endDateMessage,
            groupId: input.groupId,
            contactPhone: input.contactPhone,
            ToolRental: {
              create: input.tools.map((tool) => ({
                toolId: tool.toolId,
                quantity: tool.quantity,
              })),
            },
          },
          include: {
            ToolRental: {
              include: { tool: true },
            },
          },
        });
        await logRentalCreated(tx, created, ctx.session!.user.id);
        return created;
      });

      notifyRentalCreated(ctx.session!.user.email, {
        rentalId: rental.id,
        title: rental.title,
        startDate: rental.startDate,
        endDate: rental.endDate,
        tools: rental.ToolRental.map((tr) => ({
          name: tr.tool.name,
          quantity: tr.quantity,
        })),
      });

      return rental;
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        rentalId: z.number(),
        // Only allow the statuses defined in your enum:
        status: z.enum(["REQUESTED", "ACCEPTED", "GIVEN_OUT", "BROUGHT_BACK"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Only EK_MEMBERs and ADMINs should be allowed
      if (!isAdminRole(ctx.session?.user.role)) {
        throw new Error("Unauthorized");
      }

      const currentStatus = await assertCanMoveToStatus(
        ctx.db,
        ctx.session.user,
        input.rentalId,
        input.status,
      );

      const rental = await applyStatusChange(
        ctx.db,
        input.rentalId,
        currentStatus,
        input.status,
        ctx.session.user.id,
      );

      // ACCEPTED, GIVEN_OUT and BROUGHT_BACK each have their own email. Moving a
      // rental back to REQUESTED doesn't notify anyone.
      if (input.status !== "REQUESTED") {
        notifyStatusChanged(rental.user.email, input.status, {
          rentalId: rental.id,
          title: rental.title,
          startDate: rental.startDate,
          endDate: rental.endDate,
          tools: rental.ToolRental.map((tr) => ({
            name: tr.tool.name,
            quantity: tr.quantity,
          })),
          acceptedByName:
            rental.acceptedBy?.fullName ?? rental.acceptedBy?.email,
          acceptedByPhone: rental.acceptedBy?.phoneNumber,
        });
      }

      return rental;
    }),

  getUserRentals: protectedProcedure
    .input(z.object({ userId: z.string() }).optional())
    .query(async ({ ctx, input }) => {
      let userId: string | undefined = input?.userId;
      if (!userId) {
        if (!ctx.session?.user?.id) {
          throw new Error("User could not be determined");
        }
        userId = ctx.session.user.id;
      }
      return ctx.db.rental.findMany({
        where: {
          userId: userId,
        },
        include: {
          group: true,
          ToolRental: { include: { tool: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    }),
});
