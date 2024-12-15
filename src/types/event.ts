export interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string;
  location: string;
  maxAttendees: number;
  imageUrl: string;
  created_by: string;
  created_at: string;
}