"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/firebase";
import type { RegisterSchema } from "@/lib/schemas";

const VerifyOtpSchema = z.object({
  otp: z.string().min(6, { message: "OTP must be 6 digits." }).max(6),
});

export function VerifyOtpForm() {
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [storedOtp, setStoredOtp] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<z.infer<typeof RegisterSchema> | null>(null);
  const [emailForVerification, setEmailForVerification] = useState<string | null>(null);

  useEffect(() => {
    // Client-side only
    const otp = sessionStorage.getItem('otp');
    const details = sessionStorage.getItem('user_details');
    const email = sessionStorage.getItem('email_for_verification');

    setStoredOtp(otp);
    setEmailForVerification(email);
    if (details) {
      setUserDetails(JSON.parse(details));
    }
  }, []);

  const form = useForm<z.infer<typeof VerifyOtpSchema>>({
    resolver: zodResolver(VerifyOtpSchema),
    defaultValues: {
      otp: "",
    },
  });

  async function onSubmit(values: z.infer<typeof VerifyOtpSchema>) {
    setLoading(true);

    if (values.otp !== storedOtp) {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "The code you entered is incorrect. Please try again.",
      });
      setLoading(false);
      return;
    }

    // OTP is correct, proceed with action (registration or password reset)
    if (userDetails) {
      // This is a registration flow
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          userDetails.email,
          userDetails.password
        );
        await updateProfile(userCredential.user, {
          displayName: userDetails.name,
        });

        toast({
          title: "Success!",
          description: "Your account has been created successfully.",
        });

        // Clean up session storage
        sessionStorage.removeItem('otp');
        sessionStorage.removeItem('user_details');
        
        router.push("/dashboard/profile"); // Redirect to profile to complete details

      } catch (error: any) {
        console.error("Firebase registration failed:", error);
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: error.message || "An unexpected error occurred during registration.",
        });
      }
    } else if (emailForVerification) {
      // This is a password reset flow
      toast({
        title: "OTP Verified",
        description: "You can now reset your password.",
      });
      // In a real app, you would redirect to a password reset page.
      // For now, we'll just clean up and go to login.
      sessionStorage.removeItem('otp');
      sessionStorage.removeItem('email_for_verification');
      router.push("/login"); // Should be a reset password page
    }

    setLoading(false);
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <Input placeholder="123456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" loading={loading}>
              Verify
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
