import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

export interface MemberProps {
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export default function Member({ name, role, avatar }: MemberProps) {
  // Get initials for fallback
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="flex w-full flex-col items-center p-3 sm:p-6">
      <Avatar className="h-16 w-16 sm:h-20 sm:w-20 lg:h-32 lg:w-32">
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback className="text-lg sm:text-xl lg:text-2xl">
          {initials}
        </AvatarFallback>
      </Avatar>
      <CardHeader className="p-0 pt-2 text-center sm:pt-4">
        <CardTitle className="text-sm sm:text-base lg:text-lg">
          {name}
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">{role}</CardDescription>
      </CardHeader>
    </Card>
  );
}
