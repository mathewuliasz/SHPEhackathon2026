import { cookies } from "next/headers";
import translations, { type Lang } from "./translations";

/** Read the language preference from the `lang` cookie (server-side). */
export async function getLanguage(): Promise<Lang> {
  const cookieStore = await cookies();
  const raw = cookieStore.get("lang")?.value;
  return raw === "es" ? "es" : "en";
}

/** Server-side translation helper. */
export function t(lang: Lang, key: string): string {
  const dict = translations[lang] as Record<string, string>;
  return dict[key] ?? key;
}
