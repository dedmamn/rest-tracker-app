import React from 'react';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Chip,
    IconButton,
    Box,
    LinearProgress,
    Tooltip
} from '@mui/material';
import {
    FitnessCenter,
    Psychology,
    People,
    Brush,
    Nature,
    Chair,
    PlayArrow,
    Edit,
    Delete,
    CheckCircle
} from '@mui/icons-material';
import { Activity, ActivityType } from '../types';

interface ActivityCardProps {
    activity: Activity;
    onComplete: (activityId: string) => void;
    onEdit: (activity: Activity) => void;
    onDelete: (activityId: string) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ 
    activity, 
    onComplete, 
    onEdit, 
    onDelete 
}) => {
    const getActivityIcon = (type: ActivityType) => {
        switch (type) {
            case ActivityType.PHYSICAL: return <FitnessCenter />;
            case ActivityType.MENTAL: return <Psychology />;
            case ActivityType.SOCIAL: return <People />;
            case ActivityType.CREATIVE: return <Brush />;
            case ActivityType.OUTDOOR: return <Nature />;
            case ActivityType.PASSIVE: return <Chair />;
            default: return <Chair />;
        }
    };

    const getActivityTypeLabel = (type: ActivityType) => {
        switch (type) {
            case ActivityType.PHYSICAL: return 'Физическая';
            case ActivityType.MENTAL: return 'Ментальная';
            case ActivityType.SOCIAL: return 'Социальная';
            case ActivityType.CREATIVE: return 'Творческая';
            case ActivityType.OUTDOOR: return 'На воздухе';
            case ActivityType.PASSIVE: return 'Пассивная';
            default: return 'Отдых';
        }
    };

    const getActivityTypeColor = (type: ActivityType) => {
        switch (type) {
            case ActivityType.PHYSICAL: return '#FF6B6B';
            case ActivityType.MENTAL: return '#4ECDC4';
            case ActivityType.SOCIAL: return '#45B7D1';
            case ActivityType.CREATIVE: return '#96CEB4';
            case ActivityType.OUTDOOR: return '#FFEAA7';
            case ActivityType.PASSIVE: return '#DDA0DD';
            default: return '#95A5A6';
        }
    };

    const getRecurrenceText = () => {
        if (!activity.recurrence) return null;
        
        const { frequency, interval, daysOfWeek } = activity.recurrence;
        let text = '';
        
        if (frequency === 'daily') {
            text = interval === 1 ? 'Ежедневно' : `Каждые ${interval} дня`;
        } else if (frequency === 'weekly') {
            if (daysOfWeek && daysOfWeek.length > 0) {
                const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
                const selectedDays = daysOfWeek.map(day => dayNames[day]).join(', ');
                text = `${selectedDays}`;
            } else {
                text = interval === 1 ? 'Еженедельно' : `Каждые ${interval} недели`;
            }
        } else if (frequency === 'monthly') {
            text = interval === 1 ? 'Ежемесячно' : `Каждые ${interval} месяца`;
        }
        
        return text;
    };

    // Вычисляем прогресс выполнения за текущую неделю
    const getWeeklyProgress = () => {
        if (!activity.recurrence || activity.recurrence.frequency !== 'weekly') return null;
        
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        
        const completedThisWeek = activity.completedDates.filter(date => {
            const completedDate = new Date(date);
            return completedDate >= startOfWeek && completedDate <= endOfWeek;
        }).length;
        
        const expectedDays = activity.recurrence.daysOfWeek?.length || 7;
        const progress = Math.min((completedThisWeek / expectedDays) * 100, 100);
        
        return { progress, completed: completedThisWeek, expected: expectedDays };
    };

    const weeklyProgress = getWeeklyProgress();
    const isCompletedToday = activity.completedDates.some(date => {
        const completedDate = new Date(date);
        const today = new Date();
        return completedDate.toDateString() === today.toDateString();
    });

    return (
        <Card 
            sx={{ 
                borderRadius: '16px',
                overflow: 'visible',
                position: 'relative',
                '&:hover': {
                    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease'
                }
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    backgroundColor: getActivityTypeColor(activity.type),
                    borderRadius: '16px 16px 0 0'
                }}
            />
            
            <CardContent sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Box 
                        sx={{ 
                            mr: 2, 
                            mt: 0.5,
                            color: getActivityTypeColor(activity.type)
                        }}
                    >
                        {getActivityIcon(activity.type)}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="h3" sx={{ mb: 0.5, fontWeight: 600 }}>
                            {activity.name}
                        </Typography>
                        <Chip 
                            label={getActivityTypeLabel(activity.type)}
                            size="small"
                            sx={{ 
                                backgroundColor: getActivityTypeColor(activity.type),
                                color: 'white',
                                fontWeight: 500
                            }}
                        />
                    </Box>
                </Box>

                {activity.description && (
                    <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ mb: 2 }}
                    >
                        {activity.description}
                    </Typography>
                )}

                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    {activity.duration && (
                        <Chip 
                            label={`${activity.duration} мин`}
                            size="small"
                            variant="outlined"
                        />
                    )}
                    {getRecurrenceText() && (
                        <Chip 
                            label={getRecurrenceText()}
                            size="small"
                            variant="outlined"
                        />
                    )}
                    {isCompletedToday && (
                        <Chip 
                            label="Выполнено сегодня"
                            size="small"
                            color="success"
                        />
                    )}
                </Box>

                {weeklyProgress && (
                    <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                Прогресс недели
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {weeklyProgress.completed}/{weeklyProgress.expected}
                            </Typography>
                        </Box>
                        <LinearProgress 
                            variant="determinate" 
                            value={weeklyProgress.progress}
                            sx={{ borderRadius: '4px', height: '6px' }}
                        />
                    </Box>
                )}
            </CardContent>

            <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Tooltip title="Выполнить активность">
                    <IconButton 
                        color="primary" 
                        onClick={() => onComplete(activity.id)}
                        disabled={isCompletedToday}
                        sx={{ 
                            backgroundColor: 'primary.main',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'primary.dark'
                            },
                            '&:disabled': {
                                backgroundColor: 'success.light',
                                color: 'white'
                            }
                        }}
                    >
                        {isCompletedToday ? <CheckCircle /> : <PlayArrow />}
                    </IconButton>
                </Tooltip>
                
                <Box>
                    <Tooltip title="Редактировать">
                        <IconButton 
                            onClick={() => onEdit(activity)}
                            size="small"
                        >
                            <Edit />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Удалить">
                        <IconButton 
                            onClick={() => onDelete(activity.id)}
                            size="small"
                            color="error"
                        >
                            <Delete />
                        </IconButton>
                    </Tooltip>
                </Box>
            </CardActions>
        </Card>
    );
};

export default ActivityCard;