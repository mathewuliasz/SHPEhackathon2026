"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
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

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hi! I'm your MediTrack triage assistant. Tell me about your symptoms and I'll help you figure out which type of specialist you should see.",
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

function urgencyLabel(urgency: string) {
  switch (urgency) {
    case "emergency":
      return "Emergency";
    case "high":
      return "High Urgency";
    case "moderate":
      return "Moderate Urgency";
    default:
      return "Low Urgency";
  }
}

export default function TriageChat() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, triageResult]);

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
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setMessages([WELCOME_MESSAGE]);
    setInput("");
    setTriageResult(null);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Symptom Triage</h2>
        <p className={styles.headerSubtitle}>
          Describe your symptoms to find the right specialist
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
                {triageResult.confidence_score}% confidence
              </span>
            </div>
            <p className={styles.resultReasoning}>{triageResult.reasoning}</p>
            <p className={styles.disclaimer}>
              This is not a medical diagnosis. Please consult a healthcare
              professional for proper evaluation and treatment.
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
            Book with {triageResult.specialty}
          </button>
          <button className={styles.resetBtn} onClick={handleReset}>
            Start Over
          </button>
        </div>
      ) : (
        <div className={styles.inputArea}>
          <input
            className={styles.input}
            type="text"
            placeholder="Describe your symptoms..."
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
