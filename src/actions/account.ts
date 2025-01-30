"use server";

interface AccountData {
  fullName: string;
  currentPassword: string;
  newPassword: string;
}

export async function updateAccount(data: AccountData) {
  // Simulated account update
  if (data.currentPassword === "admin") {
    return { success: true };
  }
  return { success: false, error: "Invalid current password" };
}