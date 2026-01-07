
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import Image from "next/image";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Image src="/logo.png" alt="App Logo" width={80} height={80} />
        </div>
        <h1 className="font-headline text-3xl font-bold text-center mb-2 text-primary">
          Reset Your Password
        </h1>
        <p className="text-center text-muted-foreground mb-6">
          Enter a new password for your account.
        </p>
        <ResetPasswordForm />
      </div>
    </div>
  );
}
