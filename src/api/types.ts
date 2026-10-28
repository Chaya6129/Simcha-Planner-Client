
export type EventType = 'THANKSGIVING_MEAL' | 'SIYUM' | 'SHEVA_BRACHOT' | 'BIRTHDAY' | 'FAMILY_PARTY' | 'OTHER';
export type TaskCategory = 'FOOD' | 'DECORATION' | 'SHOPPING' | 'INVITATIONS' | 'OTHER';
export type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE';
export type EventRole = 'ORGANIZER' | 'PARTICIPANT';
export type NotificationType = 'TASK_REASSIGNED' | 'TASK_RELEASED' | 'RELEASE_REQUESTED' | 'TASK_UNASSIGNED';


export type User = {
    id: string;
    fullName: string;
    email: string;
};

export type UserSummary = {
    id: string;
    fullName: string;
};

export type AuthResponse = {
    token: string;
    expiresAt: string;
    user: User;
};

export type MeResponse = {
    user: User;
    unreadNotifications: number;
};


export type Progress = {
    total: number;
    done: number;
    inProgress: number;
    open: number;
};

export type BudgetSummary = {
    budget: number | null;
    planned: number;
    spent: number;
    remaining: number | null;
};

export type EventSummary = {
    id: string;
    name: string;
    type: EventType;
    eventDate: string;
    location: string;
    myRole: EventRole;
    progress: Progress;
};

export type EventDetails = {
    id: string;
    name: string;
    type: EventType;
    eventDate: string;
    location: string;
    notes: string | null;
    budget: number | null;
    organizer: UserSummary;
    myRole: EventRole;
    progress: Progress;
    budgetSummary: BudgetSummary;
    createdAt: string;
    updatedAt: string;
};
export type EventInput = {
    name: string
    type: EventType
    eventDate: string
    location: string
    notes: string
    budget: number|undefined
}


export type PreviousAssignee = {
    fullName: string;
    eventName: string;
    eventDate: string;
};

export type Task = {
    id: string;
    eventId: string;
    title: string;
    description: string | null;
    category: TaskCategory;
    status: TaskStatus;
    cost: number | null;
    assignee: UserSummary | null;
    previousAssignee: PreviousAssignee | null;
    completedAt: string | null;
    createdAt: string;
    updatedAt: string;
};


export type Participant = {
    id: string;
    fullName: string;
    isOrganizer: boolean;
};

export type Invite = {
    id: string;
    email: string;
    registeredUser: UserSummary | null;
    createdAt: string;
};

export type AppNotification = {
    id: string;
    type: NotificationType;
    message: string;
    isRead: boolean;
    eventId: string | null;
    taskId: string | null;
    createdAt: string;
};

export type ListResponse<T> = {
    items: T[];
};