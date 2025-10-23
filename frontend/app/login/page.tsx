"use client"

import LoginWithUs from "../components/login-with-us"
import { useUserRole } from "@/lib/UserRoleContext"
import { useRouter } from "next/navigation"

export default function Page() {
  const { setRole } = useUserRole()
  const router = useRouter()

  const handleLogin = (selectedRole: "admin" | "student") => {
    setRole(selectedRole)      // Store role in context
    router.push("/calendar")   // Redirect to calendar page
  }

  return (
    <div>
      <LoginWithUs onLogin={handleLogin} />
    </div>
  )
}
