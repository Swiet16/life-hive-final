import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { SESSION_COOKIE, destroySession } from "@/lib/session";

export async function POST() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (token) await destroySession(token);
  (await cookies()).delete(SESSION_COOKIE);
  return NextResponse.json({ ok: true });
}
