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
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1>משימה חדשה</h1>

            <input
                type="text"
                placeholder="כותרת המשימה"
                {...register('title', {
                    required: 'כותרת היא שדה חובה',
                    minLength: { value: 2, message: 'הכותרת צריכה להכיל לפחות 2 תווים' },
                    maxLength: { value: 80, message: 'הכותרת יכולה להכיל עד 80 תווים' },
                })}
            />
            {errors.title && <span>{errors.title.message}</span>}

            <select {...register('category', { required: 'יש לבחור קטגוריה' })} defaultValue="">
                <option value="" disabled>בחר קטגוריה</option>
                {Object.entries(taskCategoryLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                ))}
            </select>
            {errors.category && <span>{errors.category.message}</span>}

            <textarea
                placeholder="תיאור (רשות)"
                {...register('description', {
                    maxLength: { value: 500, message: 'התיאור יכול להכיל עד 500 תווים' },
                })}
            />
            {errors.description && <span>{errors.description.message}</span>}

            <input
                type="number"
                step="0.01"
                placeholder="עלות בש״ח (רשות)"
                {...register('cost', {
                    valueAsNumber: true,
                    min: { value: 0, message: 'העלות לא יכולה להיות שלילית' },
                })}
            />
            {errors.cost && <span>{errors.cost.message}</span>}

            {errors.root?.serverError && <span>{errors.root.serverError.message}</span>}

            <button type="submit" disabled={isPending}>שמירה</button>
            <button type="button" onClick={() => navigate(`/events/${eventId}`)}>ביטול</button>
        </form>
    );
};

export default TaskFormPage;