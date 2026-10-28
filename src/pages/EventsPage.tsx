import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getEvents, type EventFilters } from '../api/events';
import type { EventSummary, EventType } from '../api/types';
import { eventTypeLabels, eventRoleLabels } from '../api/labels';
import { useAuth } from '../auth/AuthContext';

const whenOptions: { value: EventFilters['when']; label: string }[] = [
    { value: 'upcoming', label: 'קרובות' },
    { value: 'past', label: 'שעברו' },
    { value: 'all', label: 'הכל' },
];

// ברכה לפי שעה ביום
const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'בוקר טוב';
    if (hour < 17) return 'צהריים טובים';
    if (hour < 21) return 'ערב טוב';
    return 'לילה טוב';
};

// "היום", "מחר", או "בעוד X ימים"
const daysUntil = (iso: string) => {
    const days = Math.ceil((new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days <= 0) return 'היום';
    if (days === 1) return 'מחר';
    return `בעוד ${days} ימים`;
};

const percentDone = (event: EventSummary) =>
    event.progress.total ? Math.round((event.progress.done / event.progress.total) * 100) : 0;

const EventsPage = () => {
    const firstName = useAuth().user?.user.fullName.split(' ')[0];
    const [filters, setFilters] = useState<EventFilters>({
        when: 'upcoming',
        sort: 'date_asc',
    });

    const { data, isLoading, error } = useQuery({
        queryKey: ['events', filters],
        queryFn: () => getEvents(filters),
    });

    // "השמחה הקרובה" מוצגת בנפרד, רק כשמסתכלים על הקרובות לפי סדר תאריך
    const showNext = filters.when === 'upcoming' && filters.sort === 'date_asc' && !filters.type;
    const next = showNext ? data?.items[0] : undefined;
    const rest = next ? data?.items.slice(1) : data?.items;

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-gold">{greeting()}{firstName && `, ${firstName}`}</p>
                    <h1 className="text-5xl">השמחות שלי</h1>
                </div>
                <Link to="/events/new" className="btn btn-gold">שמחה חדשה</Link>
            </div>

            {/* השמחה הקרובה */}
            {next && (
                <Link
                    to={`/events/${next.id}`}
                    className="group relative isolate overflow-hidden rounded-2xl bg-sapphire p-8 text-white shadow-xl shadow-sapphire/25 transition-transform duration-300 hover:-translate-y-0.5"
                >
                    <div className="ornament absolute inset-0 -z-10 opacity-30" aria-hidden />
                    <div className="absolute -top-24 -left-24 -z-10 size-80 rounded-full bg-gold/30 blur-3xl transition-transform duration-700 group-hover:scale-125" aria-hidden />

                    <p className="text-sm font-semibold text-gold-light">השמחה הקרובה, {daysUntil(next.eventDate)}</p>
                    <p className="mt-2 font-display text-5xl">{next.name}</p>
                    <p className="mt-3 text-white/75">
                        {eventTypeLabels[next.type]}, {new Date(next.eventDate).toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' })}, {next.location}
                    </p>
                    <div className="mt-6 flex items-center gap-4">
                        <div className="h-2 w-48 overflow-hidden rounded-full bg-white/15">
                            <div className="h-full rounded-full bg-gold-light transition-all duration-700" style={{ width: `${percentDone(next)}%` }} />
                        </div>
                        <span className="text-sm text-white/75">
                            {next.progress.done} מתוך {next.progress.total} משימות הושלמו
                        </span>
                    </div>
                </Link>
            )}

            {/* סינון ומיון */}
            <div className="flex flex-wrap items-center gap-3">
                <select
                    className="input w-auto"
                    value={filters.type ?? ''}
                    onChange={(e) =>
                        setFilters({
                            ...filters,
                            type: e.target.value ? (e.target.value as EventType) : undefined,
                        })
                    }
                >
                    <option value="">כל הסוגים</option>
                    {Object.entries(eventTypeLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>

                <div className="flex overflow-hidden rounded-lg border border-sapphire/20 bg-white">
                    {whenOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setFilters({ ...filters, when: option.value })}
                            className={`cursor-pointer px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                                filters.when === option.value
                                    ? 'bg-sapphire text-white'
                                    : 'text-sapphire hover:bg-pearl'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                <select
                    className="input w-auto"
                    value={filters.sort}
                    onChange={(e) => setFilters({ ...filters, sort: e.target.value as EventFilters['sort'] })}
                >
                    <option value="date_asc">הקרובה קודם</option>
                    <option value="date_desc">הרחוקה קודם</option>
                </select>
            </div>

            {isLoading && (
                <div className="flex flex-col gap-3">
                    <div className="skeleton h-24" />
                    <div className="skeleton h-24" />
                    <div className="skeleton h-24" />
                </div>
            )}
            {error && <p className="error">{error.message}</p>}
            {data && data.items.length === 0 && (
                <div className="panel py-12 text-center">
                    <p className="font-display text-3xl text-sapphire">עדיין אין כאן שמחות</p>
                    <p className="mt-2 text-mist">פותחים שמחה, מזמינים את המשפחה, ומתחלקים בהכנות.</p>
                    <Link to="/events/new" className="btn btn-gold mt-6">פתיחת שמחה ראשונה</Link>
                </div>
            )}

            {/* הרשימה */}
            {rest && rest.length > 0 && (
                <ul className="panel divide-y divide-sapphire/10 p-0">
                    {rest.map((event) => {
                        const date = new Date(event.eventDate);
                        return (
                            <li key={event.id}>
                                <Link
                                    to={`/events/${event.id}`}
                                    className="group relative flex items-center gap-5 p-5 transition-colors duration-200 hover:bg-gold-soft/25"
                                >
                                    {/* פס זהב שמופיע במעבר עכבר */}
                                    <span className="absolute inset-y-3 right-0 w-1 origin-center scale-y-0 rounded-full bg-gold transition-transform duration-300 group-hover:scale-y-100" />

                                    <div className="flex w-16 shrink-0 flex-col items-center border-l border-gold/40 pl-5">
                                        <span className="font-display text-4xl text-sapphire">
                                            {date.toLocaleDateString('he-IL', { day: 'numeric' })}
                                        </span>
                                        <span className="text-xs text-gold">
                                            {date.toLocaleDateString('he-IL', { month: 'short' })}
                                        </span>
                                    </div>

                                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="font-display text-2xl text-sapphire">{event.name}</span>
                                            <span className="chip bg-gold-soft text-gold">{eventTypeLabels[event.type]}</span>
                                            <span className="chip bg-sapphire/10 text-sapphire">{eventRoleLabels[event.myRole]}</span>
                                        </div>
                                        <span className="text-sm text-mist">
                                            {date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}, {event.location}
                                        </span>
                                        <div className="mt-1 flex items-center gap-3">
                                            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-pearl">
                                                <div className="h-full bg-gold" style={{ width: `${percentDone(event)}%` }} />
                                            </div>
                                            <span className="text-xs text-mist">
                                                {event.progress.done} מתוך {event.progress.total} הושלמו
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default EventsPage;
