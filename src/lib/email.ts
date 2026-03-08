import { Resend } from "resend";
import VerificationEmail from "@/emails/VerificationEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendVerificationEmailParams {
  email: string;
  verificationCode: string;
  verificationToken: string;
  userName: string;
}

export async function sendVerificationEmail({
  email,
  verificationCode,
  verificationToken,
  userName,
}: SendVerificationEmailParams) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || "http://localhost:3000";
    const verificationUrl = `${baseUrl}/verify?token=${verificationToken}&email=${encodeURIComponent(email)}`;

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Class 7.3 <noreply@class7.3.app>",
      to: [email],
      subject: "Verify your Class 7.3 account",
      react: VerificationEmail({
        verificationCode,
        verificationUrl,
        userName,
      }),
    });

    if (error) {
      console.error("Email send error:", error);
      return { success: false, error: error.message };
    }

    console.log("Email sent successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Email service error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to send email" 
    };
  }
}

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
