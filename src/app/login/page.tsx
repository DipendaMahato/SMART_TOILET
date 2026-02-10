
import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";
import { AppLogo } from "@/components/logo";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
            <AppLogo className="h-20 w-20" />
        </div>
        <h1 className="font-headline text-3xl font-bold text-center mb-2 text-primary">
          Welcome Back
        </h1>
        <p className="text-center text-muted-foreground mb-6">
          Sign in to access your health dashboard.
        </p>
        <LoginForm />
        <div className="flex justify-between mt-4 text-sm">
            <p className="text-muted-foreground">
             <Link href="/forgot-password" className="font-medium text-primary hover:underline">
                Forgot password?
             </Link>
            </p>
            <p className="text-muted-foreground">
             Don't have an account?{' '}
             <Link href="/register" className="font-medium text-primary hover:underline">
                Sign up
             </Link>
            </p>
        </div>
      </div>
    </div>
  );
}
