import LoginForm1 from "../components/mvpblocks/login-form1";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | Dr. Hogr",
  description: "Sign in to access the admin panel.",
};

export default function LoginPage() {
  return <LoginForm1 />;
}
