import { useForm } from 'react-hook-form'
import { ApiError, serverRequest } from '../api/client';
import { type AuthResponse } from '../api/types';
import { Link, useNavigate } from 'react-router-dom';
import { saveToken } from '../api/token';
type LoginForm = {
    'email': string,
    'password': string;
}
const LoginPage = () => {
    const { setError, handleSubmit, register, formState: { isSubmitting, errors } } = useForm<LoginForm>();
    const navigate=useNavigate()
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
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="email" placeholder="מייל" {...register('email', { required: 'מייל הוא שדה חובה' })} />
            {errors.email && <span>{errors.email.message}</span>}
            <input type="password" placeholder="סיסמה" {...register('password', { required: 'סיסמא היא שדה חובה' })} />
            {errors.password && <span>{errors.password.message}</span>}
            {errors.root?.serverError && <span>{errors.root.serverError.message}</span>}
            <button type="submit" disabled={isSubmitting}>התחברות</button>
            <p>אין לך חשבון? <Link to="/register">הרשמה</Link></p>
        </form>
    );
}
export default LoginPage