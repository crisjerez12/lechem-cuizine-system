"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { LoginForm, loginSchema } from "@/lib/types/loginTypes";
import { authenticate } from "@/actions/auth";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await authenticate(data);
      console.log(res);
      if (!res.success) {
        toast.error("Something went wrong");
        return;
      }
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-emerald-100">
          <div className="flex flex-col items-center space-y-2 mb-8">
            <div className="h-20 flex items-center justify-center ">
              <Image src="/logo.png" height={150} width={150} alt="logo" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Lechem Cuizine</h1>
            <p className="text-sm text-gray-600">Reservation System</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="email"
                {...register("email")}
                className="rounded-xl border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2 relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password")}
                className="rounded-xl border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white rounded-xl h-12 font-medium shadow-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
