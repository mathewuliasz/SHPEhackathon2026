import { getLanguage, t } from "@/lib/language";

export default async function Profile() {
  const lang = await getLanguage();

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1a1a2e" }}>
        {t(lang, "profile_title")}
      </h1>
    </div>
  );
}
