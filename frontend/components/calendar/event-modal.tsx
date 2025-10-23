"use client"

import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import styles from "./event-modal.module.css"

const BASE_URL = "http://localhost:5000" // <-- your backend

type CalendarEvent = {
  id: string
  date: string
  title: string
  time?: string
  location?: string
  category?: "academic" | "sports" | "club"
  event_type?: "academic" | "sports" | "club" // Added for reading from API
  startTime?: string
  endTime?: string
  description?: string
}

export function EventModal(props: {
  open: boolean
  onClose: () => void
  date: string | null
  admin: boolean
  events: CalendarEvent[]
  onEventCreated: () => Promise<void>
  onEventUpdated: () => Promise<void>
  onEventDeleted: () => Promise<void>
  loading?: boolean
  error?: boolean
}) {
  const { open, onClose, date, admin, events, onEventCreated, onEventUpdated, onEventDeleted, loading, error } = props
  const dialogRef = useRef<HTMLDivElement>(null)

  // ✅ FIXED: Display correct local date without timezone shifts
  const niceDate = useMemo(() => {
    if (!date) return "";
    const [y, m, d] = date.split("-").map(Number);

    // Use Date only for display
    const localDate = new Date(y, m - 1, d);

    return localDate.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, [date])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    if (open) document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  // Form state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [category, setCategory] = useState<"academic" | "sports" | "club">("academic")
  const [submitting, setSubmitting] = useState(false)
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    if (open) {
      setEditingId(null)
      setTitle("")
      setLocation("")
      setCategory("academic")
      setStartTime("")
      setEndTime("")
      setDescription("")
    }
  }, [open])

  function startEdit(ev: CalendarEvent) {
    setEditingId(ev.id)
    setTitle(ev.title)
    setLocation(ev.location || "")
    setCategory(ev.event_type || ev.category || "academic") 
    setStartTime(ev.startTime || ev.time || "")
    setEndTime(ev.endTime || "")
    setDescription(ev.description || "")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!date) return
    setSubmitting(true)
    try {
        const eventData = {
            title,
            date, // ✅ send as-is to prevent date shift
            start_time: startTime || null,
            end_time: endTime || null,
            location: location || null,
            description: description || null,
            event_type: category,
        }

        let res: Response
      
      if (editingId) {
        res = await fetch(`${BASE_URL}/events`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...eventData }),
        })
        if (!res.ok) throw new Error("Failed to update event")

        await onEventUpdated()
      } else {
        res = await fetch(`${BASE_URL}/events`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        })
        if (!res.ok) throw new Error("Failed to create event")

        await onEventCreated()
      }
        
      onClose();

    } catch (e) {
      console.error("Submission error:", e)
    } finally {
      setSubmitting(false)
    }
  }

  async function deleteEvent(id: string) {
    setSubmitting(true)
    try {
      const res = await fetch(`${BASE_URL}/events`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (!res.ok) throw new Error("Failed to delete event")

      await onEventDeleted()
      onClose();

    } catch (e) {
      console.error("Deletion error:", e)
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div
        ref={dialogRef}
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 id="event-modal-title" className={styles.heading}>
            {niceDate || "Selected Day"}
          </h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {loading && <p className={styles.info}>Loading events…</p>}
        {error && <p className={styles.error}>Failed to load events.</p>}

        <div className={styles.content}>
          <div className={styles.eventsList} aria-live="polite">
            {events.length === 0 ? (
              <p className={styles.info}>No events for this day.</p>
            ) : (
              <ul className={styles.list}>
                {events.map((ev) => (
                  <li key={ev.id} className={styles.item}>
                    <div className={styles.itemMain}>
                      <span
                        className={`${styles.badge} ${
                          (ev.event_type || ev.category) === "academic"
                            ? styles.badgeAcademic
                            : (ev.event_type || ev.category) === "sports"
                            ? styles.badgeSports
                            : styles.badgeClub
                        }`}
                        aria-hidden="true"
                      />
                      <div>
                        <div className={styles.itemTitle}>{ev.title}</div>
                        <div className={styles.itemMeta}>
                          {ev.startTime || ev.time
                            ? ev.endTime
                              ? `${ev.startTime || ev.time} – ${ev.endTime}`
                              : ev.startTime || ev.time
                            : "Time TBA"}
                          {" · "}
                          {ev.location ? ev.location : "Location TBA"}
                        </div>
                        {ev.description && (
                          <div className={styles.itemMeta} aria-label="Event description">
                            {ev.description}
                          </div>
                        )}
                      </div>
                    </div>
                    {admin && (
                      <div className={styles.itemActions}>
                        <button className={styles.secondaryBtn} onClick={() => startEdit(ev)}>
                          Edit
                        </button>
                        <button className={styles.dangerBtn} onClick={() => deleteEvent(ev.id)}>
                          Delete
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {admin && (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formHeader}>
                <h3 className={styles.formTitle}>{editingId ? "Edit Event" : "Add Event"}</h3>
              </div>
              <label className={styles.label}>
                <span className="sr-only">Title</span>
                <input
                  className={styles.input}
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </label>

              <label className={styles.label}>
                <span className="sr-only">Start Time</span>
                <input
                  className={styles.input}
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </label>

              <label className={styles.label}>
                <span className="sr-only">End Time</span>
                <input
                  className={styles.input}
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </label>

              <label className={styles.label}>
                <span className="sr-only">Location</span>
                <input
                  className={styles.input}
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </label>

              <label className={styles.label}>
                <span className="selectLabel">Event Type</span>
                <select className={styles.select} value={category} onChange={(e) => setCategory(e.target.value as any)}>
                  <option value="academic">Academic</option>
                  <option value="sports">Sports</option>
                  <option value="club">Club</option>
                </select>
              </label>

              <label className={styles.label}>
                <span className="sr-only">Description</span>
                <textarea
                  className={styles.textarea}
                  placeholder="Description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </label>

              <div className={styles.formActions}>
                <button type="submit" className={styles.primaryBtn} disabled={submitting}>
                  {editingId ? "Save Changes" : "Add Event"}
                </button>
                <button type="button" className={styles.secondaryBtn} onClick={onClose}>
                  Close
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
