import { NextRequest, NextResponse } from "next/server";
import {
  clearAdminSession,
  setAdminSession,
  validateAdminCredentials,
  verifyAdminSession,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  return NextResponse.json({ authenticated: verifyAdminSession(request) });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { username?: string; password?: string };

  if (!validateAdminCredentials(String(body.username || ""), String(body.password || ""))) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  const response = NextResponse.json({ authenticated: true });
  setAdminSession(response);
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  clearAdminSession(response);
  return response;
}
