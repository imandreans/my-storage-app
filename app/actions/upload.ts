"use server";
import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";

export async function uploadFile(formData: FormData) {
  // 1. Cek autentikasi
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  // 2. Ambil file dari form
  const file = formData.get("file") as File;
  if (!file) throw new Error("No file selected");

  // 3. Upload ke Vercel Blob
  const blob = await put(file.name, file, { access: "public" });

  // 4. Simpan metadata ke Database
  await prisma.file.create({
    data: {
      name: file.name,
      url: blob.url,
      size: file.size,
      type: file.type,
      userId: user.id,
      userName:
        user.fullName || user.primaryEmailAddress?.emailAddress || "Unknown",
    },
  });

  // 5. Refresh halaman
  revalidatePath("/");
  return { success: true, url: blob.url };
}

export async function getFiles() {
  const { userId } = await auth();
  if (!userId) return [];

  return await prisma.file.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteFile(fileId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const file = await prisma.file.findUnique({ where: { id: fileId } });
  if (!file || file.userId !== userId) throw new Error("Forbidden");

  // Hapus dari database
  await prisma.file.delete({ where: { id: fileId } });

  revalidatePath("/");
}
