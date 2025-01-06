export type GalleryAlbum = {
  id: string;
  title: string;
  description: string | null;
  event_id: string | null;
  folder_path: string;
  created_by: string;
  created_at: string;
};

export type GalleryImage = {
  id: string;
  file_name: string;
  display_order: number;
  created_at: string;
};