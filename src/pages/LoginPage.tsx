import { useForm } from 'react-hook-form'
import { ApiError, serverRequest } from '../api/client';
import { type AuthResponse } from '../api/types';
import { Link, useNavigate } from 'react-router-dom';
import { saveToken } from '../api/token';
import AuthShell from '../components/AuthShell';

type LoginForm = {
    email: string;
    password: string;
}

const LoginPage = () => {
    const { setError, handleSubmit, register, formState: { isSubmitting, errors } } = useForm<LoginForm>();
    const navigate = useNavigate()

    const onSubmit = async (data: LoginForm) => {
        try {
            const res = await serverRequest<AuthResponse>('/api/auth/login', 'POST', data);
            saveToken(res.token)
            navigate('/events')
        }
        catch (err) {
            if (err instanceof ApiError) {
                setError('root.serverError', { message: err.message })
            }
            else {
                setError('root.serverError', { message: "לא ניתן להתחבר לשרת" })
            }
        }
    }

    return (
        <AuthShell title="ברוכים השבים" subtitle="מתחברים, וממשיכים להתכונן לשמחה">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <label className="field">
                    <span className="label">מייל</span>
                    <input className="input" type="email" {...register('email', { required: 'מייל הוא שדה חובה' })} />
                    {errors.email && <span className="error">{errors.email.message}</span>}
                </label>

                <label className="field">
                    <span className="label">סיסמה</span>
                    <input className="input" type="password" {...register('password', { required: 'סיסמה היא שדה חובה' })} />
                    {errors.password && <span className="error">{errors.password.message}</span>}
                </label>

                {errors.root?.serverError && <p className="error">{errors.root.serverError.message}</p>}

                <button type="submit" disabled={isSubmitting} className="btn btn-primary mt-2">
                    {isSubmitting ? 'מתחבר...' : 'התחברות'}
                </button>

                <p className="mt-4 text-sm text-mist">
                    אין לך חשבון? <Link to="/register" className="link">הרשמה</Link>
                </p>
            </form>
        </AuthShell>
    );
}

export default LoginPage
