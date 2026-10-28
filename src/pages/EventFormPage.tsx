import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { EventInput } from '../api/types';
import { eventTypeLabels } from '../api/labels';
import { createEvent, getEvent, updateEvent } from '../api/events';
import { toast } from 'sonner';

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
            toast.success(isEdit ? 'השינויים נשמרו' : 'השמחה נפתחה. מזל טוב!');
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

    if (isEdit && isLoading) return <div className="skeleton mx-auto h-[36rem] max-w-2xl" />;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="panel mx-auto flex max-w-2xl flex-col gap-5 p-8">
            <h1 className="text-5xl">{isEdit ? 'עריכת שמחה' : 'שמחה חדשה'}</h1>

            <label className="field">
                <span className="label">שם השמחה</span>
                <input
                    className="input"
                    type="text"
                    placeholder="למשל: סעודת הודיה לסבא"
                    {...register('name', {
                        required: 'שם הוא שדה חובה',
                        minLength: { value: 2, message: 'השם צריך להכיל לפחות 2 תווים' },
                        maxLength: { value: 80, message: 'השם יכול להכיל עד 80 תווים' },
                    })}
                />
                {errors.name && <span className="error">{errors.name.message}</span>}
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
                <label className="field">
                    <span className="label">סוג השמחה</span>
                    <select className="input" {...register('type', { required: 'יש לבחור סוג שמחה' })} defaultValue="">
                        <option value="" disabled>בחר סוג שמחה</option>
                        {Object.entries(eventTypeLabels).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                    {errors.type && <span className="error">{errors.type.message}</span>}
                </label>

                <label className="field">
                    <span className="label">תאריך ושעה</span>
                    <input
                        className="input"
                        type="datetime-local"
                        {...register('eventDate', { required: 'תאריך ושעה הם שדה חובה' })}
                    />
                    {errors.eventDate && <span className="error">{errors.eventDate.message}</span>}
                </label>
            </div>

            <label className="field">
                <span className="label">מקום</span>
                <input
                    className="input"
                    type="text"
                    placeholder="למשל: אצל סבא וסבתא, רחוב הרצל 5"
                    {...register('location', {
                        required: 'מקום הוא שדה חובה',
                        minLength: { value: 2, message: 'המקום צריך להכיל לפחות 2 תווים' },
                        maxLength: { value: 150, message: 'המקום יכול להכיל עד 150 תווים' },
                    })}
                />
                {errors.location && <span className="error">{errors.location.message}</span>}
            </label>

            <label className="field">
                <span className="label">הערות (רשות)</span>
                <textarea
                    className="input min-h-24"
                    {...register('notes', {
                        maxLength: { value: 1000, message: 'ההערות יכולות להכיל עד 1,000 תווים' },
                    })}
                />
                {errors.notes && <span className="error">{errors.notes.message}</span>}
            </label>

            <label className="field sm:max-w-xs">
                <span className="label">תקציב בש״ח (רשות)</span>
                <input
                    className="input"
                    type="number"
                    step="0.01"
                    {...register('budget', {
                        valueAsNumber: true,
                        min: { value: 0, message: 'התקציב לא יכול להיות שלילי' },
                    })}
                />
                {errors.budget && <span className="error">{errors.budget.message}</span>}
            </label>

            {errors.root?.serverError && <p className="error">{errors.root.serverError.message}</p>}

            <div className="mt-2 flex gap-3">
                <button type="submit" disabled={isPending} className="btn btn-primary">שמירה</button>
                <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => navigate(isEdit ? `/events/${eventId}` : '/events')}
                >
                    ביטול
                </button>
            </div>
        </form>
    );
};

export default EventFormPage;
