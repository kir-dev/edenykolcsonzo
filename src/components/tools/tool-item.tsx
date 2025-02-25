import type { Tool } from "@prisma/client";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface ToolItemProps {
  tool: Tool;
}

export default function ToolItem({ tool }: ToolItemProps) {
  return (
    <Card className="flex items-center justify-center p-2 md:flex md:flex-col">
      <CardHeader>
        <CardTitle className="mb-2">{tool.name}</CardTitle>
        <CardDescription className="flex flex-col">
          {tool.description && <span>{tool.description}</span>}
          <span className="mt-4 text-black dark:text-white">
            Darabszám: {tool.quantity}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex lg:flex-col">
        <Image
          src={tool.image ?? ""}
          width={400}
          height={400}
          alt={tool.name}
          className="aspect-square h-[100px] w-[100px] md:h-[200px] md:w-[200px] xl:h-[300px] xl:w-[300px]"
        />
      </CardContent>
    </Card>
  );
}
