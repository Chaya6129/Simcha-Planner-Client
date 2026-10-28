import { serverRequest } from './client';
import type { AuthResponse, MeResponse } from './types';

export const login = (data: { email: string; password: string }) =>
    serverRequest<AuthResponse>('/api/auth/login', 'POST', data);

export const register = (data: { fullName: string; email: string; password: string }) =>
    serverRequest<AuthResponse>('/api/auth/register', 'POST', data);

export const getMe = () =>
    serverRequest<MeResponse>('/api/auth/me', 'GET');