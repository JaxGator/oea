
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface DatabaseError {
  code: string;
  message: string;
  details?: string;
}

export type QueryResult<T> = {
  data: T | null;
  error: {
    message: string;
    code?: string;
    details?: string;
  } | null;
};

// Query result type guards
export function isQueryError<T>(result: T | { error: true }): result is { error: true } {
  return result && typeof result === 'object' && 'error' in result;
}

export function isQuerySuccess<T>(result: T | { error: true }): result is T {
  return !isQueryError(result);
}

export type DbResult<T> = Promise<T | { error: true }>;
export type DbResultOk<T> = Promise<T>;
