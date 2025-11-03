import type { Tool } from "@prisma/client";
import { Edit } from "lucide-react";
import Image from "next/image";

import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface ToolItemProps {
  tool: Tool;
  onEdit: () => void;
  isAdmin: boolean;
}

export default function ToolItem({ tool, onEdit, isAdmin }: ToolItemProps) {
  return (
    <Card className="flex items-center justify-center p-2 md:flex md:flex-col">
      <CardHeader>
        <CardTitle className="mb-2">{tool.name}</CardTitle>

        <CardDescription className="flex flex-col">
          {tool.description && <span>{tool.description}</span>}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex lg:flex-col">
        <Image
          src={tool.image ?? ""}
          width={400}
          height={400}
          alt={tool.name}
          className="aspect-square h-[100px] w-[100px] object-cover md:h-[200px] md:w-[200px] xl:h-[300px] xl:w-[300px]"
        />
        <span className="text-right text-lg font-semibold text-black dark:text-white">
          {tool.quantity} db
        </span>
        {isAdmin && (
          <Button onClick={onEdit} className="mt-2 flex items-center">
            <Edit className="mr-2" /> Módosítás
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
