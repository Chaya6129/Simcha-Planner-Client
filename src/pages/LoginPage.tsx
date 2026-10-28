import { useForm } from 'react-hook-form'
import { ApiError, serverRequest } from '../api/client';
import { type AuthResponse } from '../api/types';
import { Link, useNavigate } from 'react-router-dom';
import { saveToken } from '../api/token';

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
        <div className="flex min-h-screen items-center justify-center px-4">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-md rounded-2xl border-4 border-double border-gold/60 bg-white p-8 shadow-sm"
            >
                <h1 className="text-center text-4xl font-bold">מתכנן שמחות</h1>
                <p className="mt-2 mb-8 text-center text-mist">מתחברים, ומתחלקים בהכנות</p>

                <div className="flex flex-col gap-4">
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

                    <button type="submit" disabled={isSubmitting} className="btn btn-primary mt-2">התחברות</button>
                </div>

                <p className="mt-6 text-center text-sm text-mist">
                    אין לך חשבון? <Link to="/register" className="link">הרשמה</Link>
                </p>
            </form>
        </div>
    );
}

export default LoginPage
