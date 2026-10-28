import { useForm } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createInvite, deleteInvite, getInvites } from '../api/invites'

type InviteForm = {
    email: string;
}

const ParticipantsPage = () => {
    const { eventId } = useParams();
    const { data, isLoading, error } = useQuery({
        queryKey: ['invites', eventId],
        queryFn: () => getInvites(eventId!),
    })
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

    return (
        <div className="mx-auto flex max-w-2xl flex-col gap-6">
            <div>
                <Link to={`/events/${eventId}`} className="link text-sm">חזרה לשמחה</Link>
                <h1 className="mt-2 text-3xl font-bold">ניהול משתתפים</h1>
                <p className="mt-1 text-mist">
                    מי שהמייל שלו ברשימה ונרשם למערכת, רואה את השמחה ויכול לקחת משימות.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="panel flex flex-col gap-2">
                <span className="label">הוספת משתתף</span>
                <div className="flex gap-3">
                    <input
                        className="input"
                        type="email"
                        placeholder="name@example.com"
                        {...register('email', {
                            required: 'מייל הוא שדה חובה',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'כתובת מייל לא תקינה',
                            },
                        })}
                    />
                    <button type="submit" disabled={add.isPending} className="btn btn-gold shrink-0">הוספה</button>
                </div>
                {errors.email && <span className="error">{errors.email.message}</span>}
                {errors.root?.serverError && <span className="error">{errors.root.serverError.message}</span>}
            </form>

            <section className="panel">
                {isLoading && <p className="text-mist">טוען...</p>}
                {error && <p className="error">{error.message}</p>}
                {data?.items.length === 0 && <p className="text-mist">עדיין לא נוספו משתתפים. הוסיפו מייל כדי להזמין.</p>}

                <ul className="divide-y divide-sapphire/10">
                    {data?.items.map((invite) => (
                        <li key={invite.id} className="flex items-center justify-between gap-4 py-3">
                            <div className="flex min-w-0 flex-col">
                                <span className="font-semibold text-ink">
                                    {invite.registeredUser ? invite.registeredUser.fullName : invite.email}
                                </span>
                                {invite.registeredUser ? (
                                    <span className="text-sm text-mist">{invite.email}</span>
                                ) : (
                                    <span className="text-sm text-gold">עוד לא נרשם למערכת</span>
                                )}
                            </div>
                            <button
                                onClick={() => remove.mutate(invite.id)}
                                disabled={remove.isPending}
                                className="btn btn-danger btn-sm"
                            >
                                הסרה
                            </button>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    )
}

export default ParticipantsPage
