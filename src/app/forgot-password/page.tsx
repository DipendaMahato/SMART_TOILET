
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { AppLogo } from "@/components/logo";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
            <AppLogo className="h-20 w-20" />
        </div>
        <h1 className="font-headline text-3xl font-bold text-center mb-2 text-primary">
          Forgot Password
        </h1>
        <p className="text-center text-muted-foreground mb-6">
          Enter your email to receive a password reset code.
        </p>
        <ForgotPasswordForm />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Remember your password?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
