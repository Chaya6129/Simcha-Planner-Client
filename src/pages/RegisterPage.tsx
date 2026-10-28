import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { ApiError, serverRequest } from '../api/client';
import type { AuthResponse } from '../api/types';
import { saveToken } from '../api/token';

type RegisterForm = {
    fullName: string;
    email: string;
    password: string;
};

const RegisterPage = () => {
    const navigate = useNavigate();
    const {
        setError,
        handleSubmit,
        register,
        formState: { isSubmitting, errors },
    } = useForm<RegisterForm>();

    const onSubmit = async (data: RegisterForm) => {
        try {
            const res = await serverRequest<AuthResponse>('/api/auth/register', 'POST', data);
            saveToken(res.token);
            navigate('/events');
        } catch (err) {
            if (err instanceof ApiError) {
                setError('root.serverError', { message: err.message });
            } else {
                setError('root.serverError', { message: 'לא ניתן להתחבר לשרת' });
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input
                type="text"
                placeholder="שם מלא"
                {...register('fullName', {
                    required: 'שם מלא הוא שדה חובה',
                    minLength: { value: 2, message: 'השם צריך להכיל לפחות 2 תווים' },
                    maxLength: { value: 60, message: 'השם יכול להכיל עד 60 תווים' },
                })}
            />
            {errors.fullName && <span>{errors.fullName.message}</span>}

            <input
                type="email"
                placeholder="מייל"
                {...register('email', {
                    required: 'מייל הוא שדה חובה',
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'כתובת מייל לא תקינה',
                    },
                })}
            />
            {errors.email && <span>{errors.email.message}</span>}

            <input
                type="password"
                placeholder="סיסמה"
                {...register('password', {
                    required: 'סיסמה היא שדה חובה',
                    minLength: { value: 8, message: 'הסיסמה צריכה להכיל לפחות 8 תווים' },
                    maxLength: { value: 64, message: 'הסיסמה יכולה להכיל עד 64 תווים' },
                    validate: (value) =>
                        (/[a-zA-Z]/.test(value) && /\d/.test(value)) ||
                        'הסיסמה צריכה להכיל לפחות אות אחת באנגלית וספרה אחת',
                })}
            />
            {errors.password && <span>{errors.password.message}</span>}

            {errors.root?.serverError && <span>{errors.root.serverError.message}</span>}

            <button type="submit" disabled={isSubmitting}>הרשמה</button>
            <p>כבר רשום? <Link to="/login">התחברות</Link></p>
        </form>
    );
};

export default RegisterPage;