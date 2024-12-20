export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
}

export type MessageInsert = Omit<Message, 'id' | 'created_at' | 'read_at'> & {
  id?: string;
  created_at?: string;
  read_at?: string | null;
};

export type MessageUpdate = Partial<Message>;