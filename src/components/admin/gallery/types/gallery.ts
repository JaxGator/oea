export interface ImageType {
  url: string;
  id: string;
  displayOrder: number;
  fileName: string;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  description: string | null;
  event_id: string | null;
  folder_path: string;
  created_by: string;
  created_at: string;
}