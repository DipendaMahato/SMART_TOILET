
import { RegisterForm } from "@/components/auth/register-form";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
         <div className="flex justify-center mb-6">
            <Image src="/logo.png" alt="App Logo" width={80} height={80} />
        </div>
        <h1 className="font-headline text-3xl font-bold text-center mb-2 text-primary">
          Create an Account
        </h1>
        <p className="text-center text-muted-foreground mb-6">
          Start your health journey with us today.
        </p>
        <RegisterForm />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
