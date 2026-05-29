import { NextRequest, NextResponse } from "next/server";

type User = {
  id: number;
  name: string;
};

type CreateUserBody = {
  name: string;
};

export async function GET() {
  const users: User[] = [
    { id: 1, name: "Harry" },
    { id: 2, name: "John" },
  ];

  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const body: CreateUserBody = await req.json();

  return NextResponse.json({
    message: "User created",
    data: body,
  });
}