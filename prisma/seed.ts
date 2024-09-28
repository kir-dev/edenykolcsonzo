import { type Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const tools: Prisma.ToolCreateInput[] = [
    {
      name: "Spatula",
      description:
        "Egy konyhai eszköz, amelyet forgatáshoz vagy kenéshez használnak.",
      rentable: true,
      quantity: 10,
      image: "spatula.jpg",
    },
    {
      name: "Habverő",
      description:
        "Egy konyhai eszköz, amelyet habveréshez vagy keveréshez használnak.",
      rentable: true,
      quantity: 15,
      image: "whisk.jpg",
    },
    {
      name: "Séf kés",
      description:
        "Egy sokoldalú kés, amelyet különféle konyhai feladatokhoz használnak.",
      rentable: true,
      quantity: 5,
      image: "chefs_knife.jpg",
    },
    {
      name: "Vágódeszka",
      description:
        "Egy deszka, amelyet ételek vágásához és előkészítéséhez használnak.",
      rentable: true,
      quantity: 20,
      image: "cutting_board.jpg",
    },
    {
      name: "Mérőpoharak",
      description: "Poharak, amelyeket hozzávalók méréséhez használnak.",
      rentable: true,
      quantity: 25,
      image: "measuring_cups.jpg",
    },
    {
      name: "Mérőkanalak",
      description:
        "Kanalak, amelyeket kis mennyiségű hozzávalók méréséhez használnak.",
      rentable: true,
      quantity: 30,
      image: "measuring_spoons.jpg",
    },
    {
      name: "Keverőtál",
      description: "Egy tál, amelyet hozzávalók keveréséhez használnak.",
      rentable: true,
      quantity: 12,
      image: "mixing_bowl.jpg",
    },
    {
      name: "Hámozó",
      description:
        "Egy eszköz, amelyet gyümölcsök és zöldségek hámozásához használnak.",
      rentable: true,
      quantity: 18,
      image: "peeler.jpg",
    },
    {
      name: "Reszelő",
      description:
        "Egy eszköz, amelyet sajt vagy zöldségek reszeléséhez használnak.",
      rentable: true,
      quantity: 14,
      image: "grater.jpg",
    },
    {
      name: "Szűrő",
      description:
        "Egy lyukakkal ellátott tál, amelyet folyadékok lecsöpögtetéséhez használnak.",
      rentable: true,
      quantity: 10,
      image: "colander.jpg",
    },
    {
      name: "Fogó",
      description:
        "Egy eszköz, amelyet ételek megfogásához és emeléséhez használnak.",
      rentable: true,
      quantity: 22,
      image: "tongs.jpg",
    },
    {
      name: "Nyújtófa",
      description: "Egy eszköz, amelyet tészta kinyújtásához használnak.",
      rentable: true,
      quantity: 8,
      image: "rolling_pin.jpg",
    },
    {
      name: "Konzervnyitó",
      description: "Egy eszköz, amelyet konzervek nyitásához használnak.",
      rentable: true,
      quantity: 16,
      image: "can_opener.jpg",
    },
    {
      name: "Merőkanál",
      description:
        "Egy nagy kanál, amelyet leves vagy pörkölt tálalásához használnak.",
      rentable: true,
      quantity: 9,
      image: "ladle.jpg",
    },
    {
      name: "Konyhai olló",
      description:
        "Olló, amelyet ételek és egyéb konyhai feladatok vágásához használnak.",
      rentable: true,
      quantity: 13,
      image: "kitchen_shears.jpg",
    },
  ];

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
