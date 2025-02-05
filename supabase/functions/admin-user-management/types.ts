
export interface UpdateUserRequest {
  action?: string;
  userId: string;
  username?: string;
  fullName?: string;
  isAdmin?: boolean;
  isApproved?: boolean;
  isMember?: boolean;
  avatarUrl?: string;
  email?: string;
  password?: string;
}

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
