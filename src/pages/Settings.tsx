import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    FormControlLabel,
    Switch,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Divider,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Slider,
    AppBar,
    Toolbar,
    LinearProgress,
    Chip
} from '@mui/material';
import {
    Notifications,
    DarkMode,
    Schedule,
    DataUsage,
    CloudDownload,
    CloudUpload,
    DeleteForever,
    Info,
    Storage,
    Backup
} from '@mui/icons-material';
import { Settings as SettingsType, Activity } from '../types';
import { StorageManager } from '../utils/storage';
import { DataFormatter, NotificationManager } from '../utils/helpers';

interface SettingsProps {
    settings: SettingsType;
    setSettings: React.Dispatch<React.SetStateAction<SettingsType>>;
    activities?: Activity[];
    setActivities?: React.Dispatch<React.SetStateAction<Activity[]>>;
}

const Settings: React.FC<SettingsProps> = ({ settings, setSettings, activities = [], setActivities }) => {
    const [exportDialogOpen, setExportDialogOpen] = useState(false);
    const [importDialogOpen, setImportDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [importData, setImportData] = useState('');
    const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [storageInfo, setStorageInfo] = useState(StorageManager.getStorageInfo());

    const handleSettingChange = (key: keyof SettingsType, value: any) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleExportData = () => {
        try {
            const exportString = StorageManager.exportData(activities, settings);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(exportString);
            
            const exportFileDefaultName = `rest-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            
            setExportDialogOpen(false);
            setAlertMessage({ type: 'success', message: 'Данные успешно экспортированы!' });
        } catch (error) {
            setAlertMessage({ type: 'error', message: 'Ошибка при экспорте данных' });
        }
    };

    const handleImportData = () => {
        try {
            const importedData = StorageManager.importData(importData);
            
            if (setActivities) {
                setActivities(importedData.activities);
            }
            setSettings(importedData.settings);
            
            // Сохраняем импортированные данные
            StorageManager.saveData(importedData.activities, importedData.settings);
            
            setImportDialogOpen(false);
            setImportData('');
            setStorageInfo(StorageManager.getStorageInfo());
            setAlertMessage({ type: 'success', message: 'Данные успешно импортированы!' });
        } catch (error) {
            setAlertMessage({ type: 'error', message: 'Ошибка импорта: неверный формат данных' });
        }
    };

    const handleDeleteAllData = () => {
        StorageManager.clearAllData();
        if (setActivities) {
            setActivities([]);
        }
        setSettings({
            notificationsEnabled: true,
            theme: 'light',
            defaultActivityDuration: 30,
            reminderTime: '09:00'
        });
        setDeleteDialogOpen(false);
        setStorageInfo(StorageManager.getStorageInfo());
        setAlertMessage({ type: 'success', message: 'Все данные удалены!' });
    };

    const handleCreateBackup = () => {
        try {
            StorageManager.createBackup(activities, settings);
            setAlertMessage({ type: 'success', message: 'Резервная копия создана!' });
        } catch (error) {
            setAlertMessage({ type: 'error', message: 'Ошибка создания резервной копии' });
        }
    };

    const formatBytes = (bytes: number): string => {
        return DataFormatter.formatBytes(bytes);
    };

    const handleNotificationToggle = async (enabled: boolean) => {
        if (enabled) {
            const hasPermission = await NotificationManager.requestPermission();
            if (!hasPermission) {
                setAlertMessage({ 
                    type: 'error', 
                    message: 'Разрешение на уведомления не получено. Проверьте настройки браузера.' 
                });
                return;
            }
        }
        handleSettingChange('notificationsEnabled', enabled);
    };

    const formatTime = (timeString: string) => {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        return `${hours}:${minutes}`;
    };

    return (
        <Box sx={{ pb: 10 }}>
            {/* Заголовок */}
            <AppBar 
                position="sticky" 
                color="transparent" 
                elevation={0}
                sx={{ 
                    backdropFilter: 'blur(8px)',
                    backgroundColor: (theme) => theme.palette.mode === 'dark' 
                        ? 'rgba(18, 18, 18, 0.9)' 
                        : 'rgba(255, 255, 255, 0.9)',
                    borderBottom: (theme) => `1px solid ${theme.palette.divider}`
                }}
            >
                <Toolbar>
                    <Typography variant="h5" component="h1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        Настройки
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box sx={{ p: 2 }}>
                {/* Уведомления */}
                {alertMessage && (
                    <Alert 
                        severity={alertMessage.type} 
                        onClose={() => setAlertMessage(null)}
                        sx={{ mb: 2 }}
                    >
                        {alertMessage.message}
                    </Alert>
                )}

                {/* Основные настройки */}
                <Card sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Notifications color="primary" />
                            Уведомления и напоминания
                        </Typography>
                        
                        <FormControlLabel
                            control={
                                <Switch 
                                    checked={settings.notificationsEnabled}
                                    onChange={(e) => handleNotificationToggle(e.target.checked)}
                                />
                            }
                            label="Включить уведомления"
                            sx={{ mb: 2 }}
                        />
                        
                        {settings.notificationsEnabled && (
                            <TextField
                                label="Время напоминаний"
                                type="time"
                                value={settings.reminderTime || '09:00'}
                                onChange={(e) => handleSettingChange('reminderTime', e.target.value)}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                helperText="Время ежедневных напоминаний о запланированных активностях"
                            />
                        )}
                    </CardContent>
                </Card>

                {/* Настройки интерфейса */}
                <Card sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <DarkMode color="primary" />
                            Интерфейс
                        </Typography>
                        
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Тема оформления</InputLabel>
                            <Select
                                value={settings.theme}
                                onChange={(e) => handleSettingChange('theme', e.target.value)}
                                label="Тема оформления"
                            >
                                <MenuItem value="light">Светлая</MenuItem>
                                <MenuItem value="dark">Тёмная</MenuItem>
                            </Select>
                        </FormControl>
                    </CardContent>
                </Card>

                {/* Настройки активностей */}
                <Card sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Schedule color="primary" />
                            Активности
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Продолжительность активности по умолчанию: {settings.defaultActivityDuration} минут
                        </Typography>
                        <Slider
                            value={settings.defaultActivityDuration}
                            onChange={(_, value) => handleSettingChange('defaultActivityDuration', value)}
                            min={5}
                            max={120}
                            step={5}
                            marks={[
                                { value: 15, label: '15 мин' },
                                { value: 30, label: '30 мин' },
                                { value: 60, label: '1 час' },
                                { value: 120, label: '2 часа' }
                            ]}
                            valueLabelDisplay="auto"
                            sx={{ mt: 2 }}
                        />
                    </CardContent>
                </Card>

                {/* Данные и резервное копирование */}
                <Card sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <DataUsage color="primary" />
                            Данные и резервное копирование
                        </Typography>

                        {/* Информация о хранилище */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Storage fontSize="small" />
                                Использование хранилища
                            </Typography>
                            <LinearProgress 
                                variant="determinate" 
                                value={Math.min(storageInfo.percentage, 100)} 
                                sx={{ mb: 1, height: 8, borderRadius: 4 }}
                                color={storageInfo.percentage > 80 ? 'error' : storageInfo.percentage > 60 ? 'warning' : 'primary'}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="caption">
                                    {formatBytes(storageInfo.used)} использовано
                                </Typography>
                                <Typography variant="caption">
                                    {formatBytes(storageInfo.total)} всего
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                <Chip 
                                    label={`${activities.length} активностей`} 
                                    size="small" 
                                    color="primary" 
                                    variant="outlined" 
                                />
                                <Chip 
                                    label={`${storageInfo.percentage.toFixed(1)}% заполнено`} 
                                    size="small" 
                                    color={storageInfo.percentage > 80 ? 'error' : 'default'}
                                    variant="outlined" 
                                />
                            </Box>
                        </Box>
                        
                        <List disablePadding>
                            <ListItem 
                                button 
                                onClick={handleCreateBackup}
                                sx={{ borderRadius: 1, mb: 1 }}
                            >
                                <ListItemIcon>
                                    <Backup color="primary" />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Создать резервную копию"
                                    secondary="Сохранить текущие данные локально"
                                />
                            </ListItem>

                            <ListItem 
                                button 
                                onClick={() => setExportDialogOpen(true)}
                                sx={{ borderRadius: 1, mb: 1 }}
                            >
                                <ListItemIcon>
                                    <CloudDownload color="success" />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Экспорт данных"
                                    secondary="Сохранить все данные в файл"
                                />
                            </ListItem>
                            
                            <ListItem 
                                button 
                                onClick={() => setImportDialogOpen(true)}
                                sx={{ borderRadius: 1, mb: 1 }}
                            >
                                <ListItemIcon>
                                    <CloudUpload color="info" />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Импорт данных"
                                    secondary="Восстановить данные из файла"
                                />
                            </ListItem>
                            
                            <Divider sx={{ my: 1 }} />
                            
                            <ListItem 
                                button 
                                onClick={() => setDeleteDialogOpen(true)}
                                sx={{ borderRadius: 1 }}
                            >
                                <ListItemIcon>
                                    <DeleteForever color="error" />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Удалить все данные"
                                    secondary="Очистить все активности и настройки"
                                />
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>

                {/* Информация о приложении */}
                <Card>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Info color="primary" />
                            О приложении
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            <strong>Трекер отдыха</strong> v1.0.0
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Приложение для отслеживания активностей отдыха и поддержания баланса между работой и личной жизнью.
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Данные хранятся локально в вашем браузере.
                        </Typography>
                    </CardContent>
                </Card>
            </Box>

            {/* Диалог экспорта */}
            <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)}>
                <DialogTitle>Экспорт данных</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Будет создан файл с резервной копией всех ваших активностей и настроек.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setExportDialogOpen(false)}>
                        Отмена
                    </Button>
                    <Button onClick={handleExportData} variant="contained">
                        Экспортировать
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Диалог импорта */}
            <Dialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Импорт данных</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Вставьте содержимое файла резервной копии:
                    </Typography>
                    <TextField
                        multiline
                        rows={6}
                        fullWidth
                        value={importData}
                        onChange={(e) => setImportData(e.target.value)}
                        placeholder="Вставьте JSON-данные здесь..."
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setImportDialogOpen(false)}>
                        Отмена
                    </Button>
                    <Button 
                        onClick={handleImportData} 
                        variant="contained"
                        disabled={!importData.trim()}
                    >
                        Импортировать
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Диалог удаления всех данных */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Удалить все данные?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="error">
                        Это действие необратимо! Все ваши активности и настройки будут безвозвратно удалены.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>
                        Отмена
                    </Button>
                    <Button onClick={handleDeleteAllData} color="error" variant="contained">
                        Удалить все
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Settings;
