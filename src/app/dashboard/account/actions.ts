'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateEmail(formData: FormData) {
  const newEmail = formData.get('email') as string;
  
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) throw error;

    revalidatePath('/dashboard/account');
    return { success: true, message: 'Email update confirmation sent!' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
