import { startOfDay, addDays } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";

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

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return events.filter(event => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);

    // For "This Weekend" selection
    if (selectedDate.getDay() === 5) { // If selected date is Friday
      return isDateInWeekendRange(eventDate, selectedDate);
    }

    // Convert event date to local timezone for comparison
    const localEventDate = zonedTimeToUtc(eventDate, timeZone);
    localEventDate.setHours(0, 0, 0, 0);
    
    const localSelectedDate = zonedTimeToUtc(selectedDate, timeZone);
    localSelectedDate.setHours(0, 0, 0, 0);

    return isSameDay(localEventDate, localSelectedDate);
  });
};

export const isDateInWeekendRange = (date: Date, weekendStart: Date): boolean => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const localDate = zonedTimeToUtc(date, timeZone);
  localDate.setHours(0, 0, 0, 0);
  
  const localWeekendStart = zonedTimeToUtc(weekendStart, timeZone);
  localWeekendStart.setHours(0, 0, 0, 0);
  
  const weekendEnd = new Date(localWeekendStart);
  weekendEnd.setDate(localWeekendStart.getDate() + 2); // Sunday (Friday + 2 days)
  weekendEnd.setHours(23, 59, 59, 999);
  
  return localDate >= localWeekendStart && localDate <= weekendEnd;
};