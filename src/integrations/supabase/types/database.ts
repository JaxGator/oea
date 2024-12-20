import { Profile, ProfileInsert, ProfileUpdate } from './tables/profiles';
import { Event, EventInsert, EventUpdate } from './tables/events';
import { EventRSVP, EventRSVPInsert, EventRSVPUpdate } from './tables/event-rsvps';
import { Message, MessageInsert, MessageUpdate } from './tables/messages';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      events: {
        Row: Event;
        Insert: EventInsert;
        Update: EventUpdate;
      };
      event_rsvps: {
        Row: EventRSVP;
        Insert: EventRSVPInsert;
        Update: EventRSVPUpdate;
      };
      messages: {
        Row: Message;
        Insert: MessageInsert;
        Update: MessageUpdate;
      };
    };
  };
}