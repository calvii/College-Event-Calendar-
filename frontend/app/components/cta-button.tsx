import type { ButtonHTMLAttributes } from "react"
import styles from "./cta-button.module.css"

type CTAButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary"
}

export function CTAButton({ variant = "primary", className = "", ...props }: CTAButtonProps) {
  const variantClass = variant === "secondary" ? styles.secondary : styles.primary

  return <button type="button" className={[styles.button, variantClass, className].join(" ").trim()} {...props} />
}
