"use client"

import EventCalendar from "@/components/calendar/event-calendar"
import { useUserRole } from "@/lib/UserRoleContext"

export default function CalendarPage() {
  const { role } = useUserRole() // Get current role from context

  // If user is not logged in, show a message
  if (!role) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Please login to see the calendar</h2>
      </div>
    )
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>College Events Calendar</h1>

      {/* Role-specific message */}
      {role === "admin" ? (
        <p style={{ color: "green", marginBottom: "20px" }}>
          You are an Admin: you can edit events.
        </p>
      ) : (
        <p style={{ color: "blue", marginBottom: "20px" }}>
          You are a Student: read-only view.
        </p>
      )}

      {/* Render the actual calendar component and pass role as prop */}
      <EventCalendar role={role} />
    </div>
  )
}
