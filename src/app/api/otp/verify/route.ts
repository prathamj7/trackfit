import { NextResponse } from "next/server";

// Reuse global in-memory stores
const otpStore: Map<string, { code: string; expiresAt: number; name: string }> = (global as any).__OTP_STORE__ || new Map();
(global as any).__OTP_STORE__ = otpStore;

const sessionStore: Map<string, { email: string; name: string; createdAt: number }> = (global as any).__SESS_STORE__ || new Map();
(global as any).__SESS_STORE__ = sessionStore;

function generateToken() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return (crypto as any).randomUUID();
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();
    if (!email || !code) {
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
    }

    const key = email.toLowerCase();
    const rec = otpStore.get(key);
    if (!rec) {
      return NextResponse.json({ error: "OTP not found. Please request a new code." }, { status: 404 });
    }

    if (Date.now() > rec.expiresAt) {
      otpStore.delete(key);
      return NextResponse.json({ error: "OTP expired. Please request a new code." }, { status: 410 });
    }

    if (rec.code !== String(code)) {
      return NextResponse.json({ error: "Invalid OTP. Please check and try again." }, { status: 401 });
    }

    // Success: create a simple session token
    const token = generateToken();
    sessionStore.set(token, { email: key, name: rec.name, createdAt: Date.now() });
    otpStore.delete(key);

    return NextResponse.json({
      ok: true,
      token,
      user: { email: key, name: rec.name },
    });
  } catch (e) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}