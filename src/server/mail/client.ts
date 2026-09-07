import { env } from "~/env";

interface SendMailInput {
  to: string;
  subject: string;
  html: string;
}

// Fire-and-forget wrapper around the Kir-Mail API (https://mail.kir-dev.hu/api).
// Failures are logged but never thrown, so a mail outage can't break a rental mutation.
export async function sendMail({ to, subject, html }: SendMailInput) {
  if (!env.KIR_MAIL_API_KEY) {
    console.error("KIR_MAIL_API_KEY is not set, skipping email send to", to);
    return;
  }

  try {
    const response = await fetch(`${env.KIR_MAIL_API_URL}/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Kir-Mail expects the "Api-Key" scheme prefix, not just the bare token.
        Authorization: `Api-Key ${env.KIR_MAIL_API_KEY}`,
      },
      body: JSON.stringify({
        from: {
          name: env.KIR_MAIL_FROM_NAME,
          email: env.KIR_MAIL_FROM_EMAIL,
        },
        to,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      console.error(
        `Kir-Mail request failed (${response.status}) for ${to}:`,
        await response.text(),
      );
    }
  } catch (error) {
    console.error(`Kir-Mail request threw for ${to}:`, error);
  }
}
