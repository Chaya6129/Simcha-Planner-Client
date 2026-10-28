import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask, type TaskInput } from '../api/tasks';
import { taskCategoryLabels } from '../api/labels';

const TaskFormPage = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<TaskInput>();

    const { mutate, isPending } = useMutation({
        mutationFn: (task: TaskInput) => createTask(eventId!, task),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', eventId] });
            queryClient.invalidateQueries({ queryKey: ['event', eventId] });
            navigate(`/events/${eventId}`);
        },
        onError: (err) => {
            setError('root.serverError', { message: err.message });
        },
    });

    const onSubmit = (data: TaskInput) => {
        mutate({
            ...data,
            cost: Number.isNaN(data.cost) ? undefined : data.cost,
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="panel mx-auto flex max-w-2xl flex-col gap-5 p-8">
            <h1 className="text-3xl font-bold">משימה חדשה</h1>

            <label className="field">
                <span className="label">כותרת</span>
                <input
                    className="input"
                    type="text"
                    placeholder="למשל: להביא עוגה"
                    {...register('title', {
                        required: 'כותרת היא שדה חובה',
                        minLength: { value: 2, message: 'הכותרת צריכה להכיל לפחות 2 תווים' },
                        maxLength: { value: 80, message: 'הכותרת יכולה להכיל עד 80 תווים' },
                    })}
                />
                <span className="text-xs text-mist">כותרת קבועה למשימות חוזרות מאפשרת לראות מי ביצע אותן בפעם הקודמת</span>
                {errors.title && <span className="error">{errors.title.message}</span>}
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
                <label className="field">
                    <span className="label">קטגוריה</span>
                    <select className="input" {...register('category', { required: 'יש לבחור קטגוריה' })} defaultValue="">
                        <option value="" disabled>בחר קטגוריה</option>
                        {Object.entries(taskCategoryLabels).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                    {errors.category && <span className="error">{errors.category.message}</span>}
                </label>

                <label className="field">
                    <span className="label">עלות בש״ח (רשות)</span>
                    <input
                        className="input"
                        type="number"
                        step="0.01"
                        {...register('cost', {
                            valueAsNumber: true,
                            min: { value: 0, message: 'העלות לא יכולה להיות שלילית' },
                        })}
                    />
                    {errors.cost && <span className="error">{errors.cost.message}</span>}
                </label>
            </div>

            <label className="field">
                <span className="label">תיאור (רשות)</span>
                <textarea
                    className="input min-h-24"
                    {...register('description', {
                        maxLength: { value: 500, message: 'התיאור יכול להכיל עד 500 תווים' },
                    })}
                />
                {errors.description && <span className="error">{errors.description.message}</span>}
            </label>

            {errors.root?.serverError && <p className="error">{errors.root.serverError.message}</p>}

            <div className="mt-2 flex gap-3">
                <button type="submit" disabled={isPending} className="btn btn-primary">שמירה</button>
                <button type="button" className="btn btn-ghost" onClick={() => navigate(`/events/${eventId}`)}>ביטול</button>
            </div>
        </form>
    );
};

export default TaskFormPage;
