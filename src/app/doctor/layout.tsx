import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import DoctorShell from "./DoctorShell";

export default async function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/doctor/login");
  }

  if (user.role !== "doctor") {
    redirect(user.role === "admin" ? "/admin" : "/dashboard");
  }

  return (
    <DoctorShell user={{ fullName: user.fullName, email: user.email }}>
      {children}
    </DoctorShell>
  );
}
