"use server";

import supabase from "@/lib/supabase";
import type { CateringItem } from "@/lib/types/cateringType";
import { fileTypeFromBuffer } from "file-type";

async function getFileExtension(base64String: string): Promise<string> {
  const base64 = base64String.split(",")[1] || base64String;
  const buffer = Buffer.from(base64, "base64");
  const fileType = await fileTypeFromBuffer(buffer);
  return fileType?.ext || "jpg";
}

async function base64ToBuffer(base64String: string): Promise<Buffer> {
  const base64 = base64String.split(",")[1] || base64String;
  return Buffer.from(base64, "base64");
}

async function getSignedUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from("offers-image")
    .createSignedUrl(path, 365 * 24 * 60 * 60); // 1 year in seconds

  if (error) throw error;
  return data.signedUrl;
}

export async function getOffers() {
  const { data, error } = await supabase.from("packages").select("*");
  if (error) throw error;
  return data;
}

export async function addCateringItem(data: Omit<CateringItem, "id">) {
  const { image, ...rest } = data;
  const { data: newItem, error } = await supabase
    .from("packages")
    .insert([rest])
    .select()
    .single();

  if (error) throw error;
  if (image) {
    const extension = await getFileExtension(image);
    const fileName = `${newItem.id}.${extension}`;
    const buffer = await base64ToBuffer(image);

    const { error: uploadError } = await supabase.storage
      .from("offers-image")
      .upload(fileName, buffer, {
        cacheControl: "3600",
        contentType: `image/${extension}`,
        upsert: false,
      });
    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw uploadError;
    }

    const signedUrl = await getSignedUrl(fileName);

    const { error: updateError } = await supabase
      .from("packages")
      .update({ image: signedUrl })
      .eq("id", newItem.id);

    if (updateError) throw updateError;

    newItem.image = signedUrl;
  }

  return { success: true, item: newItem };
}

export async function updateCateringItem(
  id: string,
  data: Partial<CateringItem>
) {
  const { image, ...rest } = data;
  const { data: updatedItem, error } = await supabase
    .from("packages")
    .update(rest)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  if (image) {
    const extension = await getFileExtension(image);
    const fileName = `${id}.${extension}`;
    const buffer = await base64ToBuffer(image);

    const { error: uploadError } = await supabase.storage
      .from("offers-image")
      .upload(fileName, buffer, {
        contentType: `image/${extension}`,
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw uploadError;
    }

    const signedUrl = await getSignedUrl(fileName);

    const { error: updateError } = await supabase
      .from("packages")
      .update({ image: signedUrl })
      .eq("id", id);

    if (updateError) throw updateError;

    updatedItem.image = signedUrl;
  }

  return { success: true, item: updatedItem };
}

export async function deleteCateringItem(id: string) {
  const { error } = await supabase.from("packages").delete().eq("id", id);

  if (error) throw error;
  return { success: true };
}
