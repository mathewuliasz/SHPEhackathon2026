"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import styles from "./TriageChat.module.css";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type TriageResult = {
  specialty: string;
  confidence_score: number;
  reasoning: string;
  urgency: "low" | "moderate" | "high" | "emergency";
};

function tryParseTriageResult(text: string): TriageResult | null {
  let cleaned = text.trim();
  // Strip markdown code fences if present
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
  }
  try {
    const parsed = JSON.parse(cleaned);
    if (
      parsed.specialty &&
      typeof parsed.confidence_score === "number" &&
      parsed.reasoning &&
      parsed.urgency
    ) {
      return parsed as TriageResult;
    }
  } catch {
    // Not JSON — it's a conversational message
  }
  return null;
}

function urgencyStyle(urgency: string) {
  switch (urgency) {
    case "emergency":
      return styles.urgencyEmergency;
    case "high":
      return styles.urgencyHigh;
    case "moderate":
      return styles.urgencyModerate;
    default:
      return styles.urgencyLow;
  }
}

export default function TriageChat() {
  const router = useRouter();
  const { lang, t } = useLanguage();

  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: t("triage_welcome") },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Reset chat when language changes
  useEffect(() => {
    setMessages([{ role: "assistant", content: t("triage_welcome") }]);
    setInput("");
    setTriageResult(null);
  }, [lang, t]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, triageResult]);

  function urgencyLabel(urgency: string) {
    switch (urgency) {
      case "emergency":
        return t("triage_urgencyEmergency");
      case "high":
        return t("triage_urgencyHigh");
      case "moderate":
        return t("triage_urgencyModerate");
      default:
        return t("triage_urgencyLow");
    }
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || isLoading || triageResult) return;

    const userMessage: Message = { role: "user", content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Send only role/content pairs (exclude the initial welcome for cleaner context)
      const apiMessages = newMessages
        .slice(1) // skip the hardcoded welcome
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json();

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error: ${data.error}` },
        ]);
      } else {
        const result = tryParseTriageResult(data.message);
        if (result) {
          setTriageResult(result);
        } else {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: data.message },
          ]);
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: t("triage_error"),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setMessages([{ role: "assistant", content: t("triage_welcome") }]);
    setInput("");
    setTriageResult(null);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>{t("triage_headerTitle")}</h2>
        <p className={styles.headerSubtitle}>
          {t("triage_headerSubtitle")}
        </p>
      </div>

      <div className={styles.messagesArea}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={
              msg.role === "user" ? styles.messageUser : styles.messageBot
            }
          >
            {msg.content}
          </div>
        ))}

        {isLoading && (
          <div className={styles.typing}>
            <span className={styles.typingDot} />
            <span className={styles.typingDot} />
            <span className={styles.typingDot} />
          </div>
        )}

        {triageResult && (
          <div className={styles.resultCard}>
            <h3 className={styles.resultSpecialty}>
              {triageResult.specialty}
            </h3>
            <div className={styles.resultMeta}>
              <span
                className={`${styles.urgencyBadge} ${urgencyStyle(triageResult.urgency)}`}
              >
                {urgencyLabel(triageResult.urgency)}
              </span>
              <span className={styles.confidenceBadge}>
                {triageResult.confidence_score}% {t("triage_confidence")}
              </span>
            </div>
            <p className={styles.resultReasoning}>{triageResult.reasoning}</p>
            <p className={styles.disclaimer}>
              {t("triage_disclaimer")}
            </p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {triageResult ? (
        <div className={styles.inputArea}>
          <button
            className={styles.bookBtn}
            onClick={() =>
              router.push(
                `/dashboard/schedule?specialty=${encodeURIComponent(triageResult.specialty)}`
              )
            }
          >
            {t("triage_bookWith")} {triageResult.specialty}
          </button>
          <button className={styles.resetBtn} onClick={handleReset}>
            {t("triage_startOver")}
          </button>
        </div>
      ) : (
        <div className={styles.inputArea}>
          <input
            className={styles.input}
            type="text"
            placeholder={t("triage_placeholder")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            disabled={isLoading}
          />
          <button
            className={styles.sendBtn}
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
          >
            <svg viewBox="0 0 24 24">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
