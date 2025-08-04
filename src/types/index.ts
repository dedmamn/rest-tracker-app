export enum ActivityType {
    PHYSICAL = 'physical',
    MENTAL = 'mental',
    EMOTIONAL = 'emotional',
    SOCIAL = 'social',
    SENSORY = 'sensory',
    SPIRITUAL = 'spiritual',
    CREATIVE = 'creative',
    OUTDOOR = 'outdoor',
    PASSIVE = 'passive'
}

export interface Activity {
    id: string;
    type: ActivityType;
    name: string;
    description?: string;
    recurrence?: Recurrence;
    duration?: number; // в минутах
    createdAt: Date;
    completedDates: Date[];
    isActive: boolean;
}

export interface Recurrence {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number; // каждые X дней/недель/месяцев
    daysOfWeek?: number[]; // для еженедельной повторяемости (0-6, где 0 - воскресенье)
    endDate?: Date;
}

export interface Settings {
    notificationsEnabled: boolean;
    theme: 'light' | 'dark';
    defaultActivityDuration: number;
    reminderTime?: string; // время напоминания в формате HH:MM
}

export interface CompletedActivity {
    activityId: string;
    completedAt: Date;
    duration?: number;
    notes?: string;
}