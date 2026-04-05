"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";

export default function ProfileLanguageSetting() {
  const { lang, setLang, t } = useLanguage();
  const [saved, setSaved] = useState(false);

  function handleChange(newLang: "en" | "es") {
    setLang(newLang);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 12 }}>
        <button
          type="button"
          onClick={() => handleChange("en")}
          style={{
            padding: "10px 24px",
            borderRadius: 12,
            border: lang === "en" ? "2px solid #4a84ec" : "1px solid #dfe5ef",
            background: lang === "en" ? "#f0f5ff" : "#fff",
            color: lang === "en" ? "#4a84ec" : "#5b6377",
            fontWeight: 600,
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          English
        </button>
        <button
          type="button"
          onClick={() => handleChange("es")}
          style={{
            padding: "10px 24px",
            borderRadius: 12,
            border: lang === "es" ? "2px solid #4a84ec" : "1px solid #dfe5ef",
            background: lang === "es" ? "#f0f5ff" : "#fff",
            color: lang === "es" ? "#4a84ec" : "#5b6377",
            fontWeight: 600,
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          Español
        </button>
      </div>
      {saved && (
        <p style={{ marginTop: 12, fontSize: 14, color: "#4a84ec", fontWeight: 500 }}>
          {t("profile_languageSaved")}
        </p>
      )}
    </div>
  );
}
