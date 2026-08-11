
export async function POST(req) {
  const { name, email, phone, eventType, eventDate, guestCount, budget, services, message } = await req.json();
  const apiKey = process.env.RESEND_API;

  if (!apiKey) {
    // Fail quietly — a missing notification key should never block a real inquiry from saving
    return Response.json({ ok: false, skipped: true });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: "Ewa Inquiries <notifications@eventwithabby.com>",
      to: ["eventwithabby@gmail.com"],
      subject: `New inquiry: ${name} — ${eventType}`,
      text: `New inquiry received!

Name: ${name}
Email: ${email}
Phone: ${phone || "not provided"}
Event: ${eventType} on ${eventDate}
Guests: ${guestCount || "not specified"}
Budget: ${budget}
Services: ${(services || []).join(", ")}

Vision: ${message || "none"}

View in your Ledger: https://eventwithabby.com/?owner=ledger`,
    }),
  });

  const data = await res.json();
  return Response.json({ ok: res.ok, data }, { status: res.status });
}