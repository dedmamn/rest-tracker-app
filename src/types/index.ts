export enum ActivityType {
    PHYSICAL = 'physical',
    EMOTIONAL = 'emotional',
    MENTAL = 'mental',
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
    testSettings: TestSettings;
}

export interface CompletedActivity {
    activityId: string;
    completedAt: Date;
    duration?: number;
    notes?: string;
}

// Типы для теста усталости
export interface TestQuestion {
    id: number;
    block: 'A' | 'B' | 'C' | 'D' | 'E';
    blockName: string;
    text: string;
}

export interface TestAnswer {
    questionId: number;
    score: number; // 0-5
}

export interface TestResult {
    id: string;
    completedAt: Date;
    answers: TestAnswer[];
    fatigueScores: FatigueScores;
    dominantTypes: FatigueType[];
}

export interface FatigueScores {
    physical: number;
    emotional: number;
    cognitive: number;
    social: number;
    achievement: number;
    caregiving: number;
    anxiety: number;
    hormonal: number;
    chronicFatigue: number;
}

export interface FatigueType {
    type: keyof FatigueScores;
    name: string;
    score: number;
    description: string;
    solutions: string;
    restActivities: string[];
}

export interface TestSettings {
    hasCompletedFirstTest: boolean;
    showTestReminderPopup: boolean;
    testHistory: TestResult[];
}