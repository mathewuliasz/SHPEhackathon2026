import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import styles from "./layout.module.css";
import Sidebar from "./Sidebar";
import Chatbot from "./Chatbot";

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
    <div className={styles.wrapper}>
      <Sidebar user={user} />
      <main className={styles.content}>{children}</main>
      <Chatbot />
    </div>
  );
}
