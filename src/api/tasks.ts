import { serverRequest } from './client';
import type { Task, ListResponse, TaskCategory, TaskStatus } from './types';

export type TaskFilters = {
    search?: string;
    category?: TaskCategory;
    status?: TaskStatus;
    mine?: boolean;
    sort?: 'status' | 'category' | 'cost_desc';
};

export type TaskInput = {
    title: string;
    category: TaskCategory;
    description?: string;
    cost?: number;
};

export const getTasks = (eventId: string, filters: TaskFilters = {}) => {
    const params = new URLSearchParams();

    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.status) params.append('status', filters.status);
    if (filters.mine) params.append('mine', 'true');
    if (filters.sort) params.append('sort', filters.sort);

    const query = params.toString();
    const basePath = `/api/events/${eventId}/tasks`;
    const path = query ? `${basePath}?${query}` : basePath;

    return serverRequest<ListResponse<Task>>(path, 'GET');
};

export const createTask = (eventId: string, task: TaskInput) => {
    return serverRequest<Task>(`/api/events/${eventId}/tasks`, 'POST', task);
};

export const getTask = (taskId: string) => {
    return serverRequest<Task>(`/api/tasks/${taskId}`, 'GET');
};

export const updateTask = (taskId: string, task: Partial<TaskInput>) => {
    return serverRequest<Task>(`/api/tasks/${taskId}`, 'PATCH', task);
};

export const deleteTask = (taskId: string) => {
    return serverRequest<void>(`/api/tasks/${taskId}`, 'DELETE');
};

export const claimTask = (taskId: string) => {
    return serverRequest<Task>(`/api/tasks/${taskId}/claim`, 'POST');
};

export const updateTaskStatus = (taskId: string, status: 'IN_PROGRESS' | 'DONE') => {
    return serverRequest<Task>(`/api/tasks/${taskId}/status`, 'PATCH', { status });
};

export const releaseTask = (taskId: string) => {
    return serverRequest<Task>(`/api/tasks/${taskId}/release`, 'POST');
};

export const requestRelease = (taskId: string, reason?: string) => {
    return serverRequest<{ message: string }>(`/api/tasks/${taskId}/release-request`, 'POST', { reason });
};

export const changeAssignee = (taskId: string, assigneeId: string | null) => {
    return serverRequest<Task>(`/api/tasks/${taskId}/assignee`, 'PATCH', { assigneeId });
};