export interface SiteConfig {
  id: string;
  key: string;
  value: string | null;
  updated_by: string | null;
  updated_at: string | null;
  created_at: string | null;
}

export interface SiteConfigInsert extends Omit<SiteConfig, 'id' | 'created_at' | 'updated_at'> {
  id?: string;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface SiteConfigUpdate extends Partial<SiteConfigInsert> {}