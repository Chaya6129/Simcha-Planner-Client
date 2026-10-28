import { useForm } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom'
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createInvite, deleteInvite, getInvites } from '../api/invites'

type InviteForm = {
        email: string;
}
const ParticipantsPage = () => {
        const { eventId } = useParams();
        const { data, isLoading, error } = useQuery(
                {
                        queryKey: ['invites', eventId],
                        queryFn: () => getInvites(eventId!)
                }
        )
        const queryClient = useQueryClient()
        const {
                register,
                handleSubmit,
                setError,
                reset,
                formState: { errors },
        } = useForm<InviteForm>();
        const add = useMutation({
                mutationFn: (email: string) => createInvite(eventId!, email),
                onSuccess: () => {
                        queryClient.invalidateQueries({ queryKey: ['invites', eventId] });
                        reset();
                },
                onError: (err) => {
                        setError('root.serverError', { message: err.message });
                },
        });
        const remove = useMutation({
                mutationFn: (inviteId: string) => deleteInvite(eventId!, inviteId),
                onSuccess: () => {
                        queryClient.invalidateQueries({ queryKey: ['invites', eventId] });
                        queryClient.invalidateQueries({ queryKey: ['tasks', eventId] });
                        queryClient.invalidateQueries({ queryKey: ['event', eventId] });
                },
                onError: (err) => {
                        alert(err.message);
                },
        });
        const onSubmit = (form: InviteForm) => {
                add.mutate(form.email)
        }
        return <div>
                <h2>ניהול משתמשים  </h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                        <input
                                type="email"
                                placeholder="מייל של משתתף"
                                {...register('email', {
                                        required: 'מייל הוא שדה חובה',
                                        pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: 'כתובת מייל לא תקינה',
                                        },
                                })}
                        />
                        <button type="submit" disabled={add.isPending}>הוספה</button>
                        {errors.email && <span>{errors.email.message}</span>}
                        {errors.root?.serverError && <span>{errors.root.serverError.message}</span>}
                </form>
                {isLoading && <p>טוען ...</p>}
                {error && <p>{error.message}</p>}
                {data?.items.length === 0 && <p>עדיין לא נוספו משתמשים</p>}
                <ul>
                        {data?.items.map((invite) => (
                                <li key={invite.id}>
                                        <strong>{invite.email}</strong>
                                        {invite.registeredUser && <p>{invite.registeredUser.fullName}</p>}.<button onClick={() => remove.mutate(invite.id)} disabled={remove.isPending}>
                                                הסרה
                                        </button>
                                </li>
                        ))}
                </ul>

        </div>
}
export default ParticipantsPage