import { type RentalStatus } from "@prisma/client";

import { statusTitle } from "~/lib/utils";

interface RentalTool {
  name: string;
  quantity: number;
}

interface RentalEmailInput {
  rentalId: number;
  startDate: Date;
  endDate: Date;
  tools: RentalTool[];
}

function formatDate(date: Date) {
  return date.toLocaleDateString("hu-HU");
}

function toolListHtml(tools: RentalTool[]) {
  if (tools.length === 0) return "";
  return `<ul>${tools
    .map((tool) => `<li>${tool.name} (${tool.quantity} db)</li>`)
    .join("")}</ul>`;
}

function rentalSummaryHtml({
  rentalId,
  startDate,
  endDate,
  tools,
}: RentalEmailInput) {
  return `
    <p>Kérés azonosítója: #${rentalId}</p>
    <p>Időszak: ${formatDate(startDate)} - ${formatDate(endDate)}</p>
    ${toolListHtml(tools)}
  `;
}

export function rentalCreatedEmail(input: RentalEmailInput) {
  return {
    subject: `Kölcsönzési kérésed beérkezett (#${input.rentalId})`,
    html: `
      <h1>Beérkezett a kölcsönzési kérésed</h1>
      <p>A kérésedet rögzítettük, hamarosan elbíráljuk.</p>
      ${rentalSummaryHtml(input)}
    `,
  };
}

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

export function rentalStatusChangedEmail(
  status: RentalStatus,
  input: RentalEmailInput,
) {
  const subject = STATUS_SUBJECT[status] ?? statusTitle(status);
  const lead =
    STATUS_LEAD[status] ?? `A kérésed új státusza: ${statusTitle(status)}.`;

  return {
    subject: `${subject} (#${input.rentalId})`,
    html: `
      <h1>${subject}</h1>
      <p>${lead}</p>
      ${rentalSummaryHtml(input)}
    `,
  };
}
