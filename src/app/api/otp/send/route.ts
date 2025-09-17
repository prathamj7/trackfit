import { NextResponse } from "next/server";

// In-memory OTP store (email -> { code, expiresAt, name })
const otpStore: Map<string, { code: string; expiresAt: number; name: string }> = (global as any).__OTP_STORE__ || new Map();
(global as any).__OTP_STORE__ = otpStore;

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
}

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();
    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const code = generateCode();
    const ttlMs = 10 * 60 * 1000; // 10 minutes
    otpStore.set(email.toLowerCase(), { code, expiresAt: Date.now() + ttlMs, name });

    // TODO: Integrate real email provider. For now, log to server for demo.
    console.log(`[TrackFit] OTP for ${email}: ${code} (valid 10m)`);

    return NextResponse.json({ ok: true, message: "OTP sent to email" });
  } catch (e) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}