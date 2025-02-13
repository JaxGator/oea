
import { Json } from './base';

export interface SocialMediaFeedsTable {
  Row: {
    id: string;
    platform: string;
    feed_url: string;
    created_at: string;
    updated_at: string;
    is_active: boolean;
    display_order: number;
  };
  Insert: {
    id?: string;
    platform: string;
    feed_url: string;
    created_at?: string;
    updated_at?: string;
    is_active?: boolean;
    display_order: number;
  };
  Update: {
    id?: string;
    platform?: string;
    feed_url?: string;
    created_at?: string;
    updated_at?: string;
    is_active?: boolean;
    display_order?: number;
  };
}

export type SocialMediaFeed = SocialMediaFeedsTable['Row'];
