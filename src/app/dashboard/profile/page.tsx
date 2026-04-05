import { getLanguage, t } from "@/lib/language";
import ProfileLanguageSetting from "./ProfileLanguageSetting";

export default async function Profile() {
  const lang = await getLanguage();

  return (
    <div style={{ maxWidth: 640 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1a1a2e", marginBottom: 32 }}>
        {t(lang, "profile_title")}
      </h1>

      <section
        style={{
          background: "#fff",
          borderRadius: 20,
          border: "1px solid #dfe5ef",
          padding: "28px 32px",
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "#27313f", marginBottom: 6 }}>
          {t(lang, "profile_languageSection")}
        </h2>
        <p style={{ fontSize: 15, color: "#7f8a98", marginBottom: 20, lineHeight: 1.5 }}>
          {t(lang, "profile_languageText")}
        </p>
        <ProfileLanguageSetting />
      </section>
    </div>
  );
}
