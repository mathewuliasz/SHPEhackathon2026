"use client";

import { useLanguage } from "@/lib/LanguageContext";
import styles from "./LanguageToggle.module.css";

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div className={styles.toggle}>
      <button
        type="button"
        className={`${styles.option} ${lang === "en" ? styles.active : ""}`}
        onClick={() => setLang("en")}
      >
        English
      </button>
      <button
        type="button"
        className={`${styles.option} ${lang === "es" ? styles.active : ""}`}
        onClick={() => setLang("es")}
      >
        Español
      </button>
    </div>
  );
}
