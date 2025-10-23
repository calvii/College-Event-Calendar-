"use client"
import React, { createContext, useContext, useState, useEffect } from "react"

// Define type for role
type Role = "admin" | "student" | null

// Create context
const UserRoleContext = createContext<{
  role: Role
  setRole: (role: Role) => void
}>({
  role: null,
  setRole: () => {}
})

// Provider component
export const UserRoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>(null)

  // Optional: persist role on refresh
  useEffect(() => {
    const storedRole = localStorage.getItem("role") as Role
    if (storedRole) setRole(storedRole)
  }, [])

  useEffect(() => {
    if (role) localStorage.setItem("role", role)
  }, [role])

  return (
    <UserRoleContext.Provider value={{ role, setRole }}>
      {children}
    </UserRoleContext.Provider>
  )
}

// Custom hook to use the role
export const useUserRole = () => useContext(UserRoleContext)

