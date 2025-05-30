
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date string (e.g., "2024-06-15T14:30:00Z")
  location: string;
  createdAt: string;
  updatedAt: string; 
}

// Type for creating a new event (without id, createdAt, updatedAt)
export interface CreateEventRequest {
  title: string;
  description: string;
  date: string;
  location: string;
}

// Type for updating an event (all fields optional except id)
export interface UpdateEventRequest {
  id: string;
  title?: string;
  description?: string;
  date?: string;
  location?: string;
}

// API Response types
export interface EventsResponse {
  events: Event[];
  count: number;
}

export interface EventResponse {
  event: Event;
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

// Utility type for event validation
export interface EventValidationResult {
  isValid: boolean;
  errors: string[];
}

// Enum 
export enum EventSortBy {
  DATE_ASC = 'date_asc',
  DATE_DESC = 'date_desc',
  TITLE_ASC = 'title_asc',
  TITLE_DESC = 'title_desc',
  CREATED_ASC = 'created_asc',
  CREATED_DESC = 'created_desc'
}