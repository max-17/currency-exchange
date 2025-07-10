"use server";

import { db } from "@/lib/db";
import { User } from "@prisma/client";

export async function createUser(
  data: Pick<User, "name" | "email" | "phone" | "role">
) {
  try {
    await db.user.create({ data });
    console.log("user created");
  } catch (error) {
    console.error(error);
  }
}

export async function getUserById(id: string) {
  const data = await db.user.findUnique({ where: { id } });
  return data;
}

export async function getAllUsers() {
  const data = await db.user.findMany({
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      role: true,
    },
  });
  return data;
}

export async function updateUser(data: { id: string } & Partial<User>) {
  await db.user.update({ where: { id: data.id }, data });
}

export async function deleteUser(id: string) {
  await db.user.delete({ where: { id } });
  return "success";
}
