import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getEvent } from '../api/events';
import { eventTypeLabels } from '../api/labels';
import TaskList from '../components/TaskList'

const EventPage = () => {
    const { eventId } = useParams();

    const { data, isLoading, error } = useQuery({
        queryKey: ['event', eventId],
        queryFn: () => getEvent(eventId!),
    });

    if (isLoading) return (
        <div className="flex flex-col gap-6">
            <div className="skeleton h-80" />
            <div className="grid gap-6 md:grid-cols-2">
                <div className="skeleton h-44" />
                <div className="skeleton h-44" />
            </div>
        </div>
    );
    if (error) return <p className="error">{error.message}</p>;
    if (!data) return null;

    const date = new Date(data.eventDate);
    const percent = data.progress.total
        ? Math.round((data.progress.done / data.progress.total) * 100)
        : 0;

    return (
        <div className="flex flex-col gap-6">
            {/* ראש העמוד בסגנון הזמנה לשמחה */}
            <section className="relative isolate overflow-hidden rounded-2xl border-4 border-double border-gold/60 bg-white px-6 py-12 text-center shadow-sm">
                <div className="ornament absolute inset-0 -z-10 opacity-20" aria-hidden />
                <p className="font-semibold text-gold">{eventTypeLabels[data.type]}</p>
                <h1 className="mt-3 text-6xl leading-tight">{data.name}</h1>
                <div className="mx-auto my-6 flex max-w-xs items-center gap-3 text-gold">
                    <span className="h-px flex-1 bg-gold/50" />
                    <span>✦</span>
                    <span className="h-px flex-1 bg-gold/50" />
                </div>
                <p className="font-display text-2xl text-sapphire">
                    {date.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    {', בשעה '}
                    {date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="mt-1 text-lg text-ink">{data.location}</p>
                <p className="mt-4 text-sm text-mist">בארגון {data.organizer.fullName}</p>
                {data.notes && (
                    <p className="mx-auto mt-4 max-w-lg rounded-lg bg-pearl px-4 py-3 text-sm text-ink">{data.notes}</p>
                )}

                {data.myRole === 'ORGANIZER' && (
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <Link to={`/events/${data.id}/tasks/new`} className="btn btn-gold btn-sm">משימה חדשה</Link>
                        <Link to={`/events/${data.id}/participants`} className="btn btn-ghost btn-sm">ניהול משתתפים</Link>
                        <Link to={`/events/${data.id}/edit`} className="btn btn-ghost btn-sm">עריכת השמחה</Link>
                    </div>
                )}
            </section>

            <div className="grid gap-6 md:grid-cols-2">
                {/* מצב הכנה */}
                <section className="panel">
                    <h2 className="text-3xl">מצב הכנה</h2>
                    <p className="mt-4 font-display text-5xl text-sapphire">
                        {data.progress.done}
                        <span className="font-body text-lg text-mist"> מתוך {data.progress.total} הושלמו</span>
                    </p>
                    <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-pearl">
                        <div className="h-full rounded-full bg-gradient-to-l from-gold to-gold-light transition-all duration-700" style={{ width: `${percent}%` }} />
                    </div>
                    <p className="mt-3 text-sm text-mist">
                        {data.progress.inProgress} בטיפול, {data.progress.open} עדיין פנויות
                    </p>
                </section>

                {/* תקציב */}
                <section className="panel">
                    <h2 className="text-3xl">תקציב</h2>
                    {data.budget === null ? (
                        <p className="mt-4 text-mist">לא הוגדר תקציב לשמחה הזו.</p>
                    ) : (
                        <dl className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                                <dt className="text-sm text-mist">תקציב</dt>
                                <dd className="font-display text-3xl text-sapphire">{data.budgetSummary.budget} ₪</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-mist">מתוכנן</dt>
                                <dd className="font-display text-3xl text-sapphire">{data.budgetSummary.planned} ₪</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-mist">הוצא</dt>
                                <dd className="font-display text-3xl text-sapphire">{data.budgetSummary.spent} ₪</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-mist">נשאר</dt>
                                <dd className={`font-display text-3xl ${(data.budgetSummary.remaining ?? 0) < 0 ? 'text-wine' : 'text-gold'}`}>
                                    {data.budgetSummary.remaining} ₪
                                </dd>
                            </div>
                        </dl>
                    )}
                </section>
            </div>

            <TaskList eventId={data.id} eventDate={data.eventDate} isOrganizer={data.myRole === 'ORGANIZER'} />
        </div>
    );
};

export default EventPage;
