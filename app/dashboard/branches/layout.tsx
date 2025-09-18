import { ReactNode } from "react";
import getServerSession from "next-auth";
import { auth, authOptions } from "@/auth/index";

export default async function BranchesLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-600">Доступ запрещён</h1>
        <p className="mt-2">
          У вас нет прав для просмотра этой страницы. Обратитесь к
          администратору.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
