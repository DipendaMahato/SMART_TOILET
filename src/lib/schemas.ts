
import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export const RegisterSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

export const ProfileSchema = z.object({
  avatar: z.any().optional(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  dateOfBirth: z.date({ required_error: "Date of birth is required."}).optional().nullable(),
  gender: z.enum(["male", "female", "other"], { required_error: "Please select a gender."}),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], { required_error: "Please select a blood group."}),
  height: z.coerce.number().positive({ message: "Height must be a positive number." }),
  weight: z.coerce.number().positive({ message: "Weight must be a positive number." }),
});

    