import TriageChat from "./TriageChat";

export const metadata = {
  title: "Symptom Triage | MediTrack",
};

export default function TriagePage() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 48px)", padding: "24px" }}>
      <TriageChat />
    </div>
  );
}
