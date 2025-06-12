import { Activity, Settings } from '../types';

export interface AppData {
    activities: Activity[];
    settings: Settings;
    version: string;
    lastBackup: string;
}

const STORAGE_KEY = 'rest-tracker-data';
const BACKUP_KEY = 'rest-tracker-backup';
const VERSION = '1.0.0';

export class StorageManager {
    // Сохранение данных
    static saveData(activities: Activity[], settings: Settings): void {
        const data: AppData = {
            activities: this.serializeActivities(activities),
            settings,
            version: VERSION,
            lastBackup: new Date().toISOString()
        };

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            console.log('✅ Данные сохранены:', { 
                activities: activities.length, 
                settings: settings.theme,
                key: STORAGE_KEY 
            });
        } catch (error) {
            console.error('❌ Ошибка сохранения данных:', error);
            throw new Error('Не удалось сохранить данные');
        }
    }

    // Загрузка данных
    static loadData(): { activities: Activity[]; settings: Settings } | null {
        try {
            // Сначала пытаемся загрузить из основного ключа
            let dataString = localStorage.getItem(STORAGE_KEY);
            
            // Если основных данных нет, пытаемся восстановить из backup
            if (!dataString) {
                console.log('🔄 Основные данные не найдены, проверяем backup...');
                const backupData = this.loadBackup();
                if (backupData) {
                    console.log('✅ Данные восстановлены из backup');
                    // Сохраняем восстановленные данные в основной ключ
                    this.saveData(backupData.activities, backupData.settings);
                    return backupData;
                }
                return null;
            }

            const data: AppData = JSON.parse(dataString);
            
            // Проверка версии и миграция данных при необходимости
            if (data.version !== VERSION) {
                console.log('🔄 Обнаружена старая версия данных, выполняется миграция...');
                const migratedData = this.migrateData(data);
                this.saveData(migratedData.activities, migratedData.settings);
                return migratedData;
            }

            const result = {
                activities: this.deserializeActivities(data.activities || []),
                settings: data.settings || this.getDefaultSettings()
            };

            console.log('✅ Данные загружены:', { 
                activities: result.activities.length,
                settings: result.settings.theme,
                key: STORAGE_KEY
            });

            return result;
        } catch (error) {
            console.error('❌ Ошибка загрузки данных:', error);
            const backupData = this.loadBackup();
            if (backupData) {
                console.log('✅ Данные восстановлены из backup после ошибки');
                return backupData;
            }
            return null;
        }
    }

    // Создание резервной копии
    static createBackup(activities: Activity[], settings: Settings): void {
        const backupData: AppData = {
            activities: this.serializeActivities(activities),
            settings,
            version: VERSION,
            lastBackup: new Date().toISOString()
        };

        try {
            localStorage.setItem(BACKUP_KEY, JSON.stringify(backupData));
            console.log('🗄️ Резервная копия создана');
        } catch (error) {
            console.error('❌ Ошибка создания резервной копии:', error);
        }
    }

    // Умное создание резервной копии (раз в день вечером)
    static createSmartBackup(activities: Activity[], settings: Settings): void {
        const now = new Date();
        const hour = now.getHours();
        
        // Backup только вечером (22:00-23:59)
        if (hour < 22) {
            return;
        }

        const lastBackupTime = localStorage.getItem('lastBackupTime');
        
        // Проверяем, прошло ли больше 20 часов с последнего backup
        if (lastBackupTime) {
            const timeDiff = now.getTime() - new Date(lastBackupTime).getTime();
            const hoursDiff = timeDiff / (1000 * 60 * 60);
            
            if (hoursDiff < 20) {
                return; // Еще рано для backup
            }
        }

        // Создаем backup
        this.createBackup(activities, settings);
        localStorage.setItem('lastBackupTime', now.toISOString());
        console.log('🌙 Создан вечерний backup');
    }

    // Восстановление из резервной копии
    static loadBackup(): { activities: Activity[]; settings: Settings } | null {
        try {
            const backupString = localStorage.getItem(BACKUP_KEY);
            if (!backupString) {
                console.log('🔍 Backup не найден');
                return null;
            }

            const backup: AppData = JSON.parse(backupString);
            console.log('📦 Данные восстановлены из резервной копии');
            
            return {
                activities: this.deserializeActivities(backup.activities || []),
                settings: backup.settings || this.getDefaultSettings()
            };
        } catch (error) {
            console.error('❌ Ошибка восстановления из резервной копии:', error);
            return null;
        }
    }

    // Экспорт данных в JSON
    static exportData(activities: Activity[], settings: Settings): string {
        const exportData: AppData = {
            activities,
            settings,
            version: VERSION,
            lastBackup: new Date().toISOString()
        };

        return JSON.stringify(exportData, null, 2);
    }

    // Импорт данных из JSON
    static importData(jsonString: string): { activities: Activity[]; settings: Settings } {
        try {
            const importedData: AppData = JSON.parse(jsonString);
            
            // Валидация данных
            if (!this.validateImportedData(importedData)) {
                throw new Error('Неверный формат данных');
            }

            // Миграция данных при необходимости
            if (importedData.version !== VERSION) {
                return this.migrateData(importedData);
            }

            return {
                activities: importedData.activities || [],
                settings: importedData.settings || this.getDefaultSettings()
            };
        } catch (error) {
            console.error('Ошибка импорта данных:', error);
            throw new Error('Не удалось импортировать данные');
        }
    }

    // Сериализация активностей (преобразование Date в строки)
    private static serializeActivities(activities: Activity[]): any[] {
        return activities.map(activity => ({
            ...activity,
            createdAt: activity.createdAt.toISOString(),
            completedDates: activity.completedDates.map(date => date.toISOString()),
            recurrence: activity.recurrence ? {
                ...activity.recurrence,
                endDate: activity.recurrence.endDate ? activity.recurrence.endDate.toISOString() : undefined
            } : undefined
        }));
    }

    // Десериализация активностей (преобразование строк в Date)
    private static deserializeActivities(activities: any[]): Activity[] {
        return activities.map(activity => ({
            ...activity,
            createdAt: new Date(activity.createdAt),
            completedDates: activity.completedDates ? 
                activity.completedDates.map((dateStr: string) => new Date(dateStr)) : [],
            recurrence: activity.recurrence ? {
                ...activity.recurrence,
                endDate: activity.recurrence.endDate ? new Date(activity.recurrence.endDate) : undefined
            } : undefined
        }));
    }

    // Валидация импортированных данных
    private static validateImportedData(data: any): boolean {
        if (!data || typeof data !== 'object') {
            return false;
        }

        // Проверка структуры activities
        if (data.activities && Array.isArray(data.activities)) {
            for (const activity of data.activities) {
                if (!activity.id || !activity.name || !activity.type) {
                    return false;
                }
            }
        }

        // Проверка структуры settings
        if (data.settings && typeof data.settings === 'object') {
            const requiredSettingsFields = ['theme', 'notificationsEnabled'];
            for (const field of requiredSettingsFields) {
                if (!(field in data.settings)) {
                    return false;
                }
            }
        }

        return true;
    }

    // Миграция данных между версиями
    private static migrateData(oldData: any): { activities: Activity[]; settings: Settings } {
        // Миграция активностей (десериализация дат)
        const activities = oldData.activities ? 
            this.deserializeActivities(oldData.activities) : [];

        return {
            activities,
            settings: { ...this.getDefaultSettings(), ...oldData.settings }
        };
    }

    // Получение настроек по умолчанию
    private static getDefaultSettings(): Settings {
        return {
            notificationsEnabled: true,
            theme: 'light',
            defaultActivityDuration: 30,
            reminderTime: '09:00'
        };
    }

    // Очистка всех данных
    static clearAllData(): void {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(BACKUP_KEY);
        console.log('Все данные очищены');
    }

    // Получение информации о размере хранилища
    static getStorageInfo(): { used: number; total: number; percentage: number } {
        let used = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                used += localStorage[key].length;
            }
        }

        // Примерный лимит localStorage (5MB для большинства браузеров)
        const total = 5 * 1024 * 1024;
        const percentage = (used / total) * 100;

        return { used, total, percentage };
    }
}
