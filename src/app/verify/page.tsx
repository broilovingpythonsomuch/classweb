"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

function VerificationContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");
  const [isVerified, setIsVerified] = useState(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    if (token && email) {
      // Auto-verify if token and email are provided
      verifyEmail(token, email);
    }
  }, [token, email]);

  const verifyEmail = async (verifyToken?: string, verifyEmail?: string) => {
    setIsVerifying(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: verifyToken || token,
          email: verifyEmail || email,
          code: verifyToken ? undefined : verificationCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setMessageType("success");
        setIsVerified(true);
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        setMessage(data.error || "Verification failed");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("An error occurred during verification");
      setMessageType("error");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCodeVerification = () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setMessage("Please enter a 6-digit verification code");
      setMessageType("error");
      return;
    }

    if (!email) {
      setMessage("Email is required for verification");
      setMessageType("error");
      return;
    }

    verifyEmail(undefined, email);
  };

  const handleResendEmail = async () => {
    if (!email) {
      setMessage("Email is required to resend verification");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/verify", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: decodeURIComponent(email),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setMessageType("success");
      } else {
        setMessage(data.error || "Failed to resend verification email");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("An error occurred while resending the email");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {isVerified ? (
              <CheckCircle className="h-12 w-12 text-green-500" />
            ) : (
              <Mail className="h-12 w-12 text-blue-500" />
            )}
          </div>
          <CardTitle className="text-2xl">Email Verification</CardTitle>
          <CardDescription>
            {isVerified 
              ? "Your email has been verified successfully!"
              : "Please verify your email address to activate your account"
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {!isVerified && (
            <>
              {token && email ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Verifying your email automatically...
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="space-y-2">
                    <label htmlFor="code" className="text-sm font-medium">
                      Verification Code
                    </label>
                    <Input
                      id="code"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      maxLength={6}
                      className="text-center text-lg tracking-widest"
                    />
                  </div>

                  <Button 
                    onClick={handleCodeVerification}
                    disabled={isVerifying || verificationCode.length !== 6}
                    className="w-full"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify Email"
                    )}
                  </Button>

                  <div className="text-center">
                    <Button 
                      variant="link" 
                      onClick={handleResendEmail}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Resend verification email"
                      )}
                    </Button>
                  </div>
                </>
              )}
            </>
          )}

          {message && (
            <Alert className={messageType === "error" ? "border-red-200 bg-red-50" : 
                             messageType === "success" ? "border-green-200 bg-green-50" : 
                             "border-blue-200 bg-blue-50"}>
              <AlertCircle className={`h-4 w-4 ${messageType === "success" ? "text-green-500" : 
                                                    messageType === "error" ? "text-red-500" : 
                                                    "text-blue-500"}`} />
              <AlertDescription className={messageType === "success" ? "text-green-700" : 
                                                      messageType === "error" ? "text-red-700" : 
                                                      "text-blue-700"}>
                {message}
              </AlertDescription>
            </Alert>
          )}

          <div className="text-center text-sm text-gray-600">
            <Link href="/" className="text-blue-600 hover:underline">
              Back to Sign In
            </Link>
          </div>

          {isVerified && (
            <div className="text-center text-sm text-gray-600">
              Redirecting to sign in page...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <VerificationContent />
    </Suspense>
  );
}
