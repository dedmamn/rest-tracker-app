// Утилита для миграции данных из старых ключей localStorage
import { Activity, Settings } from '../types';
import { StorageManager } from './storage';

export class DataMigration {
    // Список всех возможных старых ключей
    private static readonly OLD_KEYS = [
        'restTracker',
        'restTracker_backup',
        'rest-tracker-activities',
        'rest-tracker-settings'
    ];

    // Проверяем, есть ли данные в старых ключах
    static hasOldData(): boolean {
        return this.OLD_KEYS.some(key => localStorage.getItem(key) !== null);
    }

    // Миграция всех старых данных
    static migrateAllData(): { activities: Activity[]; settings: Settings } | null {
        console.log('🔄 Начинаем миграцию данных...');
        
        let bestData: { activities: Activity[]; settings: Settings } | null = null;
        let bestScore = 0;

        // Проверяем каждый старый ключ
        for (const key of this.OLD_KEYS) {
            const data = this.extractDataFromKey(key);
            if (data) {
                const score = this.calculateDataScore(data);
                console.log(`📊 Ключ ${key}: ${data.activities.length} активностей, score: ${score}`);
                
                if (score > bestScore) {
                    bestData = data;
                    bestScore = score;
                }
            }
        }

        if (bestData) {
            console.log(`✅ Выбраны лучшие данные с ${bestData.activities.length} активностями`);
            
            // Сохраняем в новом формате
            StorageManager.saveData(bestData.activities, bestData.settings);
            
            // Очищаем старые ключи
            this.cleanupOldKeys();
            
            return bestData;
        }

        console.log('❌ Данные для миграции не найдены');
        return null;
    }

    // Извлечение данных из конкретного ключа
    private static extractDataFromKey(key: string): { activities: Activity[]; settings: Settings } | null {
        try {
            const dataString = localStorage.getItem(key);
            if (!dataString) return null;

            const data = JSON.parse(dataString);

            // Разные форматы данных в разных ключах
            switch (key) {
                case 'restTracker':
                case 'restTracker_backup':
                    return this.extractFromRestTracker(data);
                
                case 'rest-tracker-activities':
                    const settings = this.extractSettings();
                    return {
                        activities: this.normalizeActivities(data),
                        settings: settings || this.getDefaultSettings()
                    };
                
                case 'rest-tracker-settings':
                    // Только настройки, активности нужно взять из другого места
                    return null;
                
                default:
                    return null;
            }
        } catch (error) {
            console.error(`❌ Ошибка извлечения данных из ${key}:`, error);
            return null;
        }
    }

    // Извлечение из restTracker формата
    private static extractFromRestTracker(data: any): { activities: Activity[]; settings: Settings } | null {
        if (!data || typeof data !== 'object') return null;

        return {
            activities: this.normalizeActivities(data.activities || []),
            settings: data.settings || this.getDefaultSettings()
        };
    }

    // Извлечение настроек из отдельного ключа
    private static extractSettings(): Settings | null {
        try {
            const settingsString = localStorage.getItem('rest-tracker-settings');
            if (settingsString) {
                return JSON.parse(settingsString);
            }
        } catch (error) {
            console.error('❌ Ошибка извлечения настроек:', error);
        }
        return null;
    }

    // Нормализация активностей (приведение к правильному формату)
    private static normalizeActivities(activities: any[]): Activity[] {
        if (!Array.isArray(activities)) return [];

        return activities.map(activity => ({
            id: activity.id || Date.now().toString(),
            name: activity.name || activity.title || 'Активность',
            type: activity.type || 'passive',
            description: activity.description,
            duration: activity.duration || 30,
            createdAt: activity.createdAt ? new Date(activity.createdAt) : new Date(),
            completedDates: (activity.completedDates || []).map((date: any) => 
                typeof date === 'string' ? new Date(date) : date
            ),
            isActive: activity.isActive !== false, // по умолчанию true
            recurrence: activity.recurrence
        }));
    }

    // Подсчет "качества" данных для выбора лучших
    private static calculateDataScore(data: { activities: Activity[]; settings: Settings }): number {
        let score = 0;
        
        // Очки за активности
        score += data.activities.length * 10;
        
        // Очки за выполненные активности
        data.activities.forEach(activity => {
            score += activity.completedDates.length * 5;
        });
        
        // Очки за настройки
        if (data.settings) {
            score += 1;
        }
        
        return score;
    }

    // Настройки по умолчанию
    private static getDefaultSettings(): Settings {
        return {
            notificationsEnabled: true,
            theme: 'light',
            defaultActivityDuration: 30,
            reminderTime: '09:00',
            testSettings: {
                hasCompletedFirstTest: false,
                showTestReminderPopup: true,
                testHistory: []
            }
        };
    }

    // Очистка старых ключей после миграции
    private static cleanupOldKeys(): void {
        this.OLD_KEYS.forEach(key => {
            if (localStorage.getItem(key)) {
                localStorage.removeItem(key);
                console.log(`🗑️ Удален старый ключ: ${key}`);
            }
        });
        
        // Также удаляем вспомогательные ключи
        localStorage.removeItem('lastBackupTime');
        console.log('✅ Миграция завершена, старые данные очищены');
    }

    // Показать информацию о найденных старых данных
    static showOldDataInfo(): void {
        console.log('🔍 Проверка старых данных...');
        
        this.OLD_KEYS.forEach(key => {
            const dataString = localStorage.getItem(key);
            if (dataString) {
                try {
                    const data = JSON.parse(dataString);
                    const size = dataString.length;
                    console.log(`📦 ${key}: ${size} байт`, data);
                } catch (e) {
                    console.log(`📦 ${key}: некорректные данные`);
                }
            }
        });
    }
}
