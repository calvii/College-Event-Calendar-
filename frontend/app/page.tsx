import Link from 'next/link'                   // <-- added this
import { CTAButton } from "./components/cta-button"
import { Illustration } from "./components/illustration";
import { Logo } from "./components/logo"
import styles from "./page.module.css"

export default function Page() {
  return (
    <main className={styles.main}>
      <img src="/art.png" alt="Art" style={{ position: 'absolute', top: 0, right: 0, width: '900px', height: 'auto', zIndex: 10 }} />
      <div className={styles.container}>
        <header className={styles.header}>
          <Logo />
        </header>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <h1 className={styles.heroTitle}>
              college<br />event calendar
            </h1>
            <p className={styles.heroIntro}>
              Welcome to the College Event Calendar. This platform helps you track, manage, and organize all campus events in one place. From fests to workshops and seminars, everything is easily accessible through a unified calendar. Stay updated, plan better, and never miss an important event again.
            </p>
            <div className={styles.heroCta}>
              {/* Wrapped CTAButton in Link */}
              <Link href="/login">
                <CTAButton type="button">login</CTAButton>
              </Link>
            </div>
          </div>
        </section>
        <footer className={styles.footer}>
          <div className={styles.footerActions}>
            <CTAButton type="button" variant="secondary">About</CTAButton>
            <CTAButton type="button" variant="secondary">contact</CTAButton>
          </div>
        </footer>
      </div>
    </main>
  )
}
