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

      if (payment) {
        const { data: inquiryRow } = await supabase
          .from("inquiries")
          .select("total_amount")
          .eq("id", payment.inquiry_id)
          .single();

        const { data: paidPayments } = await supabase
          .from("payments")
          .select("amount")
          .eq("inquiry_id", payment.inquiry_id)
          .eq("status", "paid");

        const totalPaid = (paidPayments || []).reduce((sum, p) => sum + Number(p.amount), 0);
        const total = inquiryRow?.total_amount ? Number(inquiryRow.total_amount) : null;
        const remaining = total !== null ? total - totalPaid : null;

        if (resendKey && session.customer_details?.email) {
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
                        ${total !== null ? `
                        <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; margin: 16px 0;">
                          <tr><td style="padding:6px 0; color:#8A746B; font-size:13px;">Total quote</td><td style="padding:6px 0; text-align:right; font-size:13px; color:#3A2B26;">$${total.toFixed(2)}</td></tr>
                          <tr><td style="padding:6px 0; color:#8A746B; font-size:13px;">Paid so far</td><td style="padding:6px 0; text-align:right; font-size:13px; color:#7C8768;">$${totalPaid.toFixed(2)}</td></tr>
                          <tr><td style="padding:8px 0; font-weight:700; font-size:14px; color:#3A2B26; border-top:1px solid #F0DCD3;">${remaining <= 0 ? "Balance" : "Remaining balance"}</td><td style="padding:8px 0; text-align:right; font-weight:700; font-size:14px; color:${remaining <= 0 ? "#7C8768" : "#A85F6B"};border-top:1px solid #F0DCD3;">${remaining <= 0 ? "Paid in full 🤍" : "$" + remaining.toFixed(2)}</td></tr>
                        </table>
                        ` : ""}
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

        if (resendKey) {
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
    }

    return Response.json({ received: true });
  } catch (err) {
    console.error("Webhook handler crashed:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}