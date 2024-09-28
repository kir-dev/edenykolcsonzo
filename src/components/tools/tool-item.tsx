import type { Tool } from "@prisma/client";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import Image from "next/image";

interface ToolItemProps {
  tool: Tool;
}

export default function ToolItem({ tool }: ToolItemProps) {
  return (
    <Card>
      <CardTitle>{tool.name}</CardTitle>
      <CardContent>
        {tool.description && (
          <CardDescription>{tool.description}</CardDescription>
        )}
        <p>Darabszám: {tool.quantity}</p>
        <Image
          src={tool.image ?? ""}
          width={300}
          height={300}
          alt={tool.name}
        />
      </CardContent>
    </Card>
  );
}
