export * from './tables/profiles';
export * from './tables/events';
export * from './tables/event-rsvps';
export * from './tables/event-guests';
export * from './tables/messages';
export * from './tables/page-content';
export * from './tables/site-config';

import type { Profile, ProfileInsert, ProfileUpdate } from './tables/profiles';
import type { Event, EventInsert, EventUpdate } from './tables/events';
import type { EventRSVP, EventRSVPInsert, EventRSVPUpdate } from './tables/event-rsvps';
import type { EventGuest, EventGuestInsert, EventGuestUpdate } from './tables/event-guests';
import type { Message, MessageInsert, MessageUpdate } from './tables/messages';
import type { PageContent, PageContentInsert, PageContentUpdate } from './tables/page-content';
import type { SiteConfig, SiteConfigInsert, SiteConfigUpdate } from './tables/site-config';

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
      event_guests: {
        Row: EventGuest;
        Insert: EventGuestInsert;
        Update: EventGuestUpdate;
      };
      messages: {
        Row: Message;
        Insert: MessageInsert;
        Update: MessageUpdate;
      };
      page_content: {
        Row: PageContent;
        Insert: PageContentInsert;
        Update: PageContentUpdate;
      };
      site_config: {
        Row: SiteConfig;
        Insert: SiteConfigInsert;
        Update: SiteConfigUpdate;
      };
    };
  };
}