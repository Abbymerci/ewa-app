import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  try {
    const secretKey = process.env.STRIPE_API_KEY_RESTRICTED;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const stripe = new Stripe(secretKey);
    const sig = req.headers.get("stripe-signature");
    const rawBody = await req.text();

    let event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err) {
      console.error("Signature verification failed:", err.message);
      return Response.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

      const { data: payment, error: updateError } = await supabase
        .from("payments")
        .update({ status: "paid", paid_at: new Date().toISOString() })
        .eq("stripe_session_id", session.id)
        .select()
        .single();

      console.log("Webhook update result:", { sessionId: session.id, payment, updateError });

      const resendKey = process.env.RESEND_API;

      if (resendKey && session.customer_details?.email && payment) {
        try {
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
            body: JSON.stringify({
              from: "Ẹwà <notifications@eventwithabby.com>",
              to: [session.customer_details.email],
              subject: `✔️ Payment received — ${payment.label}`,
              html: `
                <div style="font-family: 'Georgia', serif; background:#FCF2ED; padding: 32px 16px; margin:0;">
                  <div style="max-width: 480px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #F0DCD3;">
                    <div style="background: linear-gradient(135deg, #7C8768, #5C6B4E); padding: 28px 24px; text-align: center;">
                      <div style="font-size: 26px; color: #FFFFFF; letter-spacing: 0.04em;">Ẹwà</div>
                      <div style="font-size: 12px; color: #EFF3E8; letter-spacing: 0.15em; margin-top: 4px; font-family: Arial, sans-serif;">PAYMENT CONFIRMED</div>
                    </div>
                    <div style="padding: 28px 26px; text-align: center;">
                      <p style="font-size: 15px; color: #3A2B26; margin: 0 0 16px; font-family: Arial, sans-serif;">Your <strong>${payment.label.toLowerCase()}</strong> of <strong>$${Number(payment.amount).toFixed(2)}</strong> has been received. Thank you! 🤍</p>
                      <p style="font-size: 13px; color: #8A746B; font-family: Arial, sans-serif;">Abby will be in touch with next steps.</p>
                    </div>
                    <div style="background: #FBF3E1; padding: 18px 24px; text-align: center; border-top: 1px solid #F0DCD3;">
                      <p style="font-size: 12px; color: #A85F6B; margin: 0; font-family: Arial, sans-serif;">— Abby</p>
                    </div>
                  </div>
                </div>
              `,
            }),
          });
        } catch (e) {
          console.error("Client email failed:", e);
        }
      }

      if (resendKey && payment) {
        try {
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
            body: JSON.stringify({
              from: "Ẹwà Payments <notifications@eventwithabby.com>",
              to: ["eventwithabby@gmail.com"],
              subject: `💰 Payment received: $${Number(payment.amount).toFixed(2)}`,
              text: `${payment.label} of $${payment.amount} was just paid.\n\nView in your Ledger: https://eventwithabby.com/?owner=ledger`,
            }),
          });
        } catch (e) {
          console.error("Abby notification email failed:", e);
        }
      }
    }

    return Response.json({ received: true });
  } catch (err) {
    console.error("Webhook handler crashed:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}