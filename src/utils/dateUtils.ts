import { startOfDay, addDays } from "date-fns";

export const isSameDay = (date1: Date, date2: Date): boolean => {
  const d1 = startOfDay(date1);
  const d2 = startOfDay(date2);
  return d1.getTime() === d2.getTime();
};

export const getUpcomingWeekendDate = (): Date => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 is Sunday, 6 is Saturday
  const friday = new Date(today);
  
  // If today is Sunday, get next Friday
  if (dayOfWeek === 0) {
    friday.setDate(today.getDate() + 5);
  } 
  // If today is already Friday or Saturday, use today's date
  else if (dayOfWeek >= 5) {
    friday.setDate(today.getDate());
  } 
  // Otherwise, get this coming Friday
  else {
    friday.setDate(today.getDate() + (5 - dayOfWeek));
  }
  
  return startOfDay(friday);
};

export const filterEventsByDate = (events: any[], selectedDate: Date | undefined): any[] => {
  if (!selectedDate) return events;

  const normalizedSelectedDate = startOfDay(selectedDate);

  return events.filter((event) => {
    const eventDate = startOfDay(new Date(event.date));

    // For "This Weekend" selection
    if (normalizedSelectedDate.getDay() === 5) {
      return isDateInWeekendRange(eventDate, normalizedSelectedDate);
    }

    return isSameDay(eventDate, normalizedSelectedDate);
  });
};

export const isDateInWeekendRange = (date: Date, weekendStart: Date): boolean => {
  const normalizedDate = startOfDay(date);
  const normalizedWeekendStart = startOfDay(weekendStart);
  
  const weekendEnd = startOfDay(new Date(normalizedWeekendStart));
  weekendEnd.setDate(normalizedWeekendStart.getDate() + 2); // Sunday (Friday + 2 days)
  weekendEnd.setHours(23, 59, 59, 999);
  
  return normalizedDate >= normalizedWeekendStart && normalizedDate <= weekendEnd;
};
