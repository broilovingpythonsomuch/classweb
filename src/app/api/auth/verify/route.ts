import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, email } = body;

    if (!token || !email) {
      return NextResponse.json(
        { error: "Token and email are required" },
        { status: 400 }
      );
    }

    const sanitizedEmail = email.toLowerCase().trim();

    const user = await db.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid verification link" },
        { status: 400 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json({
        message: "Email already verified. You can now sign in.",
      });
    }

    if (user.verificationToken !== token) {
      return NextResponse.json(
        { error: "Invalid verification token" },
        { status: 400 }
      );
    }

    if (user.tokenExpiry && new Date() > user.tokenExpiry) {
      return NextResponse.json(
        { error: "Verification link has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Update user as verified
    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        tokenExpiry: null,
      },
    });

    return NextResponse.json({
      message: "Email verified successfully. You can now sign in.",
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}

// Resend verification email
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const sanitizedEmail = email.toLowerCase().trim();

    const user = await db.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (!user) {
      // Don't reveal if email exists
      return NextResponse.json({
        message: "If an account exists, a new verification email has been sent.",
      });
    }

    if (user.emailVerified) {
      return NextResponse.json({
        message: "Email already verified. You can sign in.",
      });
    }

    // Generate new token
    const crypto = await import("crypto");
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await db.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        tokenExpiry,
      },
    });

    // In production, send email here
    // await sendVerificationEmail(email, verificationToken);

    return NextResponse.json({
      message: "If an account exists, a new verification email has been sent.",
      // Remove in production
      verificationToken: process.env.NODE_ENV === "development" ? verificationToken : undefined,
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Failed to resend verification" },
      { status: 500 }
    );
  }
}
