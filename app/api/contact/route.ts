import { NextRequest, NextResponse } from "next/server";
import { validateEmail, validateName, validateMessage, sanitizeInput } from "@/utils";

const rateLimit = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

function getRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) return false;

  entry.count++;
  return true;
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  if (!getRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in an hour." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, message } = body as Record<string, unknown>;

  if (typeof name !== "string" || !validateName(name)) {
    return NextResponse.json({ error: "Name must be between 2 and 100 characters." }, { status: 422 });
  }

  if (typeof email !== "string" || !validateEmail(email)) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 422 });
  }

  if (typeof message !== "string" || !validateMessage(message)) {
    return NextResponse.json(
      { error: "Message must be between 10 and 5000 characters." },
      { status: 422 }
    );
  }

  const safePayload = {
    name: sanitizeInput(name),
    email: sanitizeInput(email),
    message: sanitizeInput(message),
    sentAt: new Date().toISOString(),
    ip,
  };

  console.info("[contact] New message from:", safePayload.email, "at", safePayload.sentAt);

  return NextResponse.json(
    { success: true, message: "Message received. I'll get back to you within 24 hours." },
    { status: 200 }
  );
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
