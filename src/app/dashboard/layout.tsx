import styles from "./layout.module.css";
import Sidebar from "./Sidebar";
import Chatbot from "./Chatbot";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <main className={styles.content}>{children}</main>
      <Chatbot />
    </div>
  );
}
