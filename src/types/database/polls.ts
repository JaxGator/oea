
import { Json } from './base';

export interface PollsTable {
  Row: {
    id: string;
    title: string;
    description: string | null;
    created_at: string;
    created_by: string;
    status: 'active' | 'closed';
    start_date: string | null;
    end_date: string | null;
    allow_multiple_choices: boolean;
    share_token: string | null;
    visibility: 'public' | 'private';
  };
  Insert: {
    id?: string;
    title: string;
    description?: string | null;
    created_at?: string;
    created_by: string;
    status?: 'active' | 'closed';
    start_date?: string | null;
    end_date?: string | null;
    allow_multiple_choices?: boolean;
    share_token?: string | null;
    visibility?: 'public' | 'private';
  };
  Update: {
    id?: string;
    title?: string;
    description?: string | null;
    created_at?: string;
    created_by?: string;
    status?: 'active' | 'closed';
    start_date?: string | null;
    end_date?: string | null;
    allow_multiple_choices?: boolean;
    share_token?: string | null;
    visibility?: 'public' | 'private';
  };
}

export type Poll = PollsTable['Row'];
export type PollOption = PollOptionsTable['Row'];

export interface PollOptionsTable {
  Row: {
    id: string;
    poll_id: string;
    option_text: string;
    created_at: string;
    display_order: number;
  };
  Insert: {
    id?: string;
    poll_id: string;
    option_text: string;
    created_at?: string;
    display_order: number;
  };
  Update: {
    id?: string;
    poll_id?: string;
    option_text?: string;
    created_at?: string;
    display_order?: number;
  };
}

export type VoteResult = 'success' | 'already_voted' | 'poll_closed' | 'not_found';

export type PollWithDetails = Poll & {
  poll_options: (PollOption & {
    has_voted?: boolean;
    vote_count?: number;
  })[];
  total_votes?: number;
};
