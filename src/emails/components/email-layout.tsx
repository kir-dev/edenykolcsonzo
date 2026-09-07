import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { type ReactNode } from "react";

interface EmailLayoutProps {
  previewText: string;
  heading: string;
  children: ReactNode;
}

// Shared chrome for every transactional email - brand header, card body, footer.
export function EmailLayout({
  previewText,
  heading,
  children,
}: EmailLayoutProps) {
  return (
    <Html lang="hu">
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="m-0 bg-[#f4f0ea] p-6 font-sans">
          <Container className="mx-auto max-w-[560px]">
            <Section className="rounded-t-3xl bg-amber-500 px-8 py-6">
              <Text className="m-0 text-lg font-bold text-white">
                Edénykölcsönző
              </Text>
            </Section>
            <Section className="rounded-b-3xl bg-white px-8 py-8 shadow-sm">
              <Heading className="m-0 mb-4 text-xl font-bold text-neutral-900">
                {heading}
              </Heading>
              {children}
            </Section>
            <Hr className="my-6 border-neutral-200" />
            <Text className="m-0 px-2 text-center text-xs text-neutral-400">
              Ezt az e-mailt az Edénykölcsönző rendszere küldte automatikusan.
              Kérdés esetén válaszolj erre a levélre.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
