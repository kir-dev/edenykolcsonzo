import { PrismaClient, type Prisma } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

interface SeedData {
  tools: Prisma.ToolCreateInput[];
  users: {
    fullName: string;
    email: string;
    role: "USER" | "EK_MEMBER";
  }[];
  rentals: {
    userEmail: string;
    status: "REQUESTED" | "ACCEPTED" | "EXPIRED" | "BROUGHT_BACK";
    startDateMessage: string;
    endDateMessage: string;
    startDate: string;
    endDate: string;
    toolRentals: {
      toolName: string;
      quantity: number;
      broughtBackQuantity?: number;
    }[];
  }[];
}

async function main() {
  const seedDataPath = path.join(__dirname, "seedData.json");
  const seedData: SeedData = JSON.parse(fs.readFileSync(seedDataPath, "utf-8")) as SeedData;

  // Delete existing data in an order that respects relations.
  await prisma.toolRental.deleteMany();
  await prisma.rental.deleteMany();
  await prisma.tool.deleteMany();
  await prisma.user.deleteMany();

  // Seed tools
  console.log("Seeding tools...");
  await prisma.tool.createMany({ data: seedData.tools });
  
  // Seed users
  console.log("Seeding users...");
  for (const userData of seedData.users) {
    await prisma.user.create({
      data: userData,
    });
  }

  // Seed rentals along with their tool rentals
  console.log("Seeding rentals...");
  for (const rentalData of seedData.rentals) {
    // Find the user based on the email provided
    const user = await prisma.user.findUnique({
      where: { email: rentalData.userEmail }
    });
    if (!user) {
      console.error(`User with email ${rentalData.userEmail} not found.`);
      continue;
    }

    // Create the rental record with nested tool rentals
    await prisma.rental.create({
      data: {
        userId: user.id,
        status: rentalData.status,
        startDateMessage: rentalData.startDateMessage,
        endDateMessage: rentalData.endDateMessage,
        startDate: new Date(rentalData.startDate),
        endDate: new Date(rentalData.endDate),
        ToolRental: {
          create: await Promise.all(
            rentalData.toolRentals.map(async (tr) => {
              // Find the tool based on the tool name
              const tool = await prisma.tool.findFirst({
                where: { name: tr.toolName }
              });
              if (!tool) {
                throw new Error(`Tool with name ${tr.toolName} not found.`);
              }
              return {
                toolId: tool.id,
                quantity: tr.quantity,
                broughtBackQuantity: tr.broughtBackQuantity
              };
            })
          )
        }
      }
    });
  }

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });