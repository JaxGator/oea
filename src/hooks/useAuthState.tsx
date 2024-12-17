import { AuthState } from "@/types/auth";

export function useAuthState(): AuthState {
  return {
    isLoading: false,
    user: null,
    profile: null
  };
}