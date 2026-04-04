import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Chatbot from "./Chatbot";
import DashboardShell from "./DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth");
  }

  return (
    <>
      <DashboardShell user={{ fullName: user.fullName, email: user.email }}>
        {children}
      </DashboardShell>
      <Chatbot />
    </>
  );
}
