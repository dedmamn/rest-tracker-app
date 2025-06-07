import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Chip,
    Typography,
    Switch,
    FormControlLabel,
    Grid
} from '@mui/material';
import { Activity, ActivityType, Recurrence } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface ActivityFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (activity: Activity) => void;
    editActivity?: Activity;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ 
    open, 
    onClose, 
    onSubmit, 
    editActivity 
}) => {
    const [name, setName] = useState(editActivity?.name || '');
    const [description, setDescription] = useState(editActivity?.description || '');
    const [activityType, setActivityType] = useState<ActivityType>(
        editActivity?.type || ActivityType.PASSIVE
    );
    const [duration, setDuration] = useState(editActivity?.duration || 30);
    const [hasRecurrence, setHasRecurrence] = useState(!!editActivity?.recurrence);
    const [recurrence, setRecurrence] = useState<Recurrence>(
        editActivity?.recurrence || {
            frequency: 'weekly',
            interval: 1,
            daysOfWeek: []
        }
    );

    const activityTypeLabels = {
        [ActivityType.PHYSICAL]: 'Физическая активность',
        [ActivityType.MENTAL]: 'Ментальный отдых',
        [ActivityType.SOCIAL]: 'Социальная активность',
        [ActivityType.CREATIVE]: 'Творчество',
        [ActivityType.OUTDOOR]: 'На свежем воздухе',
        [ActivityType.PASSIVE]: 'Пассивный отдых'
    };

    const frequencyLabels = {
        daily: 'Ежедневно',
        weekly: 'Еженедельно',
        monthly: 'Ежемесячно'
    };

    const daysOfWeek = [
        { value: 1, label: 'Пн' },
        { value: 2, label: 'Вт' },
        { value: 3, label: 'Ср' },
        { value: 4, label: 'Чт' },
        { value: 5, label: 'Пт' },
        { value: 6, label: 'Сб' },
        { value: 0, label: 'Вс' }
    ];

    const handleSubmit = () => {
        const activity: Activity = {
            id: editActivity?.id || uuidv4(),
            name,
            description: description || undefined,
            type: activityType,
            duration,
            recurrence: hasRecurrence ? recurrence : undefined,
            createdAt: editActivity?.createdAt || new Date(),
            completedDates: editActivity?.completedDates || [],
            isActive: true
        };

        onSubmit(activity);
        handleClose();
    };

    const handleClose = () => {
        // Сброс формы
        setName('');
        setDescription('');
        setActivityType(ActivityType.PASSIVE);
        setDuration(30);
        setHasRecurrence(false);
        setRecurrence({
            frequency: 'weekly',
            interval: 1,
            daysOfWeek: []
        });
        onClose();
    };

    const toggleDayOfWeek = (day: number) => {
        setRecurrence(prev => ({
            ...prev,
            daysOfWeek: prev.daysOfWeek?.includes(day)
                ? prev.daysOfWeek.filter(d => d !== day)
                : [...(prev.daysOfWeek || []), day]
        }));
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    borderRadius: '16px',
                    margin: '16px'
                }
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                {editActivity ? 'Редактировать активность' : 'Новая активность отдыха'}
            </DialogTitle>
            
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
                    <TextField
                        label="Название"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        required
                        variant="outlined"
                    />

                    <TextField
                        label="Описание (необязательно)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        multiline
                        rows={2}
                        variant="outlined"
                    />

                    <FormControl fullWidth>
                        <InputLabel>Тип отдыха</InputLabel>
                        <Select
                            value={activityType}
                            onChange={(e) => setActivityType(e.target.value as ActivityType)}
                            label="Тип отдыха"
                        >
                            {Object.entries(activityTypeLabels).map(([key, label]) => (
                                <MenuItem key={key} value={key}>
                                    {label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Продолжительность (минуты)"
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        fullWidth
                        inputProps={{ min: 5, max: 480 }}
                    />

                    <FormControlLabel
                        control={
                            <Switch 
                                checked={hasRecurrence}
                                onChange={(e) => setHasRecurrence(e.target.checked)}
                            />
                        }
                        label="Настроить регулярность"
                    />

                    {hasRecurrence && (
                        <Box sx={{ pl: 2, borderLeft: '3px solid', borderColor: 'primary.light' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Частота</InputLabel>
                                        <Select
                                            value={recurrence.frequency}
                                            onChange={(e) => setRecurrence(prev => ({
                                                ...prev,
                                                frequency: e.target.value as 'daily' | 'weekly' | 'monthly'
                                            }))}
                                            label="Частота"
                                        >
                                            {Object.entries(frequencyLabels).map(([key, label]) => (
                                                <MenuItem key={key} value={key}>
                                                    {label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                
                                <Grid item xs={6}>
                                    <TextField
                                        label="Каждые N дней/недель"
                                        type="number"
                                        size="small"
                                        value={recurrence.interval}
                                        onChange={(e) => setRecurrence(prev => ({
                                            ...prev,
                                            interval: Number(e.target.value)
                                        }))}
                                        fullWidth
                                        inputProps={{ min: 1, max: 30 }}
                                    />
                                </Grid>
                            </Grid>

                            {recurrence.frequency === 'weekly' && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Дни недели:
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        {daysOfWeek.map(day => (
                                            <Chip
                                                key={day.value}
                                                label={day.label}
                                                clickable
                                                color={recurrence.daysOfWeek?.includes(day.value) ? 'primary' : 'default'}
                                                onClick={() => toggleDayOfWeek(day.value)}
                                                size="small"
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button onClick={handleClose} color="inherit">
                    Отмена
                </Button>
                <Button 
                    onClick={handleSubmit} 
                    variant="contained"
                    disabled={!name.trim()}
                    sx={{ borderRadius: '8px' }}
                >
                    {editActivity ? 'Сохранить' : 'Создать'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ActivityForm;