import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getEvents, type EventFilters } from '../api/events';
import type { EventType } from '../api/types';
import { eventTypeLabels, eventRoleLabels } from '../api/labels';

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
        <div>
            <h1>השמחות שלי</h1>

            <Link to="/events/new">שמחה חדשה</Link>

            <div>
                <select
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

                <button onClick={() => setFilters({ ...filters, when: 'upcoming' })} disabled={filters.when === 'upcoming'}>
                    קרובות
                </button>
                <button onClick={() => setFilters({ ...filters, when: 'past' })} disabled={filters.when === 'past'}>
                    שעברו
                </button>
                <button onClick={() => setFilters({ ...filters, when: 'all' })} disabled={filters.when === 'all'}>
                    הכל
                </button>

                <select
                    value={filters.sort}
                    onChange={(e) =>
                        setFilters({ ...filters, sort: e.target.value as EventFilters['sort'] })
                    }
                >
                    <option value="date_asc">הקרובה קודם</option>
                    <option value="date_desc">הרחוקה קודם</option>
                </select>
            </div>

            {isLoading && <p>טוען...</p>}
            {error && <p>{error.message}</p>}
            {data && data.items.length === 0 && <p>אין שמחות להצגה</p>}

            {/* הרשימה */}
            <ul>
                {data?.items.map((event) => (
                    <li key={event.id}>
                        <Link to={`/events/${event.id}`}>
                            <strong>{event.name}</strong>
                        </Link>
                        <div>
                            {eventTypeLabels[event.type]} · {new Date(event.eventDate).toLocaleString('he-IL')} · {event.location}
                        </div>
                        <div>
                            {eventRoleLabels[event.myRole]} · {event.progress.done} מתוך {event.progress.total} משימות הושלמו
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EventsPage;