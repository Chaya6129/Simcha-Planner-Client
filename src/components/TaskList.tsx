import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { claimTask, getTasks, releaseTask, requestRelease, updateTaskStatus, type TaskFilters } from '../api/tasks';
import { taskCategoryLabels, taskStatusLabels } from '../api/labels';
import type { TaskCategory } from '../api/types';
import { useAuth } from '../auth/AuthContext';

type Action = 'claim' | 'finish' | 'release' | 'askRelease';

const actions: Record<Action, (taskId: string) => Promise<unknown>> = {
    claim: claimTask,
    finish: (taskId) => updateTaskStatus(taskId, 'DONE'),
    release: releaseTask,
    askRelease: async (taskId) => {
        const reason = prompt('סיבת הוויתור (רשות):') ?? undefined;
        const res = await requestRelease(taskId, reason);
        alert(res.message);
    },
};

const TaskList = ({ eventId, eventDate, isOrganizer }: { eventId: string; eventDate: string; isOrganizer: boolean }) => {    const [filters, setFilters] = useState<TaskFilters>({});
    const update = (change: Partial<TaskFilters>) => setFilters({ ...filters, ...change });

    const { data, isLoading, error } = useQuery({
        queryKey: ['tasks', eventId, filters],
        queryFn: () => getTasks(eventId, filters),
    });

    const queryClient = useQueryClient();
    const action = useMutation({
        mutationFn: ({ type, taskId }: { type: Action; taskId: string }) => actions[type](taskId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', eventId] });
            queryClient.invalidateQueries({ queryKey: ['event', eventId] });
        },
        onError: (err) => alert(err.message),
    });

    const myId = useAuth().user?.user.id;
const canReleaseFreely = isOrganizer || new Date(eventDate).getTime() - Date.now() > 48 * 60 * 60 * 1000;
    const button = (type: Action, taskId: string, label: string) => (
        <button onClick={() => action.mutate({ type, taskId })} disabled={action.isPending}>
            {label}
        </button>
    );

    return (
        <div>
            <h2>משימות {data?.items.length}</h2>

            <input
                placeholder="חיפוש לפי כותרת"
                value={filters.search ?? ''}
                onChange={(e) => update({ search: e.target.value })}
            />
            <select
                value={filters.category ?? ''}
                onChange={(e) => update({ category: (e.target.value || undefined) as TaskCategory | undefined })}
            >
                <option value="">כל הקטגוריות</option>
                {Object.entries(taskCategoryLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                ))}
            </select>
            <label>
                <input
                    type="checkbox"
                    checked={filters.status === 'OPEN'}
                    onChange={(e) => update({ status: e.target.checked ? 'OPEN' : undefined })}
                />
                רק פנויות
            </label>
            <label>
                <input
                    type="checkbox"
                    checked={!!filters.mine}
                    onChange={(e) => update({ mine: e.target.checked || undefined })}
                />
                המשימות שלי
            </label>
            <select
                value={filters.sort ?? ''}
                onChange={(e) => update({ sort: (e.target.value || undefined) as TaskFilters['sort'] })}
            >
                <option value="">ללא מיון</option>
                <option value="status">פנויות קודם</option>
                <option value="category">לפי קטגוריה</option>
                <option value="cost_desc">היקרה קודם</option>
            </select>

            {isLoading && <p>טוען משימות...</p>}
            {error && <p>{error.message}</p>}
            {data?.items.length === 0 && <p>אין משימות להצגה</p>}

            <ul>
                {data?.items.map((task) => {
                    const isMine = task.assignee?.id === myId && task.status !== 'DONE';
                    return (
                        <li key={task.id}>
                            <strong>{task.title}</strong>
                            {' · '}{taskCategoryLabels[task.category]}
                            {' · '}{taskStatusLabels[task.status]}
                            {task.cost != null && ` · ${task.cost} ₪`}
                            <div>{task.assignee ? `אחראי: ${task.assignee.fullName}` : 'פנויה'}</div>
                            {task.previousAssignee && (
                                <div>
                                    בפעם הקודמת: {task.previousAssignee.fullName}, {task.previousAssignee.eventName}
                                </div>
                            )}

                            {!task.assignee && button('claim', task.id, 'אני לוקח')}
                            {isMine && task.status === 'IN_PROGRESS' && button('finish', task.id, 'סיימתי')}
                            {isMine && (canReleaseFreely
                                ? button('release', task.id, 'לוותר')
                                : button('askRelease', task.id, 'בקשת ויתור'))}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default TaskList;