import Link from "next/link";
import styles from "./page.module.css";

const menuItems = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact Us", href: "/#contact-us" },
] as const;

const impactStats = [
  { value: "3,800+", label: "Families Served" },
  { value: "210+", label: "Medical Volunteers" },
  { value: "100%", label: "Free of Charge" },
  { value: "Bilingual", label: "Spanish & English Service" },
] as const;

const storyHighlights = [
  {
    title: "501(c)(3) Certified Nonprofit",
    text: "Every dollar donated goes directly to operations, outreach, and keeping every single consultation free of charge.",
    tone: "blue",
    icon: "★",
  },
  {
    title: "Fully Bilingual",
    text: "Every consultation, form, follow-up, and support message is available in Spanish and English.",
    tone: "mint",
    icon: "文",
  },
  {
    title: "No Insurance Needed",
    text: "Uninsured, undocumented, or underinsured, everyone is welcome. Zero paperwork. Zero judgment. Zero cost.",
    tone: "sky",
    icon: "⌂",
  },
] as const;

const audiences = [
  "Low-income Hispanic families",
  "Uninsured individuals",
  "Immigrant and undocumented communities",
  "Spanish-speaking seniors",
  "Mothers and children without pediatric access",
] as const;

const values = [
  {
    title: "Dignity in Every Visit",
    text: "Every family regardless of income, insurance status, or immigration background deserves respectful, high-quality medical guidance.",
    icon: "♡",
    featured: false,
  },
  {
    title: "Culturally Rooted",
    text: "We bridge language and cultural barriers so Hispanic families feel seen, heard, and trusted. All services are fully bilingual.",
    icon: "◍",
    featured: true,
  },
  {
    title: "Community First",
    text: "Built by and for the community. We collaborate with local organizations, churches, and schools to reach those who need us most.",
    icon: "◌",
    featured: false,
  },
  {
    title: "Volunteer Powered",
    text: "Licensed physicians, nurses, and specialists donate their expertise to provide free online consultations, changing lives one hour at a time.",
    icon: "⌘",
    featured: false,
  },
] as const;

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/">
          SHPE Medical
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          {menuItems.map((item) => (
            <Link key={item.label} href={item.href} aria-current={item.label === "About Us" ? "page" : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.headerActions}>
          <Link className={styles.headerSecondaryCta} href="/auth">
            Log In
          </Link>
          <Link className={styles.headerCta} href="/auth?mode=signup">
            Get Started
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <span className={styles.heroKicker}>About SHPE Medical</span>
            <h1>Health For Everyone.</h1>
            <p>
              SHPE Medical is a nonprofit connecting low-income Hispanic households
              with licensed volunteer doctors. Completely free, bilingual, and from
              home.
            </p>
            <div className={styles.heroActions}>
              <Link className={styles.primaryCta} href="/dashboard/schedule">
                Book Free Consult →
              </Link>
              <Link className={styles.secondaryCta} href="/volunteer">
                I&apos;m a Doctor
              </Link>
            </div>
          </div>

          <aside className={styles.heroStats}>
            <div className={styles.statsGrid}>
              {impactStats.map((item) => (
                <div key={item.label} className={styles.statItem}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
            <div className={styles.quoteBlock}>
              <p>&quot;Health is a human right, not a privilege.&quot;</p>
              <span>Founders of SHPE Medical</span>
            </div>
          </aside>
        </section>

        <section className={styles.storySection}>
          <div className={styles.storyCopy}>
            <span className={styles.sectionKicker}>Who We Are</span>
            <h2>
              Born from necessity,
              <br />
              built with heart.
            </h2>
            <p>
              SHPE Medical was founded in 2026 after our co-founders witnessed
              firsthand how language barriers, fear of deportation, and lack of
              financial resources left entire families without medical care.
            </p>
            <p>
              What started as a weekend volunteer clinic in a Houston church
              basement grew into a national network of over 210 doctors, nurses,
              and specialists donating their time for free online consultations.
            </p>
            <blockquote>
              “Health is a human right. No family should have to choose between a
              doctor and dinner.”
            </blockquote>
          </div>

          <div className={styles.storyCards}>
            {storyHighlights.map((item) => (
              <article
                key={item.title}
                className={`${styles.storyCard} ${styles[`storyCard${capitalize(item.tone)}`]}`}
              >
                <div className={styles.storyIcon}>{item.icon}</div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.audienceSection}>
          <span className={styles.sectionKicker}>Who We Serve</span>
          <h2>Designed for families like yours.</h2>
          <p className={styles.sectionIntro}>
            Our services are specifically built for low-income Hispanic households
            that face systemic barriers to healthcare access.
          </p>

          <div className={styles.audienceList}>
            {audiences.map((item, index) => (
              <div
                key={item}
                className={`${styles.audienceItem} ${index === 2 ? styles.audienceItemActive : ""}`}
              >
                <span className={styles.audienceCheck}>✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.valuesSection}>
          <span className={styles.sectionKicker}>Our Values</span>
          <h2>What Guides Us</h2>

          <div className={styles.valuesGrid}>
            {values.map((item) => (
              <article
                key={item.title}
                className={`${styles.valueCard} ${item.featured ? styles.valueCardFeatured : ""}`}
              >
                <div className={styles.valueIcon}>{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.volunteerBanner}>
          <div>
            <span className={styles.bannerKicker}>Are you a doctor or specialist?</span>
            <h2>Join as a Volunteer</h2>
            <p>
              Doctors, nurses, and specialists sign up to donate online consultations
              and directly impact families with no other access to care.
            </p>
          </div>
          <Link className={styles.bannerCta} href="/volunteer">
            Sign Up to Volunteer →
          </Link>
        </section>

        <section className={styles.dualCards}>
          <article className={styles.ctaCardBlue}>
            <div className={styles.ctaIcon}>♥</div>
            <h3>Need a Consultation?</h3>
            <p>
              Book a free online consultation today. No insurance, no fee, no
              barriers. Available in Spanish and English.
            </p>
            <Link className={styles.cardCta} href="/dashboard/schedule">
              Book Free Consult →
            </Link>
          </article>

          <article className={styles.ctaCardNavy}>
            <div className={styles.ctaIcon}>⌘</div>
            <h3>Are You a Doctor or Specialist?</h3>
            <p>
              Join our volunteer network. Even one hour a week transforms lives for
              families with nowhere else to turn. Fully remote.
            </p>
            <Link className={styles.cardCta} href="/volunteer">
              Sign Up to Volunteer →
            </Link>
          </article>
        </section>
      </main>
    </div>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
