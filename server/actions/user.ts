"use server";

import { db } from "@/lib/db";
import { User } from "@prisma/client";

type CreateUserPayload = Pick<User, "name" | "email" | "role"> & {
  branchIds?: string[];
};

export async function createUser(data: CreateUserPayload) {
  try {
    const { branchIds, ...rest } = data;
    await db.user.create({
      data: {
        ...rest,
        Branches: branchIds
          ? { connect: branchIds.map((id) => ({ id })) }
          : undefined,
      },
    });
    console.log("user created");
  } catch (error) {
    console.error(error);
  }
}

export async function getUserById(id: string) {
  const data = await db.user.findUnique({
    where: { id },
    include: { Branches: { select: { id: true, name: true } } },
  });
  return data;
}

export async function getAllUsers() {
  const data = await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      Branches: { select: { id: true, name: true } },
    },
  });
  return data;
}

export async function updateUser(
  data: { id: string } & Partial<User> & { branchIds?: string[] }
) {
  const { id, branchIds, ...rest } = data;
  await db.user.update({
    where: { id },
    data: {
      ...rest,
      Branches: branchIds
        ? { set: branchIds.map((id) => ({ id })) }
        : undefined,
    },
  });
}

export async function deleteUser(id: string) {
  await db.user.delete({ where: { id } });
  return "success";
}
