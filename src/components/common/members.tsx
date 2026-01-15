import type { MemberProps } from "./member";
import Member from "./member";

export default function Members() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4">
      {members.map((member) => (
        <Member key={member.email} {...member} />
      ))}
    </div>
  );
}

const members: MemberProps[] = [
  {
    name: "John Doe",
    email: "johndoe@gmail.com",
    role: "Körvezető",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    name: "Jane Smith",
    email: "janesmith@gmail.com",
    role: "Tag",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    name: "Alice Johnson",
    email: "alicejohnson@gmail.com",
    role: "Tag",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    name: "Bob Brown",
    email: "bobbrown@gmail.com",
    role: "Tag",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    name: "Charlie Davis",
    email: "charliedavis@gmail.com",
    role: "Tag",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    name: "Diana Evans",
    email: "dianaevans@gmail.com",
    role: "Tag",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    name: "Eve Foster",
    email: "evefoster@gmail.com",
    role: "Tag",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    name: "Frank Green",
    email: "frankgreen@gmail.com",
    role: "Tag",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    name: "Grace Harris",
    email: "graceharris@gmail.com",
    role: "Tag",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
  },
];
