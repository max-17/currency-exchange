import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ReactNode } from "react";
import { auth } from "@/auth";
import { SignOutButton } from "@/components/auth-buttons";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (session?.user.role !== "ADMIN" && !session?.user.Branches?.length) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center gap-4">
        <h1>Вы еще не назначены ни в одну филиал.</h1>
        <SignOutButton variant="destructive" className="mt-4" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
