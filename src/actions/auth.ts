"use server";

import { LoginForm } from "@/lib/types/loginTypes";

export async function authenticate(data: LoginForm) {
  console.log(data);
  return { success: true };
}
