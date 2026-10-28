import type { EventRole, EventType, NotificationType, TaskCategory, TaskStatus } from './types';

export const eventTypeLabels: Record<EventType, string> = {
    THANKSGIVING_MEAL: 'סעודת הודיה',
    SIYUM: 'סיום מסכת',
    SHEVA_BRACHOT: 'שבע ברכות',
    BIRTHDAY: 'יום הולדת',
    FAMILY_PARTY: 'מסיבה משפחתית',
    OTHER: 'אחר',
};

export const taskCategoryLabels: Record<TaskCategory, string> = {
    FOOD: "אוכל",
    DECORATION: 'קישוט',
    SHOPPING: "קניות",
    INVITATIONS: "הזמנות",
    OTHER: "אחר"
};
export const taskStatusLabels: Record<TaskStatus, string> = {
    OPEN: 'פנויה',
    IN_PROGRESS: 'בטיפול',
    DONE: 'הושלמה'
}
export const eventRoleLabels: Record<EventRole, string> = {
    ORGANIZER:'מנהל',
    PARTICIPANT:'משתתף'
};
export const notificationTypeLabels:Record<NotificationType, string> = {

    TASK_REASSIGNED:'משימה הועברה',
    TASK_RELEASED:'משתתף ויתר',
    RELEASE_REQUESTED:'בקשת ויתור',
    TASK_UNASSIGNED:'מארגן שחרר משימה'
};
