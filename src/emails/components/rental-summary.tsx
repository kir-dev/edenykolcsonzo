import { Row, Section, Text } from "@react-email/components";

export interface RentalTool {
  name: string;
  quantity: number;
}

export interface RentalSummaryProps {
  rentalId: number;
  title: string | null;
  startDate: Date;
  endDate: Date;
  tools: RentalTool[];
}

function formatDateTime(date: Date) {
  return `${date.toLocaleDateString("hu-HU")} ${date.toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" })}`;
}

export function rentalDisplayName({
  rentalId,
  title,
}: Pick<RentalSummaryProps, "rentalId" | "title">) {
  return title ?? `Bérlés #${rentalId}`;
}

export function RentalSummary({
  rentalId,
  title,
  startDate,
  endDate,
  tools,
}: RentalSummaryProps) {
  return (
    <Section className="mb-4 rounded-2xl bg-neutral-50 px-5 py-4">
      <Row>
        <Text className="m-0 text-sm text-neutral-500">Bérlés</Text>
        <Text className="m-0 mb-3 text-base font-semibold text-neutral-900">
          {rentalDisplayName({ rentalId, title })}
        </Text>
      </Row>
      <Row>
        <Text className="m-0 text-sm text-neutral-500">Időszak</Text>
        <Text className="m-0 mb-3 text-base font-semibold text-neutral-900">
          {formatDateTime(startDate)} - {formatDateTime(endDate)}
        </Text>
      </Row>
      {tools.length > 0 && (
        <Row>
          <Text className="m-0 mb-1 text-sm text-neutral-500">Eszközök</Text>
          {tools.map((tool) => (
            <Text
              key={tool.name}
              className="m-0 text-base font-semibold text-neutral-900"
            >
              {tool.name}{" "}
              <span className="font-normal text-neutral-500">
                ({tool.quantity} db)
              </span>
            </Text>
          ))}
        </Row>
      )}
    </Section>
  );
}
