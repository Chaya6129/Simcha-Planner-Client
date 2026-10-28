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
        <div className="flex min-h-screen items-center justify-center px-4 py-10">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-md rounded-2xl border-4 border-double border-gold/60 bg-white p-8 shadow-sm"
            >
                <h1 className="text-center text-4xl font-bold">הרשמה</h1>
                <p className="mt-2 mb-8 text-center text-mist">חשבון אחד לכל השמחות של המשפחה</p>

                <div className="flex flex-col gap-4">
                    <label className="field">
                        <span className="label">שם מלא</span>
                        <input
                            className="input"
                            type="text"
                            {...register('fullName', {
                                required: 'שם מלא הוא שדה חובה',
                                minLength: { value: 2, message: 'השם צריך להכיל לפחות 2 תווים' },
                                maxLength: { value: 60, message: 'השם יכול להכיל עד 60 תווים' },
                            })}
                        />
                        {errors.fullName && <span className="error">{errors.fullName.message}</span>}
                    </label>

                    <label className="field">
                        <span className="label">מייל</span>
                        <input
                            className="input"
                            type="email"
                            {...register('email', {
                                required: 'מייל הוא שדה חובה',
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'כתובת מייל לא תקינה',
                                },
                            })}
                        />
                        {errors.email && <span className="error">{errors.email.message}</span>}
                    </label>

                    <label className="field">
                        <span className="label">סיסמה</span>
                        <input
                            className="input"
                            type="password"
                            {...register('password', {
                                required: 'סיסמה היא שדה חובה',
                                minLength: { value: 8, message: 'הסיסמה צריכה להכיל לפחות 8 תווים' },
                                maxLength: { value: 64, message: 'הסיסמה יכולה להכיל עד 64 תווים' },
                                validate: (value) =>
                                    (/[a-zA-Z]/.test(value) && /\d/.test(value)) ||
                                    'הסיסמה צריכה להכיל לפחות אות אחת באנגלית וספרה אחת',
                            })}
                        />
                        <span className="text-xs text-mist">8 תווים לפחות, עם אות באנגלית וספרה</span>
                        {errors.password && <span className="error">{errors.password.message}</span>}
                    </label>

                    {errors.root?.serverError && <p className="error">{errors.root.serverError.message}</p>}

                    <button type="submit" disabled={isSubmitting} className="btn btn-primary mt-2">הרשמה</button>
                </div>

                <p className="mt-6 text-center text-sm text-mist">
                    כבר רשום? <Link to="/login" className="link">התחברות</Link>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;
