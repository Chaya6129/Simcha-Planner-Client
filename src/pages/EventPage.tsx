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


    if (isLoading) return <p>טוען...</p>
    if (error) return <p>{error.message}</p>;
    if (!data) return null;
    return (
        <div>
            <h1>{data.name}</h1>

            <p>סוג: {eventTypeLabels[data.type]}</p>
            <p>תאריך: {new Date(data.eventDate).toLocaleString('he-IL')}</p>
            <p>מקום: {data.location}</p>
            <p>מארגן: {data.organizer.fullName}</p>
            {data.notes && <p>הערות: {data.notes}</p>}

            <h2>מצב הכנה</h2>
            <p>
                {data.progress.done} מתוך {data.progress.total} משימות הושלמו,
                {' '}{data.progress.inProgress} בטיפול, {data.progress.open} פנויות
            </p>

            <h2>תקציב</h2>
            {data.budget === null ? (
                <p>לא הוגדר תקציב</p>
            ) : (
                <p>
                    תקציב: {data.budgetSummary.budget} ₪ ·
                    מתוכנן: {data.budgetSummary.planned} ₪ ·
                    הוצא: {data.budgetSummary.spent} ₪ ·
                    נשאר: {data.budgetSummary.remaining} ₪
                </p>
            )}

            {data.myRole === 'ORGANIZER' && (
                <div>
                    <Link to={`/events/${data.id}/edit`}>עריכת השמחה</Link>
                    {' · '}
                    <Link to={`/events/${data.id}/tasks/new`}>משימה חדשה</Link>
                    {' · '}
                    <Link to={`/events/${data.id}/participants`}>ניהול משתתפים</Link>
                </div>
            )}
            <TaskList eventId={data.id} eventDate={data.eventDate} isOrganizer={data.myRole === 'ORGANIZER'} />
        </div>
    );
};

export default EventPage;