export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
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
  
  friday.setHours(0, 0, 0, 0);
  return friday;
};

export const isDateInWeekendRange = (date: Date, weekendStart: Date): boolean => {
  const dateToCheck = new Date(date);
  dateToCheck.setHours(0, 0, 0, 0);
  
  const weekendEnd = new Date(weekendStart);
  weekendEnd.setDate(weekendStart.getDate() + 2); // Sunday (Friday + 2 days)
  weekendEnd.setHours(23, 59, 59, 999);
  
  return dateToCheck >= weekendStart && dateToCheck <= weekendEnd;
};

export const filterEventsByDate = (events: any[], selectedDate: Date | undefined): any[] => {
  if (!selectedDate) return events;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return events.filter(event => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);

    // For "This Weekend" selection
    if (selectedDate.getDay() === 5) { // If selected date is Friday
      return isDateInWeekendRange(eventDate, selectedDate);
    }

    // For specific date selection
    return isSameDay(eventDate, selectedDate);
  });
};
