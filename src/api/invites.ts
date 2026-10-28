import { serverRequest } from './client';
import type { Invite, ListResponse } from './types';

export const getInvites = (eventId: string) => {
    return serverRequest<ListResponse<Invite>>(`/api/events/${eventId}/invites`, 'GET');
};

export const createInvite = (eventId: string, email: string) => {
    return serverRequest<Invite>(`/api/events/${eventId}/invites`, 'POST', { email });
};

export const deleteInvite = (eventId: string, inviteId: string) => {
    return serverRequest<void>(`/api/events/${eventId}/invites/${inviteId}`, 'DELETE');
};