import Image from "next/image"
import styles from "./illustration.module.css"

export function Illustration() {
  return (
    <div className={styles.wrapper}>
      <Image
        src="/images/hero-illustration.png"
        alt="Playful illustration of campus tickets and reminders."
        width={640}
        height={470}
        className={styles.image}
        priority
      />
    </div>
  )
}
