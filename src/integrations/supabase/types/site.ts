export type PageContent = {
  id: string;
  page_id: string;
  section_id: string;
  content: string;
  updated_by: string | null;
  updated_at: string | null;
  created_at: string | null;
};

export type SiteConfig = {
  id: string;
  key: string;
  value: string | null;
  updated_by: string | null;
  updated_at: string | null;
  created_at: string | null;
  verification_status: boolean | null;
};

export type SocialMediaFeed = {
  id: string;
  platform: 'instagram' | 'facebook' | 'twitter';
  feed_url: string;
  is_enabled: boolean | null;
  display_order: number;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
};