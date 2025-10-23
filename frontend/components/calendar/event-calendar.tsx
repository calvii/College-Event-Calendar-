"use client"

import { useMemo, useState } from "react"
import useSWR, { mutate } from "swr"
import styles from "./calendar.module.css"
import { EventModal } from "./event-modal"

// Global API Constants
const BASE_URL = "http://localhost:5000"
const SWR_KEY = "/events"

type CalendarEvent = {
  id: string
  date: string
  title: string
  time?: string
  location?: string
  category?: "academic" | "sports" | "club"
  event_type?: "academic" | "sports" | "club"
  startTime?: string
  endTime?: string
  description?: string
}

const fetcher = (url: string) => fetch(`${BASE_URL}${url}`).then((r) => r.json())

function getMonthMatrix(year: number, month: number) {
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startWeekday = firstDayOfMonth.getDay()

  const matrix: (Date | null)[] = []
  for (let i = 0; i < startWeekday; i++) matrix.push(null)
  for (let d = 1; d <= daysInMonth; d++) matrix.push(new Date(year, month, d))
  while (matrix.length % 7 !== 0) matrix.push(null)
  return matrix
}

type EventCalendarProps = {
  role: "admin" | "student"
}

export default function EventCalendar({ role }: EventCalendarProps) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  // Remove adminMode toggle; we will rely on role from props
  const adminMode = role === "admin"

  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const { data, error, isLoading } = useSWR<{ events: CalendarEvent[] }>(SWR_KEY, fetcher)

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    if (data?.events) {
      for (const e of data.events) {
        const dateKey = e.date.split("T")[0]
        if (!map.has(dateKey)) map.set(dateKey, [])
        map.get(dateKey)!.push(e)
      }
    }
    return map
  }, [data])

  const matrix = useMemo(() => getMonthMatrix(viewYear, viewMonth), [viewYear, viewMonth])

  const monthLabel = useMemo(() => {
    const date = new Date(viewYear, viewMonth, 1)
    return date.toLocaleString(undefined, { month: "long", year: "numeric" })
  }, [viewYear, viewMonth])

  const weekdays = ["S", "M", "T", "W", "T", "F", "S"]

  function openDay(date: Date) {
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, "0")
    const dd = String(date.getDate()).padStart(2, "0")
    setSelectedDate(`${yyyy}-${mm}-${dd}`)
    setModalOpen(true)
  }

  function prevMonth() {
    if (viewMonth === 0) setViewMonth(11), setViewYear((y) => y - 1)
    else setViewMonth((m) => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) setViewMonth(0), setViewYear((y) => y + 1)
    else setViewMonth((m) => m + 1)
  }

  const revalidateEvents = async () => {
    await mutate(SWR_KEY)
  }

  return (
    <main className={styles.page}>
      <div className={styles.pageInner}>
        <header className={styles.pageHeader} aria-label="Calendar Header">
          <h1 className={styles.title}>College Event Calendar</h1>

          <div className={styles.headerRow}>
            <button type="button" className={styles.navBtn} onClick={prevMonth} aria-label="Previous month">
              {"<"}
            </button>
            <div className={styles.monthLabel} aria-live="polite">
              {monthLabel}
            </div>
            <button type="button" className={styles.navBtn} onClick={nextMonth} aria-label="Next month">
              {">"}
            </button>
          </div>

          {/* Admin info */}
          <div className={styles.adminToggleWrap}>
            <p>{adminMode ? "Admin Mode: On" : "Student Mode: Read-only"}</p>
          </div>
        </header>

        <section className={styles.calendarWrap} aria-label="Monthly Calendar">
          <div className={styles.card}>
            <div className={styles.weekdays} role="rowgroup" aria-label="Weekdays">
              {weekdays.map((d, i) => (
                <button key={d + i} type="button" className={styles.weekday} aria-label={`Weekday ${d}`}>
                  {d}
                </button>
              ))}
            </div>

            <div className={styles.grid} role="grid" aria-readonly>
              {matrix.map((date, idx) => {
                if (!date) return <div key={idx} className={styles.cellEmpty} aria-hidden="true" />
                const yyyy = date.getFullYear()
                const mm = String(date.getMonth() + 1).padStart(2, "0")
                const dd = String(date.getDate()).padStart(2, "0")
                const key = `${yyyy}-${mm}-${dd}`
                const dayEvents = eventsByDate.get(key) ?? []

                const isToday =
                  yyyy === today.getFullYear() &&
                  date.getMonth() === today.getMonth() &&
                  date.getDate() === today.getDate()

                return (
                  <button
                    key={idx}
                    type="button"
                    role="gridcell"
                    aria-label={`Day ${date.getDate()} with ${dayEvents.length} events`}
                    className={`${styles.cell} ${isToday ? styles.today : ""}`}
                    onClick={() => openDay(date)}
                  >
                    <span className={styles.dateNum}>{date.getDate()}</span>
                    {dayEvents.length > 0 && (
                      <div className={styles.dots}>
                        {dayEvents.slice(0, 3).map((ev) => {
                          const eventCategory = ev.event_type || ev.category
                          const colorClass =
                            eventCategory === "academic"
                              ? styles.dotAcademic
                              : eventCategory === "sports"
                              ? styles.dotSports
                              : styles.dotClub
                          return <span key={ev.id} className={`${styles.dot} ${colorClass}`} />
                        })}
                        {dayEvents.length > 3 && (
                          <span className={styles.moreDot} aria-label={`${dayEvents.length - 3} more events`} />
                        )}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </section>
      </div>

      <EventModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        date={selectedDate}
        admin={adminMode}
        events={selectedDate ? eventsByDate.get(selectedDate) ?? [] : []}
        onEventCreated={revalidateEvents}
        onEventUpdated={revalidateEvents}
        onEventDeleted={revalidateEvents}
        loading={isLoading}
        error={!!error}
      />
    </main>
  )
}
