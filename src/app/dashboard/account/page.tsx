"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { updateEmail } from "./actions";

const accountSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  currentPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

type AccountForm = z.infer<typeof accountSchema>;

export default function Account() {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountForm>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      fullName: "John Doe",
      email: "",
      currentPassword: "",
      newPassword: "",
    },
  });

  const onSubmit = async (data: AccountForm) => {
    try {
      console.log("Form data:", data);
      toast.success("Account information updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update account information");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="bg-white/70 backdrop-blur-lg shadow-lg border-emerald-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <Input
                  {...register("fullName")}
                  disabled={!isEditing}
                  className="mt-1"
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {isEditing && (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <Input
                      {...register("email")}
                      type="email"
                      className="mt-1"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <Input
                      {...register("currentPassword")}
                      type="password"
                      className="mt-1"
                    />
                    {errors.currentPassword && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <Input
                      {...register("newPassword")}
                      type="password"
                      className="mt-1"
                    />
                    {errors.newPassword && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.newPassword.message}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end gap-4">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white"
                  >
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white"
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-white/70 backdrop-blur-lg shadow-lg border-emerald-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Update Email
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* <form action={updateEmail} className="space-y-4">
            <div>
              <Input
                type="email"
                name="email"
                placeholder="New Email Address"
                required
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full">
              Update Email
            </Button>
          </form> */}
        </CardContent>
      </Card>
    </div>
  );
}
