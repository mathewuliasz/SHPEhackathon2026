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

export default function PrescriptionsPage() {
  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Prescriptions</h1>
          <p className={styles.subtitle}>
            Manage and review your active medications.
          </p>
        </div>

        <button type="button" className={styles.renewButton}>
          <svg viewBox="0 0 24 24">
            <path d="M20 11a8 8 0 1 1-2.34-5.66" />
            <path d="M20 4v7h-7" />
          </svg>
          Request Renewal
        </button>
      </div>

      <label className={styles.search}>
        <svg viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input type="search" placeholder="Search medications or doctors..." />
      </label>

      <div className={styles.tableShell}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Medication</th>
              <th>Dosage</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Doctor</th>
              <th>Status</th>
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
                    {item.status}
                  </span>
                </td>
                <td className={styles.actionCell}>
                  <button type="button" className={styles.detailsButton}>
                    View Details
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
