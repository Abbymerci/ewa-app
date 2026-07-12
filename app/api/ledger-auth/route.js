export async function POST(req) {
  const { password } = await req.json();
  const correct = process.env.LEDGER_PASSWORD;

  if (!correct) {
    return Response.json(
      { ok: false, error: "LEDGER_PASSWORD is not set on the server." },
      { status: 500 }
    );
  }
  if (password === correct) {
    return Response.json({ ok: true });
  }
  return Response.json({ ok: false, error: "Incorrect password." }, { status: 401 });
}
