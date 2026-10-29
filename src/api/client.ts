export type FieldError = {
    field: string;
    message: string;
};

export class ApiError extends Error {
    status: number;
    code: string;
    details?: FieldError[];

    constructor(status: number, code: string, message: string, details?: FieldError[]) {
        super(message);
        this.status = status;
        this.code = code;
        this.name = 'ApiError';
        this.details = details;
    }
}

export const serverRequest = async <T>(
    path: string,
    method: 'GET' | 'PATCH' | 'POST' | 'DELETE',
    body?: unknown
): Promise<T> => {
    const url = import.meta.env.VITE_API_URL + path;
    const token = localStorage.getItem('token');

    const headers: Record<string, string> = {};
    if (body != null)
        headers['content-type'] = 'application/json';
    if (token != null)
        headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(url, {
        method,
        headers,
        body: body != null ? JSON.stringify(body) : undefined
    });

    if (response.status === 401 && path !== '/api/auth/login') {
    localStorage.removeItem('token');
    if (window.location.pathname !== '/login') {
        window.location.href = '/login';
    }
    throw new ApiError(401, 'UNAUTHORIZED', 'נדרשת התחברות מחדש');
}

    if (!response.ok) {
        const data = await response.json();
        throw new ApiError(response.status, data.error.code, data.error.message, data.error.details);
    }

    if (response.status === 204)
        return undefined as T;

    return await response.json();
};