"use server";
import { revalidatePath } from "next/cache";

export async function revalidateAdminProducts() {
  revalidatePath("/admin/products");
}
