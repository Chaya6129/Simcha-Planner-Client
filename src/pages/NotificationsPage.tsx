import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getNotifications, markAllAsRead, markAsRead } from '../api/notifications';

const NotificationsPage = () => {
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ['notifications'],
        queryFn: () => getNotifications(),
    });

    // אחרי סימון: מרעננים את הרשימה, וגם את 'me' כדי שהמספר בסרגל יתעדכן
    const refresh = () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        queryClient.invalidateQueries({ queryKey: ['me'] });
    };

    const readOne = useMutation({
        mutationFn: (id: string) => markAsRead(id),
        onSuccess: refresh,
        onError: (err) => alert(err.message),
    });

    const readAll = useMutation({
        mutationFn: () => markAllAsRead(),
        onSuccess: refresh,
        onError: (err) => alert(err.message),
    });

    const hasUnread = data?.items.some((n) => !n.isRead);

    return (
        <div className="mx-auto flex max-w-2xl flex-col gap-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <h1 className="text-4xl font-bold">הודעות</h1>
                {hasUnread && (
                    <button onClick={() => readAll.mutate()} disabled={readAll.isPending} className="btn btn-ghost btn-sm">
                        סימון הכל כנקרא
                    </button>
                )}
            </div>

            {isLoading && <p className="text-mist">טוען...</p>}
            {error && <p className="error">{error.message}</p>}
            {data?.items.length === 0 && (
                <div className="panel text-center text-mist">אין הודעות. כאן יופיעו העברות משימות ובקשות ויתור.</div>
            )}

            {data && data.items.length > 0 && (
                <ul className="panel divide-y divide-sapphire/10 p-0">
                    {data.items.map((n) => (
                        <li
                            key={n.id}
                            className={`flex items-start gap-4 p-5 ${n.isRead ? '' : 'border-r-4 border-gold bg-gold-soft/30'}`}
                        >
                            <div className="flex min-w-0 flex-1 flex-col gap-1">
                                <p className={n.isRead ? 'text-mist' : 'font-semibold text-ink'}>{n.message}</p>
                                <div className="flex flex-wrap items-center gap-3 text-sm">
                                    <span className="text-mist">
                                        {new Date(n.createdAt).toLocaleString('he-IL', { dateStyle: 'short', timeStyle: 'short' })}
                                    </span>
                                    <Link to={`/events/${n.eventId}`} className="link">מעבר לשמחה</Link>
                                </div>
                            </div>
                            {!n.isRead && (
                                <button
                                    onClick={() => readOne.mutate(n.id)}
                                    disabled={readOne.isPending}
                                    className="btn btn-ghost btn-sm shrink-0"
                                >
                                    סימון כנקרא
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NotificationsPage;
