import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getEvents, type EventFilters } from '../api/events';
import type { EventType } from '../api/types';
import { eventTypeLabels, eventRoleLabels } from '../api/labels';

// שלושת כפתורי הזמן, כדי לא לכתוב שלושה כפתורים כמעט זהים
const whenOptions: { value: EventFilters['when']; label: string }[] = [
    { value: 'upcoming', label: 'קרובות' },
    { value: 'past', label: 'שעברו' },
    { value: 'all', label: 'הכל' },
];

const EventsPage = () => {
    const [filters, setFilters] = useState<EventFilters>({
        when: 'upcoming',
        sort: 'date_asc',
    });

    const { data, isLoading, error } = useQuery({
        queryKey: ['events', filters],
        queryFn: () => getEvents(filters),
    });

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <h1 className="text-4xl font-bold">השמחות שלי</h1>
                <Link to="/events/new" className="btn btn-gold">שמחה חדשה</Link>
            </div>

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
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>

                <div className="flex overflow-hidden rounded-lg border border-sapphire/20 bg-white">
                    {whenOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setFilters({ ...filters, when: option.value })}
                            className={`cursor-pointer px-4 py-2.5 text-sm font-semibold transition-colors ${
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
                    onChange={(e) =>
                        setFilters({ ...filters, sort: e.target.value as EventFilters['sort'] })
                    }
                >
                    <option value="date_asc">הקרובה קודם</option>
                    <option value="date_desc">הרחוקה קודם</option>
                </select>
            </div>

            {isLoading && <p className="text-mist">טוען...</p>}
            {error && <p className="error">{error.message}</p>}
            {data && data.items.length === 0 && (
                <div className="panel text-center">
                    <p className="text-mist">אין שמחות להצגה.</p>
                    <Link to="/events/new" className="link mt-2 inline-block">פתיחת שמחה ראשונה</Link>
                </div>
            )}

            {/* הרשימה */}
            {data && data.items.length > 0 && (
                <ul className="panel divide-y divide-sapphire/10 p-0">
                    {data.items.map((event) => {
                        const date = new Date(event.eventDate);
                        const percent = event.progress.total
                            ? Math.round((event.progress.done / event.progress.total) * 100)
                            : 0;
                        return (
                            <li key={event.id}>
                                <Link to={`/events/${event.id}`} className="flex items-center gap-5 p-5 hover:bg-pearl/60">
                                    {/* תאריך בסגנון הזמנה */}
                                    <div className="flex w-16 shrink-0 flex-col items-center border-l border-gold/40 pl-5">
                                        <span className="font-display text-3xl font-bold text-sapphire">
                                            {date.toLocaleDateString('he-IL', { day: 'numeric' })}
                                        </span>
                                        <span className="text-xs text-gold">
                                            {date.toLocaleDateString('he-IL', { month: 'short' })}
                                        </span>
                                    </div>

                                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="font-display text-xl font-bold text-sapphire">{event.name}</span>
                                            <span className="chip bg-gold-soft text-gold">{eventTypeLabels[event.type]}</span>
                                            <span className="chip bg-sapphire/10 text-sapphire">{eventRoleLabels[event.myRole]}</span>
                                        </div>
                                        <span className="text-sm text-mist">
                                            {date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}, {event.location}
                                        </span>
                                        <div className="mt-1 flex items-center gap-3">
                                            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-pearl">
                                                <div className="h-full bg-gold" style={{ width: `${percent}%` }} />
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
