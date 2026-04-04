import styles from "./page.module.css";

type Biomarker = {
  name: string;
  subtitle: string;
  value: string;
  unit: string;
  markerPosition: number;
  barColors: string[];
};

type StatusGroup = {
  status: "outOfRange" | "average" | "optimal";
  items: Biomarker[];
};

type Category = {
  name: string;
  color: string;
  groups: StatusGroup[];
};

const BAR_BLUE = "#5B8BD4";
const BAR_BLUE_LIGHT = "#A8C4E6";
const BAR_DARK = "#2D3142";
const BAR_DARK_MUTED = "#4A4E5A";
const BAR_PINK = "#E8A0A5";
const BAR_RED = "#D4686E";

function makeBar(colors: string[], count = 16): string[] {
  const result: string[] = [];
  const segmentSize = count / colors.length;
  for (let i = 0; i < count; i++) {
    const idx = Math.min(Math.floor(i / segmentSize), colors.length - 1);
    result.push(colors[idx]);
  }
  return result;
}

const barHighIsBad = makeBar([BAR_BLUE, BAR_BLUE_LIGHT, BAR_DARK_MUTED, BAR_DARK, BAR_PINK, BAR_RED]);
const barLowIsBad = makeBar([BAR_RED, BAR_PINK, BAR_DARK, BAR_DARK_MUTED, BAR_BLUE_LIGHT, BAR_BLUE]);
const barMiddleBest = makeBar([BAR_PINK, BAR_DARK, BAR_BLUE, BAR_BLUE, BAR_DARK, BAR_PINK]);
const barOptimalHigh = makeBar([BAR_RED, BAR_PINK, BAR_DARK_MUTED, BAR_BLUE_LIGHT, BAR_BLUE, BAR_BLUE]);

const categories: Category[] = [
  {
    name: "Hormonal Health",
    color: "#7C5CBF",
    groups: [
      {
        status: "average",
        items: [
          { name: "Estrogen", subtitle: "Reproductive Health", value: "18.41", unit: "pg/mL", markerPosition: 42, barColors: barMiddleBest },
          { name: "SHBG", subtitle: "Hormone Availability", value: "24.3", unit: "nmol/L", markerPosition: 38, barColors: barMiddleBest },
          { name: "Total Testosterone", subtitle: "Vitality Indicator", value: "465.0", unit: "ng/dL", markerPosition: 55, barColors: barMiddleBest },
          { name: "Free Testosterone", subtitle: "Active Testosterone", value: "106.15", unit: "pg/mL", markerPosition: 35, barColors: barMiddleBest },
        ],
      },
    ],
  },
  {
    name: "Metabolic Efficiency",
    color: "#4CAF50",
    groups: [
      {
        status: "outOfRange",
        items: [
          { name: "Thyroid Stimulating Hormone", subtitle: "Thyroid Regulator", value: "5.655", unit: "uIU/mL", markerPosition: 78, barColors: barHighIsBad },
          { name: "Vitamin D", subtitle: "Vitality Hormone", value: "22.9", unit: "ng/mL", markerPosition: 25, barColors: barLowIsBad },
        ],
      },
      {
        status: "average",
        items: [
          { name: "Ferritin", subtitle: "Iron Storage", value: "213.4", unit: "ng/mL", markerPosition: 50, barColors: barHighIsBad },
          { name: "Triglycerides/HDL Ratio", subtitle: "Metabolic Health", value: "1.49", unit: "mg/dL", markerPosition: 55, barColors: barHighIsBad },
          { name: "Free T3", subtitle: "Active Thyroid", value: "2.97", unit: "pg/mL", markerPosition: 58, barColors: barLowIsBad },
        ],
      },
      {
        status: "optimal",
        items: [
          { name: "Albumin", subtitle: "Fluid Balance", value: "4.8", unit: "g/dL", markerPosition: 62, barColors: barOptimalHigh },
          { name: "Triglycerides", subtitle: "Stored Energy", value: "82", unit: "mg/dL", markerPosition: 55, barColors: barMiddleBest },
        ],
      },
    ],
  },
  {
    name: "Heart Health",
    color: "#D4686E",
    groups: [
      {
        status: "outOfRange",
        items: [
          { name: "ApoB", subtitle: "Number of Particles", value: "106.84", unit: "mg/dL", markerPosition: 78, barColors: barHighIsBad },
        ],
      },
      {
        status: "average",
        items: [
          { name: "Total Cholesterol", subtitle: "Heart Health", value: "214", unit: "mg/dL", markerPosition: 52, barColors: barHighIsBad },
          { name: "Total Cholesterol/HDL Ratio", subtitle: "Heart Health", value: "3.89", unit: "", markerPosition: 55, barColors: barHighIsBad },
          { name: "HDL Cholesterol", subtitle: "Cholesterol Clearer", value: "55", unit: "mg/dL", markerPosition: 48, barColors: barLowIsBad },
          { name: "LDL Cholesterol", subtitle: "Cholesterol Mass", value: "142.60", unit: "mg/dL", markerPosition: 58, barColors: barHighIsBad },
          { name: "LDL/ApoB Ratio", subtitle: "LDL-C Particle Size", value: "1.33", unit: "", markerPosition: 52, barColors: barLowIsBad },
        ],
      },
      {
        status: "optimal",
        items: [
          { name: "CRP (C-Reactive Protein)", subtitle: "Inflammation Indicator", value: "1.0", unit: "mg/L", markerPosition: 18, barColors: barHighIsBad },
          { name: "Remnant Cholesterol", subtitle: "", value: "16.4", unit: "mg/dL", markerPosition: 50, barColors: barMiddleBest },
        ],
      },
    ],
  },
];

function StatusLabel({ status }: { status: "outOfRange" | "average" | "optimal" }) {
  const config = {
    outOfRange: {
      label: "Out of Range",
      className: styles.statusOutOfRange,
      icon: (
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      ),
    },
    average: {
      label: "Average",
      className: styles.statusAverage,
      icon: (
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12h8" />
        </svg>
      ),
    },
    optimal: {
      label: "Optimal",
      className: styles.statusOptimal,
      icon: (
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
    },
  };

  const c = config[status];
  return (
    <div className={`${styles.statusLabel} ${c.className}`}>
      <span className={styles.statusIcon}>{c.icon}</span>
      {c.label}
    </div>
  );
}

function BiomarkerCard({ marker }: { marker: Biomarker }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <span className={styles.cardName}>{marker.name}</span>
        <span className={styles.cardCopyIcon}>
          <svg viewBox="0 0 24 24">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </span>
      </div>
      <div className={styles.cardSubtitle}>{marker.subtitle}</div>
      <div className={styles.cardValue}>
        {marker.value}
        {marker.unit && <span className={styles.cardUnit}>{marker.unit}</span>}
      </div>
      <div className={styles.rangeBar}>
        <div className={styles.rangeTrack}>
          {marker.barColors.map((color, i) => (
            <div
              key={i}
              className={styles.rangeDot}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <div
          className={styles.rangeMarker}
          style={{ left: `${marker.markerPosition}%` }}
        />
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
      </div>

      {categories.map((cat) => (
        <section key={cat.name} className={styles.category}>
          <div className={styles.categoryHeader}>
            <span
              className={styles.categoryDot}
              style={{ backgroundColor: cat.color }}
            />
            <h2 className={styles.categoryTitle}>{cat.name}</h2>
          </div>

          {cat.groups.map((group) => (
            <div key={group.status} className={styles.statusGroup}>
              <StatusLabel status={group.status} />
              <div className={styles.cardGrid}>
                {group.items.map((marker) => (
                  <BiomarkerCard key={marker.name} marker={marker} />
                ))}
              </div>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
