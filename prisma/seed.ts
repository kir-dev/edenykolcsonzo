import { type Prisma, PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function main() {
  await prisma.tool.deleteMany();

  const seedDataPath = path.join(__dirname, "seedData.json");
  const seedData = JSON.parse(fs.readFileSync(seedDataPath, "utf-8")) as {
    tools: Prisma.ToolCreateInput[];
  };

  const tools: Prisma.ToolCreateInput[] = seedData.tools;

  await prisma.tool.createMany({ data: tools });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
