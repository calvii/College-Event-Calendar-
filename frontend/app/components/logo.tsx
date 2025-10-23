import styles from "./logo.module.css"

export function Logo() {
  return (
    <div className={styles.wrapper}>
      <span className={styles.badge} aria-hidden="true">
        <span className={styles.badgeLetters}>MI</span>
        <span className={styles.badgeDivider} />
        <span className={styles.badgeLetters}>ST</span>
      </span>
    </div>
  )
}
