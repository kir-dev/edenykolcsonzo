import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

export interface MemberProps {
  name: string;
  email: string;
  role: string;
  avatar: string;
}

// Helper function to get initials from name
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
}

export default function Member({ name, role, avatar }: MemberProps) {
  return (
    <Card className="flex w-full flex-col items-center p-3 sm:p-6">
      <CardHeader>
        <CardTitle>
          <Avatar className="h-16 w-16 sm:h-20 sm:w-20 lg:h-32 lg:w-32">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="text-lg sm:text-xl lg:text-2xl">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <p className="mt-4">{name}</p>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">{role}</CardDescription>
      </CardHeader>
    </Card>
  );
}
