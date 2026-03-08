import { Button } from "@react-email/button";
import { Html } from "@react-email/html";
import { Head } from "@react-email/head";
import { Font } from "@react-email/font";
import { Container } from "@react-email/container";
import { Section } from "@react-email/section";
import { Text } from "@react-email/text";
import { Heading } from "@react-email/heading";

interface VerificationEmailProps {
  verificationCode: string;
  verificationUrl: string;
  userName: string;
}

export default function VerificationEmail({
  verificationCode,
  verificationUrl,
  userName,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Container style={container}>
        <Section style={header}>
          <Heading style={heading}>Class 7.3 - Email Verification</Heading>
        </Section>
        
        <Section style={content}>
          <Text style={text}>Hi {userName},</Text>
          <Text style={text}>
            Thank you for signing up for Class 7.3! To complete your registration and activate your account, please verify your email address.
          </Text>
          
          <Heading style={subheading}>Verification Code</Heading>
          <div style={codeContainer}>
            <Text style={code}>{verificationCode}</Text>
          </div>
          
          <Text style={text}>Or click the button below to verify instantly:</Text>
          
          <Button
            href={verificationUrl}
            style={button}
          >
            Verify Email Address
          </Button>
          
          <Text style={smallText}>
            This verification link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
          </Text>
          
          <Text style={smallText}>
            If the button doesn't work, you can copy and paste this link into your browser:
          </Text>
          <Text style={linkText}>{verificationUrl}</Text>
        </Section>
        
        <Section style={footer}>
          <Text style={footerText}>
            © 2024 Class 7.3. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Html>
  );
}

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "20px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

const header = {
  textAlign: "center" as const,
  padding: "20px 0",
  borderBottom: "1px solid #e5e7eb",
};

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#1f2937",
  margin: "0",
};

const content = {
  padding: "30px 0",
};

const text = {
  fontSize: "16px",
  lineHeight: "1.5",
  color: "#4b5563",
  margin: "0 0 16px 0",
};

const subheading = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#1f2937",
  margin: "24px 0 12px 0",
};

const codeContainer = {
  backgroundColor: "#f3f4f6",
  border: "2px solid #e5e7eb",
  borderRadius: "8px",
  padding: "16px",
  textAlign: "center" as const,
  margin: "16px 0",
};

const code = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#1f2937",
  letterSpacing: "4px",
  margin: "0",
  fontFamily: "monospace",
};

const button = {
  backgroundColor: "#3b82f6",
  color: "#ffffff",
  padding: "12px 24px",
  borderRadius: "6px",
  textDecoration: "none",
  fontWeight: "600",
  display: "inline-block",
  margin: "16px 0",
};

const smallText = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "16px 0",
  lineHeight: "1.4",
};

const linkText = {
  fontSize: "12px",
  color: "#3b82f6",
  wordBreak: "break-all" as const,
  margin: "8px 0",
};

const footer = {
  textAlign: "center" as const,
  padding: "20px 0",
  borderTop: "1px solid #e5e7eb",
};

const footerText = {
  fontSize: "12px",
  color: "#9ca3af",
  margin: "0",
};
