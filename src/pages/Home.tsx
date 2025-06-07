import React, { useState } from 'react';
import {
    Box,
    Typography,
    Fab,
    Grid,
    Card,
    CardContent,
    LinearProgress,
    Avatar
} from '@mui/material';
import { Add, TrendingUp, Today, Assignment } from '@mui/icons-material';
import { Activity, Settings as SettingsType } from '../types';
import ActivityCard from '../components/ActivityCard';
import ActivityForm from '../components/ActivityForm';

interface HomeProps {
    activities: Activity[];
    setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
    settings: SettingsType;
}

const Home: React.FC<HomeProps> = ({ activities, setActivities, settings }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleCompleteActivity = (activityId: string) => {
        setActivities(prev => prev.map(activity => 
            activity.id === activityId 
                ? {
                    ...activity,
                    completedDates: [...activity.completedDates, new Date()]
                }
                : activity
        ));
    };

    const handleEditActivity = (updatedActivity: Activity) => {
        setActivities(prev => prev.map(activity => 
            activity.id === updatedActivity.id ? updatedActivity : activity
        ));
    };

    const handleDeleteActivity = (activityId: string) => {
        setActivities(prev => prev.filter(activity => activity.id !== activityId));
    };

    const handleAddActivity = (newActivity: Activity) => {
        setActivities(prev => [...prev, newActivity]);
    };

    // Статистика для дашборда
    const getStats = () => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const todayActivities = activities.filter(activity =>
            activity.completedDates.some(date => {
                const completedDate = new Date(date);
                return completedDate.toDateString() === today.toDateString();
            })
        ).length;

        const weekActivities = activities.reduce((count, activity) => {
            const weekCompleted = activity.completedDates.filter(date => {
                const completedDate = new Date(date);
                return completedDate >= startOfWeek;
            }).length;
            return count + weekCompleted;
        }, 0);

        const monthActivities = activities.reduce((count, activity) => {
            const monthCompleted = activity.completedDates.filter(date => {
                const completedDate = new Date(date);
                return completedDate >= startOfMonth;
            }).length;
            return count + monthCompleted;
        }, 0);

        return { todayActivities, weekActivities, monthActivities };
    };

    const stats = getStats();
    const activeActivities = activities.filter(activity => activity.isActive);
    const todaysActivities = activeActivities.filter(activity => {
        if (!activity.recurrence) return false;
        
        const today = new Date().getDay();
        
        if (activity.recurrence.frequency === 'daily') return true;
        if (activity.recurrence.frequency === 'weekly') {
            return activity.recurrence.daysOfWeek?.includes(today) || false;
        }
        
        return false;
    });

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Доброе утро! ☀️';
        if (hour < 18) return 'Добрый день! 🌤️';
        return 'Добрый вечер! 🌙';
    };

    return (
        <Box sx={{ p: 2, pb: 10 }}>
            {/* Приветствие */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                    {getGreeting()}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Время позаботиться о своем отдыхе
                </Typography>
            </Box>

            {/* Статистика */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={4}>
                    <Card sx={{ textAlign: 'center', py: 1 }}>
                        <CardContent sx={{ pb: '16px !important' }}>
                            <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1, width: 32, height: 32 }}>
                                <Today fontSize="small" />
                            </Avatar>
                            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                                {stats.todayActivities}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Сегодня
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid item xs={4}>
                    <Card sx={{ textAlign: 'center', py: 1 }}>
                        <CardContent sx={{ pb: '16px !important' }}>
                            <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 1, width: 32, height: 32 }}>
                                <TrendingUp fontSize="small" />
                            </Avatar>
                            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                                {stats.weekActivities}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Неделя
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid item xs={4}>
                    <Card sx={{ textAlign: 'center', py: 1 }}>
                        <CardContent sx={{ pb: '16px !important' }}>
                            <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 1, width: 32, height: 32 }}>
                                <Assignment fontSize="small" />
                            </Avatar>
                            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                                {stats.monthActivities}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Месяц
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Сегодняшние активности */}
            {todaysActivities.length > 0 && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        Запланировано на сегодня
                    </Typography>
                    <Grid container spacing={2}>
                        {todaysActivities.slice(0, 2).map(activity => (
                            <Grid item xs={12} key={activity.id}>
                                <ActivityCard 
                                    activity={activity}
                                    onComplete={handleCompleteActivity}
                                    onEdit={handleEditActivity}
                                    onDelete={handleDeleteActivity}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            {/* Последние активности */}
            {activeActivities.length > 0 && (
                <Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        Ваши активности
                    </Typography>
                    <Grid container spacing={2}>
                        {activeActivities.slice(0, 3).map(activity => (
                            <Grid item xs={12} key={activity.id}>
                                <ActivityCard 
                                    activity={activity}
                                    onComplete={handleCompleteActivity}
                                    onEdit={handleEditActivity}
                                    onDelete={handleDeleteActivity}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            {/* Пустое состояние */}
            {activeActivities.length === 0 && (
                <Card sx={{ textAlign: 'center', py: 6, mt: 4 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            🌟 Начните свой путь к лучшему отдыху!
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Создайте свою первую активность отдыха
                        </Typography>
                    </CardContent>
                </Card>
            )}

            {/* FAB для добавления активности */}
            <Fab
                color="primary"
                aria-label="add"
                onClick={() => setIsFormOpen(true)}
                sx={{
                    position: 'fixed',
                    bottom: 90, // Над нижней навигацией
                    right: 16,
                    zIndex: 1000
                }}
            >
                <Add />
            </Fab>

            {/* Форма создания активности */}
            <ActivityForm 
                open={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleAddActivity}
            />
        </Box>
    );
};

export default Home;