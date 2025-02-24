import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

export interface MemberProps {
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export default function Member({ name, role, avatar }: MemberProps) {
  return (
    <Card className="flex w-fit p-6">
      <CardHeader>
        <CardTitle>
          <Avatar className="h-20 w-20 lg:h-40 lg:w-40">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{name}</AvatarFallback>
          </Avatar>
          <p className="mt-4">{name}</p>
        </CardTitle>
        <CardDescription>{role}</CardDescription>
      </CardHeader>
    </Card>
  );
}
