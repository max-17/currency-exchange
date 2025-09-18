import { signOut } from "@/auth/helpers";
import { redirect } from "next/navigation";
import { Button } from "./ui/button";
import { ButtonProps } from "./ui/button";

export function SignInButton(props: ButtonProps) {
  return (
    <Button
      {...props}
      type="button"
      onClick={() => redirect("/api/auth/signin")}
    >
      Sign In
    </Button>
  );
}

export function SignUpButton(props: ButtonProps) {
  return (
    <Button
      {...props}
      type="button"
      onClick={() => redirect("/api/auth/signup")}
    >
      Sign Up
    </Button>
  );
}

export function SignOutButton(props: ButtonProps) {
  return (
    <Button {...props} type="button" onClick={signOut}>
      Sign Out
    </Button>
  );
}
