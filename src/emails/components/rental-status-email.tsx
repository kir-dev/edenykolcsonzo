import { type RentalStatus } from "@prisma/client";
import { Text } from "@react-email/components";

import { statusTitle } from "~/lib/utils";

import { EmailLayout } from "./email-layout";
import { RentalSummary, type RentalSummaryProps } from "./rental-summary";

const STATUS_SUBJECT: Partial<Record<RentalStatus, string>> = {
  ACCEPTED: "Kölcsönzési kérésed elfogadva",
  GIVEN_OUT: "Az eszközöket kiadtuk",
  BROUGHT_BACK: "Köszönjük, hogy visszahoztad az eszközöket",
};

const STATUS_LEAD: Partial<Record<RentalStatus, string>> = {
  ACCEPTED: "A kölcsönzési kérésedet elfogadtuk.",
  GIVEN_OUT: "Az eszközöket átadtuk neked.",
  BROUGHT_BACK: "Az eszközöket sikeresen visszahoztad, köszönjük!",
};

export interface RentalStatusEmailProps extends RentalSummaryProps {
  status: RentalStatus;
  // Name and phone number of the EK_MEMBER/ADMIN who accepted the request, so the
  // renter knows who to reach out to. Only set (and only shown) for the ACCEPTED email.
  acceptedByName?: string | null;
  acceptedByPhone?: string | null;
}

export function RentalStatusEmail({
  status,
  acceptedByName,
  acceptedByPhone,
  ...summary
}: RentalStatusEmailProps) {
  const subject = STATUS_SUBJECT[status] ?? statusTitle(status);
  const lead =
    STATUS_LEAD[status] ?? `A kérésed új státusza: ${statusTitle(status)}.`;

  return (
    <EmailLayout previewText={subject} heading={subject}>
      <Text className="m-0 mb-4 text-base text-neutral-700">{lead}</Text>
      <RentalSummary {...summary} />
      {status === "ACCEPTED" && (acceptedByName ?? acceptedByPhone) && (
        <Text className="m-0 text-base text-neutral-700">
          Elérhetőség egyeztetéshez:{" "}
          <span className="font-semibold text-neutral-900">
            {[acceptedByName, acceptedByPhone].filter(Boolean).join(" – ")}
          </span>
        </Text>
      )}
    </EmailLayout>
  );
}
