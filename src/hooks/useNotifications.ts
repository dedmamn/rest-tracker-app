import { useEffect, useCallback } from 'react';
import { Settings } from '../types';
import { NotificationManager } from '../utils/helpers';

interface UseNotificationsProps {
    settings: Settings;
}

export const useNotifications = ({ settings }: UseNotificationsProps) => {
    // Инициализация уведомлений при изменении настроек
    useEffect(() => {
        console.log('🔔 Обновление настроек уведомлений:', {
            enabled: settings.notificationsEnabled,
            time: settings.reminderTime
        });

        if (settings.notificationsEnabled && settings.reminderTime) {
            // Запрашиваем разрешение на уведомления
            NotificationManager.requestPermission().then(hasPermission => {
                if (hasPermission) {
                    // Планируем ежедневные уведомления
                    NotificationManager.scheduleDaily(settings.reminderTime!);
                    console.log('✅ Уведомления успешно запланированы');
                } else {
                    console.log('❌ Разрешение на уведомления не получено');
                }
            });
        } else {
            // Очищаем запланированные уведомления если они отключены
            NotificationManager.clearScheduled();
            console.log('🧹 Уведомления отключены и очищены');
        }

        // Очистка при размонтировании компонента
        return () => {
            // Не очищаем здесь, чтобы уведомления работали в фоне
        };
    }, [settings.notificationsEnabled, settings.reminderTime]);

    // Отправка уведомления вручную (для тестирования)
    const sendTestNotification = useCallback(async () => {
        await NotificationManager.sendDailyReminder();
    }, []);

    // Получение статуса уведомлений
    const getNotificationStatus = useCallback(() => {
        return NotificationManager.getNotificationStatus();
    }, []);

    // Очистка уведомлений
    const clearNotifications = useCallback(() => {
        NotificationManager.clearScheduled();
    }, []);

    return {
        sendTestNotification,
        getNotificationStatus,
        clearNotifications
    };
};
