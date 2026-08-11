export async function POST(req) {
  const { prompt } = await req.json();
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: { message: "ANTHROPIC_API_KEY is not set on the server." } },
      { status: 500 }
    );
  }
  if (!prompt || typeof prompt !== "string") {
    return Response.json(
      { error: { message: "Missing prompt." } },
      { status: 400 }
    );
  }

  const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await anthropicRes.json();
  return Response.json(data, { status: anthropicRes.status });
}

