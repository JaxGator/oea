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
  
  if (dayOfWeek === 0) { // Sunday
    friday.setDate(today.getDate() - 2); // Go back to Friday
  } else if (dayOfWeek >= 5) { // Friday or Saturday
    friday.setDate(today.getDate() - (dayOfWeek - 5)); // Go back to current Friday
  } else { // Monday through Thursday
    friday.setDate(today.getDate() + (5 - dayOfWeek)); // Go forward to next Friday
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