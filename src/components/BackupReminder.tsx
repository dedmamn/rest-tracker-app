import React, { useState, useEffect } from 'react';
import {
    Snackbar,
    Alert,
    AlertTitle,
    Button,
    Box
} from '@mui/material';
import { Backup, Close } from '@mui/icons-material';

interface BackupReminderProps {
    onCreateBackup: () => void;
    activitiesCount: number;
}

const BackupReminder: React.FC<BackupReminderProps> = ({ onCreateBackup, activitiesCount }) => {
    const [showReminder, setShowReminder] = useState(false);

    useEffect(() => {
        // Проверяем, нужно ли показать напоминание о резервной копии
        const checkBackupReminder = () => {
            const lastBackup = localStorage.getItem('lastBackupTime');
            const lastReminderDismissed = localStorage.getItem('lastBackupReminderDismissed');
            
            if (!lastBackup) {
                // Если никогда не создавали резервную копию и есть активности
                if (activitiesCount >= 3) {
                    setShowReminder(true);
                }
                return;
            }

            const lastBackupTime = new Date(lastBackup);
            const now = new Date();
            const daysSinceBackup = (now.getTime() - lastBackupTime.getTime()) / (1000 * 60 * 60 * 24);
            
            // Показываем напоминание если прошло более 7 дней с последней резервной копии
            if (daysSinceBackup > 7) {
                // Проверяем, не отклонял ли пользователь напоминание в последние 24 часа
                if (lastReminderDismissed) {
                    const lastDismissedTime = new Date(lastReminderDismissed);
                    const hoursSinceDismissed = (now.getTime() - lastDismissedTime.getTime()) / (1000 * 60 * 60);
                    
                    if (hoursSinceDismissed > 24) {
                        setShowReminder(true);
                    }
                } else {
                    setShowReminder(true);
                }
            }
        };

        checkBackupReminder();
    }, [activitiesCount]);

    const handleCreateBackup = () => {
        onCreateBackup();
        setShowReminder(false);
        localStorage.setItem('lastBackupTime', new Date().toISOString());
    };

    const handleDismiss = () => {
        setShowReminder(false);
        localStorage.setItem('lastBackupReminderDismissed', new Date().toISOString());
    };

    return (
        <Snackbar
            open={showReminder}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            sx={{ mt: 8 }}
        >
            <Alert
                severity="info"
                icon={<Backup />}
                action={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            color="inherit"
                            size="small"
                            onClick={handleCreateBackup}
                            startIcon={<Backup />}
                        >
                            Создать
                        </Button>
                        <Button
                            color="inherit"
                            size="small"
                            onClick={handleDismiss}
                            startIcon={<Close />}
                        >
                            Позже
                        </Button>
                    </Box>
                }
                sx={{ width: '100%', maxWidth: 600 }}
            >
                <AlertTitle>Рекомендуется создать резервную копию</AlertTitle>
                У вас {activitiesCount} активностей. Создайте резервную копию для безопасности данных.
            </Alert>
        </Snackbar>
    );
};

export default BackupReminder;
