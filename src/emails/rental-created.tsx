import { Text } from "@react-email/components";

import { EmailLayout } from "./components/email-layout";
import {
  RentalSummary,
  type RentalSummaryProps,
} from "./components/rental-summary";

export type RentalCreatedEmailProps = RentalSummaryProps;

export default function RentalCreatedEmail(props: RentalCreatedEmailProps) {
  return (
    <EmailLayout
      previewText="Beérkezett a kölcsönzési kérésed"
      heading="Beérkezett a kölcsönzési kérésed"
    >
      <Text className="m-0 mb-4 text-base text-neutral-700">
        A kérésedet rögzítettük, hamarosan elbíráljuk. Erről is kapsz majd
        e-mailt.
      </Text>
      <RentalSummary {...props} />
    </EmailLayout>
  );
}

RentalCreatedEmail.PreviewProps = {
  rentalId: 42,
  title: "Zsúrasztal a szülinapra",
  startDate: new Date("2026-09-10"),
  endDate: new Date("2026-09-14"),
  tools: [
    { name: "Fazék, 5L", quantity: 2 },
    { name: "Merőkanál", quantity: 5 },
  ],
} satisfies RentalCreatedEmailProps;
