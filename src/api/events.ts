import { serverRequest } from './client';
import type {
    EventSummary,
    EventDetails,
    ListResponse,
    EventType,
    EventInput,
    Participant,
} from './types';

export type EventFilters = {
    type?: EventType;
    when?: 'upcoming' | 'past' | 'all';
    sort?: 'date_asc' | 'date_desc';
};

export const getEvents = (filters: EventFilters = {}) => {
    const params = new URLSearchParams();

    if (filters.type) params.append('type', filters.type);
    if (filters.when) params.append('when', filters.when);
    if (filters.sort) params.append('sort', filters.sort);

    const query = params.toString();
    const path = query ? `/api/events?${query}` : '/api/events';

    return serverRequest<ListResponse<EventSummary>>(path, 'GET');
};

export const getEvent = (eventId: string) => {
    return serverRequest<EventDetails>(`/api/events/${eventId}`, 'GET');
};

export const createEvent = (event: EventInput) => {
    return serverRequest<EventDetails>('/api/events', 'POST', event);
};

export const updateEvent = (eventId: string, event: Partial<EventInput>) => {
    return serverRequest<EventDetails>(`/api/events/${eventId}`, 'PATCH', event);
};

export const deleteEvent = (eventId: string) => {
    return serverRequest<void>(`/api/events/${eventId}`, 'DELETE');
};

export const getParticipants = (eventId: string) => {
    return serverRequest<ListResponse<Participant>>(`/api/events/${eventId}/participants`, 'GET');
};