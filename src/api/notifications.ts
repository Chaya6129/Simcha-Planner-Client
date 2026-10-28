import { serverRequest } from './client';
import type { AppNotification, ListResponse } from './types';

export const getNotifications = (unreadOnly = false) => {
    const path = unreadOnly ? '/api/notifications?unreadOnly=true' : '/api/notifications';
    return serverRequest<ListResponse<AppNotification>>(path, 'GET');
};

export const markAsRead = (notificationId: string) => {
    return serverRequest<AppNotification>(`/api/notifications/${notificationId}/read`, 'PATCH');
};

export const markAllAsRead = () => {
    return serverRequest<{ updated: number }>('/api/notifications/read-all', 'PATCH');
};