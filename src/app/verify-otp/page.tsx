
import { VerifyOtpForm } from "@/components/auth/verify-otp-form";
import Image from "next/image";

export default function VerifyOtpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
            <Image src="/logo.png" alt="App Logo" width={80} height={80} />
        </div>
        <h1 className="font-headline text-3xl font-bold text-center mb-2 text-primary">
          Verify Your Account
        </h1>
        <p className="text-center text-muted-foreground mb-6">
          Enter the 6-digit code sent to your email.
        </p>
        <VerifyOtpForm />
      </div>
    </div>
  );
}
