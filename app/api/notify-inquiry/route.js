export async function POST(req) {
  const { name, email, phone, eventType, eventDate, guestCount, budget, services, message, savedLook } = await req.json();
  const apiKey = process.env.RESEND_API;

  if (!apiKey) {
    return Response.json({ ok: false, skipped: true });
  }

  const imageUrl = savedLook?.dataUrl && savedLook.dataUrl.startsWith("http") ? savedLook.dataUrl : null;
  const styleLine = savedLook ? `${savedLook.shapeLabel} · ${savedLook.paletteLabel}` : null;

  const textBody = `New inquiry received!

Name: ${name}
Email: ${email}
Phone: ${phone || "not provided"}
Event: ${eventType} on ${eventDate}
Guests: ${guestCount || "not specified"}
Budget: ${budget}
Services: ${(services || []).join(", ")}
${styleLine ? `\nStyle: ${styleLine}` : ""}
${imageUrl ? `\nPreview image: ${imageUrl}` : ""}

Vision: ${message || "none"}

View in your Ledger: https://eventwithabby.com/?owner=ledger`;

  const htmlBody = `
    <div style="font-family: sans-serif; color: #3A2B26;">
      <h2>New inquiry received!</h2>
      <p><strong>Name:</strong> ${name}<br/>
      <strong>Email:</strong> ${email}<br/>
      <strong>Phone:</strong> ${phone || "not provided"}<br/>
      <strong>Event:</strong> ${eventType} on ${eventDate}<br/>
      <strong>Guests:</strong> ${guestCount || "not specified"}<br/>
      <strong>Budget:</strong> ${budget}<br/>
      <strong>Services:</strong> ${(services || []).join(", ")}</p>
      ${styleLine ? `<p><strong>Style:</strong> ${styleLine}</p>` : ""}
      ${imageUrl ? `<img src="${imageUrl}" alt="AI-generated preview" style="max-width: 500px; border-radius: 8px; margin: 12px 0;" />` : ""}
      <p><strong>Vision:</strong> ${message || "none"}</p>
      <p><a href="https://eventwithabby.com/?owner=ledger">View in your Ledger</a></p>
    </div>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      from: "Ewa Inquiries <notifications@eventwithabby.com>",
      to: ["eventwithabby@gmail.com"],
      subject: `New inquiry: ${name} — ${eventType}`,
      text: textBody,
      html: htmlBody,
    }),
  });

  const data = await res.json();
  return Response.json({ ok: res.ok, data }, { status: res.status });
}