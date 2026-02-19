import React, { useState } from 'react';
import {
    Box,
    Typography,
    Fab,
    Grid,
    Card,
    CardContent,
    LinearProgress,
    Avatar,
    Button,
    IconButton
} from '@mui/material';
import { Add, TrendingUp, Today, Assignment, Psychology } from '@mui/icons-material';
import { Activity, Settings as SettingsType, TestResult } from '../types';
import ActivityCard from '../components/ActivityCard';
import ActivityForm from '../components/ActivityForm';

interface HomeProps {
    activities: Activity[];
    setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
    settings: SettingsType;
    onOpenTest?: () => void;
    testHistory?: TestResult[];
}

const Home: React.FC<HomeProps> = ({ 
    activities, 
    setActivities, 
    settings, 
    onOpenTest,
    testHistory = []
}) => {
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleCompleteActivity = (activityId: string) => {
        setActivities(prev => prev.map(activity => {
            if (activity.id !== activityId) return activity;
            
            const today = new Date();
            const isCompletedToday = activity.completedDates.some(date => {
                const completedDate = new Date(date);
                return completedDate.toDateString() === today.toDateString();
            });
            
            if (isCompletedToday) {
                // Remove today's completion
                return {
                    ...activity,
                    completedDates: activity.completedDates.filter(date => {
                        const completedDate = new Date(date);
                        return completedDate.toDateString() !== today.toDateString();
                    })
                };
            } else {
                // Add today's completion
                return {
                    ...activity,
                    completedDates: [...activity.completedDates, today]
                };
            }
        }));
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
        <Box sx={{ 
            p: 2, 
            pb: 10,
            width: '100%',
            maxWidth: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            {/* Приветствие с кнопкой теста */}
            <Box sx={{ mb: 3, width: '100%', textAlign: 'center' }}>
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    mb: 1
                }}>
                    <Box sx={{ textAlign: 'left', flexGrow: 1 }}>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                            {getGreeting()}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Время позаботиться о своем отдыхе
                        </Typography>
                    </Box>
                    
                    {onOpenTest && (
                        <Box sx={{ ml: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <IconButton 
                                onClick={onOpenTest}
                                sx={{ 
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    '&:hover': {
                                        bgcolor: 'primary.dark'
                                    },
                                    mb: 0.5
                                }}
                                size="large"
                            >
                                <Psychology />
                            </IconButton>
                            <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
                                Пройти<br/>тест
                            </Typography>
                            {testHistory.length > 0 && (
                                <Typography variant="caption" color="primary" sx={{ mt: 0.5 }}>
                                    {testHistory.length}
                                </Typography>
                            )}
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Статистика */}
            <Box sx={{ 
                mb: 3, 
                width: '100%', 
                display: 'flex', 
                justifyContent: 'center',
                gap: 2,
                flexWrap: 'wrap'
            }}>
                <Card sx={{ 
                    textAlign: 'center', 
                    py: 1, 
                    flex: '1 1 calc(33.333% - 16px)',
                    minWidth: '100px',
                    maxWidth: '120px'
                }}>
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
                
                <Card sx={{ 
                    textAlign: 'center', 
                    py: 1, 
                    flex: '1 1 calc(33.333% - 16px)',
                    minWidth: '100px',
                    maxWidth: '120px'
                }}>
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
                
                <Card sx={{ 
                    textAlign: 'center', 
                    py: 1, 
                    flex: '1 1 calc(33.333% - 16px)',
                    minWidth: '100px',
                    maxWidth: '120px'
                }}>
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
            </Box>

            {/* Сегодняшние активности */}
            {todaysActivities.length > 0 && (
                <Box sx={{ mb: 3, width: '100%' }}>
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
                <Box sx={{ width: '100%' }}>
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
                <Card sx={{ 
                    textAlign: 'center', 
                    py: 6, 
                    mt: 4, 
                    width: '100%', 
                    maxWidth: '400px',
                    mx: 'auto'
                }}>
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