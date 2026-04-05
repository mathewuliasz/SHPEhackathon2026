import { getLanguage, t } from "@/lib/language";
import styles from "./page.module.css";

type Prescription = {
  medication: string;
  dosage: string;
  startDate: string;
  endDate: string;
  doctor: string;
  status: "Active" | "Expired" | "Pending";
};

const prescriptions: Prescription[] = [
  {
    medication: "Lisinopril",
    dosage: "10mg — Once daily",
    startDate: "2024-01-15",
    endDate: "2024-07-15",
    doctor: "Dr. Sarah Chen",
    status: "Active",
  },
  {
    medication: "Metformin",
    dosage: "500mg — Twice daily",
    startDate: "2024-02-01",
    endDate: "2024-08-01",
    doctor: "Dr. James Patel",
    status: "Active",
  },
  {
    medication: "Atorvastatin",
    dosage: "20mg — Once at night",
    startDate: "2023-11-10",
    endDate: "2024-05-10",
    doctor: "Dr. Sarah Chen",
    status: "Expired",
  },
  {
    medication: "Amoxicillin",
    dosage: "250mg — Three times daily",
    startDate: "2024-06-01",
    endDate: "2024-06-10",
    doctor: "Dr. Maria Lopez",
    status: "Pending",
  },
  {
    medication: "Omeprazole",
    dosage: "20mg — Once daily",
    startDate: "2024-03-20",
    endDate: "2024-09-20",
    doctor: "Dr. James Patel",
    status: "Active",
  },
];

export default async function PrescriptionsPage() {
  const lang = await getLanguage();

  const statusLabel = (status: string) => {
    if (status === "Active") return t(lang, "rx_active");
    if (status === "Expired") return t(lang, "rx_expired");
    return t(lang, "rx_pending");
  };

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t(lang, "rx_title")}</h1>
          <p className={styles.subtitle}>{t(lang, "rx_subtitle")}</p>
        </div>

        <button type="button" className={styles.renewButton}>
          <svg viewBox="0 0 24 24">
            <path d="M20 11a8 8 0 1 1-2.34-5.66" />
            <path d="M20 4v7h-7" />
          </svg>
          {t(lang, "rx_requestRenewal")}
        </button>
      </div>

      <label className={styles.search}>
        <svg viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input type="search" placeholder={t(lang, "rx_searchPlaceholder")} />
      </label>

      <div className={styles.tableShell}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t(lang, "rx_medication")}</th>
              <th>{t(lang, "rx_dosage")}</th>
              <th>{t(lang, "rx_startDate")}</th>
              <th>{t(lang, "rx_endDate")}</th>
              <th>{t(lang, "rx_doctor")}</th>
              <th>{t(lang, "rx_status")}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((item) => (
              <tr key={`${item.medication}-${item.startDate}`}>
                <td className={styles.medication}>{item.medication}</td>
                <td className={styles.dosage}>{item.dosage}</td>
                <td>{item.startDate}</td>
                <td>{item.endDate}</td>
                <td>{item.doctor}</td>
                <td>
                  <span
                    className={`${styles.status} ${
                      item.status === "Active"
                        ? styles.statusActive
                        : item.status === "Expired"
                          ? styles.statusExpired
                          : styles.statusPending
                    }`}
                  >
                    {statusLabel(item.status)}
                  </span>
                </td>
                <td className={styles.actionCell}>
                  <button type="button" className={styles.detailsButton}>
                    {t(lang, "rx_viewDetails")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
