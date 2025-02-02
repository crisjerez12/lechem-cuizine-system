"use server";

import { LoginForm } from "@/lib/types/loginTypes";
import { createClient } from "@/utils/supabase/server";

interface AuthResponse {
  success: boolean;
  error?: string;
  user?: any;
}

export async function authenticate(data: LoginForm): Promise<AuthResponse> {
  try {
    const supabase = await createClient();
    const { email, password } = data;
    const {
      data: { user },
      error,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return {
        success: false,
      };
    }

    // Verify session was created
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return {
        success: false,
        error: "Failed to create session",
      };
    }
    return {
      success: true,
      user: user,
    };
  } catch (error) {
    return {
      success: false,
      error: "An unexpected error occurred during authentication",
    };
  }
}

export async function logout(): Promise<AuthResponse> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: "An unexpected error occurred during logout",
    };
  }
}
