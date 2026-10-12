export async function POST(req: Request) {
  const body = await req.json();

  if (!body.role || !body.fullName) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  // TODO: save to a database (see Step 8)
  console.log("New registration:", body);

  return Response.json({ ok: true });
}