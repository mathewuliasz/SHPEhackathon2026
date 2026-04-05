"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Appointment, Message } from "@/scheduling/types/scheduling";
import styles from "./page.module.css";

type DoctorWorkspaceProps = {
  doctorName: string;
  appointments: Appointment[];
};

function formatDate(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(time: string) {
  const [h, m] = time.split(":");
  const hour = Number(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

export default function DoctorWorkspace({
  doctorName,
  appointments,
}: DoctorWorkspaceProps) {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(
    appointments[0]?.id ?? null,
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedAppointment = useMemo(
    () => appointments.find((item) => item.id === selectedAppointmentId) ?? null,
    [appointments, selectedAppointmentId],
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!selectedAppointmentId) return;

    setIsLoading(true);
    fetch(`/api/consultations/${selectedAppointmentId}/messages`)
      .then((res) => res.json())
      .then((data) => setMessages(data.messages || []))
      .catch(() => setMessages([]))
      .finally(() => setIsLoading(false));
  }, [selectedAppointmentId]);

  async function handleSend() {
    const content = input.trim();
    if (!content || !selectedAppointmentId || isSending) return;

    setIsSending(true);
    setInput("");

    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      appointment_id: selectedAppointmentId,
      sender_type: "doctor",
      content,
      created_at: new Date().toISOString(),
    };

    setMessages((current) => [...current, optimisticMessage]);

    try {
      const response = await fetch(`/api/consultations/${selectedAppointmentId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await response.json();

      if (data.message) {
        setMessages((current) =>
          current.map((message) =>
            message.id === optimisticMessage.id ? data.message : message,
          ),
        );
      }
    } catch {
      setMessages((current) => current.filter((message) => message.id !== optimisticMessage.id));
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className={styles.workspace}>
      <section className={styles.overviewGrid} id="overview">
        <article className={styles.statCard}>
          <span>Upcoming Appointments</span>
          <strong>{appointments.length}</strong>
          <p>Visits currently assigned to your queue.</p>
        </article>
        <article className={styles.statCard}>
          <span>Patient Threads</span>
          <strong>{appointments.length}</strong>
          <p>Open conversation threads tied to appointments.</p>
        </article>
        <article className={styles.statCard}>
          <span>Next Patient</span>
          <strong>{appointments[0]?.patient_name || "No visits"}</strong>
          <p>
            {appointments[0]
              ? `${formatDate(appointments[0].date)} at ${formatTime(appointments[0].time)}`
              : "You have no upcoming visits."}
          </p>
        </article>
      </section>

      <section className={styles.mainGrid}>
        <div className={styles.appointmentsPanel} id="appointments">
          <div className={styles.panelHeader}>
            <div>
              <h2>Upcoming Appointments</h2>
              <p>Review your schedule and open a patient conversation.</p>
            </div>
          </div>

          <div className={styles.appointmentList}>
            {appointments.map((appointment) => (
              <button
                key={appointment.id}
                type="button"
                className={`${styles.appointmentCard} ${
                  appointment.id === selectedAppointmentId ? styles.appointmentCardActive : ""
                }`}
                onClick={() => setSelectedAppointmentId(appointment.id)}
              >
                <div className={styles.appointmentCardTop}>
                  <strong>{appointment.patient_name || "Patient"}</strong>
                  <span>{formatDate(appointment.date)}</span>
                </div>
                <div className={styles.appointmentCardMeta}>
                  <span>{formatTime(appointment.time)}</span>
                  <span>
                    {appointment.zoom_join_url ? "Zoom ready" : "Chat available"}
                  </span>
                </div>
              </button>
            ))}

            {appointments.length === 0 ? (
              <div className={styles.emptyState}>No upcoming appointments assigned yet.</div>
            ) : null}
          </div>
        </div>

        <div className={styles.chatPanel} id="messages">
          <div className={styles.chatHeader}>
            {selectedAppointment ? (
              <>
                <div>
                  <h2>{selectedAppointment.patient_name || "Patient"} Messages</h2>
                  <p>
                    {doctorName} · {formatDate(selectedAppointment.date)} at{" "}
                    {formatTime(selectedAppointment.time)}
                  </p>
                </div>
                {selectedAppointment.zoom_join_url ? (
                  <a
                    className={styles.zoomLink}
                    href={selectedAppointment.zoom_join_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open Zoom
                  </a>
                ) : null}
              </>
            ) : (
              <div>
                <h2>Patient Messages</h2>
                <p>Select an appointment to view messages.</p>
              </div>
            )}
          </div>

          <div className={styles.messageList}>
            {isLoading ? (
              <div className={styles.emptyState}>Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className={styles.emptyState}>No patient messages yet.</div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={
                    message.sender_type === "doctor"
                      ? styles.messageSent
                      : message.sender_type === "system"
                      ? styles.messageSystem
                      : styles.messageReceived
                  }
                >
                  {message.sender_type === "system" && (
                    <div className={styles.systemLabel}>AI Meeting Notes</div>
                  )}
                  <div>{message.content}</div>
                  <span className={styles.messageMeta}>
                    {message.sender_type === "doctor"
                      ? "You"
                      : message.sender_type === "system"
                      ? "AI Summary"
                      : "Patient"}
                  </span>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.inputBar}>
            <input
              className={styles.chatInput}
              type="text"
              placeholder="Reply to the patient..."
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSend();
                }
              }}
              disabled={!selectedAppointment || isSending}
            />
            <button
              type="button"
              className={styles.sendButton}
              onClick={handleSend}
              disabled={!selectedAppointment || !input.trim() || isSending}
            >
              Send
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
