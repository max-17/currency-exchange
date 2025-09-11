import "./globals.css";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Currency Exchange App",
  description: "",
  authors: { name: "max-17", url: "maxmud-dev.uz" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (session?.user.role === "ADMIN") {
    return (
      <html lang="en" suppressHydrationWarning>
        <body>
          <Providers>{children}</Providers>
        </body>
      </html>
    );
  } else {
    return redirect("/api/auth/signin");
  }
}
