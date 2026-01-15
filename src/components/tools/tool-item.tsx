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
    <Card className="flex flex-row items-center p-2 sm:flex-col">
      {/* Image - left on mobile, top on desktop */}
      <div className="flex-shrink-0">
        <Image
          src={tool.image ?? ""}
          width={400}
          height={400}
          alt={tool.name}
          className="aspect-square h-[80px] w-[80px] rounded-md object-cover sm:h-[150px] sm:w-[150px] md:h-[200px] md:w-[200px]"
        />
      </div>

      {/* Content - right on mobile, below image on desktop */}
      <div className="flex flex-1 flex-col px-3 sm:items-center sm:px-0 sm:pt-3">
        <CardHeader className="p-0 pb-1">
          <CardTitle className="text-sm sm:text-base md:text-lg">
            {tool.name}
          </CardTitle>
          {/* Description hidden on mobile */}
          <CardDescription className="hidden text-xs sm:block">
            {tool.description && <span>{tool.description}</span>}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex items-center gap-2 p-0 pt-1 sm:flex-col sm:pt-2">
          <span className="text-sm font-semibold sm:text-base">
            {tool.quantity} db
          </span>
          {isAdmin && (
            <Button
              onClick={onEdit}
              size="sm"
              className="flex items-center text-xs sm:mt-2 sm:text-sm"
            >
              <Edit className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> Módosítás
            </Button>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
