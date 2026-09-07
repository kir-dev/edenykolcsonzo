import { type RentalStatus } from "@prisma/client";
import { render } from "@react-email/render";
import { type ReactElement } from "react";

import { statusTitle } from "~/lib/utils";

import {
  rentalDisplayName,
  type RentalSummaryProps,
} from "../../emails/components/rental-summary";
import RentalAcceptedEmail from "../../emails/rental-accepted";
import RentalBroughtBackEmail from "../../emails/rental-brought-back";
import RentalCreatedEmail from "../../emails/rental-created";
import RentalGivenOutEmail from "../../emails/rental-given-out";

export type RentalEmailInput = RentalSummaryProps;

export type RentalStatusChangeInput = RentalEmailInput & {
  // Name and phone number of the EK_MEMBER/ADMIN who accepted the request. Only
  // relevant (and only rendered) for the ACCEPTED email.
  acceptedByName?: string | null;
  acceptedByPhone?: string | null;
};

const STATUS_SUBJECT: Partial<Record<RentalStatus, string>> = {
  ACCEPTED: "Kölcsönzési kérésed elfogadva",
  GIVEN_OUT: "Az eszközöket kiadtuk",
  BROUGHT_BACK: "Köszönjük, hogy visszahoztad az eszközöket",
};

export async function rentalCreatedEmail(input: RentalEmailInput) {
  return {
    subject: `Kölcsönzési kérésed beérkezett (${rentalDisplayName(input)})`,
    html: await render(<RentalCreatedEmail {...input} />),
  };
}

const STATUS_EMAIL = {
  ACCEPTED: RentalAcceptedEmail,
  GIVEN_OUT: RentalGivenOutEmail,
  BROUGHT_BACK: RentalBroughtBackEmail,
} satisfies Partial<
  Record<RentalStatus, (props: RentalStatusChangeInput) => ReactElement>
>;

export async function rentalStatusChangedEmail(
  status: RentalStatus,
  input: RentalStatusChangeInput,
) {
  const subject = STATUS_SUBJECT[status] ?? statusTitle(status);
  const EmailComponent = STATUS_EMAIL[status as keyof typeof STATUS_EMAIL];

  return {
    subject: `${subject} (${rentalDisplayName(input)})`,
    html: EmailComponent
      ? await render(<EmailComponent {...input} />)
      : `<h1>${subject}</h1>`,
  };
}
