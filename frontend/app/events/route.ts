import { NextResponse } from "next/server"

type CalendarEvent = {
  id: string
  date: string // YYYY-MM-DD
  title: string
  time?: string
  location?: string
  category?: "academic" | "sports" | "club"
  startTime?: string
  endTime?: string
  description?: string
}

let EVENTS: CalendarEvent[] = [
  {
    id: "seed-1",
    date: new Date().toISOString().slice(0, 10),
    title: "Orientation Briefing",
    time: "10:00 AM",
    location: "Main Hall",
    category: "academic",
  },
  {
    id: "seed-2",
    date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    title: "Soccer Practice",
    time: "4:30 PM",
    location: "Athletics Field",
    category: "sports",
  },
  {
    id: "seed-3",
    date: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10),
    title: "Robotics Club Meetup",
    time: "6:00 PM",
    location: "Lab 3",
    category: "club",
  },
]

export async function GET() {
  return NextResponse.json({ events: EVENTS })
}

export async function POST(req: Request) {
  const body = (await req.json()) as Omit<CalendarEvent, "id">
  if (!body?.date || !body?.title) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }
  const id = crypto.randomUUID()
  const ev: CalendarEvent = {
    id,
    date: body.date,
    title: body.title,
    time: body.time,
    location: body.location,
    category: body.category ?? "academic",
    startTime: (body as any).startTime,
    endTime: (body as any).endTime,
    description: (body as any).description,
  }
  EVENTS.unshift(ev)
  return NextResponse.json({ ok: true, id })
}

export async function PUT(req: Request) {
  const body = (await req.json()) as Partial<CalendarEvent> & { id: string }
  if (!body?.id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
  const i = EVENTS.findIndex((e) => e.id === body.id)
  if (i === -1) return NextResponse.json({ error: "Not found" }, { status: 404 })
  EVENTS[i] = { ...EVENTS[i], ...body, id: EVENTS[i].id }
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request) {
  const body = (await req.json()) as { id: string }
  if (!body?.id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
  EVENTS = EVENTS.filter((e) => e.id !== body.id)
  return NextResponse.json({ ok: true })
}
