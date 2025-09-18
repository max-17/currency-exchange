import { db } from "@/lib/db";
import { Role } from "@prisma/client";
import { createHash } from "crypto";
import NextAuth, { User, NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const BASE_PATH = "/api/auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: Role;
      Branches: string[];
    };
  }
}

export const authOptions: NextAuthConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials
      ): Promise<(User & { role: Role; Branches: string[] }) | null> {
        //hashing credentials?.password
        const hashedPassword = createHash("sha256")
          .update(credentials?.password as string)
          .digest("hex");
        const user = await db.user.findUnique({
          where: {
            email: credentials?.username as string,
            passwordHash: hashedPassword,
          },
          select: {
            id: true,
            name: true,
            Branches: { select: { id: true } },
            role: true,
          },
        });
        return user
          ? {
              id: user.id.toString(),
              name: user.name,
              role: user.role,
              Branches: user.Branches.map((b) => b.id),
            }
          : null;
      },
    }),
  ],
  basePath: BASE_PATH,
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.role = token.role as Role;
        session.user.Branches = token.Branches as string[];
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.role = (user as any).role;
        token.Branches = (user as any).Branches;
      }
      return token;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
