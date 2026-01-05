"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useRef, useEffect } from "react";
import { CalendarIcon, UserCircle } from "lucide-react";
import { format } from "date-fns";
import { useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ProfileSchema } from "@/lib/schemas";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";

type ProfileFormValues = z.infer<typeof ProfileSchema>;

export function ProfileForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const profileRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, "users", user.uid);
  }, [firestore, user?.uid]);


  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: "",
      gender: undefined,
      bloodGroup: undefined,
      height: 0,
      weight: 0,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (user && !isUserLoading && profileRef) {
        form.setValue("name", user.displayName || "");
        
        const fetchProfile = async () => {
            const docSnap = await getDoc(profileRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                form.reset({
                    name: data.name || user.displayName,
                    dateOfBirth: data.dateOfBirth ? (data.dateOfBirth as Timestamp).toDate() : undefined,
                    gender: data.gender,
                    bloodGroup: data.bloodGroup,
                    height: data.height,
                    weight: data.weight,
                });
            }
        };
        fetchProfile();
    }
  }, [user, isUserLoading, form, profileRef]);

  async function onSubmit(data: ProfileFormValues) {
    if (!profileRef || !user) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "User not authenticated. Unable to save profile.",
        });
        return;
    }
    setLoading(true);
    
    const profileData = {
      ...data,
      id: user.uid,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };

    setDocumentNonBlocking(profileRef, profileData, { merge: true });

    setLoading(false);
    toast({
      title: "Profile Updated",
      description: "Your medical profile has been saved successfully.",
    });
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  if (isUserLoading) {
    return <div>Loading profile...</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Profile Picture</FormLabel>
                    <FormControl>
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={avatarPreview || user?.photoURL || undefined} alt="User avatar"/>
                                <AvatarFallback>
                                    {user?.displayName?.charAt(0) || <UserCircle className="h-full w-full text-muted-foreground" />}
                                </AvatarFallback>
                            </Avatar>
                            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                Change Picture
                            </Button>
                            <Input 
                                ref={fileInputRef}
                                type="file" 
                                className="hidden"
                                accept="image/*"
                                onChange={handleAvatarChange}
                             />
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
        <div className="grid md:grid-cols-2 gap-8">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                    <Input placeholder="Your Name" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="bloodGroup"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Blood Group</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select your blood group" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(group => (
                            <SelectItem key={group} value={group}>{group}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Height (cm)</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="e.g., 175" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Weight (kg)</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="e.g., 70" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <Button type="submit" loading={loading}>Save Changes</Button>
      </form>
    </Form>
  );
}
