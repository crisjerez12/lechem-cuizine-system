"use server";

import { createClient } from "@/utils/supabase/server";

export async function updateCredential(field: string, value: string) {
  const supabase = await createClient();

  const updatePayload =
    field === "display_name"
      ? { data: { display_name: value } }
      : { [field]: value };

  const { data, error } = await supabase.auth.updateUser(updatePayload);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getUserCredentials() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  const userData = {
    fullName: user?.user_metadata.display_name || "Not Set",
    email: user?.email,
  };
  if (error)
    return {
      success: false,
      data: userData,
    };
  return { success: true, data: userData };
}
