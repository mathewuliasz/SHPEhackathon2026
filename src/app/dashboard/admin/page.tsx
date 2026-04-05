"use client";

import { useEffect, useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import AdminVolunteerApplications from "@/app/admin/AdminVolunteerApplications";
import styles from "@/app/admin/page.module.css";

type Tab = "volunteers" | "appointments" | "patients";

export default function AdminDashboardPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>("volunteers");

  return (
    <div className={styles.reviewPanel} style={{ minHeight: '80vh' }}>
      <div className={styles.reviewPanelHeader} style={{ marginBottom: '32px' }}>
        <span className={styles.kicker}>Admin Control Panel</span>
        <h2>System Oversight</h2>
        <p>Manage volunteer applications, oversee patient data, and monitor scheduled appointments.</p>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '32px',
        borderBottom: '1px solid rgba(146, 168, 222, 0.2)',
        paddingBottom: '16px'
      }}>
        <TabButton 
          active={activeTab === "volunteers"} 
          onClick={() => setActiveTab("volunteers")}
          label={t("admin_tabVolunteers")}
        />
        <TabButton 
          active={activeTab === "appointments"} 
          onClick={() => setActiveTab("appointments")}
          label={t("admin_tabAppointments")}
        />
        <TabButton 
          active={activeTab === "patients"} 
          onClick={() => setActiveTab("patients")}
          label={t("admin_tabPatients")}
        />
      </div>

      {activeTab === "volunteers" && <AdminVolunteerApplications />}
      {activeTab === "appointments" && <AdminAppointmentManager />}
      {activeTab === "patients" && <AdminPatientOverview />}
    </div>
  );
}

function TabButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '12px 24px',
        borderRadius: '12px',
        border: '0',
        background: active ? 'linear-gradient(135deg, #2f55db, #466bfa)' : 'transparent',
        color: active ? '#fff' : '#5b6377',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
    >
      {label}
    </button>
  );
}

function AdminAppointmentManager() {
  const { t } = useLanguage();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/appointments")
      .then(res => res.json())
      .then(data => {
        setAppointments(data.appointments || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading appointments...</p>;

  return (
    <div className={styles.applicationList}>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
        <thead>
          <tr style={{ textAlign: 'left', color: '#8d96aa', fontSize: '0.9rem' }}>
            <th style={{ padding: '0 24px' }}>{t("admin_appointmentDate")}</th>
            <th>{t("admin_appointmentTime")}</th>
            <th>Patient</th>
            <th>{t("admin_appointmentDoctor")}</th>
            <th>{t("admin_appointmentSpecialty")}</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(app => (
            <tr key={app.id} style={{ background: '#fbfdff', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <td style={{ padding: '20px 24px', borderRadius: '16px 0 0 16px', fontWeight: '600' }}>{app.date}</td>
              <td>{app.time}</td>
              <td style={{ fontWeight: '600', color: '#2f55db' }}>{app.patient_name || 'N/A'}</td>
              <td>{app.doctors?.name}</td>
              <td style={{ borderRadius: '0 16px 16px 0' }}>{app.specialties?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {appointments.length === 0 && <p className={styles.emptyState}>{t("admin_noAppointments")}</p>}
    </div>
  );
}

function AdminPatientOverview() {
  const { t } = useLanguage();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/patients")
      .then(res => res.json())
      .then(data => {
        setPatients(data.patients || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading patients...</p>;

  return (
    <div className={styles.applicationList}>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
        <thead>
          <tr style={{ textAlign: 'left', color: '#8d96aa', fontSize: '0.9rem' }}>
            <th style={{ padding: '0 24px' }}>{t("admin_patientName")}</th>
            <th>{t("admin_patientEmail")}</th>
            <th>{t("admin_patientJoined")}</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(patient => (
            <tr key={patient.id} style={{ background: '#fbfdff', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <td style={{ padding: '20px 24px', borderRadius: '16px 0 0 16px', fontWeight: '700' }}>{patient.full_name}</td>
              <td style={{ color: '#2f55db' }}>{patient.email}</td>
              <td style={{ borderRadius: '0 16px 16px 0' }}>{new Date(patient.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {patients.length === 0 && <p className={styles.emptyState}>{t("admin_noPatients")}</p>}
    </div>
  );
}
