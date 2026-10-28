import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { changeAssignee, claimTask, getTasks, releaseTask, requestRelease, updateTaskStatus, type TaskFilters } from '../api/tasks';
import { getParticipants } from '../api/events';
import { taskCategoryLabels, taskStatusLabels } from '../api/labels';
import type { TaskCategory, TaskStatus } from '../api/types';
import { useAuth } from '../auth/AuthContext';
import { toast } from 'sonner';

type Action = 'claim' | 'finish' | 'release' | 'askRelease';

const actions: Record<Action, (taskId: string) => Promise<unknown>> = {
    claim: claimTask,
    finish: (taskId) => updateTaskStatus(taskId, 'DONE'),
    release: releaseTask,
    // בקשת ויתור מחזירה הודעה מהשרת, ואותה מציגים
    askRelease: async (taskId) => (await requestRelease(taskId)).message,
};

const successMessages: Record<Exclude<Action, 'askRelease'>, string> = {
    claim: 'המשימה עליך. בהצלחה!',
    finish: 'כל הכבוד, המשימה הושלמה',
    release: 'ויתרת על המשימה, והיא חזרה להיות פנויה',
};

const statusStyle: Record<TaskStatus, string> = {
    OPEN: 'bg-gold-soft text-gold',
    IN_PROGRESS: 'bg-sapphire/10 text-sapphire',
    DONE: 'bg-emerald-50 text-emerald-700',
};

const TaskList = ({ eventId, eventDate, isOrganizer }: { eventId: string; eventDate: string; isOrganizer: boolean }) => {
    const [filters, setFilters] = useState<TaskFilters>({});
    const update = (change: Partial<TaskFilters>) => setFilters({ ...filters, ...change });

    const { data, isLoading, error } = useQuery({
        queryKey: ['tasks', eventId, filters],
        queryFn: () => getTasks(eventId, filters),
    });

    const queryClient = useQueryClient();
    const action = useMutation({
        mutationFn: ({ type, taskId }: { type: Action; taskId: string }) => actions[type](taskId),
        onSuccess: (result, { type }) => {
            queryClient.invalidateQueries({ queryKey: ['tasks', eventId] });
            queryClient.invalidateQueries({ queryKey: ['event', eventId] });
            toast.success(type === 'askRelease' ? String(result) : successMessages[type]);
        },
        onError: (err) => toast.error(err.message),
    });

    const { data: participants } = useQuery({
        queryKey: ['participants', eventId],
        queryFn: () => getParticipants(eventId),
        enabled: isOrganizer,
    });

     const assign = useMutation({
        mutationFn: ({ taskId, assigneeId }: { taskId: string; assigneeId: string | null }) =>
            changeAssignee(taskId, assigneeId),
        onSuccess: (_, { assigneeId }) => {
            queryClient.invalidateQueries({ queryKey: ['tasks', eventId] });
            queryClient.invalidateQueries({ queryKey: ['event', eventId] });
            toast.success(assigneeId ? 'המשימה הועברה' : 'המשימה שוחררה');
        },
        onError: (err) => toast.error(err.message),
    });

    const myId = useAuth().user?.user.id;
    const canReleaseFreely = isOrganizer || new Date(eventDate).getTime() - Date.now() > 48 * 60 * 60 * 1000;

    const button = (type: Action, taskId: string, label: string, style: string) => (
        <button
            onClick={() => action.mutate({ type, taskId })}
            disabled={action.isPending}
            className={`btn btn-sm ${style}`}
        >
            {label}
        </button>
    );

    return (
        <section className="panel">
            <div className="flex items-baseline gap-3">
                <h2 className="text-3xl">משימות</h2>
                {data && <span className="text-mist">{data.items.length}</span>}
            </div>

            {/* חיפוש, סינון ומיון */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
                <input
                    className="input max-w-56"
                    placeholder="חיפוש לפי כותרת"
                    value={filters.search ?? ''}
                    onChange={(e) => update({ search: e.target.value })}
                />
                <select
                    className="input w-auto"
                    value={filters.category ?? ''}
                    onChange={(e) => update({ category: (e.target.value || undefined) as TaskCategory | undefined })}
                >
                    <option value="">כל הקטגוריות</option>
                    {Object.entries(taskCategoryLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
                <select
                    className="input w-auto"
                    value={filters.sort ?? ''}
                    onChange={(e) => update({ sort: (e.target.value || undefined) as TaskFilters['sort'] })}
                >
                    <option value="">ללא מיון</option>
                    <option value="status">פנויות קודם</option>
                    <option value="category">לפי קטגוריה</option>
                    <option value="cost_desc">היקרה קודם</option>
                </select>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        className="size-4 accent-gold"
                        checked={filters.status === 'OPEN'}
                        onChange={(e) => update({ status: e.target.checked ? 'OPEN' : undefined })}
                    />
                    רק פנויות
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        className="size-4 accent-gold"
                        checked={!!filters.mine}
                        onChange={(e) => update({ mine: e.target.checked || undefined })}
                    />
                    המשימות שלי
                </label>
            </div>

            {isLoading && (
                <div className="mt-6 flex flex-col gap-3">
                    <div className="skeleton h-16" />
                    <div className="skeleton h-16" />
                    <div className="skeleton h-16" />
                </div>
            )}
            {error && <p className="error mt-6">{error.message}</p>}
            {data?.items.length === 0 && <p className="mt-6 text-mist">אין משימות שמתאימות לחיפוש.</p>}

            <ul className="mt-4 divide-y divide-sapphire/10">
                {data?.items.map((task) => {
                    const isMine = task.assignee?.id === myId && task.status !== 'DONE';
                    return (
                        <li key={task.id} className="flex flex-wrap items-center gap-4 rounded-lg px-2 py-4 transition-colors duration-200 hover:bg-pearl/70">
                            <div className="flex min-w-0 flex-1 flex-col gap-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className={`font-semibold ${task.status === 'DONE' ? 'text-mist line-through' : 'text-ink'}`}>
                                        {task.title}
                                    </span>
                                    <span className={`chip ${statusStyle[task.status]}`}>{taskStatusLabels[task.status]}</span>
                                    <span className="chip bg-pearl text-mist">{taskCategoryLabels[task.category]}</span>
                                    {task.cost != null && <span className="text-sm text-mist">{task.cost} ₪</span>}
                                </div>
                                <span className="text-sm text-mist">
                                    {task.assignee ? `אחראי: ${task.assignee.fullName}` : 'מחכה למתנדב'}
                                </span>
                                {task.previousAssignee && (
                                    <span className="text-xs text-gold">
                                        בפעם הקודמת: {task.previousAssignee.fullName}, {task.previousAssignee.eventName}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                {!task.assignee && button('claim', task.id, 'אני לוקח', 'btn-gold')}
                                {isMine && task.status === 'IN_PROGRESS' && button('finish', task.id, 'סיימתי', 'btn-primary')}
                                {isMine && (canReleaseFreely
                                    ? button('release', task.id, 'לוותר', 'btn-ghost')
                                    : button('askRelease', task.id, 'בקשת ויתור', 'btn-ghost'))}

                                {/* פקדי מארגן: העברה ושחרור */}
                                {isOrganizer && task.status !== 'DONE' && (
                                    <>
                                        <select
                                            className="input w-auto py-1.5 text-sm"
                                            value=""
                                            disabled={assign.isPending}
                                            onChange={(e) => assign.mutate({ taskId: task.id, assigneeId: e.target.value })}
                                        >
                                            <option value="">העברה ל...</option>
                                            {participants?.items
                                                .filter((p) => p.id !== task.assignee?.id)
                                                .map((p) => (
                                                    <option key={p.id} value={p.id}>{p.fullName}</option>
                                                ))}
                                        </select>
                                        {task.assignee && task.assignee.id !== myId && (
                                            <button
                                                onClick={() => assign.mutate({ taskId: task.id, assigneeId: null })}
                                                disabled={assign.isPending}
                                                className="btn btn-danger btn-sm"
                                            >
                                                שחרור
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
};

export default TaskList;
