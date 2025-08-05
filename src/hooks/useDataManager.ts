import { useState, useEffect, useCallback } from 'react';
import { Activity, Settings } from '../types';
import { StorageManager } from '../utils/storage';
import { DataMigration } from '../utils/dataMigration';

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
    reminderTime: '09:00',
    testSettings: {
        hasCompletedFirstTest: false,
        showTestReminderPopup: true,
        testHistory: []
    }
};

export const useDataManager = (): UseDataManagerReturn => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [settings, setSettings] = useState<Settings>(defaultSettings);

    // Загрузка данных при инициализации
    useEffect(() => {
        let loadedData = StorageManager.loadData();
        
        // Если данных нет, пытаемся мигрировать из старых ключей
        if (!loadedData && DataMigration.hasOldData()) {
            console.log('🔄 Обнаружены старые данные, начинаем миграцию...');
            DataMigration.showOldDataInfo();
            loadedData = DataMigration.migrateAllData();
        }
        
        if (loadedData) {
            setActivities(loadedData.activities);
            setSettings(loadedData.settings);
            console.log('✅ Данные успешно загружены:', {
                activities: loadedData.activities.length,
                theme: loadedData.settings.theme
            });
        } else {
            console.log('📝 Начинаем с пустыми данными');
        }
    }, []);

    // Флаг для отслеживания инициализации
    const [isInitialized, setIsInitialized] = useState(false);

    // Автоматическое сохранение при изменении данных
    useEffect(() => {
        if (isInitialized) {
            StorageManager.saveData(activities, settings);
            
            // Умный backup (раз в день вечером)
            StorageManager.createSmartBackup(activities, settings);
        }
    }, [activities, settings, isInitialized]);

    // Устанавливаем флаг инициализации после первой загрузки
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsInitialized(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

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
