export interface PageContent {
  id: string;
  page_id: string;
  section_id: string;
  content: string;
  updated_by: string | null;
  updated_at: string | null;
  created_at: string | null;
}

export interface PageContentInsert extends Omit<PageContent, 'id' | 'created_at' | 'updated_at'> {
  id?: string;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface PageContentUpdate extends Partial<PageContentInsert> {}