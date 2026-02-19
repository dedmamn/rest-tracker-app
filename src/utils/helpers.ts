// Утилиты для работы с уведомлениями и PWA
import { ActivityType } from '../types';
import { PREDEFINED_ACTIVITIES } from '../data/predefinedActivities';

export const formatDate = (date: Date): string => {
    return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export const validateActivityInput = (name: string, description: string): boolean => {
    return name.trim().length > 0 && description.trim().length > 0;
};

export const getActivityTypeByName = (activityName: string): ActivityType => {
    // Поиск активности в предопределенных активностях
    for (const [type, activities] of Object.entries(PREDEFINED_ACTIVITIES)) {
        if (activities.some(activity => activity.name === activityName)) {
            return type as ActivityType;
        }
    }

    // Если не найдено, возвращаем значение по умолчанию
    return ActivityType.PASSIVE;
};

export const generateRecurrenceOptions = (frequency: string): string[] => {
    const options = [];
    if (frequency === 'daily') {
        options.push('Каждый день');
    } else if (frequency === 'weekly') {
        options.push('Каждую неделю');
    } else if (frequency === 'monthly') {
        options.push('Каждый месяц');
    }
    return options;
};

export class NotificationManager {
    // Система автоматических напоминаний
    private static notificationIntervals: { [key: string]: number } = {};

    // Запрос разрешения на уведомления
    static async requestPermission(): Promise<boolean> {
        if (!('Notification' in window)) {
            console.log('Этот браузер не поддерживает уведомления');
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }

        return false;
    }

    // Отправка уведомления
    static async sendNotification(title: string, options?: NotificationOptions): Promise<void> {
        const hasPermission = await this.requestPermission();
        
        if (hasPermission) {
            const notification = new Notification(title, {
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                ...options
            });

            // Автоматически закрывать уведомление через 5 секунд
            setTimeout(() => {
                notification.close();
            }, 5000);
        }
    }

    // Напоминание о активности
    static async sendActivityReminder(activityTitle: string): Promise<void> {
        await this.sendNotification(
            'Напоминание о отдыхе',
            {
                body: `Время для: ${activityTitle}`,
                tag: 'activity-reminder'
            }
        );
    }

    // Уведомление о резервной копии
    static async sendBackupReminder(): Promise<void> {
        await this.sendNotification(
            'Рекомендуется создать резервную копию',
            {
                body: 'Создайте резервную копию ваших данных для безопасности',
                tag: 'backup-reminder'
            }
        );
    }

    // Планирование ежедневных уведомлений
    static scheduleDaily(reminderTime: string): void {
        // Очищаем предыдущие интервалы
        this.clearScheduled();

        if (!reminderTime) return;

        const [hours, minutes] = reminderTime.split(':').map(Number);
        
        // Функция для расчета времени до следующего напоминания
        const getNextReminderTime = (): number => {
            const now = new Date();
            const reminderDate = new Date();
            reminderDate.setHours(hours, minutes, 0, 0);

            // Если время уже прошло сегодня, планируем на завтра
            if (reminderDate <= now) {
                reminderDate.setDate(reminderDate.getDate() + 1);
            }

            return reminderDate.getTime() - now.getTime();
        };

        // Функция отправки напоминания
        const sendReminder = () => {
            this.sendDailyReminder();
            // Планируем следующее напоминание через 24 часа
            this.notificationIntervals['daily'] = window.setTimeout(() => {
                sendReminder();
            }, 24 * 60 * 60 * 1000);
        };

        // Планируем первое напоминание
        this.notificationIntervals['daily'] = window.setTimeout(() => {
            sendReminder();
        }, getNextReminderTime());

        console.log(`📅 Ежедневные напоминания запланированы на ${reminderTime}`);
    }

    // Отправка ежедневного напоминания
    static async sendDailyReminder(): Promise<void> {
        const hasPermission = await this.requestPermission();
        if (!hasPermission) return;

        // Получаем активные активности из localStorage
        try {
            const data = localStorage.getItem('rest-tracker-data');
            if (!data) return;

            const appData = JSON.parse(data);
            const activeActivities = appData.activities?.filter((activity: any) => activity.isActive) || [];

            if (activeActivities.length === 0) {
                await this.sendNotification(
                    'Время отдыха!',
                    {
                        body: 'Не забудьте запланировать активности для отдыха сегодня',
                        tag: 'daily-reminder',
                        requireInteraction: true
                    }
                );
            } else {
                const randomActivity = activeActivities[Math.floor(Math.random() * activeActivities.length)];
                await this.sendNotification(
                    'Время отдыха!',
                    {
                        body: `Рекомендуемая активность: ${randomActivity.name}`,
                        tag: 'daily-reminder',
                        requireInteraction: true
                    }
                );
            }
        } catch (error) {
            console.error('Ошибка при отправке ежедневного напоминания:', error);
        }
    }

    // Очистка запланированных уведомлений
    static clearScheduled(): void {
        Object.values(this.notificationIntervals).forEach(intervalId => {
            if (intervalId) {
                clearTimeout(intervalId);
            }
        });
        this.notificationIntervals = {};
        console.log('🧹 Запланированные уведомления очищены');
    }

    // Проверка статуса уведомлений
    static getNotificationStatus(): { 
        permission: NotificationPermission;
        scheduled: boolean;
        nextReminder?: string;
        activeReminders: string[];
    } {
        const hasScheduled = Object.keys(this.notificationIntervals).length > 0;
        const activeReminders = Object.keys(this.notificationIntervals);
        
        return {
            permission: Notification.permission,
            scheduled: hasScheduled,
            activeReminders
        };
    }

    // Получение информации о следующем напоминании
    static getNextReminderInfo(reminderTime: string): { 
        nextReminder: string;
        timeUntilNext: number;
    } | null {
        if (!reminderTime) return null;

        const [hours, minutes] = reminderTime.split(':').map(Number);
        const now = new Date();
        const reminderDate = new Date();
        reminderDate.setHours(hours, minutes, 0, 0);

        // Если время уже прошло сегодня, планируем на завтра
        if (reminderDate <= now) {
            reminderDate.setDate(reminderDate.getDate() + 1);
        }

        const timeUntilNext = reminderDate.getTime() - now.getTime();
        
        return {
            nextReminder: reminderDate.toLocaleString('ru-RU'),
            timeUntilNext
        };
    }
}

export class PWAManager {
    // Проверка, является ли приложение PWA
    static isPWA(): boolean {
        return window.matchMedia('(display-mode: standalone)').matches ||
               (window.navigator as any).standalone === true ||
               document.referrer.includes('android-app://');
    }

    // Проверка поддержки Service Worker
    static isServiceWorkerSupported(): boolean {
        return 'serviceWorker' in navigator;
    }

    // Регистрация Service Worker (для будущего использования)
    static async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
        if (!this.isServiceWorkerSupported()) {
            console.log('Service Worker не поддерживается');
            return null;
        }

        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker зарегистрирован:', registration);
            return registration;
        } catch (error) {
            console.error('Ошибка регистрации Service Worker:', error);
            return null;
        }
    }

    // Проверка, можно ли установить приложение
    static canInstall(): boolean {
        return 'beforeinstallprompt' in window;
    }
}

export class DataFormatter {
    // Форматирование размера файла
    static formatBytes(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Форматирование даты для отображения
    static formatDateRelative(date: Date | string): string {
        const d = typeof date === 'string' ? new Date(date) : date;
        const now = new Date();
        const diffTime = now.getTime() - d.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return 'Сегодня';
        } else if (diffDays === 1) {
            return 'Вчера';
        } else if (diffDays < 7) {
            return `${diffDays} дней назад`;
        } else {
            return d.toLocaleDateString('ru-RU');
        }
    }

    // Форматирование времени выполнения активности
    static formatDuration(minutes: number): string {
        if (minutes < 60) {
            return `${minutes} мин`;
        } else {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            return remainingMinutes > 0 ? `${hours}ч ${remainingMinutes}м` : `${hours}ч`;
        }
    }

    // Получение приветствия в зависимости от времени дня
    static getGreeting(): string {
        const hour = new Date().getHours();
        if (hour < 6) return 'Доброй ночи';
        if (hour < 12) return 'Доброе утро';
        if (hour < 18) return 'Добрый день';
        return 'Добрый вечер';
    }
}