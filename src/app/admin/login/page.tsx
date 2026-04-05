import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function AdminLoginPage() {
  const user = await getCurrentUser();

  if (user?.role === "admin") {
    redirect("/admin");
  }

  redirect("/auth");
}
