"use server";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";

export async function getAllBranches() {
  const branches = await db.branch.findMany({
    select: { id: true, name: true },
  });
  return branches;
}

export async function getUserBranchIds(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { Branches: { select: { id: true } } },
  });
  return (user?.Branches || []).map((b) => b.id);
}

export async function assignBranchesToUser(
  userId: string,
  branchIds: string[]
) {
  // Use Prisma implicit many-to-many relation on User.Branches.
  // Replace the user's branches with the provided set.
  await db.user.update({
    where: { id: userId },
    data: {
      Branches: {
        set: branchIds.map((id) => ({ id })),
      },
    },
  });

  return true;
}

export async function createBranch(name: string, address?: string, currentUserId?: string) {
  if (currentUserId) {
    const u = await db.user.findUnique({ where: { id: currentUserId }, select: { role: true } });
    if (!u || u.role !== Role.ADMIN) throw new Error("Unauthorized");
  }
  return db.branch.create({ data: { name, address } });
}

export async function deleteBranch(id: string, currentUserId?: string) {
  if (currentUserId) {
    const u = await db.user.findUnique({ where: { id: currentUserId }, select: { role: true } });
    if (!u || u.role !== Role.ADMIN) throw new Error("Unauthorized");
  }
  await db.branch.delete({ where: { id } });
  return true;
}

export async function updateBranch(id: string, data: { name?: string; address?: string }, currentUserId?: string) {
  if (currentUserId) {
    const u = await db.user.findUnique({ where: { id: currentUserId }, select: { role: true } });
    if (!u || u.role !== Role.ADMIN) throw new Error("Unauthorized");
  }
  return db.branch.update({ where: { id }, data });
}
