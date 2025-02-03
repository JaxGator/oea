import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import { format, isAfter, isBefore, startOfDay } from 'date-fns';

const TIMEZONE = 'America/New_York';

export const toEasternTime = (date: Date): Date => {
  return toZonedTime(date, TIMEZONE);
};

export const fromEasternTime = (date: Date): Date => {
  return fromZonedTime(date, TIMEZONE);
};

export const combineDateAndTime = (date: string, time: string): Date => {
  const [hours, minutes] = time.split(':');
  const combined = new Date(date);
  combined.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
  return combined;
};

export const isEventPast = (eventDate: string, eventTime: string): boolean => {
  const now = toEasternTime(new Date());
  const eventDateTime = combineDateAndTime(eventDate, eventTime);
  const eventInET = toEasternTime(eventDateTime);
  return isBefore(eventInET, now);
};

export const formatEventDateTime = (date: string, time: string): string => {
  const dateTime = combineDateAndTime(date, time);
  const easternTime = toEasternTime(dateTime);
  return format(easternTime, 'MMMM d, yyyy h:mm a');
};