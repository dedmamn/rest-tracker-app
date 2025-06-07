import { useState, useEffect, useCallback } from 'react';
import { Activity, Settings } from '../types';
import { StorageManager } from '../utils/storage';

interface UseDataManagerReturn {
    activities: Activity[];
    settings: Settings;
    setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
    addActivity: (activity: Omit<Activity, 'id'>) => void;
    updateActivity: (id: string, updates: Partial<Activity>) => void;
    deleteActivity: (id: string) => void;
    exportData: () => string;
    importData: (jsonString: string) => void;
    clearAllData: () => void;
    createBackup: () => void;
    getStorageInfo: () => { used: number; total: number; percentage: number };
}

const defaultSettings: Settings = {
    notificationsEnabled: true,
    theme: 'light',
    defaultActivityDuration: 30,
    reminderTime: '09:00'
};

export const useDataManager = (): UseDataManagerReturn => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [settings, setSettings] = useState<Settings>(defaultSettings);

    // Загрузка данных при инициализации
    useEffect(() => {
        const loadedData = StorageManager.loadData();
        if (loadedData) {
            setActivities(loadedData.activities);
            setSettings(loadedData.settings);
        }
    }, []);

    // Автоматическое сохранение при изменении данных
    useEffect(() => {
        if (activities.length > 0 || Object.keys(settings).length > 0) {
            StorageManager.saveData(activities, settings);
            
            // Автоматическое создание резервной копии каждые 10 минут
            const now = new Date();
            const lastBackup = localStorage.getItem('lastBackupTime');
            if (!lastBackup || now.getTime() - new Date(lastBackup).getTime() > 10 * 60 * 1000) {
                StorageManager.createBackup(activities, settings);
                localStorage.setItem('lastBackupTime', now.toISOString());
            }
        }
    }, [activities, settings]);

    // Добавление новой активности
    const addActivity = useCallback((activityData: Omit<Activity, 'id'>) => {
        const newActivity: Activity = {
            ...activityData,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        };
        setActivities(prev => [...prev, newActivity]);
    }, []);

    // Обновление активности
    const updateActivity = useCallback((id: string, updates: Partial<Activity>) => {
        setActivities(prev => 
            prev.map(activity => 
                activity.id === id 
                    ? { ...activity, ...updates }
                    : activity
            )
        );
    }, []);

    // Удаление активности
    const deleteActivity = useCallback((id: string) => {
        setActivities(prev => prev.filter(activity => activity.id !== id));
    }, []);

    // Экспорт данных
    const exportData = useCallback(() => {
        return StorageManager.exportData(activities, settings);
    }, [activities, settings]);

    // Импорт данных
    const importData = useCallback((jsonString: string) => {
        const importedData = StorageManager.importData(jsonString);
        setActivities(importedData.activities);
        setSettings(importedData.settings);
    }, []);

    // Очистка всех данных
    const clearAllData = useCallback(() => {
        StorageManager.clearAllData();
        setActivities([]);
        setSettings(defaultSettings);
    }, []);

    // Создание резервной копии
    const createBackup = useCallback(() => {
        StorageManager.createBackup(activities, settings);
    }, [activities, settings]);

    // Получение информации о хранилище
    const getStorageInfo = useCallback(() => {
        return StorageManager.getStorageInfo();
    }, []);

    return {
        activities,
        settings,
        setActivities,
        setSettings,
        addActivity,
        updateActivity,
        deleteActivity,
        exportData,
        importData,
        clearAllData,
        createBackup,
        getStorageInfo
    };
};
