export async function GET() {
  const users = [
    { id: 1, name: "Harry" },
    { id: 2, name: "John" },
  ];

  return Response.json(users);
}

export async function POST(request) {
  const body = await request.json();

  return Response.json({
    message: "User created",
    data: body,
  });
}