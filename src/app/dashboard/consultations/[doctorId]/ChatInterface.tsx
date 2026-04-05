"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import type { Appointment, Message } from "@/scheduling/types/scheduling";
import styles from "./page.module.css";

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(time: string) {
  const [h, m] = time.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

function formatTimestamp(ts: string) {
  const d = new Date(ts);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

type Props = {
  appointments: Appointment[];
  doctorName: string;
};

export default function ChatInterface({ appointments, doctorName }: Props) {
  const { t } = useLanguage();
  const [selectedId, setSelectedId] = useState<string | null>(
    appointments[0]?.id ?? null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!selectedId) return;
    setIsLoading(true);
    fetch(`/api/consultations/${selectedId}/messages`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.messages || []);
      })
      .catch(() => setMessages([]))
      .finally(() => setIsLoading(false));
  }, [selectedId]);

  async function handleSend() {
    const text = input.trim();
    if (!text || isSending || !selectedId) return;

    setIsSending(true);
    setInput("");

    // Optimistic update
    const optimisticMsg: Message = {
      id: "temp-" + Date.now(),
      appointment_id: selectedId,
      sender_type: "patient",
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const res = await fetch(`/api/consultations/${selectedId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      const data = await res.json();
      if (data.message) {
        setMessages((prev) =>
          prev.map((m) => (m.id === optimisticMsg.id ? data.message : m))
        );
      }
    } catch {
      // Remove optimistic message on failure
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
    } finally {
      setIsSending(false);
    }
  }

  const selectedAppt = appointments.find((a) => a.id === selectedId);

  return (
    <div className={styles.chatLayout}>
      {/* Appointment sidebar */}
      <div className={styles.appointmentSidebar}>
        <div className={styles.sidebarTitle}>{t("consult_sidebarTitle")}</div>
        {appointments.map((appt) => (
          <button
            key={appt.id}
            className={
              appt.id === selectedId
                ? styles.appointmentCardActive
                : styles.appointmentCard
            }
            onClick={() => setSelectedId(appt.id)}
          >
            <div className={styles.appointmentDate}>
              {formatDate(appt.date)}
            </div>
            <div className={styles.appointmentTime}>
              {formatTime(appt.time)}
            </div>
          </button>
        ))}
      </div>

      {/* Chat area */}
      <div className={styles.chatArea}>
        {selectedAppt ? (
          <>
            <div className={styles.chatHeader}>
              {t("consult_chatWith")} {doctorName} &mdash;{" "}
              {formatDate(selectedAppt.date)} {t("consult_at")}{" "}
              {formatTime(selectedAppt.time)}
            </div>
            <div className={styles.messageList}>
              {isLoading ? (
                <div className={styles.emptyChat}>{t("consult_loadingMessages")}</div>
              ) : messages.length === 0 ? (
                <div className={styles.emptyChat}>
                  {t("consult_noMessages")}
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={
                      msg.sender_type === "patient"
                        ? styles.messageSent
                        : msg.sender_type === "system"
                        ? styles.messageSystem
                        : styles.messageReceived
                    }
                  >
                    {msg.sender_type === "system" && (
                      <div className={styles.systemLabel}>AI Meeting Notes</div>
                    )}
                    {msg.content}
                    <div className={styles.messageTime}>
                      {formatTimestamp(msg.created_at)}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className={styles.inputBar}>
              <input
                className={styles.chatInput}
                type="text"
                placeholder={t("consult_typePlaceholder")}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                disabled={isSending}
              />
              <button
                className={styles.sendBtn}
                onClick={handleSend}
                disabled={isSending || !input.trim()}
              >
                <svg viewBox="0 0 24 24">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className={styles.emptyChat}>
            {t("consult_selectAppointment")}
          </div>
        )}
      </div>
    </div>
  );
}
