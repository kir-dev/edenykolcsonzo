import {
  RentalStatusEmail,
  type RentalStatusEmailProps,
} from "./components/rental-status-email";

export default function RentalBroughtBackEmail(
  props: Omit<RentalStatusEmailProps, "status">,
) {
  return <RentalStatusEmail {...props} status="BROUGHT_BACK" />;
}

RentalBroughtBackEmail.PreviewProps = {
  rentalId: 42,
  title: "Zsúrasztal a szülinapra",
  startDate: new Date("2026-09-10"),
  endDate: new Date("2026-09-14"),
  tools: [
    { name: "Fazék, 5L", quantity: 2 },
    { name: "Merőkanál", quantity: 5 },
  ],
} satisfies Omit<RentalStatusEmailProps, "status">;
