export interface EventFilters {
  date: Date | null;
  location?: string;
  maxGuests?: number;
  searchTerm?: string;
}

export const defaultFilters: EventFilters = {
  date: null,
  location: '',
  maxGuests: undefined,
  searchTerm: '',
};