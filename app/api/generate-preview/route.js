export async function POST(req) {
  const { shapeLabel, colors, venueId, packageName, refinement } = await req.json();
  const apiKey = process.env.FAL_API_KEY;

  if (!apiKey) {
    return Response.json({ error: { message: "FAL_API_KEY is not set on the server." } }, { status: 500 });
  }
  if (!shapeLabel || !Array.isArray(colors)) {
    return Response.json({ error: { message: "Missing shape or colors." } }, { status: 400 });
  }

  const venueDescriptions = {
    studio: "clean bright studio venue",
    banquet: "elegant banquet hall",
    home: "cozy home or loft interior",
    noir: "moody evening venue with dramatic lighting",
  };
  const venueText = venueDescriptions[venueId] || "elegant event venue";
  const colorText = colors.join(", ");

  const prompt = `Professional event photography, a ${shapeLabel.toLowerCase()} balloon and floral installation${packageName ? ` for a ${packageName}` : ""}, color palette of ${colorText}, set in a ${venueText}, soft natural lighting, high-end styling, shot on a DSLR, photorealistic, no text or watermarks${refinement ? `. Additional scene details: ${refinement}` : ""}`;

  const res = await fetch("https://fal.run/fal-ai/flux-2-pro", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Key ${apiKey}` },
    body: JSON.stringify({ prompt, image_size: "landscape_4_3" }),
  });

  const data = await res.json();
  if (!res.ok) {
    return Response.json({ error: data?.error || { message: "Generation failed" } }, { status: res.status });
  }
  const imageUrl = data?.images?.[0]?.url;
  if (!imageUrl) {
    return Response.json({ error: { message: "No image returned" } }, { status: 500 });
  }
  return Response.json({ imageUrl });
}