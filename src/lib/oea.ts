export const OEA_TAGS = [
  "Kayak",
  "Hike",
  "Bike",
  "Beach",
  "Camping",
  "Social",
  "Beginner-friendly",
] as const;

export const OEA_DIFFICULTIES = [
  "Easy",
  "Easy–Moderate",
  "Moderate",
  "Challenging",
] as const;

export const OEA_STATUSES = ["published", "draft", "cancelled"] as const;

export type OeaTag = (typeof OEA_TAGS)[number];
export type OeaDifficulty = (typeof OEA_DIFFICULTIES)[number];
export type OeaStatus = (typeof OEA_STATUSES)[number];

export interface OeaRsvp {
  id: string;
  user_id: string;
  response: string;
  status: string | null;
  event_guests?: { id: string }[] | null;
  profiles?: { full_name: string | null; username: string | null } | null;
}

export interface OeaEvent {
  id: string;
  slug: string | null;
  title: string;
  description: string | null;
  date: string;
  time: string;
  end_time: string | null;
  location: string;
  place: string | null;
  difficulty: string | null;
  tags: string[] | null;
  status: string | null;
  organizer: string | null;
  max_guests: number | null;
  image_url: string | null;
  is_published: boolean | null;
  imported_rsvp_count: number | null;
  latitude: number | null;
  longitude: number | null;
  created_by?: string | null;
  event_rsvps?: OeaRsvp[] | null;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Build a Date in local time from an event's `date` + `time` columns. */
export function eventDateTime(event: Pick<OeaEvent, "date" | "time">): Date {
  const [y, m, d] = event.date.split("-").map(Number);
  const [hh = 0, mm = 0] = (event.time || "00:00").split(":").map(Number);
  return new Date(y, (m || 1) - 1, d || 1, hh, mm);
}

export function eventDateOnly(event: Pick<OeaEvent, "date">): Date {
  const [y, m, d] = event.date.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function formatTime(time?: string | null): string {
  if (!time) return "";
  const [hh, mm] = time.split(":").map(Number);
  const period = hh >= 12 ? "PM" : "AM";
  const hour = hh % 12 === 0 ? 12 : hh % 12;
  return `${hour}:${String(mm ?? 0).padStart(2, "0")} ${period}`;
}

export function formatTimeRange(event: Pick<OeaEvent, "time" | "end_time">): string {
  const start = formatTime(event.time);
  const end = formatTime(event.end_time);
  return end ? `${start} - ${end}` : start;
}

/** Total people going: attending RSVPs + their extra guests + imported count. */
export function goingCount(event: OeaEvent): number {
  const rsvps = event.event_rsvps ?? [];
  const attending = rsvps.filter(
    (r) => r.response === "attending" && r.status !== "waitlisted",
  );
  const guests = attending.reduce((sum, r) => sum + (r.event_guests?.length ?? 0), 0);
  return attending.length + guests + (event.imported_rsvp_count ?? 0);
}

export function eventPath(event: Pick<OeaEvent, "slug" | "id">): string {
  return `/event/${event.slug || event.id}`;
}

export function isPastEvent(event: Pick<OeaEvent, "date" | "time" | "end_time">): boolean {
  const end = eventDateTime(event);
  if (event.end_time) {
    const [hh, mm] = event.end_time.split(":").map(Number);
    end.setHours(hh || 23, mm || 59);
  } else {
    end.setHours(23, 59);
  }
  return end.getTime() < Date.now();
}

/** Duration in minutes between start and end time, or null. */
export function durationMinutes(event: Pick<OeaEvent, "time" | "end_time">): number | null {
  if (!event.end_time) return null;
  const [sh, sm] = event.time.split(":").map(Number);
  const [eh, em] = event.end_time.split(":").map(Number);
  return (eh * 60 + em) - (sh * 60 + sm);
}

export function addMinutesToTime(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = (h * 60 + m + minutes + 24 * 60) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

/** Google Calendar link for an event. */
export function googleCalendarUrl(event: OeaEvent): string {
  const start = eventDateTime(event);
  const end = new Date(start);
  const mins = durationMinutes(event);
  end.setMinutes(end.getMinutes() + (mins && mins > 0 ? mins : 120));
  const fmt = (d: Date) =>
    `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}T${String(
      d.getHours(),
    ).padStart(2, "0")}${String(d.getMinutes()).padStart(2, "0")}00`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: (event.description || "").replace(/<[^>]+>/g, "").slice(0, 900),
    location: [event.place, event.location].filter(Boolean).join(", "),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
