import Stripe from "stripe";

export async function POST(req) {
  const { inquiryId, label, amount, refCode, customerEmail, customerName, totalAmount, alreadyPaid } = await req.json();
  const secretKey = process.env.STRIPE_API_KEY_RESTRICTED;

  if (!secretKey) {
    return Response.json({ error: { message: "STRIPE_API_KEY_RESTRICTED is not set on the server." } }, { status: 500 });
  }
  if (!inquiryId || !label || !amount || Number(amount) <= 0) {
    return Response.json({ error: { message: "Missing inquiryId, label, or a valid amount." } }, { status: 400 });
  }

  const stripe = new Stripe(secretKey);

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: `${label} — ${refCode || "Ẹwà event"}` },
            unit_amount: Math.round(Number(amount) * 100),
          },
          quantity: 1,
        },
      ],
      customer_email: customerEmail || undefined,
      success_url: `https://eventwithabby.com/?payment=success`,
      cancel_url: `https://eventwithabby.com/?payment=cancelled`,
      metadata: { inquiryId, label },
    });
  } catch (e) {
    return Response.json({ error: { message: e.message } }, { status: 500 });
  }

  const resendKey = process.env.RESEND_API;
  if (resendKey && customerEmail) {
    const paidSoFar = Number(alreadyPaid || 0);
    const thisAmount = Number(amount);
    const total = totalAmount ? Number(totalAmount) : null;
    const remaining = total !== null ? total - paidSoFar - thisAmount : null;

    const breakdownRows = total !== null
      ? `
        <tr>
          <td style="padding:10px 0;color:#8A746B;font-size:14px;">Total quote</td>
          <td style="padding:10px 0;text-align:right;font-size:14px;color:#3A2B26;">$${total.toFixed(2)}</td>
        </tr>
        ${paidSoFar > 0 ? `
        <tr>
          <td style="padding:10px 0;color:#8A746B;font-size:14px;">Already paid</td>
          <td style="padding:10px 0;text-align:right;font-size:14px;color:#7C8768;">$${paidSoFar.toFixed(2)}</td>
        </tr>` : ""}
        <tr style="background:#FBF3E1;">
          <td style="padding:12px 10px;font-weight:700;font-size:15px;color:#3A2B26;border-radius:6px 0 0 6px;">${label} — due now</td>
          <td style="padding:12px 10px;text-align:right;font-weight:700;font-size:15px;color:#A85F6B;border-radius:0 6px 6px 0;">$${thisAmount.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;color:#8A746B;font-size:13px;border-top:1px solid #F0DCD3;">Remaining after this payment</td>
          <td style="padding:10px 0;text-align:right;font-size:13px;color:#8A746B;border-top:1px solid #F0DCD3;">$${remaining.toFixed(2)}</td>
        </tr>
      `
      : `
        <tr style="background:#FBF3E1;">
          <td style="padding:12px 10px;font-weight:700;font-size:15px;color:#3A2B26;border-radius:6px 0 0 6px;">${label}</td>
          <td style="padding:12px 10px;text-align:right;font-weight:700;font-size:15px;color:#A85F6B;border-radius:0 6px 6px 0;">$${thisAmount.toFixed(2)}</td>
        </tr>
      `;

    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
        body: JSON.stringify({
          from: "Ẹwà <notifications@eventwithabby.com>",
          to: [customerEmail],
          subject: `💛 Your ${label.toLowerCase()} for ${refCode || "your Ẹwà event"}`,
          html: `
            <div style="font-family: 'Georgia', serif; background:#FCF2ED; padding: 32px 16px; margin:0;">
              <div style="max-width: 480px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #F0DCD3;">
                <div style="background: linear-gradient(135deg, #C98D93, #A85F6B); padding: 28px 24px; text-align: center;">
                  <div style="font-size: 26px; color: #FFFFFF; letter-spacing: 0.04em; font-weight: normal;">Ẹwà</div>
                  <div style="font-size: 12px; color: #FBEFEC; letter-spacing: 0.15em; margin-top: 4px; font-family: Arial, sans-serif;">EVENTS WITH ABBY</div>
                </div>
                <div style="padding: 28px 26px;">
                  <p style="font-size: 15px; color: #3A2B26; margin: 0 0 6px; font-family: Arial, sans-serif;">Hi ${customerName || "there"} 💐,</p>
                  <p style="font-size: 14px; color: #5C463E; line-height: 1.6; margin: 0 0 20px; font-family: Arial, sans-serif;">
                    Here's your payment summary for <strong>${refCode || "your event"}</strong> — everything's laid out below so nothing's a surprise.
                  </p>
                  <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;">
                    ${breakdownRows}
                  </table>
                  <div style="text-align: center; margin: 28px 0 8px;">
                    <a href="${session.url}" style="background: #A85F6B; color: #FFFFFF; padding: 14px 32px; border-radius: 30px; text-decoration: none; display: inline-block; font-weight: bold; font-size: 14px; font-family: Arial, sans-serif; letter-spacing: 0.03em;">
                      Pay $${thisAmount.toFixed(2)} now →
                    </a>
                  </div>
                  <p style="font-size: 11px; color: #B0A090; text-align: center; margin: 12px 0 0; font-family: Arial, sans-serif;">
                    Secure checkout powered by Stripe
                  </p>
                </div>
                <div style="background: #FBF3E1; padding: 18px 24px; text-align: center; border-top: 1px solid #F0DCD3;">
                  <p style="font-size: 13px; color: #5C463E; margin: 0; font-family: Arial, sans-serif;">Can't wait to bring your vision to life 🤍</p>
                  <p style="font-size: 12px; color: #A85F6B; margin: 6px 0 0; font-family: Arial, sans-serif;">— Abby</p>
                </div>
              </div>
              <p style="text-align: center; font-size: 11px; color: #B0A090; margin-top: 16px; font-family: Arial, sans-serif;">
                Ẹwà · Charlotte, NC · 202-769-7282
              </p>
            </div>
          `,
        }),
      });
    } catch (e) {}
  }

  return Response.json({ url: session.url, sessionId: session.id });
}