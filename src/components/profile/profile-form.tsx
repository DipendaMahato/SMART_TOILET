
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useRef, useEffect } from "react";
import { UserCircle } from "lucide-react";
import { format } from "date-fns";
import { useFirestore, useUser, useMemoFirebase, useStorage } from "@/firebase";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";

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
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ProfileSchema } from "@/lib/schemas";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type ProfileFormValues = z.infer<typeof ProfileSchema>;

export function ProfileForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const storage = useStorage();

  const profileRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, "users", user.uid);
  }, [firestore, user?.uid]);


  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: "",
      dateOfBirth: "",
      gender: undefined,
      bloodGroup: undefined,
      height: 0,
      weight: 0,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (user && user.photoURL) {
        setAvatarPreview(user.photoURL);
    }
    if (user && !isUserLoading && profileRef) {
        const fetchProfile = async () => {
            try {
                const docSnap = await getDoc(profileRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const fullName = [data.firstName, data.lastName].filter(Boolean).join(' ');
                    
                    let dateOfBirthString: string | null = null;
                    if (data.dateOfBirth) {
                        let dateObj: Date;
                        if (data.dateOfBirth instanceof Timestamp) {
                            dateObj = data.dateOfBirth.toDate();
                        } else { // Assuming it could be a string or other parsable format
                            dateObj = new Date(data.dateOfBirth);
                        }
                        // Check if the date is valid before formatting
                        if (!isNaN(dateObj.getTime())) {
                            dateOfBirthString = format(dateObj, 'yyyy-MM-dd');
                        }
                    }

                    form.reset({
                        name: fullName || user.displayName || "",
                        dateOfBirth: dateOfBirthString,
                        gender: data.gender,
                        bloodGroup: data.bloodGroup,
                        height: data.height || 0,
                        weight: data.weight || 0,
                    });
                    if (data.photoURL) {
                        setAvatarPreview(data.photoURL);
                    }
                } else {
                     form.reset({
                        name: user.displayName || "",
                     });
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Could not fetch your profile data.",
                });
            }
        };
        fetchProfile();
    }
  }, [user, isUserLoading, form, profileRef, toast]);

  async function onSubmit(data: ProfileFormValues) {
    if (!profileRef || !user || !storage) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "User not authenticated or storage service unavailable.",
        });
        return;
    }
    setLoading(true);
    
    try {
      let photoURL = user.photoURL;

      if (avatarFile) {
        const storageRef = ref(storage, `avatars/${user.uid}/${avatarFile.name}`);
        const uploadResult = await uploadBytes(storageRef, avatarFile);
        photoURL = await getDownloadURL(uploadResult.ref);
      }

      await updateProfile(user, {
          displayName: data.name,
          photoURL: photoURL,
      });

      const [firstName, ...lastNameParts] = data.name.split(' ');
      const lastName = lastNameParts.join(' ');

      const profileData = {
        id: user.uid,
        firstName: firstName,
        lastName: lastName,
        email: user.email,
        photoURL: photoURL,
        gender: data.gender,
        bloodGroup: data.bloodGroup,
        height: data.height,
        weight: data.weight,
        dateOfBirth: data.dateOfBirth ? Timestamp.fromDate(new Date(data.dateOfBirth)) : null,
      };

      await setDoc(profileRef, profileData, { merge: true });

      toast({
        title: "Profile Updated",
        description: "Your medical profile has been saved successfully.",
      });

    } catch (error: any) {
       toast({
        variant: "destructive",
        title: "Profile Update Failed",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
        setLoading(false);
    }
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setAvatarFile(file);
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
                                <AvatarImage src={avatarPreview || undefined} alt="User avatar"/>
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
                <FormItem>
                  <FormLabel>Date of birth</FormLabel>
                   <FormControl>
                        <Input 
                            placeholder="YYYY-MM-DD" 
                            {...field}
                            value={field.value ?? ""}
                         />
                    </FormControl>
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
                    <Input type="number" placeholder="e.g., 175" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />
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
                    <Input type="number" placeholder="e.g., 70" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />
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
