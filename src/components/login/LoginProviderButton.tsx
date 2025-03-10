"use client";
import { signIn } from "next-auth/react";

import { Button } from "../ui/button";

export default function LoginProviderButton(props: {
  provider: string;
  children: string;
}) {
  const { provider, children } = props;
  return (
    <Button
      onClick={() => signIn(provider)}
      className="mt-4 max-w-max rounded bg-blue-500 p-2"
    >
      {children}
    </Button>
  );
}
