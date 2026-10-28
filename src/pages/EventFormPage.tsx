import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { EventInput } from '../api/types';
import { eventTypeLabels } from '../api/labels';
import { createEvent, getEvent, updateEvent } from '../api/events';

const toLocalInput = (iso: string) => {
    const date = new Date(iso);
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
};

const EventFormPage = () => {
    const { eventId } = useParams();
    const isEdit = !!eventId; 

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: existing, isLoading } = useQuery({
        queryKey: ['event', eventId],
        queryFn: () => getEvent(eventId!),
        enabled: isEdit,
    });

    const {
        setError,
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<EventInput>({
        values: existing && {
            name: existing.name,
            type: existing.type,
            eventDate: toLocalInput(existing.eventDate),
            location: existing.location,
            notes: existing.notes ?? '',
            budget: existing.budget ?? undefined,
        },
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (event: EventInput) =>
            isEdit ? updateEvent(eventId!, event) : createEvent(event),
        onSuccess: (saved) => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            queryClient.invalidateQueries({ queryKey: ['event', saved.id] });
            navigate(`/events/${saved.id}`);
        },
        onError: (err) => {
            setError('root.serverError', { message: err.message });
        },
    });

    const onSubmit = (data: EventInput) => {
        mutate({
            ...data,
            eventDate: new Date(data.eventDate).toISOString(),
            budget: Number.isNaN(data.budget) ? undefined : data.budget,
        });
    };

    if (isEdit && isLoading) return <p>טוען...</p>;

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1>{isEdit ? 'עריכת שמחה' : 'שמחה חדשה'}</h1>

            <input
                type="text"
                placeholder="שם השמחה"
                {...register('name', {
                    required: 'שם הוא שדה חובה',
                    minLength: { value: 2, message: 'השם צריך להכיל לפחות 2 תווים' },
                    maxLength: { value: 80, message: 'השם יכול להכיל עד 80 תווים' },
                })}
            />
            {errors.name && <span>{errors.name.message}</span>}

            <select {...register('type', { required: 'יש לבחור סוג שמחה' })} defaultValue="">
                <option value="" disabled>בחר סוג שמחה</option>
                {Object.entries(eventTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                ))}
            </select>
            {errors.type && <span>{errors.type.message}</span>}

            <input
                type="datetime-local"
                {...register('eventDate', { required: 'תאריך ושעה הם שדה חובה' })}
            />
            {errors.eventDate && <span>{errors.eventDate.message}</span>}

            <input
                type="text"
                placeholder="מקום"
                {...register('location', {
                    required: 'מקום הוא שדה חובה',
                    minLength: { value: 2, message: 'המקום צריך להכיל לפחות 2 תווים' },
                    maxLength: { value: 150, message: 'המקום יכול להכיל עד 150 תווים' },
                })}
            />
            {errors.location && <span>{errors.location.message}</span>}

            <textarea
                placeholder="הערות (רשות)"
                {...register('notes', {
                    maxLength: { value: 1000, message: 'ההערות יכולות להכיל עד 1,000 תווים' },
                })}
            />
            {errors.notes && <span>{errors.notes.message}</span>}

            <input
                type="number"
                step="0.01"
                placeholder="תקציב בש״ח (רשות)"
                {...register('budget', {
                    valueAsNumber: true,
                    min: { value: 0, message: 'התקציב לא יכול להיות שלילי' },
                })}
            />
            {errors.budget && <span>{errors.budget.message}</span>}

            {errors.root?.serverError && <span>{errors.root.serverError.message}</span>}

            <button type="submit" disabled={isPending}>שמירה</button>
            <button type="button" onClick={() => navigate(isEdit ? `/events/${eventId}` : '/events')}>
                ביטול
            </button>
        </form>
    );
};

export default EventFormPage;