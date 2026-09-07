import { type PrismaClient, type RentalStatus } from "@prisma/client";
import { z } from "zod";

import { isAdminRole } from "~/lib/utils";
import { sendMail } from "~/server/mail/client";
import {
  rentalCreatedEmail,
  rentalStatusChangedEmail,
} from "~/server/mail/rentalEmails";

import { createTRPCRouter, protectedProcedure } from "../trpc";

// Maps a target rental status to the Rental field that should record who made
// the transition happen. REQUESTED has no such field - it's set on creation.
const STATUS_ACTOR_FIELD: Partial<
  Record<RentalStatus, "acceptedById" | "givenOutById" | "returnedById">
> = {
  ACCEPTED: "acceptedById",
  GIVEN_OUT: "givenOutById",
  BROUGHT_BACK: "returnedById",
};

// Verifies the group exists and the user is currently an active member of it, throwing
// otherwise. A rental must not be attachable to an arbitrary/foreign group.
async function assertGroupMembership(
  db: PrismaClient,
  userId: string,
  groupId: number | undefined,
) {
  if (groupId === undefined) {
    return;
  }
  const membership = await db.userGroup.findUnique({
    where: { userId_groupId: { userId, groupId } },
  });
  if (!membership) {
    throw new Error("You are not a member of this group");
  }
}

export const rentalsRouter = createTRPCRouter({
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
      await assertGroupMembership(
        ctx.db,
        ctx.session!.user.id,
        input.groupId,
      );

      const rental = await ctx.db.rental.create({
        data: {
          title: input.title,
          status: "REQUESTED",
          userId: ctx.session!.user.id,
          startDate: new Date(input.startDate),
          endDate: new Date(input.endDate),
          startDateMessage: input.startDateMessage,
          endDateMessage: input.endDateMessage,
          groupId: input.groupId,
          ToolRental: {
            create: {
              toolId: input.toolId,
              quantity: input.quantity,
            },
          },
        },
      });

      if (ctx.session!.user.email) {
        const { subject, html } = rentalCreatedEmail({
          rentalId: rental.id,
          startDate: rental.startDate,
          endDate: rental.endDate,
          tools: [{ name: tool.name, quantity: input.quantity }],
        });
        void sendMail({ to: ctx.session!.user.email, subject, html });
      }

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

      await assertGroupMembership(
        ctx.db,
        ctx.session!.user.id,
        input.groupId,
      );

      const rental = await ctx.db.rental.create({
        data: {
          title: input.title,
          status: "REQUESTED",
          userId: ctx.session!.user.id,
          startDate: new Date(input.startDate),
          endDate: new Date(input.endDate),
          startDateMessage: input.startDateMessage,
          endDateMessage: input.endDateMessage,
          groupId: input.groupId,
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

      if (ctx.session!.user.email) {
        const { subject, html } = rentalCreatedEmail({
          rentalId: rental.id,
          startDate: rental.startDate,
          endDate: rental.endDate,
          tools: rental.ToolRental.map((tr) => ({
            name: tr.tool.name,
            quantity: tr.quantity,
          })),
        });
        void sendMail({ to: ctx.session!.user.email, subject, html });
      }

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

      const actorId = ctx.session.user.id;
      const actorField = STATUS_ACTOR_FIELD[input.status];

      const [rental] = await ctx.db.$transaction([
        ctx.db.rental.update({
          where: { id: input.rentalId },
          data: {
            status: input.status,
            ...(actorField ? { [actorField]: actorId } : {}),
          },
          include: {
            user: true,
            ToolRental: { include: { tool: true } },
          },
        }),
        ctx.db.auditLog.create({
          data: {
            action: "RENTAL_STATUS_CHANGE",
            entityType: "Rental",
            entityId: String(input.rentalId),
            actorId,
            message: `#${input.rentalId} kérés státusza "${input.status}" lett`,
          },
        }),
      ]);

      if (rental.user.email) {
        const { subject, html } = rentalStatusChangedEmail(input.status, {
          rentalId: rental.id,
          startDate: rental.startDate,
          endDate: rental.endDate,
          tools: rental.ToolRental.map((tr) => ({
            name: tr.tool.name,
            quantity: tr.quantity,
          })),
        });
        void sendMail({ to: rental.user.email, subject, html });
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

  remove: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      if (!isAdminRole(ctx.session?.user.role)) {
        throw new Error("Unauthorized");
      }
      return ctx.db.$transaction([
        ctx.db.toolRental.deleteMany({
          where: { rentalId: input },
        }),
        ctx.db.rental.delete({
          where: { id: input },
        }),
      ]);
    }),

  changeQuantity: protectedProcedure
    .input(
      z.object({
        rentalId: z.number(),
        toolId: z.number(),
        quantity: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Ensure user is authorized.
      if (!isAdminRole(ctx.session?.user.role)) {
        throw new Error("Unauthorized");
      }

      // Negative quantities are not allowed.
      if (input.quantity < 0) {
        throw new Error("Quantity cannot be negative");
      }

      // When quantity is zero, delete the toolRental.
      if (input.quantity === 0) {
        await ctx.db.toolRental.delete({
          where: {
            rentalId_toolId: {
              rentalId: input.rentalId,
              toolId: input.toolId,
            },
          },
        });
        // If there are no more tool rentals for this rental, delete the rental.
        const remainingCount = await ctx.db.toolRental.count({
          where: { rentalId: input.rentalId },
        });
        if (remainingCount === 0) {
          return await ctx.db.rental.delete({
            where: { id: input.rentalId },
          });
        }
        return;
      }

      // Fetch the available quantity of the tool.
      const tool = await ctx.db.tool.findUnique({
        where: { id: input.toolId },
        select: { quantity: true },
      });
      if (!tool) {
        throw new Error("Tool not found");
      }
      if (input.quantity > tool.quantity) {
        throw new Error("Quantity cannot be more than available quantity");
      }

      // TODO: Check for available quantity in the time slot

      // Update the toolRental with the new quantity.
      return await ctx.db.toolRental.update({
        where: {
          rentalId_toolId: {
            rentalId: input.rentalId,
            toolId: input.toolId,
          },
        },
        data: {
          quantity: input.quantity,
        },
      });
    }),
});
